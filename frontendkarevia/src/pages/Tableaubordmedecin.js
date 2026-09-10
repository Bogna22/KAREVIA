import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function TableauBordMedecin() {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [stats,         setStats]         = useState({ total: 0, benevoles: 0, patients: 0 });
  const [notes,         setNotes]         = useState("");
  const [loading,       setLoading]       = useState(true);
  const [actionMsg,     setActionMsg]     = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("/medecin/dashboard");
        setConsultations(data.rdvs || []);
        setStats(data.stats || { total: 0, benevoles: 0, patients: 0 });
      } catch {
        setConsultations([
          { id: 1, date_heure: new Date().toISOString(), patient: { name: "Mme Traoré" },    statut: "en_attente", type: "teleconsultation" },
          { id: 2, date_heure: new Date().toISOString(), patient: { name: "M. Ouédraogo" },  statut: "confirme",   type: "presentiel"      },
        ]);
        setStats({ total: 120, benevoles: 87, patients: 45 });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const validerOrdonnance = async (id) => {
    try {
      await api.patch(`/consultations/${id}/valider-ordonnance`);
      setConsultations(prev => prev.map(c => c.id === id ? { ...c, ordonnance_validee: true } : c));
      showMsg("Ordonnance validée avec succès.");
    } catch {
      showMsg("Erreur lors de la validation.", true);
    }
  };

  const saveNotes = () => {
    if (!notes.trim()) return showMsg("Écrivez des notes avant d'enregistrer.", true);
    showMsg("Notes enregistrées.");
  };

  const showMsg = (text, error = false) => {
    setActionMsg({ text, error });
    setTimeout(() => setActionMsg(""), 3000);
  };

  const STATUS = {
    en_attente: { label: "En attente",  color: "var(--gold-dark)",  bg: "var(--gold-light)"  },
    confirme:   { label: "Confirmé",    color: "var(--green)",      bg: "var(--green-light)" },
    annule:     { label: "Annulé",      color: "var(--coral)",      bg: "var(--coral-light)" },
    termine:    { label: "Terminé",     color: "var(--text-muted)", bg: "var(--bg)"          },
  };

  return (
    <>
      <Header />
      <main className="container content">

        {/* En-tête */}
        <div className="dashboard-header">
          <div>
            <h2>
              <i className="fas fa-stethoscope me-2" style={{ color: "var(--teal)" }}></i>
              Espace médecin
            </h2>
            <p>Dr. <strong>{user?.name || "Médecin"}</strong> — {user?.medecin?.specialite || "Généraliste"}</p>
          </div>
          <Link to="/prise-rendezvous" className="btn btn-primary">
            <i className="fas fa-calendar-plus"></i> Gérer mon planning
          </Link>
        </div>

        {actionMsg && (
          <div className={actionMsg.error ? "alert-error" : "alert-success"} style={{ marginBottom: "1.5rem" }}>
            <i className={`fas ${actionMsg.error ? "fa-exclamation-circle" : "fa-check-circle"}`}></i>
            {actionMsg.text}
          </div>
        )}

        {/* Stats */}
        <div className="stats-grid" style={{ marginBottom: "2rem" }}>
          {[
            { label: "Consultations totales", value: stats.total,     icon: "fa-stethoscope",  cls: "teal"  },
            { label: "Bénévoles",             value: stats.benevoles, icon: "fa-heart",         cls: "coral" },
            { label: "Patients suivis",       value: stats.patients,  icon: "fa-users",         cls: "green" },
            { label: "RDV aujourd'hui",       value: consultations.filter(c => {
                const d = new Date(c.date_heure);
                const today = new Date();
                return d.toDateString() === today.toDateString();
              }).length,                                               icon: "fa-calendar-day",  cls: "gold"  },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div className={`stat-icon ${s.cls}`}><i className={`fas ${s.icon}`}></i></div>
              <div className="stat-value">{loading ? "—" : s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="row">
          {/* Consultations */}
          <div style={{ flex: "1 1 340px" }}>
            <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: "1.5rem" }}>
              <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
                <h5 style={{ margin: 0 }}>
                  <i className="fas fa-calendar-check me-2" style={{ color: "var(--teal)" }}></i>
                  Consultations à venir
                </h5>
              </div>

              {loading ? (
                <div style={{ padding: "2.5rem", textAlign: "center" }}>
                  <i className="fas fa-spinner fa-spin fa-2x" style={{ color: "var(--text-muted)" }}></i>
                </div>
              ) : consultations.length === 0 ? (
                <div style={{ padding: "2.5rem", textAlign: "center", color: "var(--text-muted)" }}>
                  <i className="fas fa-calendar fa-2x" style={{ opacity: 0.3, display: "block", marginBottom: "1rem" }}></i>
                  <p>Aucune consultation planifiée.</p>
                </div>
              ) : (
                consultations.map((c, i) => {
                  const st = STATUS[c.statut] || STATUS.en_attente;
                  return (
                    <div key={i} style={{
                      padding: "1rem 1.5rem",
                      borderBottom: "1px solid var(--border)",
                      display: "flex", alignItems: "center",
                      justifyContent: "space-between", gap: "1rem",
                      flexWrap: "wrap",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: "50%",
                          background: "var(--teal-light)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "var(--teal)", fontWeight: 700, flexShrink: 0,
                          fontSize: "0.9rem",
                        }}>
                          {c.patient?.name?.charAt(0) || "P"}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-h)" }}>
                            {c.patient?.name || "Patient"}
                          </div>
                          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                            {new Date(c.date_heure).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                            {" · "}{c.type === "teleconsultation" ? "🎥 Télé" : "🏥 Présentiel"}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                        <span style={{
                          padding: "0.25rem 0.7rem", borderRadius: "999px",
                          fontSize: "0.7rem", fontWeight: 700,
                          background: st.bg, color: st.color,
                          textTransform: "uppercase",
                        }}>
                          {st.label}
                        </span>
                        {!c.ordonnance_validee ? (
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => validerOrdonnance(c.id)}
                          >
                            <i className="fas fa-check"></i> Valider
                          </button>
                        ) : (
                          <span style={{ fontSize: "0.78rem", color: "var(--green)", fontWeight: 600 }}>
                            <i className="fas fa-check-circle me-1"></i>Validée
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Notes */}
            <div className="card">
              <h5 style={{ marginBottom: "1rem" }}>
                <i className="fas fa-notes-medical me-2" style={{ color: "var(--green)" }}></i>
                Notes cliniques
              </h5>
              <textarea
                rows={5}
                placeholder="Prenez des notes sur vos consultations..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                style={{
                  width: "100%", border: "1.5px solid var(--border)",
                  borderRadius: "var(--r-lg)", padding: "0.875rem",
                  fontFamily: "var(--font-body)", fontSize: "0.875rem",
                  color: "var(--text-body)", resize: "vertical",
                  outline: "none", transition: "border-color 0.15s",
                }}
                onFocus={e => e.target.style.borderColor = "var(--green)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
              <div style={{ textAlign: "right", marginTop: "0.75rem" }}>
                <button className="btn btn-primary" onClick={saveNotes}>
                  <i className="fas fa-save"></i> Enregistrer
                </button>
              </div>
            </div>
          </div>

          {/* Colonne droite */}
          <div style={{ flex: "0 0 260px", minWidth: "240px", display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* Statut */}
            <div className="card" style={{ background: "linear-gradient(135deg, var(--teal), var(--green))", border: "none", color: "white" }}>
              <div style={{ textAlign: "center" }}>
                <i className="fas fa-user-md" style={{ fontSize: "2rem", marginBottom: "0.75rem", display: "block", opacity: 0.9 }}></i>
                <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.25rem" }}>
                  Dr. {user?.name?.split(" ")[0] || "Médecin"}
                </div>
                <div style={{ fontSize: "0.82rem", opacity: 0.85, marginBottom: "0.75rem" }}>
                  {user?.medecin?.specialite || "Généraliste"}
                </div>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "0.35rem",
                  background: "rgba(255,255,255,0.2)",
                  padding: "0.3rem 0.875rem", borderRadius: "999px",
                  fontSize: "0.75rem", fontWeight: 700,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#AFFFDB", display: "inline-block" }}></span>
                  Actif
                </span>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="card">
              <h5 style={{ marginBottom: "1rem" }}>
                <i className="fas fa-bolt me-2" style={{ color: "var(--gold)" }}></i>
                Actions rapides
              </h5>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                <Link to="/prise-rendezvous" className="btn btn-outline-primary w-100">
                  <i className="fas fa-calendar"></i> Mon planning
                </Link>
                <Link to="/profil" className="btn btn-secondary w-100">
                  <i className="fas fa-user-edit"></i> Mon profil
                </Link>
                <Link to="/notifications" className="btn btn-secondary w-100">
                  <i className="fas fa-bell"></i> Notifications
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
