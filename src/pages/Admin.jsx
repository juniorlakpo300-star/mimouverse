import { BookOpen, BookMarked, BookPlus, Database, MessageSquare, ShieldCheck, Trash2, Upload, Users } from 'lucide-react'

const sections = [
  { icon: BookOpen, title: 'Catalogue des livres', text: 'Voir, publier, modifier ou supprimer tous les livres.' },
  { icon: BookMarked, title: 'Catalogue manga', text: 'Gérer les séries, chapitres et publications manga.' },
  { icon: Upload, title: 'Publications', text: 'Ajouter les couvertures et fichiers des œuvres.' },
  { icon: MessageSquare, title: 'Communauté', text: 'Modérer, supprimer et gérer les avis des lecteurs.' },
  { icon: Database, title: 'Dictionnaire', text: 'Ajouter, modifier ou supprimer les entrées du dictionnaire.' },
  { icon: Users, title: 'Lecteurs', text: 'Consulter et gérer les données publiques de la communauté.' },
]

export default function Admin() {
  return (
    <main className="admin-page">
      <section className="admin-hero">
        <div className="admin-badge"><ShieldCheck size={17} /> ESPACE ADMINISTRATEUR</div>
        <h1>Centre de contrôle <span>MIMOUVERSE.</span></h1>
        <p>L’administrateur est le seul responsable des publications et dispose des accès de gestion à tous les domaines du site.</p>
      </section>

      <section className="admin-warning">
        <ShieldCheck size={22} />
        <div><strong>Accès propriétaire uniquement</strong><p>Cette page est une interface d’administration. La vraie protection devra être appliquée côté Supabase avec un rôle admin lié à l’identifiant du propriétaire, jamais uniquement dans React.</p></div>
      </section>

      <section className="admin-grid">
        {sections.map(({ icon: Icon, title, text }) => (
          <article className="admin-card" key={title}>
            <div className="admin-card-icon"><Icon size={22} /></div>
            <h2>{title}</h2>
            <p>{text}</p>
            <button className="admin-action">Gérer</button>
          </article>
        ))}
      </section>

      <section className="admin-catalogue">
        <div><span className="kicker">Vue globale</span><h2>Toutes les œuvres publiées</h2><p>Le catalogue administrateur réunira les livres et mangas publiés sur MIMOUVERSE avec leurs informations, statistiques et actions de gestion.</p></div>
        <div className="admin-empty"><BookPlus size={24} /><span>Aucun catalogue connecté pour le moment</span><small>La prochaine étape est de relier cette interface à Supabase.</small></div>
      </section>
    </main>
  )
}
