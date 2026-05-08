import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

function App() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((response) => response.json())
      .then((data) => setProfile(data));
  }, []);

  if (!profile) {
    return (
      <main className="page">
        <p className="loading">Loading template...</p>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Simple React + Node.js template</p>
        <h1>{profile.name}</h1>
        <h2>{profile.title}</h2>
        <p className="intro">{profile.intro}</p>
        <div className="actions">
          <a href="#projects" className="button primary">
            View Projects
          </a>
          <a href="#contact" className="button secondary">
            Contact Me
          </a>
        </div>
      </section>

      <section className="card">
        <h3>Why this starter works</h3>
        <ul>
          {profile.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section id="projects" className="grid">
        <article className="card">
          <h3>Project One</h3>
          <p>Highlight a project, client engagement, or portfolio piece here.</p>
        </article>
        <article className="card">
          <h3>Project Two</h3>
          <p>Use each card to describe the problem, your role, and the outcome.</p>
        </article>
        <article className="card">
          <h3>Project Three</h3>
          <p>Add links, screenshots, or testimonials as you expand the template.</p>
        </article>
      </section>

      <section id="contact" className="card contact">
        <h3>Ready to customize?</h3>
        <p>Replace this content with your bio, projects, and your preferred contact links.</p>
        <a href="mailto:hello@example.com" className="button primary">
          Say Hello
        </a>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
