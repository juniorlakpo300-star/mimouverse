import { useMemo, useState } from 'react'
import { BookOpen, Search, Sparkles, Volume2, ArrowRight, RotateCcw } from 'lucide-react'
import './Dictionnaire.css'

const dictionary = [
  { word: 'Résilience', type: 'Nom féminin', definition: 'Capacité à continuer d’avancer et à retrouver un équilibre après une difficulté.', simple: 'C’est la force de se relever après un moment difficile.', synonyms: ['force', 'adaptation', 'persévérance'], antonyms: ['fragilité', 'abandon'], example: 'Sa résilience lui permet de transformer les difficultés en nouvelles occasions d’apprendre.', level: 'Intermédiaire' },
  { word: 'Persévérance', type: 'Nom féminin', definition: 'Action de poursuivre un objectif avec constance malgré les obstacles.', simple: 'C’est continuer même quand c’est difficile.', synonyms: ['constance', 'détermination', 'ténacité'], antonyms: ['abandon', 'renoncement'], example: 'Avec de la persévérance, elle a terminé son projet.', level: 'Facile' },
  { word: 'Empathie', type: 'Nom féminin', definition: 'Faculté de comprendre les émotions et le point de vue d’une autre personne.', simple: 'C’est essayer de comprendre ce que quelqu’un ressent.', synonyms: ['compréhension', 'écoute', 'sensibilité'], antonyms: ['indifférence'], example: 'L’empathie facilite le dialogue et le respect des autres.', level: 'Facile' },
  { word: 'Éloquence', type: 'Nom féminin', definition: 'Art de s’exprimer avec clarté, force et aisance afin de convaincre ou de toucher un public.', simple: 'C’est savoir bien parler pour faire passer une idée.', synonyms: ['expression', 'art oratoire'], antonyms: ['confusion'], example: 'Son éloquence a captivé toute la salle.', level: 'Avancé' },
  { word: 'Curiosité', type: 'Nom féminin', definition: 'Désir de connaître, de comprendre ou de découvrir quelque chose.', simple: 'C’est avoir envie d’apprendre et de découvrir.', synonyms: ['intérêt', 'soif de savoir'], antonyms: ['indifférence'], example: 'Sa curiosité l’a poussée à ouvrir le dictionnaire.', level: 'Facile' },
]

const normalize = (value) => value.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '')

export default function Dictionnaire() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(dictionary[0])
  const [simple, setSimple] = useState(false)

  const results = useMemo(() => {
    const q = normalize(query.trim())
    if (!q) return dictionary
    return dictionary.filter((item) => normalize(`${item.word} ${item.type} ${item.definition} ${item.synonyms.join(' ')}`).includes(q))
  }, [query])

  const choose = (item) => { setSelected(item); setSimple(false) }

  return (
    <main className="dictionary-page">
      <section className="dictionary-hero">
        <div className="dictionary-badge"><BookOpen size={15} /> MIMOUVERSE DICTIONNAIRE</div>
        <h1>Les mots ont <span>un univers.</span></h1>
        <p>Recherche un mot, découvre son sens et demande une explication simple quand tu veux aller plus loin.</p>
        <label className="dictionary-search"><Search size={20} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un mot..." aria-label="Rechercher un mot" /></label>
        <div className="dictionary-suggestions">{results.slice(0, 4).map((item) => <button key={item.word} onClick={() => choose(item)}>{item.word}</button>)}</div>
      </section>

      <section className="dictionary-content">
        <aside className="dictionary-results">
          <div className="dictionary-results-head"><span>Résultats</span><strong>{results.length}</strong></div>
          {results.map((item) => <button className={`dictionary-result ${selected.word === item.word ? 'active' : ''}`} key={item.word} onClick={() => choose(item)}><strong>{item.word}</strong><span>{item.type}</span><small>{item.definition}</small></button>)}
          {results.length === 0 && <div className="dictionary-no-result"><Search size={24} /><p>Aucun mot trouvé.</p><button onClick={() => setQuery('')}><RotateCcw size={14} /> Réinitialiser</button></div>}
        </aside>

        <article className="dictionary-card">
          <div className="dictionary-card-top"><div><span className="dictionary-level">{selected.level}</span><h2>{selected.word}</h2><p>{selected.type}</p></div><button className="sound-button" onClick={() => window.speechSynthesis?.speak(new SpeechSynthesisUtterance(selected.word))} aria-label={`Écouter ${selected.word}`}><Volume2 size={20} /></button></div>
          <div className="definition-block"><span>Définition</span><p>{selected.definition}</p></div>
          <button className="simple-button" onClick={() => setSimple((value) => !value)}><Sparkles size={17} /> {simple ? 'Masquer l’explication simple' : '✨ Expliquer simplement'}</button>
          {simple && <div className="simple-answer"><strong>En clair</strong><p>{selected.simple}</p></div>}
          <div className="dictionary-columns"><div><span>Synonymes</span><div className="word-pills">{selected.synonyms.map((word) => <em key={word}>{word}</em>)}</div></div><div><span>Antonymes</span><div className="word-pills muted">{selected.antonyms.map((word) => <em key={word}>{word}</em>)}</div></div></div>
          <div className="example-block"><span>Exemple</span><p>« {selected.example} »</p></div>
          <button className="dictionary-mia"><Sparkles size={17} /> Demander à MIA <ArrowRight size={16} /></button>
        </article>
      </section>
    </main>
  )
}
