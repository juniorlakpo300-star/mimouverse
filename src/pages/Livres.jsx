import { useEffect, useMemo, useState } from 'react'
import { Search, BookOpen, Star, Users, RefreshCw } from 'lucide-react'
import { supabase } from '../supabase.js'

export default function Livres() {
  const [books, setBooks] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Tous')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadBooks() {
    if (!supabase) {
      setError('Supabase n’est pas correctement configuré.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    const result = await supabase
      .from('books')
      .select('id, title, author, description, category, cover_url, pdf_url, rating, readers_count, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false })

    if (result.error) {
      console.error('Erreur Supabase :', result.error)
      setError('Impossible de charger les livres pour le moment.')
      setBooks([])
    } else {
      setBooks(result.data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    loadBooks()
  }, [])

  const categories = useMemo(() => {
    const values = books
      .map((book) => book.category)
      .filter((value) => value)

    return ['Tous', ...new Set(values)]
  }, [books])

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase()

    return books.filter((book) => {
      const title = (book.title || '').toLowerCase()
      const author = (book.author || '').toLowerCase()
      const description = (book.description || '').toLowerCase()

      const matchesSearch =
        !query ||
        title.includes(query) ||
        author.includes(query) ||
        description.includes(query)

      const matchesCategory =
        category === 'Tous' || book.category === category

      return matchesSearch && matchesCategory
    })
  }, [books, search, category])

  return (
    <main className="simple-page books-page">
      <span className="page-badge">📚 BIBLIOTHÈQUE</span>

      <h1>Les livres</h1>

      <p className="page-intro">
        Découvre les œuvres disponibles sur MIMOUVERSE.
      </p>

      <section className="books-toolbar">
        <div className="books-search">
          <Search size={20} />

          <input
            type="search"
            placeholder="Rechercher un livre, un auteur..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="books-categories">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={category === item ? 'active' : ''}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {loading && (
        <section className="empty-section">
          <RefreshCw className="spin" size={30} />
          <h2>Chargement de la bibliothèque...</h2>
          <p>MIMOUVERSE récupère les livres depuis Supabase.</p>
        </section>
      )}

      {!loading && error && (
        <section className="empty-section error-section">
          <div>⚠️</div>
          <h2>Impossible de charger les livres</h2>
          <p>{error}</p>

          <button type="button" onClick={loadBooks}>
            Réessayer
          </button>
        </section>
      )}

      {!loading && !error && filteredBooks.length === 0 && (
        <section className="empty-section">
          <div>📚</div>

          <h2>
            {books.length === 0
              ? 'Aucun livre publié pour le moment'
              : 'Aucun résultat'}
          </h2>

          <p>
            {books.length === 0
              ? 'Les livres publiés par l’administrateur apparaîtront ici.'
              : 'Essaie une autre recherche ou une autre catégorie.'}
          </p>
        </section>
      )}

      {!loading && !error && filteredBooks.length > 0 && (
        <section className="books-grid">
          {filteredBooks.map((book) => (
            <article className="book-card" key={book.id}>
              <div className="book-cover">
                {book.cover_url ? (
                  <img
                    src={book.cover_url}
                    alt={'Couverture de ' + book.title}
                    loading="lazy"
                  />
                ) : (
                  <div className="book-cover-placeholder">
                    <BookOpen size={46} />
                  </div>
                )}
              </div>

              <div className="book-card-content">
                <span className="book-category">
                  {book.category || 'Livre'}
                </span>

                <h2>{book.title}</h2>

                <p className="book-author">
                  {book.author || 'Auteur inconnu'}
                </p>

                {book.description && (
                  <p className="book-description">
                    {book.description}
                  </p>
                )}

                <div className="book-stats">
                  <span>
                    <Star size={16} />
                    {Number(book.rating || 0).toFixed(1)}
                  </span>

                  <span>
                    <Users size={16} />
                    {book.readers_count || 0}
                  </span>
                </div>

                <button
                  type="button"
                  className="book-read-button"
                  disabled={!book.pdf_url}
                >
                  <BookOpen size={18} />

                  {book.pdf_url
                    ? 'Lire le livre'
                    : 'Bientôt disponible'}
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}
