import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

function App() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load profile data.");
        }

        return response.json();
      })
      .then((data) => setProfile(data))
      .catch(() => setError("We couldn't load the profile content. Please try again."));
  }, []);

  if (error) {
    return (
      <main className="page">
        <section className="card">
          <h3>Template unavailable</h3>
          <p>{error}</p>
        </section>
      </main>
    );
  }

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
        <p className="eyebrow">University of Toronto</p>
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
        <h3>Some personal interests of mine:</h3>
        <ul>
          {profile.interests.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section id="projects" className="grid">
        {profile.projectCards.map((card) => (
          <article className="card" key={card.title}>
            <a href={card.link}><h3>{card.title}</h3></a> 
            <p>{card.description}</p>
            <h5>TechStack:</h5>
            <p>{card.tools}</p>
          </article>
        ))}
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
