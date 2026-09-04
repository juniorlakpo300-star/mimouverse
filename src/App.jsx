import { Link, Route, Routes } from 'react-router-dom'
import { BookOpen, Bot, BookMarked, Library, Search, Sparkles, UserRound, ShieldCheck } from 'lucide-react'
import Livres from './pages/Livres.jsx'
import Manga from './pages/Manga.jsx'
import Dictionnaire from './pages/Dictionnaire.jsx'
import Mia from './pages/Mia.jsx'
import Participation from './pages/Participation.jsx'
import Admin from './pages/Admin.jsx'
import AdminGuard from './auth/AdminGuard.jsx'
import AdminLogin from './pages/AdminLogin.jsx'

const features = [
  { to: '/livres', icon: BookOpen, title: 'Livres', text: 'Romans, éducation, développement personnel et auteurs africains.' },
  { to: '/manga', icon: BookMarked, title: 'Manga', text: 'Séries, chapitres, nouveautés et tendances.' },
  { to: '/dictionnaire', icon: Search, title: 'Dictionnaire', text: 'Définitions, synonymes, exemples et explications simples.' },
  { to: '/mia', icon: Bot, title: 'MIA', text: 'Ton assistant intelligent pour comprendre et découvrir.' },
]

function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-glow" />
        <div className="eyebrow"><Sparkles size={15} /> L’univers de la lecture réinventé</div>
        <h1>Bienvenue dans <span>MIMOUVERSE</span></h1>
        <p>Lis. Découvre. Comprends. Imagine.</p>
        <div className="hero-actions">
          <Link className="button primary" to="/livres"><Library size={18} /> Entrer dans l’univers</Link>
          <Link className="button ghost" to="/manga">Explorer les mangas</Link>
        </div>
      </section>
      <section className="section">
        <div className="section-heading"><div><span className="kicker">Tout au même endroit</span><h2>Un univers, plusieurs façons de lire</h2></div><p>Une plateforme pensée pour lire, apprendre, découvrir et échanger.</p></div>
        <div className="feature-grid">
          {features.map(({ to, icon: Icon, title, text }) => <Link className="feature-card" to={to} key={to}><div className="icon-box"><Icon size={23} /></div><h3>{title}</h3><p>{text}</p><span>Découvrir →</span></Link>)}
        </div>
      </section>
    </main>
  )
}

export default function App() {
  return <div className="app">
    <header className="navbar">
      <Link className="brand" to="/"><span className="brand-mark">M</span><span>MIMOU<span>VERSE</span></span></Link>
      <nav><Link to="/livres">Livres</Link><Link to="/manga">Manga</Link><Link to="/dictionnaire">Dictionnaire</Link><Link to="/mia">MIA</Link></nav>
      <div className="navbar-actions">
        <Link className="participate-link" to="/participer"><UserRound size={16} /> Participer</Link>
        <Link className="admin-link" to="/admin"><ShieldCheck size={15} /> Admin</Link>
      </div>
    </header>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/livres" element={<Livres />} />
      <Route path="/manga" element={<Manga />} />
      <Route path="/dictionnaire" element={<Dictionnaire />} />
      <Route path="/mia" element={<Mia />} />
      <Route path="/participer" element={<Participation />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/secure" element={<AdminGuard><Admin /></AdminGuard>} />
    </Routes>
    <footer>© 2026 MIMOUVERSE · Un univers imaginé pour les lecteurs.</footer>
  </div>
}
