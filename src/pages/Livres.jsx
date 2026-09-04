import { BookOpen, Heart, Search, Star, ArrowRight } from 'lucide-react'
import { useMemo, useState } from 'react'

const books = [
  { id: 1, title: 'Les chemins de demain', author: 'Awa Diarra', category: 'Romans', rating: 4.8, readers: '2,4k', color: 'linear-gradient(145deg,#312e81,#0f172a)', letter: 'L' },
  { id: 2, title: 'Comprendre le monde', author: 'Moussa Koné', category: 'Éducation', rating: 4.6, readers: '1,8k', color: 'linear-gradient(145deg,#0f766e,#0f172a)', letter: 'C' },
  { id: 3, title: 'L’art de recommencer', author: 'Nadia Kouamé', category: 'Développement personnel', rating: 4.9, readers: '3,1k', color: 'linear-gradient(145deg,#9a3412,#0f172a)', letter: 'A' },
  { id: 4, title: 'Voix d’Afrique', author: 'Collectif MIMOU', category: 'Auteurs africains', rating: 4.7, readers: '1,2k', color: 'linear-gradient(145deg,#854d0e,#0f172a)', letter: 'V' },
  { id: 5, title: 'Une saison à Abidjan', author: 'K. Yao', category: 'Romans', rating: 4.5, readers: '980', color: 'linear-gradient(145deg,#1e3a8a,#0f172a)', letter: 'U' },
  { id: 6, title: 'Réussir ses études', author: 'S. Traoré', category: 'Éducation', rating: 4.6, readers: '1,5k', color: 'linear-gradient(145deg,#166534,#0f172a)', letter: 'R' },
]

const categories = ['Tous', 'Romans', 'Éducation', 'Auteurs africains', 'Développement personnel']

export default function Livres() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Tous')
  const [favorites, setFavorites] = useState([])

  const filtered = useMemo(() => books.filter(book => {
    const matchesQuery = `${book.title} ${book.author}`.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = category === 'Tous' || book.category === category
    return matchesQuery && matchesCategory
  }), [query, category])

  const toggleFavorite = id => setFavorites(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id])

  return (
    <main className="library-page">
      <section className="library-hero">
        <div>
          <span className="kicker">Bibliothèque MIMOUVERSE</span>
          <h1>Des histoires à <span>vivre.</span></h1>
          <p>Explore des livres sélectionnés pour apprendre, rêver et découvrir de nouvelles voix.</p>
        </div>
        <div className="library-stat"><strong>{books.length}</strong><span>ouvrages en vitrine</span></div>
      </section>

      <section className="library-tools">
        <label className="search-box"><Search size={19} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Rechercher un livre ou un auteur..." /></label>
        <div className="category-list">
          {categories.map(item => <button className={category === item ? 'category active' : 'category'} key={item} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
      </section>

      <section className="book-section">
        <div className="section-heading"><div><span className="kicker">Sélection</span><h2>À découvrir</h2></div><span className="result-count">{filtered.length} résultat{filtered.length > 1 ? 's' : ''}</span></div>
        <div className="book-grid">
          {filtered.map(book => (
            <article className="book-card" key={book.id}>
              <div className="book-cover" style={{ background: book.color }}><span>{book.letter}</span><small>MIMOUVERSE</small><button aria-label="Ajouter aux favoris" className={favorites.includes(book.id) ? 'favorite selected' : 'favorite'} onClick={() => toggleFavorite(book.id)}><Heart size={18} fill={favorites.includes(book.id) ? 'currentColor' : 'none'} /></button></div>
              <div className="book-info"><span className="book-category">{book.category}</span><h3>{book.title}</h3><p>{book.author}</p><div className="book-meta"><span><Star size={15} fill="currentColor" /> {book.rating}</span><span>{book.readers} lecteurs</span></div><button className="read-button">Découvrir <ArrowRight size={16} /></button></div>
            </article>
          ))}
        </div>
        {filtered.length === 0 && <div className="empty-state"><BookOpen size={30} /><h3>Aucun livre trouvé</h3><p>Essaie un autre titre, auteur ou catégorie.</p></div>}
      </section>
    </main>
  )
}
