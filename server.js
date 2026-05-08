const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const port = Number(process.env.PORT) || 3000;
const publicDir = path.join(__dirname, "public");
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jsx": "text/babel; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

const profile = {
  name: "Your Name",
  title: "React + Node.js Developer",
  intro:
    "Use this starter template to introduce yourself, showcase featured work, and share the best way to get in touch.",
  highlights: [
    "Responsive hero section",
    "Project showcase cards",
    "Simple contact call-to-action",
  ],
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function sendFile(response, filePath) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      sendJson(response, 404, { error: "Not found" });
      return;
    }

    const extension = path.extname(filePath);
    response.writeHead(200, {
      "Content-Type": mimeTypes[extension] || "application/octet-stream",
    });
    response.end(data);
  });
}

const server = http.createServer((request, response) => {
  const { pathname } = new URL(request.url, `http://${request.headers.host || "localhost"}`);
  const requestPath = pathname === "/" ? "/index.html" : pathname;

  if (requestPath === "/api/profile") {
    sendJson(response, 200, profile);
    return;
  }

  const filePath = path.normalize(path.join(publicDir, requestPath));
  if (!filePath.startsWith(publicDir)) {
    sendJson(response, 400, { error: "Invalid path" });
    return;
  }

  sendFile(response, filePath);
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
