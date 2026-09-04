import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  BookMarked,
  BookOpen,
  CheckCircle2,
  Database,
  Eye,
  FileText,
  Loader2,
  LogOut,
  Pencil,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
  Users,
} from 'lucide-react'
import { supabase, ADMIN_EMAIL } from '../supabase.js'

const TABLES = [
  { key: 'books', label: 'Livres', icon: BookOpen },
  { key: 'manga', label: 'Mangas', icon: BookMarked },
]

const FALLBACK_COVER = 'https://placehold.co/160x220/111827/94a3b8?text=MIMOUVERSE'

function normalizeRows(rows, type) {
  return (rows || []).map((row) => ({
    ...row,
    _type: type,
    _title: row.title || row.name || row.nom || 'Sans titre',
    _author: row.author || row.author_name || row.auteur || 'Auteur inconnu',
    _cover: row.cover_url || row.cover || row.image_url || row.thumbnail_url || FALLBACK_COVER,
    _file: row.pdf_url || row.file_url || row.pdf || row.file || row.document_url || '',
    _category: row.category || row.genre || row.type || (type === 'manga' ? 'Manga' : 'Livre'),
  }))
}

export default function Admin() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [message, setMessage] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [user, setUser] = useState(null)

  const loadCatalogue = useCallback(async (silent = false) => {
    if (!supabase) {
      setMessage({ type: 'error', text: 'Supabase n’est pas configuré dans les variables VITE_SUPABASE_*.' })
      setLoading(false)
      return
    }

    if (silent) setRefreshing(true)
    else setLoading(true)
    setMessage(null)

    try {
      const sessionResult = await supabase.auth.getUser()
      setUser(sessionResult.data?.user || null)

      const results = await Promise.all(
        TABLES.map(async ({ key }) => {
          const result = await supabase.from(key).select('*').order('created_at', { ascending: false })
          if (result.error) {
            // La table manga peut ne pas encore exister : on garde le tableau de bord utilisable.
            if (key === 'manga' && /relation|does not exist|schema cache/i.test(result.error.message || '')) {
              return []
            }
            throw new Error(`${key}: ${result.error.message}`)
          }
          return normalizeRows(result.data, key)
        }),
      )

      setItems(results.flat())
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Impossible de charger le catalogue Supabase.' })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    loadCatalogue()
  }, [loadCatalogue])

  const filteredItems = useMemo(() => {
    const term = query.trim().toLowerCase()
    return items.filter((item) => {
      const matchesType = filter === 'all' || item._type === filter
      const haystack = `${item._title} ${item._author} ${item._category}`.toLowerCase()
      return matchesType && (!term || haystack.includes(term))
    })
  }, [items, query, filter])

  const stats = useMemo(() => ({
    total: items.length,
    books: items.filter((item) => item._type === 'books').length,
    manga: items.filter((item) => item._type === 'manga').length,
    files: items.filter((item) => Boolean(item._file)).length,
  }), [items])

  const deleteItem = async (item) => {
    if (!supabase || !item.id) return
    const confirmed = window.confirm(`Supprimer « ${item._title} » du catalogue ? Cette action est irréversible.`)
    if (!confirmed) return

    setDeleting(`${item._type}:${item.id}`)
    setMessage(null)

    const { error } = await supabase.from(item._type).delete().eq('id', item.id)
    if (error) {
      setMessage({ type: 'error', text: `Suppression impossible : ${error.message}` })
    } else {
      setItems((current) => current.filter((entry) => !(entry._type === item._type && entry.id === item.id)))
      setMessage({ type: 'success', text: `« ${item._title} » a été supprimé.` })
    }
    setDeleting(null)
  }

  const logout = async () => {
    if (supabase) await supabase.auth.signOut()
    window.location.href = '/admin'
  }

  return (
    <main className="admin-dashboard">
      <style>{`
        .admin-dashboard{min-height:100vh;padding:44px clamp(18px,4vw,64px) 72px;background:radial-gradient(circle at 10% 0%,rgba(124,58,237,.18),transparent 30%),radial-gradient(circle at 90% 10%,rgba(37,99,235,.12),transparent 28%),#060812;color:#f8fafc}
        .admin-wrap{width:min(1380px,100%);margin:0 auto}
        .admin-topbar{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-bottom:30px}
        .admin-brand{display:flex;align-items:center;gap:13px}.admin-brand-icon{display:grid;place-items:center;width:44px;height:44px;border:1px solid rgba(139,92,246,.4);border-radius:14px;background:rgba(124,58,237,.14);color:#c4b5fd}.admin-brand strong{display:block;font-size:15px}.admin-brand span{display:block;color:#94a3b8;font-size:12px;margin-top:3px}
        .admin-actions{display:flex;gap:10px;flex-wrap:wrap}.admin-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:1px solid #273449;background:#0f172a;color:#e2e8f0;border-radius:11px;padding:10px 14px;text-decoration:none;cursor:pointer;font-weight:650}.admin-btn:hover{border-color:#64748b;background:#172033}.admin-btn.primary{background:linear-gradient(135deg,#7c3aed,#4f46e5);border-color:transparent;color:white}.admin-btn.danger{color:#fca5a5}
        .admin-hero{padding:32px;border:1px solid #202b3d;border-radius:24px;background:linear-gradient(135deg,rgba(15,23,42,.96),rgba(10,14,27,.92));box-shadow:0 22px 70px rgba(0,0,0,.2);margin-bottom:22px}.admin-badge{display:inline-flex;align-items:center;gap:8px;color:#c4b5fd;font-size:11px;font-weight:800;letter-spacing:.12em}.admin-hero h1{font-size:clamp(30px,4vw,52px);line-height:1.05;margin:14px 0 10px;letter-spacing:-.04em}.admin-hero h1 span{color:#a78bfa}.admin-hero p{max-width:720px;color:#94a3b8;line-height:1.7;margin:0}.admin-session{margin-top:20px;display:flex;align-items:center;gap:10px;color:#cbd5e1;font-size:13px}.admin-session-dot{width:8px;height:8px;border-radius:50%;background:#34d399;box-shadow:0 0 14px #34d399}
        .admin-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin:22px 0}.admin-stat{padding:20px;border:1px solid #202b3d;border-radius:18px;background:#0b1120}.admin-stat-icon{display:grid;place-items:center;width:38px;height:38px;border-radius:11px;background:#111a2c;color:#a78bfa;margin-bottom:14px}.admin-stat strong{display:block;font-size:29px}.admin-stat span{display:block;color:#94a3b8;font-size:13px;margin-top:4px}
        .admin-notice{display:flex;gap:12px;align-items:flex-start;padding:15px 17px;border-radius:14px;margin-bottom:20px;background:rgba(127,29,29,.16);border:1px solid rgba(248,113,113,.22);color:#fecaca}.admin-notice.success{background:rgba(6,78,59,.18);border-color:rgba(52,211,153,.22);color:#bbf7d0}.admin-notice p{margin:2px 0 0;color:#cbd5e1;font-size:13px;line-height:1.5}
        .admin-catalogue-panel{border:1px solid #202b3d;border-radius:22px;background:#090f1d;overflow:hidden}.admin-panel-head{padding:22px;border-bottom:1px solid #202b3d;display:flex;justify-content:space-between;gap:18px;align-items:flex-start}.admin-panel-head h2{margin:4px 0 5px;font-size:22px}.admin-panel-head p{margin:0;color:#94a3b8;font-size:13px}.admin-tools{padding:16px 22px;border-bottom:1px solid #202b3d;display:flex;gap:10px;flex-wrap:wrap}.admin-search{flex:1;min-width:230px;display:flex;align-items:center;gap:9px;border:1px solid #273449;background:#0d1525;border-radius:11px;padding:0 12px;color:#64748b}.admin-search input{width:100%;border:0;outline:0;background:transparent;color:#f8fafc;padding:11px 0}.admin-filter{display:flex;gap:7px}.admin-filter button{border:1px solid #273449;background:#0d1525;color:#94a3b8;border-radius:10px;padding:9px 12px;cursor:pointer}.admin-filter button.active{background:#312e81;border-color:#6366f1;color:#fff}
        .admin-table-wrap{overflow:auto}.admin-table{width:100%;border-collapse:collapse;min-width:760px}.admin-table th{text-align:left;padding:13px 18px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:.08em;background:#080d18}.admin-table td{padding:13px 18px;border-top:1px solid #172235;vertical-align:middle}.admin-work{display:flex;align-items:center;gap:13px;min-width:260px}.admin-cover{width:42px;height:58px;object-fit:cover;border-radius:7px;background:#111827;border:1px solid #263246}.admin-title{font-weight:700}.admin-muted{font-size:12px;color:#64748b;margin-top:3px}.admin-type{display:inline-flex;padding:5px 8px;border-radius:999px;background:#111a2c;color:#c4b5fd;font-size:11px;font-weight:700}.admin-file{display:inline-flex;align-items:center;gap:5px;color:#6ee7b7;font-size:12px}.admin-missing{color:#94a3b8;font-size:12px}.admin-row-actions{display:flex;justify-content:flex-end;gap:6px}.admin-icon-btn{display:grid;place-items:center;width:34px;height:34px;border:1px solid #273449;background:#0d1525;color:#cbd5e1;border-radius:9px;cursor:pointer;text-decoration:none}.admin-icon-btn:hover{background:#172033}.admin-icon-btn.delete{color:#fca5a5}.admin-empty{padding:58px 20px;text-align:center;color:#94a3b8}.admin-empty svg{margin-bottom:12px;color:#64748b}.admin-empty h3{margin:0 0 6px;color:#e2e8f0}.admin-empty p{margin:0;font-size:13px}.admin-footer-note{display:flex;align-items:center;gap:8px;color:#64748b;font-size:12px;margin-top:16px}
        @media(max-width:900px){.admin-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.admin-panel-head{flex-direction:column}.admin-topbar{align-items:flex-start;flex-direction:column}}
        @media(max-width:520px){.admin-stats{grid-template-columns:1fr 1fr}.admin-dashboard{padding:25px 13px 50px}.admin-hero{padding:23px}.admin-actions,.admin-filter{width:100%}.admin-actions .admin-btn{flex:1}.admin-filter button{flex:1}}
      `}</style>

      <div className="admin-wrap">
        <header className="admin-topbar">
          <div className="admin-brand">
            <div className="admin-brand-icon"><ShieldCheck size={22} /></div>
            <div><strong>MIMOUVERSE</strong><span>Tableau de bord propriétaire</span></div>
          </div>
          <div className="admin-actions">
            <button className="admin-btn" onClick={() => loadCatalogue(true)} disabled={refreshing}>
              {refreshing ? <Loader2 size={16} className="spin" /> : <RefreshCw size={16} />} Actualiser
            </button>
            <Link className="admin-btn primary" to="/participation"><Upload size={16} /> Publier</Link>
            <button className="admin-btn danger" onClick={logout}><LogOut size={16} /> Déconnexion</button>
          </div>
        </header>

        <section className="admin-hero">
          <div className="admin-badge"><ShieldCheck size={16} /> ESPACE ADMINISTRATEUR SÉCURISÉ</div>
          <h1>Centre de contrôle <span>MIMOUVERSE.</span></h1>
          <p>Gère directement les œuvres présentes dans Supabase : consulte le catalogue, vérifie les fichiers, ouvre une œuvre ou supprime une publication.</p>
          <div className="admin-session"><span className="admin-session-dot" /> Connecté {user?.email ? `avec ${user.email}` : `comme ${ADMIN_EMAIL}`}</div>
        </section>

        {message && (
          <div className={`admin-notice ${message.type === 'success' ? 'success' : ''}`}>
            {message.type === 'success' ? <CheckCircle2 size={19} /> : <AlertCircle size={19} />}
            <div><strong>{message.type === 'success' ? 'Opération réussie' : 'Problème détecté'}</strong><p>{message.text}</p></div>
          </div>
        )}

        <section className="admin-stats">
          <article className="admin-stat"><div className="admin-stat-icon"><Database size={19} /></div><strong>{stats.total}</strong><span>Œuvres au total</span></article>
          <article className="admin-stat"><div className="admin-stat-icon"><BookOpen size={19} /></div><strong>{stats.books}</strong><span>Livres</span></article>
          <article className="admin-stat"><div className="admin-stat-icon"><BookMarked size={19} /></div><strong>{stats.manga}</strong><span>Mangas</span></article>
          <article className="admin-stat"><div className="admin-stat-icon"><FileText size={19} /></div><strong>{stats.files}</strong><span>Fichiers reliés</span></article>
        </section>

        <section className="admin-catalogue-panel">
          <div className="admin-panel-head">
            <div><span className="admin-badge">CATALOGUE SUPABASE</span><h2>Toutes les œuvres publiées</h2><p>{filteredItems.length} résultat{filteredItems.length !== 1 ? 's' : ''} affiché{filteredItems.length !== 1 ? 's' : ''} sur {items.length} au total.</p></div>
            <Link className="admin-btn" to="/livres"><Eye size={16} /> Voir la vitrine</Link>
          </div>

          <div className="admin-tools">
            <label className="admin-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un titre, auteur ou catégorie..." /></label>
            <div className="admin-filter">
              {[['all', 'Tout'], ['books', 'Livres'], ['manga', 'Mangas']].map(([value, label]) => (
                <button key={value} className={filter === value ? 'active' : ''} onClick={() => setFilter(value)}>{label}</button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="admin-empty"><Loader2 size={30} /><h3>Connexion à Supabase...</h3><p>Chargement du catalogue propriétaire.</p></div>
          ) : filteredItems.length === 0 ? (
            <div className="admin-empty"><BookOpen size={32} /><h3>{items.length ? 'Aucun résultat' : 'Catalogue vide'}</h3><p>{items.length ? 'Modifie ta recherche ou ton filtre.' : 'Les œuvres ajoutées dans Supabase apparaîtront ici automatiquement.'}</p></div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Œuvre</th><th>Type</th><th>Catégorie</th><th>Fichier</th><th>Actions</th></tr></thead>
                <tbody>
                  {filteredItems.map((item) => {
                    const key = `${item._type}:${item.id}`
                    return (
                      <tr key={key}>
                        <td><div className="admin-work"><img className="admin-cover" src={item._cover} alt="" onError={(event) => { event.currentTarget.src = FALLBACK_COVER }} /><div><div className="admin-title">{item._title}</div><div className="admin-muted">{item._author}</div></div></div></td>
                        <td><span className="admin-type">{item._type === 'manga' ? 'Manga' : 'Livre'}</span></td>
                        <td className="admin-muted">{item._category}</td>
                        <td>{item._file ? <span className="admin-file"><CheckCircle2 size={14} /> Disponible</span> : <span className="admin-missing">Non relié</span>}</td>
                        <td><div className="admin-row-actions">
                          {item._file && <a className="admin-icon-btn" href={item._file} target="_blank" rel="noreferrer" title="Ouvrir le fichier"><Eye size={16} /></a>}
                          <Link className="admin-icon-btn" to={item._type === 'manga' ? '/manga' : '/livres'} title="Voir dans la vitrine"><Eye size={16} /></Link>
                          <button className="admin-icon-btn delete" title="Supprimer" disabled={deleting === key} onClick={() => deleteItem(item)}>{deleting === key ? <Loader2 size={16} /> : <Trash2 size={16} />}</button>
                        </div></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="admin-footer-note"><ShieldCheck size={14} /> Les droits d’accès restent contrôlés par l’authentification Supabase. Les règles RLS doivent également protéger les tables en production.</div>
      </div>
    </main>
  )
}
