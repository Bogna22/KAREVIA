import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../services/api";

const ROLE_LABELS = {
  vulnerable: { label: "Vulnérable", color: "#E8604A", bg: "#FDE8E4" },
  medecin:    { label: "Médecin",    color: "#0891B2", bg: "#E0F4F8" },
  ong:        { label: "ONG",        color: "#0D7A5F", bg: "#E0F5EE" },
  standard:   { label: "Donateur",   color: "#F5A623", bg: "#FEF3D8" },
  patient:    { label: "Patient",    color: "#0D7A5F", bg: "#E0F5EE" },
  admin:      { label: "Admin",      color: "#7C3AED", bg: "#EDE9FE" },
};

const STATUS_LABELS = {
  active:   { label: "Actif",     color: "#0D7A5F", bg: "#E0F5EE" },
  pending:  { label: "En attente",color: "#D4861A", bg: "#FEF3D8" },
  rejected: { label: "Rejeté",    color: "#E8604A", bg: "#FDE8E4" },
};

export default function TableaubordAdmin() {
  const [stats,       setStats]       = useState({ users: 0, pendingVerif: 0, appointments: 0, donations: 0 });
  const [users,       setUsers]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [actionMsg,   setActionMsg]   = useState("");
  const [deleteModal, setDeleteModal] = useState(null); // user à supprimer

  const fetchData = async () => {
    try {
      const { data } = await api.get("/admin/stats");
      setStats(data.stats);
      setUsers(data.recent_users || []);
    } catch {
      setStats({ users: 9, pendingVerif: 2, appointments: 0, donations: 3 });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Activer / désactiver un utilisateur
  const handleToggle = async (userId, currentStatus) => {
    try {
      await api.patch(`/admin/users/${userId}/toggle`);
      setUsers(prev => prev.map(u =>
        u.id === userId
          ? { ...u, status: currentStatus === "active" ? "rejected" : "active" }
          : u
      ));
      showMsg(currentStatus === "active" ? "Compte désactivé." : "Compte activé.");
    } catch {
      showMsg("Erreur lors de la modification.", true);
    }
  };

  // Vérifier un utilisateur (pending → active)
  const handleVerify = async (userId) => {
    try {
      await api.patch(`/admin/users/${userId}/verifier`);
      setUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, status: "active", is_verified: true } : u
      ));
      showMsg("Utilisateur vérifié et activé.");
    } catch {
      showMsg("Erreur lors de la vérification.", true);
    }
  };

  // Supprimer un utilisateur
  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      await api.delete(`/admin/users/${deleteModal.id}`);
      setUsers(prev => prev.filter(u => u.id !== deleteModal.id));
      showMsg(`Compte de ${deleteModal.name} supprimé.`);
    } catch {
      showMsg("Erreur lors de la suppression.", true);
    } finally {
      setDeleteModal(null);
    }
  };

  const showMsg = (msg, isError = false) => {
    setActionMsg({ text: msg, error: isError });
    setTimeout(() => setActionMsg(""), 3500);
  };

  const STATS_CONFIG = [
    { label: "Utilisateurs totaux",      value: stats.users,       icon: "fa-users",    cls: "green" },
    { label: "Vérifications en attente", value: stats.pendingVerif,icon: "fa-clock",     cls: "gold"  },
    { label: "Rendez-vous",              value: stats.appointments, icon: "fa-calendar", cls: "teal"  },
    { label: "Dons actifs",              value: stats.donations,    icon: "fa-gift",      cls: "coral" },
  ];

  return (
    <>
      <Header />
      <main className="container content">

        {/* En-tête */}
        <div className="dashboard-header">
          <div>
            <h2><i className="fas fa-shield-alt me-2"></i>Administration</h2>
            <p>Gérez les utilisateurs, vérifications et statistiques de Karevia.</p>
          </div>
        </div>

        {/* Message d'action */}
        {actionMsg && (
          <div className={actionMsg.error ? "alert-error" : "alert-success"} style={{ marginBottom: "1.5rem" }}>
            <i className={`fas ${actionMsg.error ? "fa-exclamation-circle" : "fa-check-circle"}`}></i>
            {actionMsg.text}
          </div>
        )}

        {/* Stats */}
        <div className="stats-grid" style={{ marginBottom: "2rem" }}>
          {STATS_CONFIG.map((s, i) => (
            <div key={i} className="stat-card">
              <div className={`stat-icon ${s.cls}`}>
                <i className={`fas ${s.icon}`}></i>
              </div>
              <div className="stat-value">{loading ? "—" : s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tableau utilisateurs */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
            <h5 style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <i className="fas fa-users" style={{ color: "var(--green)" }}></i>
              Utilisateurs récents
            </h5>
            <button className="btn btn-primary btn-sm" onClick={fetchData}>
              <i className="fas fa-sync-alt"></i> Actualiser
            </button>
          </div>

          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
              <i className="fas fa-spinner fa-spin fa-2x"></i>
              <p style={{ marginTop: "1rem" }}>Chargement...</p>
            </div>
          ) : users.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
              <i className="fas fa-users fa-2x" style={{ opacity: 0.3 }}></i>
              <p style={{ marginTop: "1rem" }}>Aucun utilisateur trouvé.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Statut</th>
                    <th>Inscription</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => {
                    const roleInfo   = ROLE_LABELS[u.role]   || { label: u.role,   color: "#888", bg: "#eee" };
                    const statusInfo = STATUS_LABELS[u.status]|| { label: u.status, color: "#888", bg: "#eee" };
                    return (
                      <tr key={u.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: "50%",
                              background: roleInfo.bg,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              color: roleInfo.color, fontWeight: 700, fontSize: "0.9rem",
                              flexShrink: 0,
                            }}>
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            <strong style={{ color: "var(--text-h)" }}>{u.name}</strong>
                          </div>
                        </td>
                        <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{u.email || "—"}</td>
                        <td>
                          <span style={{
                            display: "inline-flex", alignItems: "center",
                            padding: "0.25rem 0.7rem",
                            borderRadius: "999px",
                            fontSize: "0.72rem", fontWeight: 700,
                            background: roleInfo.bg, color: roleInfo.color,
                            textTransform: "uppercase", letterSpacing: "0.04em",
                          }}>
                            {roleInfo.label}
                          </span>
                        </td>
                        <td>
                          <span style={{
                            display: "inline-flex", alignItems: "center",
                            padding: "0.25rem 0.7rem",
                            borderRadius: "999px",
                            fontSize: "0.72rem", fontWeight: 700,
                            background: statusInfo.bg, color: statusInfo.color,
                            textTransform: "uppercase", letterSpacing: "0.04em",
                          }}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td style={{ color: "var(--text-muted)", fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                          {new Date(u.created_at).toLocaleDateString("fr-FR")}
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                            {/* Vérifier (si pending) */}
                            {u.status === "pending" && (
                              <button
                                className="btn btn-sm btn-outline-success"
                                onClick={() => handleVerify(u.id)}
                                title="Vérifier et activer"
                              >
                                <i className="fas fa-check"></i>
                              </button>
                            )}

                            {/* Activer / Désactiver */}
                            <button
                              className={`btn btn-sm ${u.status === "active" ? "btn-outline-danger" : "btn-outline-primary"}`}
                              onClick={() => handleToggle(u.id, u.status)}
                              title={u.status === "active" ? "Désactiver" : "Activer"}
                            >
                              <i className={`fas ${u.status === "active" ? "fa-ban" : "fa-power-off"}`}></i>
                            </button>

                            {/* Supprimer */}
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => setDeleteModal(u)}
                              title="Supprimer définitivement"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal confirmation suppression */}
      {deleteModal && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: "1rem",
          backdropFilter: "blur(4px)",
        }}>
          <div style={{
            background: "white",
            borderRadius: "var(--r-2xl)",
            padding: "2rem",
            maxWidth: "420px", width: "100%",
            boxShadow: "var(--shadow-xl)",
            animation: "fadeSlideUp 0.3s ease both",
          }}>
            <div style={{
              width: 56, height: 56,
              borderRadius: "50%",
              background: "var(--coral-light)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 1.25rem",
            }}>
              <i className="fas fa-trash-alt" style={{ color: "var(--coral)", fontSize: "1.25rem" }}></i>
            </div>

            <h3 style={{ textAlign: "center", marginBottom: "0.5rem", fontFamily: "var(--font-display)" }}>
              Supprimer ce compte ?
            </h3>
            <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              Le compte de <strong style={{ color: "var(--text-h)" }}>{deleteModal.name}</strong> sera
              supprimé définitivement. Cette action est irréversible.
            </p>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                className="btn btn-secondary w-100"
                onClick={() => setDeleteModal(null)}
              >
                Annuler
              </button>
              <button
                className="btn btn-danger w-100"
                onClick={handleDelete}
                style={{ background: "var(--coral)", color: "white", border: "none" }}
              >
                <i className="fas fa-trash-alt me-2"></i>Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
