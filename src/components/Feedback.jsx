import { useEffect, useMemo, useState } from 'react'
import { MessageCircle, Send, Star, Loader2, UserRound } from 'lucide-react'
import { supabase } from '../supabase.js'

export default function Feedback({ type, items = [] }) {
  const isManga = type === 'manga'
  const idField = isManga ? 'manga_id' : 'book_id'
  const label = isManga ? 'manga' : 'livre'

  const [selectedId, setSelectedId] = useState(items[0]?.id || '')
  const [comments, setComments] = useState([])
  const [ratings, setRatings] = useState([])
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!selectedId && items[0]?.id) setSelectedId(items[0].id)
    if (selectedId && !items.some((item) => item.id === selectedId)) setSelectedId(items[0]?.id || '')
  }, [items, selectedId])

  useEffect(() => {
    let active = true

    const loadFeedback = async () => {
      if (!supabase || !selectedId) {
        setComments([])
        setRatings([])
        return
      }

      setLoading(true)
      setError('')

      const [commentsResult, ratingsResult] = await Promise.all([
        supabase.from('comments').select('id, content, created_at, approved').eq(idField, selectedId).eq('approved', true).order('created_at', { ascending: false }),
        supabase.from('ratings').select('id, rating, content, created_at').eq(idField, selectedId).order('created_at', { ascending: false }),
      ])

      if (!active) return

      if (commentsResult.error) setError(commentsResult.error.message)
      else setComments(commentsResult.data || [])

      if (ratingsResult.error && !commentsResult.error) setError(ratingsResult.error.message)
      else setRatings(ratingsResult.data || [])

      setLoading(false)
    }

    loadFeedback()
    return () => { active = false }
  }, [idField, selectedId])

  const average = useMemo(() => {
    if (!ratings.length) return 0
    return ratings.reduce((sum, item) => sum + Number(item.rating || 0), 0) / ratings.length
  }, [ratings])

  const selectedItem = items.find((item) => item.id === selectedId)

  const submitFeedback = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    if (!supabase) {
      setError('Supabase n’est pas configuré.')
      return
    }

    if (!selectedId) {
      setError(`Publie d’abord au moins un ${label}.`)
      return
    }

    if (!rating && !comment.trim()) {
      setError('Ajoute une note ou un commentaire avant d’envoyer.')
      return
    }

    setSending(true)

    try {
      if (rating) {
        const { error: ratingError } = await supabase.from('ratings').insert({
          [idField]: selectedId,
          rating,
          content: comment.trim(),
        })
        if (ratingError) throw ratingError
      }

      if (comment.trim()) {
        const { error: commentError } = await supabase.from('comments').insert({
          [idField]: selectedId,
          content: comment.trim(),
          approved: true,
        })
        if (commentError) throw commentError
      }

      setRating(0)
      setComment('')
      setMessage('Merci ! Ton avis a bien été enregistré.')

      const [commentsResult, ratingsResult] = await Promise.all([
        supabase.from('comments').select('id, content, created_at, approved').eq(idField, selectedId).eq('approved', true).order('created_at', { ascending: false }),
        supabase.from('ratings').select('id, rating, content, created_at').eq(idField, selectedId).order('created_at', { ascending: false }),
      ])
      if (!commentsResult.error) setComments(commentsResult.data || [])
      if (!ratingsResult.error) setRatings(ratingsResult.data || [])
    } catch (submitError) {
      setError(submitError?.message || 'Impossible d’enregistrer ton avis pour le moment.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="feedback-section" aria-label={`Commentaires et notes des ${label}s`}>
      <div className="feedback-heading">
        <div>
          <span className="kicker">Communauté MIMOUVERSE</span>
          <h2>Commentaires & notation</h2>
          <p>Choisis une œuvre, donne une note et partage ton avis avec les autres lecteurs.</p>
        </div>
        <div className="feedback-icon"><MessageCircle size={24} /></div>
      </div>

      {items.length === 0 ? (
        <div className="feedback-empty">
          <MessageCircle size={28} />
          <h3>Aucune œuvre à commenter</h3>
          <p>Les commentaires et les notes apparaîtront ici dès qu’un {label} sera publié.</p>
        </div>
      ) : (
        <div className="feedback-layout">
          <div className="feedback-form-card">
            <label className="feedback-label" htmlFor={`feedback-${type}`}>Œuvre à commenter</label>
            <select id={`feedback-${type}`} value={selectedId} onChange={(event) => { setSelectedId(event.target.value); setMessage(''); setError('') }}>
              {items.map((item) => <option value={item.id} key={item.id}>{item.title}</option>)}
            </select>

            <div className="feedback-selected">
              <div className="feedback-selected-cover"><img src={selectedItem?.cover} alt="" /></div>
              <div><strong>{selectedItem?.title || 'Œuvre sélectionnée'}</strong><span>{selectedItem?.author || ''}</span></div>
            </div>

            <div className="feedback-rating-picker">
              <span className="feedback-label">Ta note</span>
              <div className="star-picker" aria-label="Choisir une note de 1 à 5">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button type="button" key={value} className={value <= rating ? 'star-button active' : 'star-button'} onClick={() => setRating(value)} aria-label={`${value} étoile${value > 1 ? 's' : ''}`}>
                    <Star size={23} fill={value <= rating ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
            </div>

            <label className="feedback-label" htmlFor={`comment-${type}`}>Ton commentaire</label>
            <textarea id={`comment-${type}`} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Qu’as-tu pensé de cette œuvre ?" rows={5} maxLength={1000} />
            <div className="feedback-form-footer"><span>{comment.length}/1000</span><button className="feedback-submit" type="button" onClick={submitFeedback} disabled={sending}>{sending ? <><Loader2 size={16} className="feedback-spin" /> Envoi...</> : <><Send size={16} /> Publier mon avis</>}</button></div>
            {message && <p className="feedback-success">{message}</p>}
            {error && <p className="feedback-error">{error}</p>}
          </div>

          <div className="feedback-results">
            <div className="feedback-summary">
              <div className="feedback-average"><strong>{average ? average.toFixed(1) : '—'}</strong><div className="average-stars">{[1, 2, 3, 4, 5].map((value) => <Star key={value} size={16} fill={value <= Math.round(average) ? 'currentColor' : 'none'} />)}</div><span>{ratings.length} note{ratings.length > 1 ? 's' : ''}</span></div>
              <div className="feedback-summary-copy"><strong>{comments.length} commentaire{comments.length > 1 ? 's' : ''}</strong><span>Les avis récents des lecteurs.</span></div>
            </div>

            <div className="feedback-comments">
              {loading ? <div className="feedback-loading"><Loader2 size={24} className="feedback-spin" /> Chargement des avis...</div> : comments.length === 0 ? <div className="feedback-loading"><MessageCircle size={24} /><span>Sois le premier à laisser un commentaire.</span></div> : comments.map((item) => <article className="feedback-comment" key={item.id}><div className="comment-avatar"><UserRound size={17} /></div><div><div className="comment-top"><strong>Lecteur MIMOUVERSE</strong><span>{item.created_at ? new Date(item.created_at).toLocaleDateString('fr-FR') : ''}</span></div><p>{item.content}</p></div></article>)}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
