import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookMarked, BookOpen, CheckCircle2, FileUp, ImagePlus, Loader2, ShieldCheck, Upload, X } from 'lucide-react'
import { supabase, ADMIN_EMAIL } from '../supabase.js'

const EMPTY_FORM = { title: '', author: '', category: '', description: '', type: 'books' }

const STORAGE = {
  books: { files: 'book-pdfs', covers: 'book-covers' },
  manga: { files: 'manga-pages', covers: 'manga-covers' },
}

function safeName(name) {
  return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9.]+/g, '-').replace(/^-|-$/g, '')
}

export default function Publication() {
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY_FORM)
  const [cover, setCover] = useState(null)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const publish = async (event) => {
    event.preventDefault()
    setMessage(null)
    if (!supabase) return setMessage({ type: 'error', text: 'Supabase n’est pas configuré.' })
    if (!form.title.trim()) return setMessage({ type: 'error', text: 'Le titre est obligatoire.' })
    if (!file) return setMessage({ type: 'error', text: 'Sélectionne le fichier PDF de l’œuvre.' })

    setLoading(true)
    try {
      const { data: authData } = await supabase.auth.getUser()
      const user = authData?.user
      if (!user) throw new Error('Tu dois être connecté en administrateur.')
      if (user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) throw new Error('Ce compte n’a pas les droits administrateur.')

      const storage = STORAGE[form.type]
      const base = `${Date.now()}-${safeName(file.name)}`
      const filePath = `works/${base}`
      const coverPath = cover ? `covers/${Date.now()}-${safeName(cover.name)}` : null

      const uploadFile = await supabase.storage
        .from(storage.files)
        .upload(filePath, file, { upsert: false, contentType: file.type || 'application/pdf' })
      if (uploadFile.error) throw new Error(`Upload du fichier impossible : ${uploadFile.error.message}`)

      let coverUrl = ''
      if (cover) {
        const uploadCover = await supabase.storage
          .from(storage.covers)
          .upload(coverPath, cover, { upsert: false, contentType: cover.type })
        if (uploadCover.error) throw new Error(`Upload de la couverture impossible : ${uploadCover.error.message}`)
        coverUrl = supabase.storage.from(storage.covers).getPublicUrl(coverPath).data?.publicUrl || ''
      }

      const fileUrl = supabase.storage.from(storage.files).getPublicUrl(filePath).data?.publicUrl || ''
      const payload = {
        title: form.title.trim(),
        author: form.author.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        cover_url: coverUrl,
        pdf_url: fileUrl,
      }

      const { error: insertError } = await supabase.from(form.type).insert(payload)
      if (insertError) throw new Error(`Publication impossible : ${insertError.message}`)

      setMessage({ type: 'success', text: `« ${form.title.trim()} » a été publié avec succès.` })
      setForm(EMPTY_FORM)
      setCover(null)
      setFile(null)
      event.target.reset()
      setTimeout(() => navigate('/admin/secure'), 900)
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Une erreur est survenue pendant la publication.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="publication-page">
      <style>{`
        .publication-page{min-height:100vh;padding:42px 18px 80px;background:radial-gradient(circle at 12% 0%,rgba(124,58,237,.18),transparent 32%),radial-gradient(circle at 90% 15%,rgba(37,99,235,.12),transparent 28%),#060812;color:#f8fafc}.publication-wrap{width:min(980px,100%);margin:auto}.publication-top{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:25px}.publication-brand{display:flex;align-items:center;gap:12px}.publication-icon{display:grid;place-items:center;width:44px;height:44px;border-radius:14px;background:rgba(124,58,237,.15);border:1px solid rgba(167,139,250,.28);color:#c4b5fd}.publication-brand strong{display:block}.publication-brand span{display:block;color:#94a3b8;font-size:12px;margin-top:3px}.publication-back{color:#cbd5e1;text-decoration:none;border:1px solid #273449;background:#0d1525;padding:10px 13px;border-radius:10px}.publication-card{border:1px solid #202b3d;background:rgba(9,15,29,.95);border-radius:24px;padding:clamp(22px,4vw,38px);box-shadow:0 25px 80px rgba(0,0,0,.24)}.publication-card h1{font-size:clamp(30px,5vw,48px);line-height:1.05;margin:0 0 10px}.publication-card>p{color:#94a3b8;line-height:1.7;margin:0 0 28px}.publication-type{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:22px}.publication-type button{display:flex;align-items:center;justify-content:center;gap:9px;padding:14px;border-radius:12px;border:1px solid #273449;background:#0d1525;color:#94a3b8;font-weight:750;cursor:pointer}.publication-type button.active{background:#312e81;border-color:#6366f1;color:#fff}.publication-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.publication-field{display:flex;flex-direction:column;gap:7px}.publication-field.full{grid-column:1/-1}.publication-field label{font-size:12px;color:#cbd5e1;font-weight:700}.publication-field input,.publication-field textarea{width:100%;box-sizing:border-box;border:1px solid #273449;background:#0d1525;color:#f8fafc;border-radius:11px;padding:12px;outline:none;font:inherit}.publication-field textarea{min-height:120px;resize:vertical}.publication-field input:focus,.publication-field textarea:focus{border-color:#6366f1}.upload-box{position:relative;border:1px dashed #3b4a62;background:#0b1220;border-radius:14px;padding:18px;min-height:92px;display:flex;align-items:center;justify-content:center;text-align:center;color:#94a3b8}.upload-box input{position:absolute;inset:0;opacity:0;cursor:pointer}.upload-box strong{display:block;color:#e2e8f0;margin-bottom:4px}.upload-box svg{margin-bottom:6px;color:#a78bfa}.selected-file{display:flex;align-items:center;justify-content:space-between;gap:8px;color:#cbd5e1;font-size:13px}.selected-file button{border:0;background:transparent;color:#94a3b8;cursor:pointer}.publication-notice{display:flex;gap:10px;padding:13px 15px;border-radius:12px;margin-bottom:18px;font-size:13px;line-height:1.5}.publication-notice.error{background:rgba(127,29,29,.2);border:1px solid rgba(248,113,113,.25);color:#fecaca}.publication-notice.success{background:rgba(6,78,59,.2);border:1px solid rgba(52,211,153,.25);color:#bbf7d0}.publication-submit{width:100%;display:flex;align-items:center;justify-content:center;gap:9px;margin-top:22px;padding:14px;border:0;border-radius:12px;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:white;font-weight:800;font-size:15px;cursor:pointer}.publication-submit:disabled{opacity:.65;cursor:not-allowed}.publication-help{margin-top:15px;color:#64748b;font-size:12px;line-height:1.6}@media(max-width:650px){.publication-grid{grid-template-columns:1fr}.publication-field.full{grid-column:auto}.publication-top{align-items:flex-start}.publication-back{font-size:12px}}
      `}</style>
      <div className="publication-wrap">
        <header className="publication-top"><div className="publication-brand"><div className="publication-icon"><ShieldCheck size={22} /></div><div><strong>MIMOUVERSE</strong><span>Publication propriétaire</span></div></div><Link className="publication-back" to="/admin/secure">← Retour à l’admin</Link></header>
        <form className="publication-card" onSubmit={publish}>
          <h1>Publier une œuvre</h1>
          <p>Ajoute un livre ou un manga avec sa couverture et son fichier. La publication apparaîtra ensuite dans la vitrine correspondante.</p>

          {message && <div className={`publication-notice ${message.type}`}>{message.type === 'success' ? <CheckCircle2 size={18} /> : <X size={18} />}<span>{message.text}</span></div>}

          <div className="publication-type"><button type="button" className={form.type === 'books' ? 'active' : ''} onClick={() => update('type','books')}><BookOpen size={18} /> Livre</button><button type="button" className={form.type === 'manga' ? 'active' : ''} onClick={() => update('type','manga')}><BookMarked size={18} /> Manga</button></div>
          <div className="publication-grid">
            <div className="publication-field"><label>Titre *</label><input value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="Titre de l’œuvre" /></div>
            <div className="publication-field"><label>Auteur</label><input value={form.author} onChange={(e) => update('author', e.target.value)} placeholder="Nom de l’auteur" /></div>
            <div className="publication-field"><label>Catégorie / genre</label><input value={form.category} onChange={(e) => update('category', e.target.value)} placeholder={form.type === 'manga' ? 'Action, Fantasy...' : 'Roman, Éducation...'} /></div>
            <div className="publication-field"><label>Couverture</label><div className="upload-box">{cover ? <div className="selected-file"><ImagePlus size={20}/><span>{cover.name}</span><button type="button" onClick={() => setCover(null)}>×</button></div> : <><div><ImagePlus size={22}/><strong>Ajouter une couverture</strong><span>PNG, JPG ou WEBP</span></div><input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => setCover(e.target.files?.[0] || null)} /></>}</div></div>
            <div className="publication-field full"><label>Description</label><textarea value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Présente brièvement cette œuvre..." /></div>
            <div className="publication-field full"><label>Fichier de l’œuvre *</label><div className="upload-box">{file ? <div className="selected-file"><FileUp size={20}/><span>{file.name}</span><button type="button" onClick={() => setFile(null)}>×</button></div> : <><div><FileUp size={22}/><strong>Choisir le fichier PDF</strong><span>Le fichier sera envoyé dans le stockage Supabase.</span></div><input type="file" accept="application/pdf,.pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} /></>}</div></div>
          </div>
          <button className="publication-submit" disabled={loading}>{loading ? <><Loader2 size={18} /> Publication en cours...</> : <><Upload size={18} /> Publier {form.type === 'manga' ? 'le manga' : 'le livre'}</>}</button>
          <div className="publication-help">Livres : PDF dans « book-pdfs » et couvertures dans « book-covers ». Mangas : fichiers dans « manga-pages » et couvertures dans « manga-covers ».</div>
        </form>
      </div>
    </main>
  )
}
