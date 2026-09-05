export default function Home() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <span className="home-badge">📚 L'univers des lecteurs</span>

        <h1>
          Bienvenue dans
          <span> MIMOUVERSE</span>
        </h1>

        <p>
          Découvre des livres, des mangas, un dictionnaire et MIA,
          ton assistant intelligent.
        </p>

        <div className="home-actions">
          <a href="/livres">📚 Explorer les livres</a>
          <a href="/manga">🗯️ Découvrir les mangas</a>
        </div>
      </section>

      <section className="home-features">
        <article>
          <div>📚</div>
          <h2>Livres</h2>
          <p>Explore notre bibliothèque et découvre de nouvelles œuvres.</p>
        </article>

        <article>
          <div>🗯️</div>
          <h2>Manga</h2>
          <p>Retrouve tes séries et découvre de nouveaux univers.</p>
        </article>

        <article>
          <div>📖</div>
          <h2>Dictionnaire</h2>
          <p>Recherche rapidement la définition d'un mot.</p>
        </article>

        <article>
          <div>🤖</div>
          <h2>MIA</h2>
          <p>Pose tes questions à l'assistant de MIMOUVERSE.</p>
        </article>
      </section>
    </main>
  )
}
