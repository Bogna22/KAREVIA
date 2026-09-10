import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
// ============================================================
//  Profil.jsx
// ============================================================
export function Profil() {
  const { user, updateUser } = require("../context/AuthContext").useAuth?.() || {};
  const [editing, setEditing] = React.useState(false);
  const [form,    setForm]    = React.useState({ name: "", phone: "", zone: "", bio: "" });
  const [saving,  setSaving]  = React.useState(false);
  const [msg,     setMsg]     = React.useState("");

  React.useEffect(() => {
    if (user) setForm({ name: user.name || "", phone: user.phone || "", zone: user.zone || "", bio: user.bio || "" });
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const api = require("../services/api").default;
      const { data } = await api.put("/user/profile", form);
      updateUser?.(data.user);
      setMsg("Profil mis à jour !");
      setEditing(false);
    } catch {
      setMsg("Erreur lors de la mise à jour.");
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const ROLE_LABELS = {
    patient: "Patient", vulnerable: "Patient vulnérable", standard: "Donateur",
    medecin: "Médecin", ong: "ONG", admin: "Administrateur",
  };

  return (
    <>
      <Header />
      <main className="container content">

        {/* En-tête profil */}
        <div style={{
          background: "linear-gradient(135deg, var(--green) 0%, var(--teal) 100%)",
          borderRadius: "var(--r-2xl)",
          padding: "2.5rem 2rem",
          marginBottom: "2rem",
          display: "flex", alignItems: "center", gap: "1.5rem",
          flexWrap: "wrap",
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            border: "3px solid rgba(255,255,255,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-display)", fontSize: "1.8rem",
            color: "white", flexShrink: 0,
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ color: "white", fontStyle: "italic", marginBottom: "0.25rem" }}>
              {user?.name}
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
              <span style={{
                background: "rgba(255,255,255,0.2)", color: "white",
                padding: "0.25rem 0.875rem", borderRadius: "999px",
                fontSize: "0.78rem", fontWeight: 700,
              }}>
                {ROLE_LABELS[user?.role] || user?.role}
              </span>
              <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.875rem" }}>
                <i className="fas fa-envelope me-1"></i>{user?.email}
              </span>
              {user?.is_verified && (
                <span style={{
                  background: "rgba(255,255,255,0.15)", color: "#AFFFDB",
                  padding: "0.25rem 0.875rem", borderRadius: "999px",
                  fontSize: "0.78rem", fontWeight: 700,
                  display: "flex", alignItems: "center", gap: "0.35rem",
                }}>
                  <i className="fas fa-check-circle"></i> Vérifié
                </span>
              )}
            </div>
          </div>
          <button
            className="btn"
            onClick={() => setEditing(!editing)}
            style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1.5px solid rgba(255,255,255,0.4)" }}
          >
            <i className={`fas ${editing ? "fa-times" : "fa-edit"} me-2`}></i>
            {editing ? "Annuler" : "Modifier"}
          </button>
        </div>

        {msg && (
          <div className="alert-success" style={{ marginBottom: "1.5rem" }}>
            <i className="fas fa-check-circle"></i> {msg}
          </div>
        )}

        <div className="row">
          {/* Formulaire profil */}
          <div style={{ flex: "1 1 340px" }}>
            <div className="card">
              <h5 style={{ marginBottom: "1.5rem" }}>
                <i className="fas fa-user me-2" style={{ color: "var(--green)" }}></i>
                Informations personnelles
              </h5>

              {editing ? (
                <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label>Nom complet</label>
                    <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                  <div>
                    <label>Téléphone</label>
                    <input type="tel" value={form.phone} placeholder="+226 XX XX XX XX" onChange={e => setForm({...form, phone: e.target.value})} />
                  </div>
                  <div>
                    <label>Zone / Ville</label>
                    <input type="text" value={form.zone} placeholder="Ex: Ouagadougou, Centre" onChange={e => setForm({...form, zone: e.target.value})} />
                  </div>
                  <div>
                    <label>Bio / Présentation</label>
                    <textarea rows={3} value={form.bio} placeholder="Décrivez-vous brièvement..." onChange={e => setForm({...form, bio: e.target.value})} />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? <><i className="fas fa-spinner fa-spin"></i> Enregistrement...</> : <><i className="fas fa-save"></i> Enregistrer</>}
                  </button>
                </form>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {[
                    { label: "Nom",       value: user?.name,   icon: "fa-user"     },
                    { label: "Email",     value: user?.email,  icon: "fa-envelope" },
                    { label: "Téléphone", value: user?.phone || "Non renseigné",    icon: "fa-phone"    },
                    { label: "Zone",      value: user?.zone  || "Non renseignée",   icon: "fa-map-marker-alt" },
                    { label: "Bio",       value: user?.bio   || "Non renseignée",   icon: "fa-info-circle"    },
                  ].map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start" }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: "var(--r-md)",
                        background: "var(--green-light)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "var(--green)", fontSize: "0.85rem", flexShrink: 0,
                      }}>
                        <i className={`fas ${f.icon}`}></i>
                      </div>
                      <div>
                        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{f.label}</div>
                        <div style={{ fontSize: "0.9rem", color: "var(--text-h)", marginTop: "0.1rem" }}>{f.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Colonne droite */}
          <div style={{ flex: "0 0 280px", minWidth: "260px", display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* Documents */}
            <div className="card">
              <h5 style={{ marginBottom: "1rem" }}>
                <i className="fas fa-folder me-2" style={{ color: "var(--gold)" }}></i>
                Documents
              </h5>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                <Link to="/verification" className="btn btn-gold w-100">
                  <i className="fas fa-upload"></i> Téléverser justificatifs
                </Link>
                <Link to="/verification" className="btn btn-secondary w-100">
                  <i className="fas fa-folder-open"></i> Mes documents
                </Link>
              </div>
            </div>

            {/* Historique */}
            <div className="card">
              <h5 style={{ marginBottom: "1rem" }}>
                <i className="fas fa-history me-2" style={{ color: "var(--teal)" }}></i>
                Activité récente
              </h5>
              {[
                { icon: "fa-calendar-check", label: "Consultation",  date: "01/11/2025", color: "var(--teal)"  },
                { icon: "fa-gift",           label: "Don reçu",      date: "15/10/2025", color: "var(--gold)"  },
                { icon: "fa-file-alt",       label: "Demande envoy.", date: "20/09/2025", color: "var(--green)" },
              ].map((h, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "0.75rem",
                  padding: "0.625rem 0",
                  borderBottom: i < 2 ? "1px solid var(--border)" : "none",
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: h.color + "18",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: h.color, fontSize: "0.8rem", flexShrink: 0,
                  }}>
                    <i className={`fas ${h.icon}`}></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-h)" }}>{h.label}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{h.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
export default Profil;