import { randomUUID } from "node:crypto";
import mysql, { type Pool, type ResultSetHeader, type RowDataPacket } from "mysql2/promise";
import { mergeDeliverable } from "./deliverable-state";
import type { DeliverableStatus, FrictionFrequency, ResourceKind } from "@/data/cohortData";
import {
  EmailTakenError,
  type Deliverable,
  type FrictionEntry,
  type Resource,
  type Role,
  type Store,
  type StoredFile,
  type User,
  type UserWithHash,
} from "./types";

/** Connection settings come from env; see .env.example. Never hard-code credentials. */
export function mysqlConfig() {
  const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
  if (!DB_HOST || !DB_NAME || !DB_USER) {
    throw new Error("MySQL is not configured: set DB_HOST, DB_NAME, DB_USER and DB_PASSWORD.");
  }
  return {
    host: DB_HOST,
    port: Number(DB_PORT ?? 3306),
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD ?? "",
    charset: "utf8mb4",
    // DATETIME columns are stored in UTC (see createPool) and returned as plain strings; see `iso()`.
    timezone: "Z",
    dateStrings: true,
  } as const;
}

const iso = (value: string): string => new Date(`${value.replace(" ", "T")}Z`).toISOString();
const nullable = (value: string | null): string | null => value ?? null;

type Row = RowDataPacket;

const toUser = (r: Row): User => ({
  id: r.id,
  email: r.email,
  name: r.name,
  organization: r.organization,
  role: r.role as Role,
  createdAt: iso(r.created_at),
});

const toFriction = (r: Row): FrictionEntry => ({
  id: r.id,
  userId: r.user_id,
  task: r.task,
  frequency: r.frequency as FrictionFrequency,
  minutes: r.minutes,
  sessionId: nullable(r.session_id),
  done: r.done === 1,
  createdAt: iso(r.created_at),
});

const toDeliverable = (r: Row): Deliverable => ({
  userId: r.user_id,
  sessionId: r.session_id,
  status: r.status as DeliverableStatus,
  linkUrl: nullable(r.link_url),
  notes: r.notes,
  fileId: nullable(r.file_id),
  updatedAt: iso(r.updated_at),
  version: r.version,
  revision: r.revision,
  feedback: r.feedback ?? "",
  feedbackRevision: r.feedback_revision ?? null,
});

const toResource = (r: Row): Resource => ({
  id: r.id,
  sessionId: r.session_id,
  title: r.title,
  kind: r.kind as ResourceKind,
  linkUrl: nullable(r.link_url),
  fileId: nullable(r.file_id),
  createdBy: r.created_by,
  createdAt: iso(r.created_at),
});

const toFile = (r: Row): StoredFile => ({
  id: r.id,
  ownerId: r.owner_id,
  originalName: r.original_name,
  storedName: r.stored_name,
  mime: r.mime,
  size: r.size,
  createdAt: iso(r.created_at),
});

function createPool(): Pool {
  const pool = mysql.createPool({ ...mysqlConfig(), connectionLimit: 5 });
  // CURRENT_TIMESTAMP defaults use the *server's* session zone; pin every connection to UTC so
  // stored times match how `iso()` reads them, whatever zone the host runs in.
  pool.on("connection", (connection) => {
    void connection.query("SET time_zone = '+00:00'");
  });
  return pool;
}

export function createMysqlStore(pool: Pool = createPool()): Store {
  async function rows(sql: string, params: unknown[] = []): Promise<Row[]> {
    const [result] = await pool.execute<Row[]>(sql, params as never[]);
    return result;
  }
  async function exec(sql: string, params: unknown[] = []): Promise<ResultSetHeader> {
    const [result] = await pool.execute<ResultSetHeader>(sql, params as never[]);
    return result;
  }
  const one = async (sql: string, params: unknown[] = []) => (await rows(sql, params))[0] ?? null;

  const getDeliverable: Store["getDeliverable"] = async (userId, sessionId) => {
    const row = await one("SELECT * FROM deliverables WHERE user_id = ? AND session_id = ?", [userId, sessionId]);
    return row ? toDeliverable(row) : null;
  };

  return {
    async createUser(input) {
      const id = randomUUID();
      try {
        await exec(
          "INSERT INTO users (id, email, name, organization, role, password_hash) VALUES (?, ?, ?, ?, ?, ?)",
          [id, input.email, input.name, input.organization, input.role, input.passwordHash],
        );
      } catch (error) {
        if ((error as { code?: string }).code === "ER_DUP_ENTRY") throw new EmailTakenError();
        throw error;
      }
      return toUser((await one("SELECT * FROM users WHERE id = ?", [id]))!);
    },
    async findUserByEmail(email) {
      const row = await one("SELECT * FROM users WHERE email = ?", [email]);
      return row ? ({ ...toUser(row), passwordHash: row.password_hash } satisfies UserWithHash) : null;
    },
    async findUserById(id) {
      const row = await one("SELECT * FROM users WHERE id = ?", [id]);
      return row ? toUser(row) : null;
    },
    async listUsers() {
      return (await rows("SELECT * FROM users ORDER BY created_at")).map(toUser);
    },

    async listFriction(userId) {
      return (await rows("SELECT * FROM friction_entries WHERE user_id = ? ORDER BY created_at DESC", [userId])).map(
        toFriction,
      );
    },
    async addFriction(userId, input) {
      const id = randomUUID();
      await exec(
        "INSERT INTO friction_entries (id, user_id, task, frequency, minutes, session_id) VALUES (?, ?, ?, ?, ?, ?)",
        [id, userId, input.task, input.frequency, input.minutes, input.sessionId],
      );
      return toFriction((await one("SELECT * FROM friction_entries WHERE id = ?", [id]))!);
    },
    async setFrictionDone(userId, id, done) {
      await exec("UPDATE friction_entries SET done = ? WHERE id = ? AND user_id = ?", [done ? 1 : 0, id, userId]);
    },
    async deleteFriction(userId, id) {
      await exec("DELETE FROM friction_entries WHERE id = ? AND user_id = ?", [id, userId]);
    },

    async listDeliverables(userId) {
      const result = userId
        ? await rows("SELECT * FROM deliverables WHERE user_id = ?", [userId])
        : await rows("SELECT * FROM deliverables");
      return result.map(toDeliverable);
    },
    getDeliverable,
    async upsertDeliverable(userId, sessionId, patch) {
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();
        // Lock even the first save, so feedback cannot approve a concurrently replaced artifact.
        await connection.execute(
          `INSERT INTO deliverables (user_id, session_id, notes) VALUES (?, ?, '')
           ON DUPLICATE KEY UPDATE user_id = VALUES(user_id)`, [userId, sessionId]);
        const [locked] = await connection.execute<Row[]>(
          "SELECT * FROM deliverables WHERE user_id = ? AND session_id = ? FOR UPDATE", [userId, sessionId]);
        const next = mergeDeliverable(toDeliverable(locked[0]), patch);
        await connection.execute(
          `UPDATE deliverables SET status = ?, link_url = ?, notes = ?, file_id = ?,
           version = ?, revision = ?, feedback = ?, feedback_revision = ?
           WHERE user_id = ? AND session_id = ?`,
          [next.status, next.linkUrl, next.notes, next.fileId, next.version, next.revision,
            next.feedback, next.feedbackRevision, userId, sessionId]);
        await connection.commit();
        return next;
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    },

    async listCapstone(userId) {
      const result = userId
        ? await rows("SELECT user_id, step_id FROM capstone_progress WHERE user_id = ?", [userId])
        : await rows("SELECT user_id, step_id FROM capstone_progress");
      return result.map((r) => ({ userId: r.user_id, stepId: r.step_id }));
    },
    async setCapstoneStep(userId, stepId, done) {
      if (done) {
        await exec("INSERT IGNORE INTO capstone_progress (user_id, step_id) VALUES (?, ?)", [userId, stepId]);
      } else {
        await exec("DELETE FROM capstone_progress WHERE user_id = ? AND step_id = ?", [userId, stepId]);
      }
    },

    async listAttendance() {
      return (await rows("SELECT user_id, session_id FROM attendance")).map((r) => ({
        userId: r.user_id,
        sessionId: r.session_id,
      }));
    },
    async setAttendance(userId, sessionId, present) {
      if (present) {
        await exec("INSERT IGNORE INTO attendance (user_id, session_id) VALUES (?, ?)", [userId, sessionId]);
      } else {
        await exec("DELETE FROM attendance WHERE user_id = ? AND session_id = ?", [userId, sessionId]);
      }
    },

    async listResources() {
      return (await rows("SELECT * FROM resources ORDER BY created_at")).map(toResource);
    },
    async createResource(input) {
      const id = randomUUID();
      await exec(
        "INSERT INTO resources (id, session_id, title, kind, link_url, file_id, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [id, input.sessionId, input.title, input.kind, input.linkUrl, input.fileId, input.createdBy],
      );
      return toResource((await one("SELECT * FROM resources WHERE id = ?", [id]))!);
    },
    async deleteResource(id) {
      const row = await one("SELECT * FROM resources WHERE id = ?", [id]);
      if (!row) return null;
      await exec("DELETE FROM resources WHERE id = ?", [id]);
      return toResource(row);
    },

    async createFile(input) {
      const id = randomUUID();
      await exec(
        "INSERT INTO files (id, owner_id, original_name, stored_name, mime, size) VALUES (?, ?, ?, ?, ?, ?)",
        [id, input.ownerId, input.originalName, input.storedName, input.mime, input.size],
      );
      return toFile((await one("SELECT * FROM files WHERE id = ?", [id]))!);
    },
    async getFile(id) {
      const row = await one("SELECT * FROM files WHERE id = ?", [id]);
      return row ? toFile(row) : null;
    },
    async deleteFile(id) {
      const row = await one("SELECT * FROM files WHERE id = ?", [id]);
      if (!row) return null;
      await exec("DELETE FROM files WHERE id = ?", [id]);
      return toFile(row);
    },
  };
}
