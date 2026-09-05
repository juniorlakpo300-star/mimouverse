import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bot, BookOpen, Compass, ExternalLink, Send, Sparkles, WandSparkles } from 'lucide-react'

const suggestions = [
  'Recommande-moi un livre',
  'Quels livres sont disponibles ?',
  'Quels mangas sont disponibles ?',
  'Comment fonctionne MIMOUVERSE ?',
]

const quickLinks = [
  { label: 'Voir les livres', path: '/livres', icon: BookOpen },
  { label: 'Voir les mangas', path: '/manga', icon: Sparkles },
  { label: 'Dictionnaire', path: '/dictionnaire', icon: Compass },
]

const starterMessages = [
  { role: 'assistant', text: 'Bonjour 👋 Je suis MIA, l’assistante de MIMOUVERSE. Je peux chercher dans le catalogue, te recommander des œuvres et t’aider à découvrir le site.' },
]

function cleanText(text = '') {
  return String(text)
    .replace(/\\([*_`#])/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .trim()
}

function MiaText({ text }) {
  const cleaned = cleanText(text)
  const parts = cleaned.split(/(\/livres|\/manga|\/dictionnaire|\/mia|\/participer)/g)

  return (
    <div className="mia-text">
      {parts.map((part, index) => {
        const knownPaths = ['/livres', '/manga', '/dictionnaire', '/mia', '/participer']
        if (knownPaths.includes(part)) {
          return <Link className="mia-inline-link" to={part} key={`${part}-${index}`}>{part}</Link>
        }
        return <span key={index}>{part}</span>
      })}
    </div>
  )
}

function MiaItemCard({ item }) {
  const isManga = item.type === 'manga'
  return (
    <article className="mia-item-card">
      {item.cover_url ? (
        <img src={item.cover_url} alt={`Couverture de ${item.title}`} className="mia-item-cover" loading="lazy" />
      ) : (
        <div className="mia-item-cover mia-cover-fallback"><BookOpen size={28} /></div>
      )}
      <div className="mia-item-content">
        <div className="mia-item-type">{isManga ? 'MANGA' : 'LIVRE'}</div>
        <h3>{item.title}</h3>
        <p className="mia-item-author">{item.author}</p>
        {item.category && <span className="mia-item-category">{item.category}</span>}
        {item.description && <p className="mia-item-description">{item.description}</p>}
        <Link className="mia-item-button" to={isManga ? '/manga' : '/livres'}>
          <span>Voir l’œuvre</span>
          <ExternalLink size={15} />
        </Link>
      </div>
    </article>
  )
}

function MiaActions({ navigation = [] }) {
  if (!navigation.length) return null
  return (
    <div className="mia-actions">
      {navigation.map((page) => (
        <Link className="mia-action-button" to={page.path} key={page.path}>
          <Compass size={15} />
          {page.name}
        </Link>
      ))}
    </div>
  )
}

export default function Mia() {
  const [messages, setMessages] = useState(starterMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async (text = input) => {
    const value = text.trim()
    if (!value || loading) return

    const nextMessages = [...messages, { role: 'user', text: value }]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map((message) => ({ role: message.role, content: message.text })),
        }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'MIA est momentanément indisponible.')

      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text: data.reply || 'Je n’ai pas réussi à formuler une réponse.',
          items: Array.isArray(data.items) ? data.items : [],
          navigation: Array.isArray(data.navigation) ? data.navigation : [],
        },
      ])
    } catch (error) {
      setMessages((current) => [...current, { role: 'assistant', text: `Désolée 😕 ${error.message || 'Une erreur est survenue.'}` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mia-page">
      <section className="mia-hero">
        <div className="mia-orb" />
        <div className="mia-badge"><Bot size={16} /> MIMOUVERSE INTELLIGENCE</div>
        <h1>Rencontre <span>MIA.</span></h1>
        <p>Ton copilote pour lire, comprendre, apprendre et découvrir les univers de MIMOUVERSE.</p>
        <div className="mia-capabilities">
          <span><BookOpen size={15} /> Livres</span>
          <span><Sparkles size={15} /> Explications</span>
          <span><WandSparkles size={15} /> Recommandations</span>
        </div>
      </section>

      <section className="mia-chat-shell">
        <div className="mia-chat-header">
          <div className="mia-avatar"><Bot size={22} /></div>
          <div><strong>MIA</strong><span>Assistante MIMOUVERSE</span></div>
          <span className="mia-online"><i /> {loading ? 'Réfléchit…' : 'En ligne'}</span>
        </div>

        <div className="mia-messages">
          {messages.map((message, index) => (
            <div className={`mia-message ${message.role}`} key={`${message.role}-${index}`}>
              {message.role === 'assistant' && <div className="mia-mini-avatar"><Bot size={16} /></div>}
              <div className="mia-response-wrap">
                <div className="mia-bubble"><MiaText text={message.text} /></div>
                {message.role === 'assistant' && message.items?.length > 0 && (
                  <div className="mia-items-grid">
                    {message.items.map((item) => <MiaItemCard item={item} key={`${item.type}-${item.id}-${item.title}`} />)}
                  </div>
                )}
                {message.role === 'assistant' && <MiaActions navigation={message.navigation} />}
              </div>
            </div>
          ))}
          {loading && (
            <div className="mia-message assistant">
              <div className="mia-mini-avatar"><Bot size={16} /></div>
              <div className="mia-bubble mia-thinking"><span /> <span /> <span /> MIA prépare sa réponse…</div>
            </div>
          )}
        </div>

        <div className="mia-suggestions">
          {suggestions.map((suggestion) => (
            <button key={suggestion} onClick={() => sendMessage(suggestion)} disabled={loading}>{suggestion}</button>
          ))}
        </div>

        <div className="mia-quick-links">
          <div className="mia-quick-title"><Compass size={15} /> Accès rapide</div>
          <div className="mia-quick-grid">
            {quickLinks.map(({ label, path, icon: Icon }) => (
              <Link className="mia-quick-button" key={path} to={path} aria-disabled={loading}>
                <Icon size={17} />
                <span>{label}</span>
                <ExternalLink size={14} />
              </Link>
            ))}
          </div>
        </div>

        <form className="mia-input-row" onSubmit={(event) => { event.preventDefault(); sendMessage() }}>
          <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Écris ta question à MIA..." aria-label="Message à MIA" disabled={loading} />
          <button type="submit" aria-label="Envoyer" disabled={loading || !input.trim()}><Send size={18} /></button>
        </form>
        <small className="mia-disclaimer">MIA peut faire des erreurs. Vérifie les informations importantes.</small>
      </section>
    </main>
  )
}
