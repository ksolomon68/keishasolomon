module.exports = [
"[project]/lib/store/file.ts [app-route] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/lib_store_1abiywx._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/lib/store/file.ts [app-route] (ecmascript)");
    });
});
}),
"[project]/lib/store/mysql.ts [app-route] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/node_modules_mysql2_018y3bo._.js",
  "server/chunks/node_modules_iconv-lite_1hhx52c._.js",
  "server/chunks/node_modules_aws-ssl-profiles_lib_0-3pab2._.js",
  "server/chunks/node_modules_0b41fxq._.js",
  "server/chunks/[root-of-the-server]__01bmk1b._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/lib/store/mysql.ts [app-route] (ecmascript)");
    });
});
}),
];