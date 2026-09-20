module.exports = [
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/node:diagnostics_channel [external] (node:diagnostics_channel, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:diagnostics_channel", () => require("node:diagnostics_channel"));

module.exports = mod;
}),
"[externals]/process [external] (process, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("process", () => require("process"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/string_decoder [external] (string_decoder, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("string_decoder", () => require("string_decoder"));

module.exports = mod;
}),
"[externals]/timers [external] (timers, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("timers", () => require("timers"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[project]/lib/store/mysql.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createMysqlStore",
    ()=>createMysqlStore,
    "mysqlConfig",
    ()=>mysqlConfig
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/mysql2/promise.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store/types.ts [app-route] (ecmascript)");
;
;
;
function mysqlConfig() {
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
        dateStrings: true
    };
}
const iso = (value)=>new Date(`${value.replace(" ", "T")}Z`).toISOString();
const nullable = (value)=>value ?? null;
const toUser = (r)=>({
        id: r.id,
        email: r.email,
        name: r.name,
        organization: r.organization,
        role: r.role,
        createdAt: iso(r.created_at)
    });
const toFriction = (r)=>({
        id: r.id,
        userId: r.user_id,
        task: r.task,
        frequency: r.frequency,
        minutes: r.minutes,
        sessionId: nullable(r.session_id),
        done: r.done === 1,
        createdAt: iso(r.created_at)
    });
const toDeliverable = (r)=>({
        userId: r.user_id,
        sessionId: r.session_id,
        status: r.status,
        linkUrl: nullable(r.link_url),
        notes: r.notes,
        fileId: nullable(r.file_id),
        updatedAt: iso(r.updated_at)
    });
const toResource = (r)=>({
        id: r.id,
        sessionId: r.session_id,
        title: r.title,
        kind: r.kind,
        linkUrl: nullable(r.link_url),
        fileId: nullable(r.file_id),
        createdBy: r.created_by,
        createdAt: iso(r.created_at)
    });
const toFile = (r)=>({
        id: r.id,
        ownerId: r.owner_id,
        originalName: r.original_name,
        storedName: r.stored_name,
        mime: r.mime,
        size: r.size,
        createdAt: iso(r.created_at)
    });
function createPool() {
    const pool = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].createPool({
        ...mysqlConfig(),
        connectionLimit: 5
    });
    // CURRENT_TIMESTAMP defaults use the *server's* session zone; pin every connection to UTC so
    // stored times match how `iso()` reads them, whatever zone the host runs in.
    pool.on("connection", (connection)=>{
        void connection.query("SET time_zone = '+00:00'");
    });
    return pool;
}
function createMysqlStore(pool = createPool()) {
    async function rows(sql, params = []) {
        const [result] = await pool.execute(sql, params);
        return result;
    }
    async function exec(sql, params = []) {
        const [result] = await pool.execute(sql, params);
        return result;
    }
    const one = async (sql, params = [])=>(await rows(sql, params))[0] ?? null;
    const getDeliverable = async (userId, sessionId)=>{
        const row = await one("SELECT * FROM deliverables WHERE user_id = ? AND session_id = ?", [
            userId,
            sessionId
        ]);
        return row ? toDeliverable(row) : null;
    };
    return {
        async createUser (input) {
            const id = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])();
            try {
                await exec("INSERT INTO users (id, email, name, organization, role, password_hash) VALUES (?, ?, ?, ?, ?, ?)", [
                    id,
                    input.email,
                    input.name,
                    input.organization,
                    input.role,
                    input.passwordHash
                ]);
            } catch (error) {
                if (error.code === "ER_DUP_ENTRY") throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EmailTakenError"]();
                throw error;
            }
            return toUser(await one("SELECT * FROM users WHERE id = ?", [
                id
            ]));
        },
        async findUserByEmail (email) {
            const row = await one("SELECT * FROM users WHERE email = ?", [
                email
            ]);
            return row ? {
                ...toUser(row),
                passwordHash: row.password_hash
            } : null;
        },
        async findUserById (id) {
            const row = await one("SELECT * FROM users WHERE id = ?", [
                id
            ]);
            return row ? toUser(row) : null;
        },
        async listUsers () {
            return (await rows("SELECT * FROM users ORDER BY created_at")).map(toUser);
        },
        async listFriction (userId) {
            return (await rows("SELECT * FROM friction_entries WHERE user_id = ? ORDER BY created_at DESC", [
                userId
            ])).map(toFriction);
        },
        async addFriction (userId, input) {
            const id = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])();
            await exec("INSERT INTO friction_entries (id, user_id, task, frequency, minutes, session_id) VALUES (?, ?, ?, ?, ?, ?)", [
                id,
                userId,
                input.task,
                input.frequency,
                input.minutes,
                input.sessionId
            ]);
            return toFriction(await one("SELECT * FROM friction_entries WHERE id = ?", [
                id
            ]));
        },
        async setFrictionDone (userId, id, done) {
            await exec("UPDATE friction_entries SET done = ? WHERE id = ? AND user_id = ?", [
                done ? 1 : 0,
                id,
                userId
            ]);
        },
        async deleteFriction (userId, id) {
            await exec("DELETE FROM friction_entries WHERE id = ? AND user_id = ?", [
                id,
                userId
            ]);
        },
        async listDeliverables (userId) {
            const result = userId ? await rows("SELECT * FROM deliverables WHERE user_id = ?", [
                userId
            ]) : await rows("SELECT * FROM deliverables");
            return result.map(toDeliverable);
        },
        getDeliverable,
        async upsertDeliverable (userId, sessionId, patch) {
            const current = await getDeliverable(userId, sessionId);
            const next = {
                status: patch.status ?? current?.status ?? "not_started",
                linkUrl: patch.linkUrl === undefined ? current?.linkUrl ?? null : patch.linkUrl,
                notes: patch.notes ?? current?.notes ?? "",
                fileId: patch.fileId === undefined ? current?.fileId ?? null : patch.fileId
            };
            await exec(`INSERT INTO deliverables (user_id, session_id, status, link_url, notes, file_id)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE status = VALUES(status), link_url = VALUES(link_url),
                                 notes = VALUES(notes), file_id = VALUES(file_id)`, [
                userId,
                sessionId,
                next.status,
                next.linkUrl,
                next.notes,
                next.fileId
            ]);
            return await getDeliverable(userId, sessionId);
        },
        async listCapstone (userId) {
            const result = userId ? await rows("SELECT user_id, step_id FROM capstone_progress WHERE user_id = ?", [
                userId
            ]) : await rows("SELECT user_id, step_id FROM capstone_progress");
            return result.map((r)=>({
                    userId: r.user_id,
                    stepId: r.step_id
                }));
        },
        async setCapstoneStep (userId, stepId, done) {
            if (done) {
                await exec("INSERT IGNORE INTO capstone_progress (user_id, step_id) VALUES (?, ?)", [
                    userId,
                    stepId
                ]);
            } else {
                await exec("DELETE FROM capstone_progress WHERE user_id = ? AND step_id = ?", [
                    userId,
                    stepId
                ]);
            }
        },
        async listAttendance () {
            return (await rows("SELECT user_id, session_id FROM attendance")).map((r)=>({
                    userId: r.user_id,
                    sessionId: r.session_id
                }));
        },
        async setAttendance (userId, sessionId, present) {
            if (present) {
                await exec("INSERT IGNORE INTO attendance (user_id, session_id) VALUES (?, ?)", [
                    userId,
                    sessionId
                ]);
            } else {
                await exec("DELETE FROM attendance WHERE user_id = ? AND session_id = ?", [
                    userId,
                    sessionId
                ]);
            }
        },
        async listResources () {
            return (await rows("SELECT * FROM resources ORDER BY created_at")).map(toResource);
        },
        async createResource (input) {
            const id = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])();
            await exec("INSERT INTO resources (id, session_id, title, kind, link_url, file_id, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)", [
                id,
                input.sessionId,
                input.title,
                input.kind,
                input.linkUrl,
                input.fileId,
                input.createdBy
            ]);
            return toResource(await one("SELECT * FROM resources WHERE id = ?", [
                id
            ]));
        },
        async deleteResource (id) {
            const row = await one("SELECT * FROM resources WHERE id = ?", [
                id
            ]);
            if (!row) return null;
            await exec("DELETE FROM resources WHERE id = ?", [
                id
            ]);
            return toResource(row);
        },
        async createFile (input) {
            const id = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])();
            await exec("INSERT INTO files (id, owner_id, original_name, stored_name, mime, size) VALUES (?, ?, ?, ?, ?, ?)", [
                id,
                input.ownerId,
                input.originalName,
                input.storedName,
                input.mime,
                input.size
            ]);
            return toFile(await one("SELECT * FROM files WHERE id = ?", [
                id
            ]));
        },
        async getFile (id) {
            const row = await one("SELECT * FROM files WHERE id = ?", [
                id
            ]);
            return row ? toFile(row) : null;
        },
        async deleteFile (id) {
            const row = await one("SELECT * FROM files WHERE id = ?", [
                id
            ]);
            if (!row) return null;
            await exec("DELETE FROM files WHERE id = ?", [
                id
            ]);
            return toFile(row);
        }
    };
}
}),
"[project]/lib/store/types.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EmailTakenError",
    ()=>EmailTakenError
]);
class EmailTakenError extends Error {
    constructor(){
        super("An account with that email already exists.");
        this.name = "EmailTakenError";
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__01bmk1b._.js.map