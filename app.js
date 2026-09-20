/**
 * Fallback entrypoint for cPanel / Phusion Passenger environments that look for app.js.
 * Delegates directly to server.js.
 */
require("./server.js");
