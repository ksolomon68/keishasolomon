/**
 * Startup file for cPanel "Setup Node.js App" (Phusion Passenger), which runs an app through a
 * startup file rather than `next start`. Locally, keep using `npm run dev` / `npm start`.
 * Passenger supplies the listening socket/port; PORT is honoured when set.
 */
const { createServer } = require("node:http");
const next = require("next");

process.env.NODE_ENV ??= "production";

const app = next({ dev: false });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => {
      handle(req, res).catch((error) => {
        console.error(error);
        res.statusCode = 500;
        res.end("Internal Server Error");
      });
    }).listen(process.env.PORT || 3000);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
