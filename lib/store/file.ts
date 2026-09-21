import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { mergeDeliverable, normalizeDeliverable } from "./deliverable-state";
import {
  AccessCodeTakenError,
  DEFAULT_COHORT_ID,
  EmailTakenError,
  type Attendance,
  type CapstoneProgress,
  type Cohort,
  type Deliverable,
  type FrictionEntry,
  type Resource,
  type Store,
  type StoredFile,
  type User,
  type UserWithHash,
} from "./types";

/**
 * Development-only backend: one JSON document in `.data/db.json`.
 * Writes are serialized through a promise chain and swapped in atomically.
 */

interface Db {
  cohorts: Cohort[];
  users: UserWithHash[];
  friction: FrictionEntry[];
  deliverables: Deliverable[];
  capstone: CapstoneProgress[];
  attendance: Attendance[];
  resources: Resource[];
  files: StoredFile[];
}

const empty = (): Db => ({
  cohorts: [],
  users: [],
  friction: [],
  deliverables: [],
  capstone: [],
  attendance: [],
  resources: [],
  files: [],
});

export function createFileStore(dir = path.join(process.cwd(), ".data")): Store {
  const file = path.join(dir, "db.json");
  let queue: Promise<unknown> = Promise.resolve();

  /**
   * Upgrade a single-cohort database: participants and resources written before cohorts existed move
   * into one "Founding cohort". Deterministic (fixed id, derived date) so it is safe to redo on every read.
   */
  function upgradeLegacy(db: Db): void {
    const legacyUsers = db.users.filter((u) => u.cohortId === undefined);
    const legacyResources = db.resources.filter((r) => r.cohortId === undefined);
    const needsDefault =
      !db.cohorts.some((c) => c.id === DEFAULT_COHORT_ID) &&
      (legacyUsers.some((u) => u.role === "participant") || legacyResources.length > 0);
    if (needsDefault) {
      db.cohorts.push({
        id: DEFAULT_COHORT_ID,
        name: "Founding cohort",
        accessCode: process.env.COHORT_ACCESS_CODE?.trim() || "founding-cohort",
        sessionDates: {},
        completionDate: null,
        archived: false,
        createdAt: db.users.map((u) => u.createdAt).sort()[0] ?? new Date(0).toISOString(),
      });
    }
    for (const u of legacyUsers) u.cohortId = u.role === "participant" ? DEFAULT_COHORT_ID : null;
    for (const r of legacyResources) r.cohortId = DEFAULT_COHORT_ID;
  }

  async function load(): Promise<Db> {
    try {
      const db = { ...empty(), ...(JSON.parse(await readFile(file, "utf8")) as Partial<Db>) };
      db.deliverables = db.deliverables.map(normalizeDeliverable);
      upgradeLegacy(db);
      return db;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return empty();
      throw error;
    }
  }

  /** Run `fn` against the db exclusively; persist when `write` is true. */
  function run<T>(write: boolean, fn: (db: Db) => T): Promise<T> {
    const next = queue.then(async () => {
      const db = await load();
      const result = fn(db);
      if (write) {
        await mkdir(dir, { recursive: true });
        const tmp = `${file}.${process.pid}.tmp`;
        await writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
        await rename(tmp, file);
      }
      return result;
    });
    queue = next.catch(() => undefined);
    return next;
  }

  const now = () => new Date().toISOString();
  /** Explicit whitelist so the hash can never leak through a spread. */
  const publicUser = (u: UserWithHash): User => ({
    id: u.id,
    email: u.email,
    name: u.name,
    organization: u.organization,
    role: u.role,
    cohortId: u.cohortId,
    createdAt: u.createdAt,
  });

  const codeKey = (code: string) => code.trim().toLowerCase();

  return {
    listCohorts: () => run(false, (db) => [...db.cohorts].sort((a, b) => b.createdAt.localeCompare(a.createdAt))),
    getCohort: (id) => run(false, (db) => db.cohorts.find((c) => c.id === id) ?? null),
    findCohortByAccessCode: (code) =>
      run(false, (db) => db.cohorts.find((c) => codeKey(c.accessCode) === codeKey(code)) ?? null),
    createCohort: (input) =>
      run(true, (db) => {
        if (db.cohorts.some((c) => codeKey(c.accessCode) === codeKey(input.accessCode))) throw new AccessCodeTakenError();
        const cohort: Cohort = {
          id: randomUUID(),
          name: input.name,
          accessCode: input.accessCode.trim(),
          sessionDates: input.sessionDates ?? {},
          completionDate: input.completionDate ?? null,
          archived: false,
          createdAt: now(),
        };
        db.cohorts.push(cohort);
        return cohort;
      }),
    updateCohort: (id, patch) =>
      run(true, (db) => {
        const cohort = db.cohorts.find((c) => c.id === id);
        if (!cohort) return null;
        if (
          patch.accessCode !== undefined &&
          db.cohorts.some((c) => c.id !== id && codeKey(c.accessCode) === codeKey(patch.accessCode!))
        ) {
          throw new AccessCodeTakenError();
        }
        Object.assign(cohort, { ...patch, ...(patch.accessCode !== undefined && { accessCode: patch.accessCode.trim() }) });
        return { ...cohort };
      }),

    createUser: (input) =>
      run(true, (db) => {
        if (db.users.some((u) => u.email === input.email)) throw new EmailTakenError();
        const user: UserWithHash = { id: randomUUID(), createdAt: now(), ...input };
        db.users.push(user);
        return publicUser(user);
      }),
    findUserByEmail: (email) => run(false, (db) => db.users.find((u) => u.email === email) ?? null),
    findUserById: (id) =>
      run(false, (db) => {
        const user = db.users.find((u) => u.id === id);
        return user ? publicUser(user) : null;
      }),
    listUsers: (cohortId) =>
      run(false, (db) => db.users.filter((u) => !cohortId || u.cohortId === cohortId).map(publicUser)),

    listFriction: (userId) =>
      run(false, (db) =>
        db.friction
          .filter((f) => f.userId === userId)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      ),
    addFriction: (userId, input) =>
      run(true, (db) => {
        const entry: FrictionEntry = { id: randomUUID(), userId, done: false, createdAt: now(), ...input };
        db.friction.push(entry);
        return entry;
      }),
    setFrictionDone: (userId, id, done) =>
      run(true, (db) => {
        const entry = db.friction.find((f) => f.id === id && f.userId === userId);
        if (entry) entry.done = done;
      }),
    deleteFriction: (userId, id) =>
      run(true, (db) => {
        db.friction = db.friction.filter((f) => !(f.id === id && f.userId === userId));
      }),

    listDeliverables: (userId) =>
      run(false, (db) => db.deliverables.filter((d) => !userId || d.userId === userId)),
    getDeliverable: (userId, sessionId) =>
      run(
        false,
        (db) => db.deliverables.find((d) => d.userId === userId && d.sessionId === sessionId) ?? null,
      ),
    upsertDeliverable: (userId, sessionId, patch) =>
      run(true, (db) => {
        let row = db.deliverables.find((d) => d.userId === userId && d.sessionId === sessionId);
        if (!row) {
          row = {
            userId,
            sessionId,
            status: "not_started",
            linkUrl: null,
            notes: "",
            fileId: null,
            updatedAt: now(),
            version: 0,
            revision: 1,
            feedback: "",
            feedbackRevision: null,
          };
          db.deliverables.push(row);
        }
        Object.assign(row, mergeDeliverable(row, patch));
        return { ...row };
      }),

    listCapstone: (userId) =>
      run(false, (db) => db.capstone.filter((c) => !userId || c.userId === userId)),
    setCapstoneStep: (userId, stepId, done) =>
      run(true, (db) => {
        db.capstone = db.capstone.filter((c) => !(c.userId === userId && c.stepId === stepId));
        if (done) db.capstone.push({ userId, stepId });
      }),

    listAttendance: () => run(false, (db) => [...db.attendance]),
    setAttendance: (userId, sessionId, present) =>
      run(true, (db) => {
        db.attendance = db.attendance.filter((a) => !(a.userId === userId && a.sessionId === sessionId));
        if (present) db.attendance.push({ userId, sessionId });
      }),

    listResources: (cohortId) =>
      run(false, (db) =>
        db.resources
          .filter((r) => !cohortId || r.cohortId === null || r.cohortId === cohortId)
          .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
      ),
    createResource: (input) =>
      run(true, (db) => {
        const resource: Resource = { id: randomUUID(), createdAt: now(), ...input };
        db.resources.push(resource);
        return resource;
      }),
    deleteResource: (id) =>
      run(true, (db) => {
        const found = db.resources.find((r) => r.id === id) ?? null;
        db.resources = db.resources.filter((r) => r.id !== id);
        return found;
      }),

    createFile: (input) =>
      run(true, (db) => {
        const stored: StoredFile = { id: randomUUID(), createdAt: now(), ...input };
        db.files.push(stored);
        return stored;
      }),
    getFile: (id) => run(false, (db) => db.files.find((f) => f.id === id) ?? null),
    deleteFile: (id) =>
      run(true, (db) => {
        const found = db.files.find((f) => f.id === id) ?? null;
        db.files = db.files.filter((f) => f.id !== id);
        for (const d of db.deliverables) if (d.fileId === id) d.fileId = null;
        for (const r of db.resources) if (r.fileId === id) r.fileId = null;
        return found;
      }),
  };
}
