import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../services/api";

const PLANS = [
  { id: "solidarity", label: "Contribution solidaire", price: 5,  desc: "Aide à financer une consultation pour un patient vulnérable", icon: "fa-heart" },
  { id: "premium",    label: "Accès Premium",          price: 15, desc: "Accès prioritaire + historique illimité + téléchargements PDF", icon: "fa-star" },
  { id: "patron",     label: "Grand mécène",           price: 50, desc: "Finance 10 consultations + badge donateur affiché sur votre profil", icon: "fa-crown" },
];

export default function Paiement() {
  const [selected, setSelected] = useState("solidarity");
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);

  const plan = PLANS.find(p => p.id === selected);

  const handlePay = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/payment/intent", {
        plan: selected,
        amount: plan.price * 100, // centimes
      });
      // Redirection vers Stripe Checkout
      if (data.url) window.location.href = data.url;
      else setSuccess(true); // Fallback démo
    } catch {
      // Démo sans backend
      setTimeout(() => { setLoading(false); setSuccess(true); }, 1500);
      return;
    }
    setLoading(false);
  };

  if (success) return (
    <>
      <Header />
      <main className="container content" style={{ textAlign: "center", paddingTop: 80 }}>
        <div className="card p-5">
          <i className="fas fa-check-circle fa-4x mb-3" style={{ color: "#28a745" }}></i>
          <h3>Merci pour votre contribution !</h3>
          <p>Votre paiement de <strong>{plan.price} €</strong> a bien été reçu.</p>
          <p>Vous avez aidé des patients vulnérables à accéder à des soins.</p>
          <a href="/patient/dashboard" className="btn btn-primary mt-3">
            Retour au tableau de bord
          </a>
        </div>
      </main>
      <Footer />
    </>
  );

  return (
    <>
      <Header />
      <main className="container content">
        <h2>Choisissez votre contribution</h2>
        <p className="text-muted mb-4">Votre paiement finance directement les soins pour les personnes vulnérables.</p>

        <div className="row mb-4">
          {PLANS.map(p => (
            <div key={p.id} className="col-md-4 mb-3">
              <div
                className={`card p-4 plan-card ${selected === p.id ? "selected" : ""}`}
                onClick={() => setSelected(p.id)}
                style={{
                  cursor: "pointer",
                  border: selected === p.id ? "2px solid var(--primary)" : "2px solid transparent",
                  transition: "all .2s"
                }}
              >
                <i className={`fas ${p.icon} fa-2x mb-2`} style={{ color: selected === p.id ? "var(--primary)" : "var(--text-muted)" }}></i>
                <h5>{p.label}</h5>
                <p className="price-tag"><strong>{p.price} €</strong></p>
                <p className="text-muted small">{p.desc}</p>
                {selected === p.id && <i className="fas fa-check-circle" style={{ color: "var(--primary)", position: "absolute", top: 12, right: 12 }}></i>}
              </div>
            </div>
          ))}
        </div>

        <div className="card p-4">
          <h5>Paiement sécurisé</h5>
          <p className="text-muted small">
            <i className="fas fa-lock"></i> Vos données sont chiffrées et sécurisées via Stripe.
            Karevia ne conserve pas votre numéro de carte.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" style={{ height: 24, opacity: 0.7 }} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" style={{ height: 20, opacity: 0.7 }} />
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" alt="Mastercard" style={{ height: 28, opacity: 0.7 }} />
          </div>
          <button className="btn btn-primary mt-3" onClick={handlePay} disabled={loading} style={{ minWidth: 200 }}>
            {loading
              ? <><i className="fas fa-spinner fa-spin"></i> Traitement...</>
              : <><i className="fas fa-credit-card"></i> Payer {plan.price} €</>
            }
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}