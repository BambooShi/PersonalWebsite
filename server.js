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
  constructor(title, link, description, tools, priority) {
    this.title = title;
    this.link = link;
    this.description = description;
    this.tools = tools;
    this.priority = priority;
  }

  toJSON() {
    return {
      title: this.title,
      link: this.link,
      description: this.description,
      tools: this.tools,
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
      "GitHappens",
      "https://github.com/BambooShi/my-githappens",
      "This project is a full-stack Healthcare OCR and Voice-To-Text Management System built for CSCC01 Winter 2026. Its main goal is to manage patient data and clinical workflows. It enables patients, nurses, and doctors to upload medical documents, extract medical information via OCR and NLP, and store structured results in FHIR format. Voice-to-text input is also a core feature.\n\nIt follows the MVC architecture:\nFrontend: React 19 with Mantine UI (in frontend/)\nBackend: Django 5 (REST API, in backend/)\nDatabase: PostgreSQL (accessed mainly via Django ORM)\nAPI Integration: Communication is through HTTP endpoints, with Axios in the frontend.",
      "React 19, Vite, Mantine UI, React Router, Axios (JavaScript/ES modules), Django 5.x, Django REST Framework, PostgreSQL, Simple JWT, python-decouple, django-cors-headers, Docker/Docker Compose for local development and CI pipelines, GitHub Actions for CI (frontend and backend tests, code coverage, Docker build & push), Jira for issue tracking and ticketing, Git Flow branching model",
      2
    ),
    new PortfolioCard(
      "PlanetZe",
      "https://github.com/BambooShi/Planetze_B07",
      "PlanetZe is an Android application that helps users track and reduce their carbon footprint. Its core features include:\nUser Authentication: Secure login and sign-up powered by Firebase Authentication.\nEco Tracker: Tracks carbon emissions based on the user’s daily activities (commuting, energy use, shopping, etc).\nEco Gauge: Visually shows progress toward carbon reduction goals.\nEco Balance: Allows users to offset their carbon emissions.\nEco Hub: Resource center with educational content and market trends about sustainability.\n\nThe app uses a Scrum (Agile) workflow for team collaboration and development.",
      "Android (application), Kotlin (as inferred from Gradle Kotlin scripts), Google Firebase (Authentication and Realtime Database), Designed in Figma, implemented with Android views, Material Design components, and ViewBinding, Google Firebase (Authentication, Realtime Database, BoM), AndroidX (AppCompat, ConstraintLayout, RecyclerView, Lifecycle components), Material Components, MPAndroidChart (charts/graphs), Glide (image and GIF loading), OpenCSV (CSV handling), CalendarView, CardView, JUnit, Mockito (testing), ViewPager2, SplashScreen, etc.",
      1
    ),
    new PortfolioCard(
      "NoLeetNoTreat",
      "https://github.com/BambooShi/NoLeetNoTreat",
      "NoLeetNoTreat is a productivity-focused Google Chrome extension designed to help users curb impulse online shopping by requiring them to solve a LeetCode coding problem before completing a purchase. Its purpose is to merge personal productivity and responsible spending, encouraging critical thinking and mindful buying habits for developers and online shoppers.",
      "JavaScript, Node.js/Express, HTML/CSS, Python",
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
