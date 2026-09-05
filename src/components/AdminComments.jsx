import { useCallback, useEffect, useMemo, useState } from 'react'
import { Check, Clock3, MessageSquareText, RefreshCw, ShieldCheck, X } from 'lucide-react'
import { supabase } from '../supabase.js'

export default function AdminComments() {
  const [comments, setComments] = useState([])
  const [books, setBooks] = useState([])
  const [mangas, setMangas] = useState([])
  const [filter, setFilter] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!supabase) return
    setLoading(true)
    setError('')

    const [commentsResult, booksResult, mangaResult] = await Promise.all([
      supabase.from('comments').select('id, content, pseudo, user_id, book_id, manga_id, approved, created_at').order('created_at', { ascending: false }),
      supabase.from('books').select('id, title'),
      supabase.from('manga').select('id, title'),
    ])

    if (commentsResult.error) setError(commentsResult.error.message)
    else setComments(commentsResult.data || [])
    setBooks(booksResult.data || [])
    setMangas(mangaResult.data || [])
    if (mangaResult.error && !/relation|does not exist|schema cache/i.test(mangaResult.error.message || '')) setError(mangaResult.error.message)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const pendingCount = useMemo(() => comments.filter((comment) => !comment.approved).length, [comments])
  const visible = useMemo(() => comments.filter((comment) => filter === 'all' || (filter === 'pending' ? !comment.approved : comment.approved)), [comments, filter])

  const getWork = (comment) => {
    if (comment.book_id) return { type: 'Livre', title: books.find((item) => item.id === comment.book_id)?.title || 'Livre' }
    if (comment.manga_id) return { type: 'Manga', title: mangas.find((item) => item.id === comment.manga_id)?.title || 'Manga' }
    return { type: 'Œuvre', title: 'Œuvre inconnue' }
  }

  const moderate = async (comment, approved) => {
    if (!supabase) return
    setBusy(comment.id)
    setMessage('')
    setError('')

    const { error: updateError } = await supabase
      .from('comments')
      .update({ approved })
      .eq('id', comment.id)

    if (updateError) {
      setError(updateError.message)
    } else {
      setComments((current) => current.map((item) => item.id === comment.id ? { ...item, approved } : item))
      setMessage(approved ? 'Commentaire approuvé : il est maintenant visible.' : 'Commentaire refusé : il reste masqué aux lecteurs.')
    }
    setBusy(null)
  }

  return (
    <section className="admin-comments-panel">
      <style>{`
        .admin-comments-panel{margin-top:22px;border:1px solid #202b3d;border-radius:22px;background:#090f1d;overflow:hidden;color:#f8fafc}.admin-comments-head{padding:22px;border-bottom:1px solid #202b3d;display:flex;justify-content:space-between;gap:18px;align-items:flex-start}.admin-comments-head h2{margin:5px 0 5px;font-size:22px}.admin-comments-head p{margin:0;color:#94a3b8;font-size:13px;line-height:1.6}.admin-comments-badge{display:inline-flex;align-items:center;gap:7px;color:#fbbf24;font-size:11px;font-weight:800;letter-spacing:.1em}.admin-comments-actions{display:flex;gap:8px;flex-wrap:wrap}.admin-comments-filter{padding:15px 22px;border-bottom:1px solid #202b3d;display:flex;gap:8px;flex-wrap:wrap}.admin-comments-filter button{border:1px solid #273449;background:#0d1525;color:#94a3b8;border-radius:10px;padding:9px 12px;cursor:pointer}.admin-comments-filter button.active{background:#312e81;border-color:#6366f1;color:#fff}.admin-comment-list{display:grid;gap:0}.admin-comment{padding:20px 22px;border-top:1px solid #172235;display:grid;grid-template-columns:1fr auto;gap:18px}.admin-comment:first-child{border-top:0}.admin-comment-main{min-width:0}.admin-comment-meta{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-bottom:8px}.admin-comment-pseudo{font-weight:800;color:#e9d5ff}.admin-comment-work{font-size:11px;color:#a5b4fc;background:#111a2c;border:1px solid #273449;padding:4px 8px;border-radius:999px}.admin-comment-date{font-size:11px;color:#64748b}.admin-comment-text{margin:0;color:#cbd5e1;line-height:1.65;white-space:pre-wrap;overflow-wrap:anywhere}.admin-comment-status{display:inline-flex;align-items:center;gap:6px;margin-top:10px;font-size:11px;font-weight:700}.admin-comment-status.pending{color:#fbbf24}.admin-comment-status.approved{color:#6ee7b7}.admin-comment-buttons{display:flex;align-items:center;gap:8px}.admin-comment-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;border:1px solid #273449;background:#0d1525;color:#e2e8f0;border-radius:10px;padding:10px 12px;cursor:pointer;font-weight:700}.admin-comment-btn.approve{color:#86efac;border-color:rgba(74,222,128,.25)}.admin-comment-btn.reject{color:#fca5a5;border-color:rgba(248,113,113,.25)}.admin-comment-btn:hover{background:#172033}.admin-comment-btn:disabled{opacity:.5;cursor:wait}.admin-comments-notice{margin:16px 22px 0;padding:12px 14px;border-radius:11px;background:rgba(6,78,59,.18);border:1px solid rgba(52,211,153,.22);color:#bbf7d0;font-size:13px}.admin-comments-error{margin:16px 22px 0;padding:12px 14px;border-radius:11px;background:rgba(127,29,29,.16);border:1px solid rgba(248,113,113,.22);color:#fecaca;font-size:13px}.admin-comments-empty{padding:50px 20px;text-align:center;color:#94a3b8}.admin-comments-empty svg{margin-bottom:10px}.admin-comments-empty strong{display:block;color:#e2e8f0;margin-bottom:5px}.admin-comments-empty span{font-size:13px}@media(max-width:700px){.admin-comments-head{flex-direction:column}.admin-comment{grid-template-columns:1fr}.admin-comment-buttons{justify-content:flex-start}}
      `}</style>

      <div className="admin-comments-head">
        <div>
          <span className="admin-comments-badge"><ShieldCheck size={15} /> MODÉRATION DES COMMENTAIRES</span>
          <h2>Avis des lecteurs</h2>
          <p>Les nouveaux commentaires arrivent ici en attente. Ils restent invisibles sur le site jusqu’à ton approbation.</p>
        </div>
        <div className="admin-comments-actions">
          <button className="admin-btn" type="button" onClick={load} disabled={loading}><RefreshCw size={16} /> Actualiser</button>
        </div>
      </div>

      <div className="admin-comments-filter">
        <button type="button" className={filter === 'pending' ? 'active' : ''} onClick={() => setFilter('pending')}><Clock3 size={14} /> En attente ({pendingCount})</button>
        <button type="button" className={filter === 'approved' ? 'active' : ''} onClick={() => setFilter('approved')}><Check size={14} /> Approuvés</button>
        <button type="button" className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Tous ({comments.length})</button>
      </div>

      {message && <div className="admin-comments-notice">{message}</div>}
      {error && <div className="admin-comments-error">Erreur : {error}</div>}

      {loading ? (
        <div className="admin-comments-empty"><RefreshCw size={28} /><strong>Chargement des commentaires...</strong><span>Récupération depuis Supabase.</span></div>
      ) : visible.length === 0 ? (
        <div className="admin-comments-empty"><MessageSquareText size={30} /><strong>Aucun commentaire dans cette catégorie.</strong><span>Les nouveaux avis apparaîtront ici dès qu’un lecteur en enverra un.</span></div>
      ) : (
        <div className="admin-comment-list">
          {visible.map((comment) => {
            const work = getWork(comment)
            return (
              <article className="admin-comment" key={comment.id}>
                <div className="admin-comment-main">
                  <div className="admin-comment-meta">
                    <span className="admin-comment-pseudo">{comment.pseudo || 'Lecteur MIMOUVERSE'}</span>
                    <span className="admin-comment-work">{work.type} · {work.title}</span>
                    <span className="admin-comment-date">{comment.created_at ? new Date(comment.created_at).toLocaleString('fr-FR') : ''}</span>
                  </div>
                  <p className="admin-comment-text">{comment.content}</p>
                  <span className={`admin-comment-status ${comment.approved ? 'approved' : 'pending'}`}>
                    {comment.approved ? <><Check size={13} /> Publié</> : <><Clock3 size={13} /> En attente de validation</>}
                  </span>
                </div>
                <div className="admin-comment-buttons">
                  {!comment.approved && <button className="admin-comment-btn approve" type="button" onClick={() => moderate(comment, true)} disabled={busy === comment.id}><Check size={15} /> Approuver</button>}
                  {comment.approved && <button className="admin-comment-btn reject" type="button" onClick={() => moderate(comment, false)} disabled={busy === comment.id}><X size={15} /> Masquer</button>}
                  {!comment.approved && <button className="admin-comment-btn reject" type="button" onClick={() => moderate(comment, false)} disabled={busy === comment.id}><X size={15} /> Refuser</button>}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
