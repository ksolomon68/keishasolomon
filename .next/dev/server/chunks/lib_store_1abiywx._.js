module.exports = [
"[project]/lib/store/file.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createFileStore",
    ()=>createFileStore
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs/promises [external] (node:fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store/types.ts [app-route] (ecmascript)");
;
;
;
;
const empty = ()=>({
        users: [],
        friction: [],
        deliverables: [],
        capstone: [],
        attendance: [],
        resources: [],
        files: []
    });
function createFileStore(dir = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(process.cwd(), ".data")) {
    const file = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(dir, "db.json");
    let queue = Promise.resolve();
    async function load() {
        try {
            return {
                ...empty(),
                ...JSON.parse(await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["readFile"])(file, "utf8"))
            };
        } catch (error) {
            if (error.code === "ENOENT") return empty();
            throw error;
        }
    }
    /** Run `fn` against the db exclusively; persist when `write` is true. */ function run(write, fn) {
        const next = queue.then(async ()=>{
            const db = await load();
            const result = fn(db);
            if (write) {
                await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["mkdir"])(dir, {
                    recursive: true
                });
                const tmp = `${file}.${process.pid}.tmp`;
                await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["writeFile"])(tmp, JSON.stringify(db, null, 2), "utf8");
                await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["rename"])(tmp, file);
            }
            return result;
        });
        queue = next.catch(()=>undefined);
        return next;
    }
    const now = ()=>new Date().toISOString();
    /** Explicit whitelist so the hash can never leak through a spread. */ const publicUser = (u)=>({
            id: u.id,
            email: u.email,
            name: u.name,
            organization: u.organization,
            role: u.role,
            createdAt: u.createdAt
        });
    return {
        createUser: (input)=>run(true, (db)=>{
                if (db.users.some((u)=>u.email === input.email)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EmailTakenError"]();
                const user = {
                    id: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])(),
                    createdAt: now(),
                    ...input
                };
                db.users.push(user);
                return publicUser(user);
            }),
        findUserByEmail: (email)=>run(false, (db)=>db.users.find((u)=>u.email === email) ?? null),
        findUserById: (id)=>run(false, (db)=>{
                const user = db.users.find((u)=>u.id === id);
                return user ? publicUser(user) : null;
            }),
        listUsers: ()=>run(false, (db)=>db.users.map(publicUser)),
        listFriction: (userId)=>run(false, (db)=>db.friction.filter((f)=>f.userId === userId).sort((a, b)=>b.createdAt.localeCompare(a.createdAt))),
        addFriction: (userId, input)=>run(true, (db)=>{
                const entry = {
                    id: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])(),
                    userId,
                    done: false,
                    createdAt: now(),
                    ...input
                };
                db.friction.push(entry);
                return entry;
            }),
        setFrictionDone: (userId, id, done)=>run(true, (db)=>{
                const entry = db.friction.find((f)=>f.id === id && f.userId === userId);
                if (entry) entry.done = done;
            }),
        deleteFriction: (userId, id)=>run(true, (db)=>{
                db.friction = db.friction.filter((f)=>!(f.id === id && f.userId === userId));
            }),
        listDeliverables: (userId)=>run(false, (db)=>db.deliverables.filter((d)=>!userId || d.userId === userId)),
        getDeliverable: (userId, sessionId)=>run(false, (db)=>db.deliverables.find((d)=>d.userId === userId && d.sessionId === sessionId) ?? null),
        upsertDeliverable: (userId, sessionId, patch)=>run(true, (db)=>{
                let row = db.deliverables.find((d)=>d.userId === userId && d.sessionId === sessionId);
                if (!row) {
                    row = {
                        userId,
                        sessionId,
                        status: "not_started",
                        linkUrl: null,
                        notes: "",
                        fileId: null,
                        updatedAt: now()
                    };
                    db.deliverables.push(row);
                }
                Object.assign(row, patch, {
                    updatedAt: now()
                });
                return {
                    ...row
                };
            }),
        listCapstone: (userId)=>run(false, (db)=>db.capstone.filter((c)=>!userId || c.userId === userId)),
        setCapstoneStep: (userId, stepId, done)=>run(true, (db)=>{
                db.capstone = db.capstone.filter((c)=>!(c.userId === userId && c.stepId === stepId));
                if (done) db.capstone.push({
                    userId,
                    stepId
                });
            }),
        listAttendance: ()=>run(false, (db)=>[
                    ...db.attendance
                ]),
        setAttendance: (userId, sessionId, present)=>run(true, (db)=>{
                db.attendance = db.attendance.filter((a)=>!(a.userId === userId && a.sessionId === sessionId));
                if (present) db.attendance.push({
                    userId,
                    sessionId
                });
            }),
        listResources: ()=>run(false, (db)=>[
                    ...db.resources
                ].sort((a, b)=>a.createdAt.localeCompare(b.createdAt))),
        createResource: (input)=>run(true, (db)=>{
                const resource = {
                    id: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])(),
                    createdAt: now(),
                    ...input
                };
                db.resources.push(resource);
                return resource;
            }),
        deleteResource: (id)=>run(true, (db)=>{
                const found = db.resources.find((r)=>r.id === id) ?? null;
                db.resources = db.resources.filter((r)=>r.id !== id);
                return found;
            }),
        createFile: (input)=>run(true, (db)=>{
                const stored = {
                    id: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])(),
                    createdAt: now(),
                    ...input
                };
                db.files.push(stored);
                return stored;
            }),
        getFile: (id)=>run(false, (db)=>db.files.find((f)=>f.id === id) ?? null),
        deleteFile: (id)=>run(true, (db)=>{
                const found = db.files.find((f)=>f.id === id) ?? null;
                db.files = db.files.filter((f)=>f.id !== id);
                for (const d of db.deliverables)if (d.fileId === id) d.fileId = null;
                for (const r of db.resources)if (r.fileId === id) r.fileId = null;
                return found;
            })
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

//# sourceMappingURL=lib_store_1abiywx._.js.map