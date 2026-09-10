import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../services/api";
// ============================================================
//  Notification.jsx
// ============================================================
export function Notifications() {
  const [notifications, setNotifications] = React.useState([]);
  const [loading,       setLoading]       = React.useState(true);
  const [filter,        setFilter]        = React.useState("all");

  const api = require("../services/api").default;

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get("/notifications");
      setNotifications(data || []);
    } catch {
      setNotifications([
        { id: 1, type: "rdv",   message: "Votre rendez-vous du 20/01 est confirmé.",  read: false, created_at: "2025-01-15T10:00:00Z" },
        { id: 2, type: "don",   message: "Votre demande de don a été approuvée.",       read: false, created_at: "2025-01-14T09:00:00Z" },
        { id: 3, type: "info",  message: "Bienvenue sur Karevia !",                     read: true,  created_at: "2025-01-01T00:00:00Z" },
        { id: 4, type: "alert", message: "Document en attente de vérification.",        read: false, created_at: "2025-01-13T08:00:00Z" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markRead = async (id) => {
    try { await api.patch(`/notifications/${id}/read`); } catch {}
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = async () => {
    try { await api.post("/notifications/read-all"); } catch {}
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotif = async (id, e) => {
    e.stopPropagation();
    try { await api.delete(`/notifications/${id}`); } catch {}
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const ICONS = {
    rdv:   { icon: "fa-calendar-check", color: "var(--teal)",     bg: "var(--teal-light)"  },
    don:   { icon: "fa-gift",           color: "var(--gold-dark)", bg: "var(--gold-light)"  },
    info:  { icon: "fa-info-circle",    color: "var(--green)",     bg: "var(--green-light)" },
    alert: { icon: "fa-exclamation-triangle", color: "var(--coral)", bg: "var(--coral-light)" },
  };

  const unread   = notifications.filter(n => !n.read).length;
  const filtered = filter === "unread"
    ? notifications.filter(n => !n.read)
    : filter === "read"
    ? notifications.filter(n => n.read)
    : notifications;

  return (
    <>
      <Header />
      <main className="container content" style={{ maxWidth: 700 }}>

        <div className="dashboard-header">
          <div>
            <h2>
              <i className="fas fa-bell me-2" style={{ color: "var(--coral)" }}></i>
              Notifications
              {unread > 0 && (
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 22, height: 22, borderRadius: "50%",
                  background: "var(--coral)", color: "white",
                  fontSize: "0.7rem", fontWeight: 700,
                  marginLeft: "0.5rem", verticalAlign: "middle",
                }}>
                  {unread}
                </span>
              )}
            </h2>
          </div>
          {unread > 0 && (
            <button className="btn btn-sm btn-outline-primary" onClick={markAllRead}>
              <i className="fas fa-check-double"></i> Tout lire
            </button>
          )}
        </div>

        {/* Filtres */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {[
            { key: "all",    label: "Toutes" },
            { key: "unread", label: `Non lues (${unread})` },
            { key: "read",   label: "Lues" },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: "0.4rem 1rem",
                borderRadius: "999px",
                border: "1.5px solid",
                borderColor: filter === f.key ? "var(--green)" : "var(--border)",
                background: filter === f.key ? "var(--green)" : "white",
                color: filter === f.key ? "white" : "var(--text-muted)",
                fontSize: "0.82rem", fontWeight: 600,
                cursor: "pointer", fontFamily: "var(--font-body)",
                transition: "all 0.15s",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
            <i className="fas fa-spinner fa-spin fa-2x"></i>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "3.5rem 2rem" }}>
            <i className="fas fa-bell-slash fa-3x" style={{ opacity: 0.2, display: "block", marginBottom: "1rem" }}></i>
            <p style={{ color: "var(--text-muted)", margin: 0 }}>Aucune notification ici.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {filtered.map(n => {
              const ic = ICONS[n.type] || ICONS.info;
              return (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  style={{
                    background: n.read ? "white" : "var(--green-pale)",
                    border: `1.5px solid ${n.read ? "var(--border)" : "var(--green-light)"}`,
                    borderRadius: "var(--r-lg)",
                    padding: "1rem 1.25rem",
                    display: "flex", alignItems: "flex-start", gap: "1rem",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "var(--shadow-sm)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: ic.bg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: ic.color, fontSize: "0.95rem", flexShrink: 0,
                  }}>
                    <i className={`fas ${ic.icon}`}></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: n.read ? 400 : 600, color: "var(--text-h)", fontSize: "0.9rem" }}>
                      {n.message}
                    </p>
                    <small style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
                      {new Date(n.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                    </small>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
                    {!n.read && (
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)", display: "inline-block" }}></span>
                    )}
                    <button
                      onClick={(e) => deleteNotif(n.id, e)}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: "var(--text-hint)", fontSize: "0.8rem", padding: "0.25rem",
                        borderRadius: "50%", transition: "color 0.15s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = "var(--coral)"}
                      onMouseLeave={e => e.currentTarget.style.color = "var(--text-hint)"}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
export default Notifications;