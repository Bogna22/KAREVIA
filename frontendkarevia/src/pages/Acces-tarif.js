
import Header from "../components/Header";
import Footer from "../components/Footer";


export default function AccesTarife() {
  const pay = () => {
    alert("Démo paiement : redirection vers Stripe (à implémenter).");
    // Ici tu pourras ajouter Stripe Checkout réel
  };

  return (
    <div>
      {/* HEADER */}
      <header>
        <div className="header-logo">
          <img src="/karevia0.png" className="logo" alt="Karevia" />
          <div>
            <h1>Karevia</h1>
            <p className="slogan">"Soigner avec cœur, partout et pour tous."</p>
          </div>
        </div>

        <nav>
          <a href="/karevia">Accueil</a>
        </nav>

        <div className="boutons">
          <a href="/inscription">Inscription</a>
          <a href="/tableaubordpatient">Accéder au tableau de bord</a>
        </div>
      </header>

      {/* MAIN */}
      <main className="container content">
        <h2>Accès tarifé — Utilisateur standard</h2>
        <p>Votre contribution permet de financer les soins pour les plus démunis.</p>

        <div className="card p-3">
          <h5>Option unique</h5>
          <p>
            Tarif symbolique : <strong>5 €</strong>
          </p>
          <p>Paiement sécurisé via Stripe (exemple).</p>

          <button className="btn btn-primary" onClick={pay}>
            Payer 5 €
          </button>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-4 text-center bg-white shadow-sm mt-5">
        <div className="container">
          <img
            src="/karevia0.png"
            alt="logo"
            style={{
              height: "36px",
              verticalAlign: "middle",
              marginRight: "8px",
            }}
          />
          <span className="text-secondary">
            © 2025 KAREVIA — Réalisé par KY Bogna Arlette
          </span>
        </div>
      </footer>
    </div>
  );
}
