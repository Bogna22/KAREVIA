import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function TableauBordPatient() {
  const { user } = useAuth();
  const [rdvs,    setRdvs]    = useState([]);
  const [notifs,  setNotifs]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rdvRes, notifRes] = await Promise.all([
          api.get("/rendez-vous"),
          api.get("/notifications"),
        ]);
        setRdvs(rdvRes.data?.data || rdvRes.data || []);
        setNotifs((notifRes.data || []).filter(n => !n.read).slice(0, 3));
      } catch {
        setRdvs([]);
        setNotifs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const STATUS = {
    en_attente: { label: "En attente",  color: "var(--gold-dark)",  bg: "var(--gold-light)"  },
    confirme:   { label: "Confirmé",    color: "var(--green)",      bg: "var(--green-light)" },
    annule:     { label: "Annulé",      color: "var(--coral)",      bg: "var(--coral-light)" },
    termine:    { label: "Terminé",     color: "var(--text-muted)", bg: "var(--bg)"          },
  };

  const isVerified  = user?.is_verified;
  const isVulnerable = user?.role === "vulnerable";

  return (
    <>
      <Header />
      <main className="container content">

        {/* En-tête */}
        <div className="dashboard-header">
          <div>
            <h2>
              <i className="fas fa-user-injured me-2" style={{ color: "var(--green)" }}></i>
              Mon espace santé
            </h2>
            <p>Bonjour, <strong>{user?.name || "Patient"}</strong> — {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</p>
          </div>
          <Link to="/prise-rendezvous" className="btn btn-primary">
            <i className="fas fa-plus"></i> Nouveau rendez-vous
          </Link>
        </div>

        {/* Alerte vérification */}
        {isVulnerable && !isVerified && (
          <div style={{
            background: "var(--gold-light)",
            border: "1.5px solid var(--gold)",
            borderRadius: "var(--r-lg)",
            padding: "1rem 1.25rem",
            marginBottom: "1.5rem",
            display: "flex", alignItems: "center", gap: "0.875rem",
            flexWrap: "wrap",
          }}>
            <i className="fas fa-clock" style={{ color: "var(--gold-dark)", fontSize: "1.1rem" }}></i>
            <div style={{ flex: 1 }}>
              <strong style={{ color: "var(--gold-dark)" }}>Vérification en attente</strong>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-muted)" }}>
                Soumettez vos justificatifs pour accéder aux soins gratuits.
              </p>
            </div>
            <Link to="/verification" className="btn btn-sm btn-gold">
              <i className="fas fa-upload"></i> Soumettre
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="stats-grid" style={{ marginBottom: "2rem" }}>
          {[
            { label: "Rendez-vous total",  value: rdvs.length,                                                          icon: "fa-calendar-check", cls: "green" },
            { label: "En attente",         value: rdvs.filter(r => r.statut === "en_attente").length,                    icon: "fa-clock",          cls: "gold"  },
            { label: "Confirmés",          value: rdvs.filter(r => r.statut === "confirme").length,                      icon: "fa-check-circle",   cls: "teal"  },
            { label: "Notifications",      value: notifs.length,                                                         icon: "fa-bell",           cls: "coral" },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div className={`stat-icon ${s.cls}`}><i className={`fas ${s.icon}`}></i></div>
              <div className="stat-value">{loading ? "—" : s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="row">
          {/* Rendez-vous */}
          <div style={{ flex: "1 1 340px" }}>
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h5 style={{ margin: 0 }}>
                  <i className="fas fa-calendar-alt me-2" style={{ color: "var(--green)" }}></i>
                  Mes rendez-vous
                </h5>
                <Link to="/prise-rendezvous" className="btn btn-sm btn-outline-primary">
                  <i className="fas fa-plus"></i> Nouveau
                </Link>
              </div>

              {loading ? (
                <div style={{ padding: "2.5rem", textAlign: "center", color: "var(--text-muted)" }}>
                  <i className="fas fa-spinner fa-spin fa-2x"></i>
                </div>
              ) : rdvs.length === 0 ? (
                <div style={{ padding: "2.5rem", textAlign: "center", color: "var(--text-muted)" }}>
                  <i className="fas fa-calendar fa-2x" style={{ opacity: 0.3, marginBottom: "1rem", display: "block" }}></i>
                  <p style={{ marginBottom: "1rem" }}>Aucun rendez-vous pour le moment.</p>
                  <Link to="/prise-rendezvous" className="btn btn-primary btn-sm">
                    Prendre un rendez-vous
                  </Link>
                </div>
              ) : (
                <div>
                  {rdvs.slice(0, 5).map((rdv, i) => {
                    const st = STATUS[rdv.statut] || STATUS.en_attente;
                    return (
                      <div key={i} style={{
                        padding: "1rem 1.5rem",
                        borderBottom: "1px solid var(--border)",
                        display: "flex", alignItems: "center",
                        justifyContent: "space-between", gap: "1rem",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "var(--green-pale)"}
                      onMouseLeave={e => e.currentTarget.style.background = "white"}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                          <div style={{
                            width: 40, height: 40, borderRadius: "var(--r-md)",
                            background: "var(--green-light)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "var(--green)", fontSize: "0.9rem", flexShrink: 0,
                          }}>
                            <i className="fas fa-stethoscope"></i>
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-h)" }}>
                              Dr. {rdv.medecin?.name || "Médecin"}
                            </div>
                            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                              {new Date(rdv.date_heure).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                            </div>
                          </div>
                        </div>
                        <span style={{
                          padding: "0.25rem 0.7rem",
                          borderRadius: "999px",
                          fontSize: "0.7rem", fontWeight: 700,
                          background: st.bg, color: st.color,
                          textTransform: "uppercase", whiteSpace: "nowrap",
                        }}>
                          {st.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Colonne droite */}
          <div style={{ flex: "0 0 280px", minWidth: "260px", display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* Notifications */}
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
                <h5 style={{ margin: 0, fontSize: "0.9rem" }}>
                  <i className="fas fa-bell me-2" style={{ color: "var(--coral)" }}></i>
                  Notifications
                </h5>
                <Link to="/notifications" style={{ fontSize: "0.78rem", color: "var(--green)" }}>Voir tout</Link>
              </div>
              {notifs.length === 0 ? (
                <p style={{ padding: "1.25rem", color: "var(--text-muted)", fontSize: "0.875rem", margin: 0 }}>
                  Aucune nouvelle notification.
                </p>
              ) : (
                notifs.map((n, i) => (
                  <div key={i} style={{
                    padding: "0.875rem 1.25rem",
                    borderBottom: i < notifs.length - 1 ? "1px solid var(--border)" : "none",
                    fontSize: "0.82rem", color: "var(--text-body)", lineHeight: 1.5,
                  }}>
                    <i className="fas fa-circle" style={{ color: "var(--green)", fontSize: "0.4rem", verticalAlign: "middle", marginRight: "0.5rem" }}></i>
                    {n.message}
                  </div>
                ))
              )}
            </div>

            {/* Actions rapides */}
            <div className="card">
              <h5 style={{ marginBottom: "1rem" }}>
                <i className="fas fa-bolt me-2" style={{ color: "var(--gold)" }}></i>
                Actions rapides
              </h5>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                <Link to="/prise-rendezvous" className="btn btn-primary w-100">
                  <i className="fas fa-calendar-plus"></i> Prendre un RDV
                </Link>
                <Link to="/donetdemandes" className="btn btn-gold w-100">
                  <i className="fas fa-gift"></i> Demander une aide
                </Link>
                <Link to="/profil" className="btn btn-outline-primary w-100">
                  <i className="fas fa-user"></i> Mon profil
                </Link>
                <Link to="/verification" className="btn btn-secondary w-100">
                  <i className="fas fa-upload"></i> Mes documents
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
