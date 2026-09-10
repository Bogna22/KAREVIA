import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function TableaubordDonateur() {
  const { user } = useAuth();
  const [dons,    setDons]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDons = async () => {
      try {
        const { data } = await api.get("/paiements");
        setDons(data.data || data || []);
      } catch {
        setDons([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDons();
  }, []);

  const totalDonne = dons.reduce((sum, d) => sum + (parseFloat(d.montant) || 0), 0);

  return (
    <>
      <Header />
      <main className="container content">

        {/* En-tête */}
        <div className="dashboard-header">
          <div>
            <h2>
              <i className="fas fa-hands-helping me-2" style={{ color: "var(--gold)" }}></i>
              Espace Donateur
            </h2>
            <p>Bienvenue, <strong>{user?.name}</strong>. Merci pour votre générosité.</p>
          </div>
          <Link to="/donetdemandes" className="btn btn-gold">
            <i className="fas fa-gift"></i> Faire un don
          </Link>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ marginBottom: "2rem" }}>
          {[
            { label: "Total donné",    value: `${totalDonne.toFixed(0)} FCFA`, icon: "fa-coins",       cls: "gold"  },
            { label: "Dons effectués", value: dons.length,                     icon: "fa-heart",       cls: "coral" },
            { label: "Patients aidés", value: "—",                             icon: "fa-user-injured",cls: "green" },
            { label: "Campagnes",      value: "—",                             icon: "fa-flag",         cls: "teal"  },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div className={`stat-icon ${s.cls}`}>
                <i className={`fas ${s.icon}`}></i>
              </div>
              <div className="stat-value">{loading ? "—" : s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="row">
          {/* Historique des dons */}
          <div style={{ flex: "1 1 320px" }}>
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
                <h5 style={{ margin: 0 }}>
                  <i className="fas fa-history me-2" style={{ color: "var(--green)" }}></i>
                  Historique des dons
                </h5>
              </div>

              {loading ? (
                <div style={{ padding: "2.5rem", textAlign: "center", color: "var(--text-muted)" }}>
                  <i className="fas fa-spinner fa-spin fa-2x"></i>
                </div>
              ) : dons.length === 0 ? (
                <div style={{ padding: "2.5rem", textAlign: "center", color: "var(--text-muted)" }}>
                  <i className="fas fa-heart fa-2x" style={{ opacity: 0.3, marginBottom: "1rem", display: "block" }}></i>
                  <p>Vous n'avez pas encore effectué de don.</p>
                  <Link to="/donetdemandes" className="btn btn-gold btn-sm" style={{ marginTop: "0.75rem" }}>
                    Faire mon premier don
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Montant</th>
                        <th>Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dons.map((d, i) => (
                        <tr key={i}>
                          <td style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                            {new Date(d.created_at).toLocaleDateString("fr-FR")}
                          </td>
                          <td>
                            <strong style={{ color: "var(--gold-dark)" }}>
                              {parseFloat(d.montant || 0).toFixed(0)} FCFA
                            </strong>
                          </td>
                          <td>
                            <span style={{
                              padding: "0.2rem 0.6rem",
                              borderRadius: "999px",
                              fontSize: "0.72rem", fontWeight: 700,
                              background: "var(--green-light)", color: "var(--green-dark)",
                              textTransform: "uppercase",
                            }}>
                              Complété
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Actions rapides */}
          <div style={{ flex: "0 0 280px", minWidth: "260px" }}>
            <div className="card">
              <h5 style={{ marginBottom: "1.25rem" }}>
                <i className="fas fa-bolt me-2" style={{ color: "var(--gold)" }}></i>
                Actions rapides
              </h5>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <Link to="/donetdemandes" className="btn btn-gold w-100">
                  <i className="fas fa-gift"></i> Faire un don
                </Link>
                <Link to="/profil" className="btn btn-outline-primary w-100">
                  <i className="fas fa-user"></i> Mon profil
                </Link>
                <Link to="/notifications" className="btn btn-secondary w-100">
                  <i className="fas fa-bell"></i> Notifications
                </Link>
              </div>
            </div>

            {/* Message impact */}
            <div className="card" style={{ marginTop: "1rem", background: "var(--gold-pale)", border: "1px solid var(--gold-light)" }}>
              <div style={{ textAlign: "center" }}>
                <i className="fas fa-heart" style={{ color: "var(--gold)", fontSize: "1.5rem", marginBottom: "0.75rem", display: "block" }}></i>
                <p style={{ fontSize: "0.875rem", color: "var(--text-body)", lineHeight: 1.6, margin: 0 }}>
                  Chaque don permet à un patient vulnérable d'accéder à des soins médicaux gratuits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
