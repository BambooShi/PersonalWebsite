import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

function App() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [modalCard, setModalCard] = useState(null);

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
            <div className="card-content">
              <a href={card.link}><h3>{card.title}</h3></a>
              <p className="description">{card.description}</p>
              <h5>TechStack:</h5>
              <p className="tools">{card.tools}</p>
            </div>
            <div className="card-footer">
              <a href={card.link} className="button secondary in-card" target="_blank" rel="noreferrer">Repo</a>
              <button className="view-button" onClick={() => setModalCard(card)}>View more</button>
            </div>
          </article>
        ))}
      </section>

      {modalCard && (
        <div className="modal" onClick={() => setModalCard(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{modalCard.title}</h2>
            {modalCard.link && (
              <p>
                <a href={modalCard.link} target="_blank" rel="noreferrer">{modalCard.link}</a>
              </p>
            )}
            <p>{modalCard.description}</p>
            <h5>Tech Stack</h5>
            <p>{modalCard.tools}</p>
            <div className="modal-close">
              <button className="button primary" onClick={() => setModalCard(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <section id="contact" className="card contact">
        <h3>Contact</h3>
        <p>If you have any questions/inquiries, feel free to reach out via email!</p>
        <a href="mailto:shisnow2005@gmail.com" className="button primary">
          Email Me!
        </a>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
