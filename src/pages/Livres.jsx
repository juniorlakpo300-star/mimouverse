import { BookOpen, Heart, Search, ArrowRight, Loader2, Quote, X, Maximize2, Download, ArrowLeft } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabase.js'
import Feedback from '../components/Feedback.jsx'

const FALLBACK_COVER = 'https://placehold.co/400x560/111827/94a3b8?text=MIMOUVERSE'
const AFRICAN_QUOTE = { text: 'La culture est au début et à la fin de tout.', author: 'Léopold Sédar Senghor' }

function normalizeBook(row, index) {
  return { id: row.id || `book-${index}`, title: row.title || row.name || row.nom || 'Sans titre', author: row.author || row.author_name || row.auteur || 'Auteur inconnu', category: row.category || row.genre || 'Livre', description: row.description || '', cover: row.cover_url || row.cover || row.image_url || row.thumbnail_url || FALLBACK_COVER, file: row.pdf_url || row.file_url || row.pdf || row.file || row.document_url || '' }
}

export default function Livres() {
  const [books, setBooks] = useState([]), [query, setQuery] = useState(''), [category, setCategory] = useState('Tous'), [favorites, setFavorites] = useState([]), [loading, setLoading] = useState(true), [error, setError] = useState('')
  const [reader, setReader] = useState(null)

  useEffect(() => {
    let active = true
    const load = async () => {
      if (!supabase) { setError('Supabase n’est pas configuré.'); setLoading(false); return }
      const { data, error: queryError } = await supabase.from('books').select('*').order('created_at', { ascending: false })
      if (!active) return
      if (queryError) setError(queryError.message)
      else setBooks((data || []).map(normalizeBook))
      setLoading(false)
    }
    load()
    return () => { active = false }
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === 'Escape') setReader(null) }
    if (reader) window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [reader])

  const categories = useMemo(() => ['Tous', ...Array.from(new Set(books.map((book) => book.category).filter(Boolean)))], [books])
  const filtered = useMemo(() => books.filter((book) => { const text = `${book.title} ${book.author} ${book.category}`.toLowerCase(); return text.includes(query.toLowerCase()) && (category === 'Tous' || book.category === category) }), [books, query, category])
  const toggleFavorite = (id) => setFavorites((current) => current.includes(id) ? current.filter((x) => x !== id) : [...current, id])

  return <main className="library-page">
    <section className="library-hero"><div><span className="kicker">Bibliothèque MIMOUVERSE</span><h1>Des histoires à <span>vivre.</span></h1><p>Explore les livres réellement publiés sur MIMOUVERSE.</p></div><div className="library-stat"><strong>{books.length}</strong><span>ouvrages disponibles</span></div></section>
    <section className="library-quote"><div><span className="quote-label"><Quote size={11}/> Parole d’un écrivain africain</span><p className="quote-text">« {AFRICAN_QUOTE.text} »</p><p className="quote-author">— {AFRICAN_QUOTE.author}</p></div></section>
    <section className="library-tools"><label className="search-box"><Search size={19}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un livre ou un auteur..." /></label><div className="category-list">{categories.map((item) => <button className={category === item ? 'category active' : 'category'} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div></section>
    <section className="book-section"><div className="section-heading"><div><span className="kicker">Catalogue réel</span><h2>Livres publiés</h2></div><span className="result-count">{filtered.length} résultat{filtered.length > 1 ? 's' : ''}</span></div>
      {loading ? <div className="empty-state"><Loader2 size={30}/><h3>Chargement des livres...</h3><p>Connexion au catalogue MIMOUVERSE.</p></div> : error ? <div className="empty-state"><BookOpen size={30}/><h3>Catalogue temporairement indisponible</h3><p>{error}</p></div> : filtered.length === 0 ? <div className="empty-state"><BookOpen size={30}/><h3>Aucun livre publié</h3><p>Les nouveaux livres apparaîtront ici dès leur publication.</p></div> : <div className="book-grid">{filtered.map((book) => <article className="book-card" key={book.id}><div className="book-cover" style={{background:'linear-gradient(145deg,#312e81,#0f172a)'}}><img src={book.cover} alt={`Couverture de ${book.title}`} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:12}} onError={(e) => { e.currentTarget.src = FALLBACK_COVER }}/><button aria-label="Ajouter aux favoris" className={favorites.includes(book.id) ? 'favorite selected' : 'favorite'} onClick={() => toggleFavorite(book.id)}><Heart size={18} fill={favorites.includes(book.id) ? 'currentColor' : 'none'}/></button></div><div className="book-info"><span className="book-category">{book.category}</span><h3>{book.title}</h3><p>{book.author}</p>{book.description && <p>{book.description}</p>}<div className="book-actions"><button className="read-button" disabled={!book.file} onClick={() => book.file && setReader(book)}>{book.file ? <>Lire sur MIMOUVERSE <ArrowRight size={16}/></> : 'Fichier indisponible'}</button>{book.file && <a className="download-button" href={book.file} download aria-label={`Télécharger le PDF de ${book.title}`}><Download size={16}/> Télécharger PDF</a>}</div></div></article>)}</div>}
    </section>

    <Feedback type="book" items={books} />

    {reader && <div className="book-reader-overlay" role="dialog" aria-modal="true" aria-label={`Lecture de ${reader.title}`}>
      <div className="book-reader-shell">
        <header className="book-reader-header">
          <div className="book-reader-title"><button className="reader-back" onClick={() => setReader(null)}><ArrowLeft size={17}/> Retour aux livres</button><strong>{reader.title}</strong><span>{reader.author}</span></div>
          <div className="book-reader-actions"><a href={reader.file} download aria-label={`Télécharger le PDF de ${reader.title}`}><Download size={18}/></a><a href={reader.file} target="_blank" rel="noopener noreferrer" aria-label="Ouvrir le lecteur PDF en plein écran"><Maximize2 size={18}/></a><button onClick={() => setReader(null)} aria-label="Fermer la lecture"><X size={20}/></button></div>
        </header>
        <iframe className="book-reader-frame" src={reader.file} title={`Lecture de ${reader.title}`} />
      </div>
    </div>}
  </main>
}
