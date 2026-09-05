import {
  ShieldCheck,
  BookOpen,
  BookMarked,
  BookPlus,
  MessageSquare,
  Search,
  Users,
  Settings,
} from 'lucide-react'

const sections = [
  {
    icon: BookOpen,
    title: 'Catalogue des livres',
    text: 'Consulter, publier, modifier et supprimer les livres.',
  },
  {
    icon: BookMarked,
    title: 'Catalogue manga',
    text: 'Gérer les séries, chapitres et publications manga.',
  },
  {
    icon: BookPlus,
    title: 'Publications',
    text: 'Ajouter de nouvelles œuvres et leurs informations.',
  },
  {
    icon: MessageSquare,
    title: 'Communauté',
    text: 'Gérer les commentaires et les avis des lecteurs.',
  },
  {
    icon: Search,
    title: 'Dictionnaire',
    text: 'Ajouter, modifier ou supprimer les définitions.',
  },
  {
    icon: Users,
    title: 'Lecteurs',
    text: 'Consulter les activités publiques de la communauté.',
  },
]

export default function Admin() {
  return (
    <main className="admin-page">
      <section className="admin-hero">
        <div className="admin-badge">
          <ShieldCheck size={18} />
          ESPACE ADMINISTRATEUR
        </div>

        <h1>
          Centre de contrôle <span>MIMOUVERSE</span>
        </h1>

        <p>
          Bienvenue dans l'espace d'administration. Depuis cette interface,
          tu peux gérer les contenus et les différentes sections de
          MIMOUVERSE.
        </p>
      </section>

      <section className="admin-status">
        <div className="admin-status-icon">
          <ShieldCheck size={24} />
        </div>

        <div>
          <strong>Accès administrateur</strong>
          <p>
            Tu disposes des droits nécessaires pour gérer les contenus de la
            plateforme.
          </p>
        </div>
      </section>

      <section className="admin-grid">
        {sections.map(({ icon: Icon, title, text }) => (
          <article className="admin-card" key={title}>
            <div className="admin-card-icon">
              <Icon size={24} />
            </div>

            <h2>{title}</h2>

            <p>{text}</p>

            <button type="button" className="admin-action">
              Gérer
            </button>
          </article>
        ))}
      </section>

      <section className="admin-catalogue">
        <div className="admin-catalogue-heading">
          <div>
            <span className="admin-kicker">CATALOGUE GLOBAL</span>

            <h2>
              Toutes les œuvres
            </h2>

            <p>
              Les livres et mangas publiés sur MIMOUVERSE apparaîtront ici.
              Cette zone deviendra le centre de gestion principal du
              catalogue.
            </p>
          </div>

          <button type="button" className="admin-primary">
            <BookPlus size={18} />
            Ajouter une œuvre
          </button>
        </div>

        <div className="admin-empty">
          <Settings size={30} />

          <h3>Catalogue prêt à être connecté</h3>

          <p>
            La prochaine étape sera de connecter cette interface à la base de
            données afin de gérer réellement les livres, mangas et
            publications.
          </p>
        </div>
      </section>
    </main>
  )
}
