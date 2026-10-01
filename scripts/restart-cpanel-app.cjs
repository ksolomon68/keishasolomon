const fs = require("node:fs");
const path = require("node:path");

function matchesWorker(worker, appDir, uid) {
  return worker.uid === uid && worker.title === `lsnode:${appDir}/`;
}

function readWorker(pid, expectedUid) {
  try {
    const root = `/proc/${pid}`;
    const uid = fs.statSync(root).uid;
    if (uid !== expectedUid) return null;
    const fields = fs.readFileSync(`${root}/stat`, "utf8").split(") ").pop().split(" ");
    if (fields[0] === "Z") return null;
    return {
      pid: Number(pid), uid,
      title: fs.readFileSync(`${root}/cmdline`, "utf8").split("\0")[0].trimEnd(),
      started: fields[19],
    };
  } catch (error) {
    if (error.code === "ENOENT" || error.code === "ESRCH") return null;
    throw error;
  }
}

async function restartApp(appDir, options = {}) {
  const uid = options.uid ?? process.getuid();
  const list = options.list ?? (() => fs.readdirSync("/proc").filter((pid) => /^\d+$/.test(pid)).map((pid) => readWorker(pid, uid)).filter(Boolean));
  const read = options.read ?? ((pid) => readWorker(pid, uid));
  const signal = options.signal ?? ((pid) => process.kill(pid, "SIGTERM"));
  const wait = options.wait ?? (() => new Promise((resolve) => setTimeout(resolve, 250)));
  const now = options.now ?? Date.now;
  const workers = list().filter((worker) => matchesWorker(worker, appDir, uid));
  const sameWorker = (worker) => {
    const current = read(worker.pid);
    return current && current.started === worker.started && matchesWorker(current, appDir, uid);
  };
  for (const worker of workers) {
    if (!sameWorker(worker)) continue;
    try { signal(worker.pid); }
    catch (error) { if (error.code !== "ESRCH") throw error; }
  }
  const deadline = now() + (options.timeoutMs ?? 15000);
  while (workers.some(sameWorker)) {
    if (now() >= deadline) throw new Error("Old app workers did not exit within 15 seconds. Deployment cannot confirm restart; check Setup Node.js App. No forced kill was attempted.");
    await wait();
  }
  return workers.length;
}

module.exports = { matchesWorker, restartApp };

if (require.main === module) {
  (async () => {
    if (process.platform !== "linux") throw new Error("This restart helper requires Linux /proc.");
    if (!process.argv[2]) throw new Error("An application directory is required.");
    const appDir = fs.realpathSync(process.argv[2]);
    if (appDir === "/" || !fs.existsSync(path.join(appDir, "server.js")) || !fs.existsSync(path.join(appDir, ".next", "BUILD_ID"))) {
      throw new Error("Refusing restart: application directory must contain server.js and a complete build.");
    }
    const count = await restartApp(appDir);
    console.log(`==> ${count} old LiteSpeed app worker(s) exited. The next request starts the activated build.`);
  })().catch((error) => { console.error(`ERROR: ${error.message}`); process.exitCode = 1; });
}
