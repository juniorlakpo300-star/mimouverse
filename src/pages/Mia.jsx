import { useState } from 'react'
import { Bot, BookOpen, Send, Sparkles, WandSparkles } from 'lucide-react'

const suggestions = [
  'Explique-moi simplement un mot',
  'Recommande-moi un livre',
  'Résume cette histoire',
  'Comment fonctionne MIMOUVERSE ?',
]

const starterMessages = [
  { role: 'assistant', text: 'Bonjour 👋 Je suis MIA, l’assistante de MIMOUVERSE. Je peux t’aider à comprendre, chercher et découvrir.' },
]

export default function Mia() {
  const [messages, setMessages] = useState(starterMessages)
  const [input, setInput] = useState('')

  const sendMessage = (text = input) => {
    const value = text.trim()
    if (!value) return
    setMessages((current) => [
      ...current,
      { role: 'user', text: value },
      { role: 'assistant', text: 'Je suis prête à t’aider. La connexion au moteur IA sera ajoutée côté serveur pour garder les clés et les données sensibles protégées.' },
    ])
    setInput('')
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
          <span className="mia-online"><i /> Prête</span>
        </div>

        <div className="mia-messages">
          {messages.map((message, index) => (
            <div className={`mia-message ${message.role}`} key={`${message.role}-${index}`}>
              {message.role === 'assistant' && <div className="mia-mini-avatar"><Bot size={16} /></div>}
              <div className="mia-bubble">{message.text}</div>
            </div>
          ))}
        </div>

        <div className="mia-suggestions">
          {suggestions.map((suggestion) => <button key={suggestion} onClick={() => sendMessage(suggestion)}>{suggestion}</button>)}
        </div>

        <form className="mia-input-row" onSubmit={(event) => { event.preventDefault(); sendMessage() }}>
          <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Écris ta question à MIA..." aria-label="Message à MIA" />
          <button type="submit" aria-label="Envoyer"><Send size={18} /></button>
        </form>
        <small className="mia-disclaimer">MIA peut faire des erreurs. Vérifie les informations importantes.</small>
      </section>
    </main>
  )
}
