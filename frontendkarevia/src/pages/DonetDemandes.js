import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
// ============================================================
//  DonsDemandes.jsx (Donetdemandes.jsx)
// ============================================================
export function DonetDemandes() {
  const [tab,      setTab]      = React.useState("don");
  const [loading,  setLoading]  = React.useState(false);
  const [success,  setSuccess]  = React.useState("");
  const [don,      setDon]      = React.useState({ type: "Nourriture", description: "", zone: "Centre" });
  const [demande,  setDemande]  = React.useState({ besoins: "Riz", quantite: "", details: "" });

  const api = require("../services/api").default;
  const { user } = require("../context/AuthContext").useAuth?.() || {};

  const handleDon = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/dons", don);
      setSuccess("Votre don a été soumis avec succès !");
      setDon({ type: "Nourriture", description: "", zone: "Centre" });
    } catch {
      setSuccess("Don enregistré (mode démo).");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(""), 3500);
    }
  };

  const handleDemande = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/dons/demander-aide", demande);
      setSuccess("Votre demande d'aide a été envoyée !");
      setDemande({ besoins: "Riz", quantite: "", details: "" });
    } catch {
      setSuccess("Demande enregistrée (mode démo).");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(""), 3500);
    }
  };

  const TABS = [
    { key: "don",     label: "Proposer un don",    icon: "fa-gift",         color: "var(--green)"    },
    { key: "demande", label: "Demander une aide",   icon: "fa-hands-helping",color: "var(--gold-dark)"},
    { key: "liste",   label: "Dons disponibles",    icon: "fa-list",         color: "var(--teal)"     },
  ];

  return (
    <>
      <Header />
      <main className="container content">

        <div className="dashboard-header">
          <div>
            <h2>
              <i className="fas fa-gift me-2" style={{ color: "var(--gold)" }}></i>
              Dons & Demandes
            </h2>
            <p>Proposez des dons ou demandez une aide alimentaire et médicale.</p>
          </div>
        </div>

        {success && (
          <div className="alert-success" style={{ marginBottom: "1.5rem" }}>
            <i className="fas fa-check-circle"></i> {success}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.625rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.6rem 1.25rem",
                borderRadius: "var(--r-lg)",
                border: `1.5px solid ${tab === t.key ? t.color : "var(--border)"}`,
                background: tab === t.key ? t.color + "18" : "white",
                color: tab === t.key ? t.color : "var(--text-muted)",
                fontSize: "0.875rem", fontWeight: 600,
                cursor: "pointer", fontFamily: "var(--font-body)",
                transition: "all 0.2s",
              }}
            >
              <i className={`fas ${t.icon}`}></i>
              {t.label}
            </button>
          ))}
        </div>

        <div className="row">
          <div style={{ flex: "1 1 380px" }}>

            {/* Tab : Proposer un don */}
            {tab === "don" && (
              <div className="card">
                <h5 style={{ marginBottom: "1.5rem" }}>
                  <i className="fas fa-gift me-2" style={{ color: "var(--green)" }}></i>
                  Proposer un don
                </h5>
                <form onSubmit={handleDon} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label>Type de don</label>
                    <select value={don.type} onChange={e => setDon({...don, type: e.target.value})}>
                      <option>Nourriture</option>
                      <option>Médicaments</option>
                      <option>Transport</option>
                      <option>Équipements médicaux</option>
                      <option>Autre</option>
                    </select>
                  </div>
                  <div>
                    <label>Description & quantité</label>
                    <textarea
                      rows={3}
                      placeholder="Ex: Riz 50kg, Paracétamol x200..."
                      required
                      value={don.description}
                      onChange={e => setDon({...don, description: e.target.value})}
                    />
                  </div>
                  <div>
                    <label>Zone desservie</label>
                    <select value={don.zone} onChange={e => setDon({...don, zone: e.target.value})}>
                      <option>Centre</option>
                      <option>Nord</option>
                      <option>Sud</option>
                      <option>Est</option>
                      <option>Ouest</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? <><i className="fas fa-spinner fa-spin"></i> Envoi...</> : <><i className="fas fa-paper-plane"></i> Proposer ce don</>}
                  </button>
                </form>
              </div>
            )}

            {/* Tab : Demander une aide */}
            {tab === "demande" && (
              <div className="card">
                <h5 style={{ marginBottom: "1.5rem" }}>
                  <i className="fas fa-hands-helping me-2" style={{ color: "var(--gold-dark)" }}></i>
                  Demander une aide
                </h5>
                {user?.role !== "vulnerable" && (
                  <div style={{
                    background: "var(--gold-light)", border: "1px solid var(--gold)",
                    borderRadius: "var(--r-lg)", padding: "1rem", marginBottom: "1.25rem",
                    fontSize: "0.875rem", color: "var(--gold-dark)",
                  }}>
                    <i className="fas fa-info-circle me-2"></i>
                    Cette fonctionnalité est réservée aux patients vulnérables vérifiés.
                  </div>
                )}
                <form onSubmit={handleDemande} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label>Type de besoin</label>
                    <select value={demande.besoins} onChange={e => setDemande({...demande, besoins: e.target.value})}>
                      <option>Riz</option>
                      <option>Farine</option>
                      <option>Médicaments essentiels</option>
                      <option>Aide alimentaire générale</option>
                      <option>Transport médical</option>
                    </select>
                  </div>
                  <div>
                    <label>Quantité</label>
                    <input
                      type="text"
                      placeholder="Ex: 25kg, 1 boîte..."
                      value={demande.quantite}
                      onChange={e => setDemande({...demande, quantite: e.target.value})}
                    />
                  </div>
                  <div>
                    <label>Détails supplémentaires</label>
                    <textarea
                      rows={3}
                      placeholder="Expliquez votre situation..."
                      value={demande.details}
                      onChange={e => setDemande({...demande, details: e.target.value})}
                    />
                  </div>
                  <button type="submit" className="btn btn-gold" disabled={loading}>
                    {loading ? <><i className="fas fa-spinner fa-spin"></i> Envoi...</> : <><i className="fas fa-paper-plane"></i> Envoyer la demande</>}
                  </button>
                </form>
              </div>
            )}

            {/* Tab : Dons disponibles */}
            {tab === "liste" && (
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
                  <h5 style={{ margin: 0 }}>Dons disponibles près de vous</h5>
                </div>
                {[
                  { type: "Nourriture",  desc: "Riz 25kg",           zone: "Centre", date: "15/01/2026" },
                  { type: "Médicaments", desc: "Paracétamol x100",   zone: "Nord",   date: "12/01/2026" },
                  { type: "Transport",   desc: "Navette médicale",    zone: "Sud",    date: "10/01/2026" },
                ].map((d, i) => (
                  <div key={i} style={{
                    padding: "1rem 1.5rem",
                    borderBottom: i < 2 ? "1px solid var(--border)" : "none",
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center", gap: "1rem", flexWrap: "wrap",
                  }}>
                    <div style={{ display: "flex", gap: "0.875rem", alignItems: "center" }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: "var(--r-md)",
                        background: "var(--green-light)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "var(--green)", fontSize: "0.9rem",
                      }}>
                        <i className="fas fa-gift"></i>
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-h)" }}>{d.desc}</div>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                          {d.type} · {d.zone} · {d.date}
                        </div>
                      </div>
                    </div>
                    <button className="btn btn-sm btn-outline-primary">
                      <i className="fas fa-hand-holding-heart"></i> Demander
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Témoignages */}
          <div style={{ flex: "0 0 280px", minWidth: "260px" }}>
            <div className="card" style={{ background: "var(--green-pale)", border: "1px solid var(--green-light)" }}>
              <h5 style={{ marginBottom: "1.25rem" }}>
                <i className="fas fa-quote-left me-2" style={{ color: "var(--green)", opacity: 0.5 }}></i>
                Témoignages
              </h5>
              {[
                { quote: "Grâce à Karevia, ma famille a reçu de l'aide rapidement.", author: "Awa, patiente" },
                { quote: "Le système est simple et vraiment efficace.", author: "Dr. Kofi" },
                { quote: "En quelques clics, j'ai pu faire un don utile.", author: "Marie, donatrice" },
              ].map((t, i) => (
                <blockquote key={i} style={{
                  borderLeft: "3px solid var(--green)",
                  paddingLeft: "1rem", marginBottom: "1rem",
                  fontStyle: "italic", fontSize: "0.875rem",
                  color: "var(--text-body)", lineHeight: 1.6,
                }}>
                  "{t.quote}"
                  <footer style={{ marginTop: "0.4rem", fontSize: "0.78rem", fontWeight: 700, color: "var(--green)", fontStyle: "normal" }}>
                    — {t.author}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
export default DonetDemandes ;
