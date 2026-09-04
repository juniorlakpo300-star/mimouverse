import { useMemo, useState } from 'react'
import { ArrowRight, BookMarked, Flame, Heart, Search, Sparkles, Zap } from 'lucide-react'

const manga = [
  { id: 1, title: 'Néo Horizon', author: 'A. Koffi', category: 'Action', chapters: 42, readers: '12,4 k', tag: 'Tendance', accent: 'violet', description: 'Dans une ville suspendue, un jeune lecteur découvre une énergie capable de changer son destin.' },
  { id: 2, title: 'Les Gardiens du Baobab', author: 'M. Konan', category: 'Aventure', chapters: 28, readers: '9,8 k', tag: 'Nouveau', accent: 'cyan', description: 'Une équipe de jeunes gardiens protège un ancien secret au cœur d’un royaume mystérieux.' },
  { id: 3, title: 'Chroniques de Sora', author: 'N. Yao', category: 'Fantasy', chapters: 35, readers: '8,7 k', tag: 'Populaire', accent: 'pink', description: 'Une apprentie cartographe traverse des mondes invisibles pour retrouver son frère.' },
  { id: 4, title: 'Pixel Warriors', author: 'K. Traoré', category: 'Action', chapters: 19, readers: '7,2 k', tag: 'Nouveau', accent: 'orange', description: 'Dans une métropole numérique, chaque défi rapproche une équipe de son plus grand tournoi.' },
  { id: 5, title: 'L’École des Étoiles', author: 'S. Diabaté', category: 'School Life', chapters: 51, readers: '15,1 k', tag: 'Top', accent: 'blue', description: 'Une classe pas comme les autres apprend à maîtriser des talents qui dépassent l’imagination.' },
  { id: 6, title: 'Kora Nocturne', author: 'J. N’Guessan', category: 'Mystère', chapters: 23, readers: '6,4 k', tag: 'À découvrir', accent: 'green', description: 'Une mélodie entendue chaque nuit mène une lycéenne vers une énigme oubliée.' },
]

const categories = ['Tous', 'Action', 'Aventure', 'Fantasy', 'School Life', 'Mystère']

export default function Manga() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Tous')
  const [favorites, setFavorites] = useState([])

  const filtered = useMemo(() => manga.filter((item) => {
    const matchesCategory = category === 'Tous' || item.category === category
    const text = `${item.title} ${item.author} ${item.category}`.toLowerCase()
    return matchesCategory && text.includes(query.toLowerCase())
  }), [query, category])

  const toggleFavorite = (id) => setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])

  return (
    <main className="manga-page">
      <section className="manga-hero">
        <div className="manga-hero-orb orb-one" />
        <div className="manga-hero-orb orb-two" />
        <div className="manga-hero-copy">
          <div className="manga-eyebrow"><Zap size={14} /> MIMOUVERSE MANGA</div>
          <h1>Entre dans le <span>manga.</span></h1>
          <p>Des séries, des chapitres et des univers à explorer. Une expérience plus dynamique, pensée spécialement pour les lecteurs de manga.</p>
          <div className="manga-hero-actions"><button className="button manga-primary"><Flame size={17} /> Voir les tendances</button><span><Sparkles size={15} /> Nouvelles séries chaque semaine</span></div>
        </div>
        <div className="manga-stack" aria-hidden="true"><div className="manga-panel panel-back">M</div><div className="manga-panel panel-mid">V</div><div className="manga-panel panel-front"><BookMarked size={48} /><strong>MANGA</strong><small>UN NOUVEL UNIVERS</small></div></div>
      </section>

      <section className="manga-content">
        <div className="manga-section-heading"><div><span className="kicker">Explorer</span><h2>Les séries du moment</h2></div><p>Découvre les titres les plus suivis et les nouvelles histoires ajoutées à MIMOUVERSE.</p></div>
        <div className="manga-tools"><div className="manga-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher une série, un auteur..." /></div><div className="manga-categories">{categories.map((item) => <button key={item} className={category === item ? 'manga-category active' : 'manga-category'} onClick={() => setCategory(item)}>{item}</button>)}</div></div>

        <div className="manga-section-heading compact"><div><span className="kicker">Sélection</span><h2>À ne pas manquer</h2></div><span className="manga-result">{filtered.length} série{filtered.length > 1 ? 's' : ''}</span></div>
        {filtered.length > 0 ? <div className="manga-grid">{filtered.map((item) => <article className={`manga-card ${item.accent}`} key={item.id}>
          <div className="manga-cover"><div className="cover-lines" /><span className="manga-tag">{item.tag}</span><button className={favorites.includes(item.id) ? 'manga-favorite selected' : 'manga-favorite'} onClick={() => toggleFavorite(item.id)} aria-label={`Ajouter ${item.title} aux favoris`}><Heart size={18} fill={favorites.includes(item.id) ? 'currentColor' : 'none'} /></button><div className="manga-cover-title"><small>MIMOUVERSE ORIGINAL</small><strong>{item.title}</strong><span>{item.category}</span></div></div>
          <div className="manga-info"><div className="manga-meta-top"><span>{item.author}</span><span>{item.chapters} chapitres</span></div><h3>{item.title}</h3><p>{item.description}</p><div className="manga-card-bottom"><span>👥 {item.readers} lecteurs</span><button>Voir la série <ArrowRight size={15} /></button></div></div>
        </article>)}</div> : <div className="manga-empty"><Search size={28} /><h3>Aucune série trouvée</h3><p>Essaie un autre mot ou une autre catégorie.</p></div>}
      </section>
    </main>
  )
}
