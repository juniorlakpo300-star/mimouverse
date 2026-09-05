import { useMemo, useState } from 'react'
import { BookOpen, Search, Sparkles, Volume2, ArrowRight, RotateCcw } from 'lucide-react'
import './Dictionnaire.css'
import { dictionary, normalize } from '../data/dictionaryData.js'

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
          <div className="dictionary-columns"><div><span>Synonymes</span><div className="word-pills">{selected.synonyms.length ? selected.synonyms.map((word) => <em key={word}>{word}</em>) : <em>—</em>}</div></div><div><span>Antonymes</span><div className="word-pills muted">{selected.antonyms.length ? selected.antonyms.map((word) => <em key={word}>{word}</em>) : <em>—</em>}</div></div></div>
          <div className="example-block"><span>Exemple</span><p>« {selected.example} »</p></div>
          <button className="dictionary-mia"><Sparkles size={17} /> Demander à MIA <ArrowRight size={16} /></button>
        </article>
      </section>
    </main>
  )
}
