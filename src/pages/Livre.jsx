import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, BookOpen, Download, Loader2, MessageCircle, Sparkles, Star } from 'lucide-react'
import { supabase } from '../supabase.js'

const FALLBACK_COVER = 'https://placehold.co/500x700/111827/94a3b8?text=MIMOUVERSE'

function normalizeBook(row) {
  return {
    id: row.id,
    title: row.title || row.name || row.nom || 'Sans titre',
    author: row.author || row.author_name || row.auteur || 'Auteur inconnu',
    category: row.category || row.genre || 'Livre',
    description: row.description || 'Aucune description disponible pour cette œuvre.',
    cover: row.cover_url || row.cover || row.image_url || row.thumbnail_url || FALLBACK_COVER,
    file: row.pdf_url || row.file_url || row.pdf || row.file || row.document_url || '',
  }
}

export default function Livre() {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadBook = async () => {
      setLoading(true)
      setError('')

      if (!supabase) {
        if (active) {
          setError('Supabase n’est pas configuré.')
          setLoading(false)
        }
        return
      }

      const { data, error: queryError } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (!active) return

      if (queryError) setError(queryError.message)
      else if (!data) setError('Cette œuvre n’existe pas ou n’est plus disponible.')
      else setBook(normalizeBook(data))

      setLoading(false)
    }

    loadBook()
    return () => { active = false }
  }, [id])

  if (loading) {
    return (
      <main className="book-detail-page">
        <div className="book-detail-state">
          <Loader2 size={36} className="book-detail-spinner" />
          <h1>Ouverture de l’œuvre…</h1>
          <p>Chargement des informations depuis MIMOUVERSE.</p>
        </div>
      </main>
    )
  }

  if (error || !book) {
    return (
      <main className="book-detail-page">
        <div className="book-detail-state">
          <BookOpen size={42} />
          <h1>Œuvre introuvable</h1>
          <p>{error || 'Cette œuvre n’est pas disponible.'}</p>
          <Link to="/livres" className="book-detail-back"><ArrowLeft size={17} /> Retour aux livres</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="book-detail-page">
      <section className="book-detail-hero">
        <div className="book-detail-orb book-detail-orb-one" />
        <div className="book-detail-orb book-detail-orb-two" />
        <Link to="/livres" className="book-detail-back"><ArrowLeft size={17} /> Retour à la bibliothèque</Link>

        <div className="book-detail-layout">
          <div className="book-detail-cover">
            <img src={book.cover} alt={`Couverture de ${book.title}`} onError={(event) => { event.currentTarget.src = FALLBACK_COVER }} />
          </div>

          <div className="book-detail-content">
            <span className="book-detail-eyebrow"><Sparkles size={15} /> UNIVERS LITTÉRAIRE</span>
            <span className="book-detail-category">{book.category}</span>
            <h1>{book.title}</h1>
            <p className="book-detail-author">Par <strong>{book.author}</strong></p>
            <div className="book-detail-line" />
            <p className="book-detail-description">{book.description}</p>

            <div className="book-detail-actions">
              {book.file ? (
                <a className="book-detail-primary" href={book.file} target="_blank" rel="noopener noreferrer">
                  <BookOpen size={18} /> Lire l’œuvre
                </a>
              ) : (
                <button type="button" className="book-detail-primary" disabled>
                  <BookOpen size={18} /> Lecture indisponible
                </button>
              )}
              {book.file ? (
                <a className="book-detail-secondary" href={book.file} download>
                  <Download size={18} /> Télécharger
                </a>
              ) : (
                <button type="button" className="book-detail-secondary" disabled>
                  <Download size={18} /> Télécharger
                </button>
              )}
            </div>

            <div className="book-detail-meta">
              <div><Star size={18} /><span><strong>—</strong> Note</span></div>
              <div><MessageCircle size={18} /><span><strong>0</strong> Commentaires</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="book-detail-bottom">
        <div>
          <span className="book-detail-section-label">À PROPOS DE CETTE ŒUVRE</span>
          <h2>Une histoire à découvrir.</h2>
          <p>{book.description}</p>
        </div>
        <aside className="book-detail-note">
          <Star size={21} />
          <strong>Ton avis compte</strong>
          <p>Les lecteurs pourront bientôt choisir un pseudo et laisser une note ou un commentaire.</p>
        </aside>
      </section>
    </main>
  )
}
