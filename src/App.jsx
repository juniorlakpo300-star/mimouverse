import { Link, Route, Routes } from 'react-router-dom'
import {
  BookOpen,
  BookMarked,
  Search,
  Bot,
  UserRound,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react'

import Home from './pages/Home.jsx'
import Livres from './pages/Livres.jsx'
import Manga from './pages/Manga.jsx'
import Dictionnaire from './pages/Dictionnaire.jsx'
import Mia from './pages/Mia.jsx'
import Participation from './pages/Participation.jsx'
import Admin from './pages/Admin.jsx'

import './App.css'

function Layout() {
  return (
    <div className="app">
      <header className="navbar">
        <Link to="/" className="brand">
          <span className="brand-mark">M</span>
          <span className="brand-text">
            MIMOU<span>VERSE</span>
          </span>
        </Link>

        <nav className="main-nav">
          <Link to="/">
            <Sparkles size={17} />
            Accueil
          </Link>

          <Link to="/livres">
            <BookOpen size={17} />
            Livres
          </Link>

          <Link to="/manga">
            <BookMarked size={17} />
            Manga
          </Link>

          <Link to="/dictionnaire">
            <Search size={17} />
            Dictionnaire
          </Link>

          <Link to="/mia">
            <Bot size={17} />
            MIA
          </Link>
        </nav>

        <div className="nav-actions">
          <Link to="/participer" className="participate-btn">
            <UserRound size={16} />
            Participer
          </Link>

          <Link to="/admin" className="admin-btn">
            <ShieldCheck size={16} />
            Admin
          </Link>
        </div>
      </header>

      <main className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/livres" element={<Livres />} />
          <Route path="/manga" element={<Manga />} />
          <Route path="/dictionnaire" element={<Dictionnaire />} />
          <Route path="/mia" element={<Mia />} />
          <Route path="/participer" element={<Participation />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="footer-brand">
              <span className="brand-mark">M</span>
              <strong>MIMOUVERSE</strong>
            </div>

            <p>
              Un univers numérique dédié à la lecture,
              aux mangas et à la découverte.
            </p>
          </div>

          <div className="footer-links">
            <Link to="/livres">Livres</Link>
            <Link to="/manga">Manga</Link>
            <Link to="/dictionnaire">Dictionnaire</Link>
            <Link to="/mia">MIA</Link>
          </div>

          <Link to="/livres" className="footer-explore">
            Explorer
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="footer-bottom">
          © 2026 MIMOUVERSE — Tous droits réservés.
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return <Layout />
}