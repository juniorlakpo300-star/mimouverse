import { Link, Route, Routes } from 'react-router-dom'
import { BookOpen, Bot, BookMarked, Library, Search, Sparkles, UserRound, ShieldCheck, Share2, ArrowRight } from 'lucide-react'
import Livres from './pages/Livres.jsx'
import Manga from './pages/Manga.jsx'
import Dictionnaire from './pages/Dictionnaire.jsx'
import Mia from './pages/Mia.jsx'
import Participation from './pages/Participation.jsx'
import Publication from './pages/Publication.jsx'
import Admin from './pages/Admin.jsx'
import AdminGuard from './auth/AdminGuard.jsx'
import AdminLogin from './pages/AdminLogin.jsx'

const SITE_URL = 'https://mimouverse.vercel.app/'

const features = [
  { to: '/livres', icon: BookOpen, title: 'Livres', text: 'Romans, savoirs, découvertes et voix africaines.' },
  { to: '/manga', icon: BookMarked, title: 'Manga', text: 'Des univers à parcourir, série après série.' },
  { to: '/dictionnaire', icon: Search, title: 'Dictionnaire', text: 'Un mot, une définition, une nouvelle compréhension.' },
  { to: '/mia', icon: Bot, title: 'Lia', text: 'Ton guide intelligent pour trouver ton chemin.' },
]

function Home() {
  return (
    <main className="home-redesign">
      <section className="hero">
        <div className="hero-glow" />
        <div className="eyebrow"><Sparkles size={15} /> Bienvenue dans ton nouvel univers</div>
        <div className="home-logo-badge"><span className="home-logo-mark">MV</span><span>MIMOUVERSE</span></div>
        <h1>Ouvre une porte.<br /><span>Entre dans l’histoire.</span></h1>
        <p>Livres, mangas, mots et Lia réunis dans un même espace pour lire, apprendre et découvrir.</p>
        <div className="hero-actions">
          <Link className="button primary" to="/livres"><Library size={18} /> Découvrir MIMOUVERSE <ArrowRight size={17} /></Link>
          <Link className="button ghost" to="/manga"><BookMarked size={17} /> Parcourir les mangas</Link>
        </div>
        <div className="home-trust"><span>✦ Lecture</span><span>✦ Découverte</span><span>✦ Culture</span><span>✦ Imagination</span></div>
      </section>
      <section className="section home-discover">
        <div className="section-heading"><div><span className="kicker">Ton espace</span><h2>Choisis ton univers.</h2></div><p>Chaque porte mène vers une expérience différente, avec la même identité MIMOUVERSE.</p></div>
        <div className="feature-grid">
          {features.map(({ to, icon: Icon, title, text }) => <Link className="feature-card" to={to} key={to}><div className="icon-box"><Icon size={23} /></div><h3>{title}</h3><p>{text}</p><span>Ouvrir →</span></Link>)}
        </div>
      </section>
    </main>
  )
}

export default function App() {
  const shareSite = async () => {
    try {
      if (navigator.share) await navigator.share({ title: 'MIMOUVERSE', text: 'Découvre MIMOUVERSE : livres, mangas et outils de lecture.', url: SITE_URL })
      else { await navigator.clipboard.writeText(SITE_URL); window.alert('Lien MIMOUVERSE copié dans le presse-papiers.') }
    } catch (error) { if (error?.name !== 'AbortError') window.alert('Impossible de partager le lien pour le moment.') }
  }

  return <div className="app">
    <header className="navbar">
      <Link className="brand" to="/"><span className="brand-mark">MV</span><span>MIMOU<span>VERSE</span></span></Link>
      <nav><Link to="/livres">Livres</Link><Link to="/manga">Manga</Link><Link to="/dictionnaire">Dictionnaire</Link><Link to="/mia">Lia</Link></nav>
      <div className="navbar-actions">
        <button className="participate-link" type="button" onClick={shareSite}><Share2 size={16} /> <span>Partager</span></button>
        <Link className="participate-link" to="/participer"><UserRound size={16} /> <span>Participer</span></Link>
        <Link className="admin-link" to="/admin"><ShieldCheck size={15} /> <span>Admin</span></Link>
      </div>
    </header>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/livres" element={<Livres />} />
      <Route path="/manga" element={<Manga />} />
      <Route path="/dictionnaire" element={<Dictionnaire />} />
      <Route path="/mia" element={<Mia />} />
      <Route path="/participer" element={<Participation />} />
      <Route path="/publier" element={<Publication />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/secure" element={<AdminGuard><Admin /></AdminGuard>} />
    </Routes>
    <Link className="lia-float" to="/mia" aria-label="Ouvrir Lia"><span className="lia-avatar"><Bot size={18}/></span><span className="lia-label">Lia · Besoin d’aide ?</span></Link>
    <footer>© 2026 MIMOUVERSE · Lis. Découvre. Comprends. Imagine.</footer>
  </div>
}
