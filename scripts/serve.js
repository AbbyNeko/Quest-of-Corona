const fs = require("fs");
const http = require("http");
const path = require("path");

const publicDir = path.resolve(__dirname, "..", "public");
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
};

const server = http.createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" }).end("Method not allowed");
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url || "/", "http://localhost").pathname);
  } catch {
    response.writeHead(400).end("Invalid request path");
    return;
  }

  const relativePath = pathname === "/" ? "index.html" : pathname.slice(1);
  const filePath = path.resolve(publicDir, relativePath);
  if (filePath !== publicDir && !filePath.startsWith(`${publicDir}${path.sep}`)) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, contents) => {
    if (error) {
      if (error.code === "ENOENT" || error.code === "EISDIR") {
        response.writeHead(404).end("Not found");
      } else {
        console.error(`Could not serve ${pathname}:`, error);
        response.writeHead(500).end("Internal server error");
      }
      return;
    }

    response.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream"
    });
    response.end(request.method === "HEAD" ? undefined : contents);
  });
});

const port = Number(process.env.PORT) || 8888;
server.listen(port, "127.0.0.1", () => {
  console.log(`Quest of Corona is available at http://localhost:${port}`);
});

server.on("error", (error) => {
  console.error("Could not start the local site server:", error);
  process.exitCode = 1;
});
