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

class PortfolioCard {
  constructor(title, description, priority) {
    this.title = title;
    this.description = description;
    this.priority = priority;
  }

  toJSON() {
    return {
      title: this.title,
      description: this.description,
      priority: this.priority,
    };
  }
}

const profile = {
  name: "Snow Shi",
  title: "Software Developer",
  intro:
    "Hi I'm Snow! I'm an undergraduate 3rd year student currently enrolled as a computer science student specializing in software engineering at the University of Toronto. I excel at learning by doing and believes that one thing I will be doing throughout my life is to learn, since it feels quite fulfilling and accomplishing.",
  interests: [
    "drawing -- 3D sketching",
    "physically active -- badminton",
    "spiritually fulfilling & interactions -- online gaming",
  ],
  games: [
    "Valorant",
    "Minecraft -- Wynncraft",
    "Plateup",
    "Overcooked",
    "Danganronpa series",
    "Stardew Valley",
    "Minesweeper",
    "PEAK",
  ],
  projectCards: [
    new PortfolioCard(
      "Project One",
      "Highlight a project, client engagement, or portfolio piece here.",
      3
    ),
    new PortfolioCard(
      "Project Two",
      "Use each card to describe the problem, your role, and the outcome.",
      2
    ),
    new PortfolioCard(
      "Project Three",
      "Add links, screenshots, or testimonials as you expand the template.",
      1
    ),
    new PortfolioCard(
      "Project Four",
      "Keep extra projects here; only the top three will be rendered.",
      0
    ),
  ]
    .sort((left, right) => right.priority - left.priority)
    .slice(0, 3)
    .map((card) => card.toJSON()),
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
