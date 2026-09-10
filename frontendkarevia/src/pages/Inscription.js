import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDashboard } from "../App";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ROLES = [
  {
    value: "patient",
    label: "Patient",
    icon: "fa-user-injured",
    description: "Accédez à des consultations médicales et un suivi de santé personnalisé.",
    color: "#0D7A5F",
    bg: "#E0F5EE",
  },
  {
    value: "vulnerable",
    label: "Patient vulnérable",
    icon: "fa-heart",
    description: "Accès solidaire aux soins après vérification de vos justificatifs.",
    color: "#E8604A",
    bg: "#FDE8E4",
  },
  {
    value: "standard",
    label: "Donateur / Contributeur",
    icon: "fa-hands-helping",
    description: "Soutenez financièrement les patients vulnérables et les ONG partenaires.",
    color: "#F5A623",
    bg: "#FEF3D8",
  },
  {
    value: "medecin",
    label: "Médecin",
    icon: "fa-user-md",
    description: "Proposez vos consultations et participez à la médecine solidaire.",
    color: "#0891B2",
    bg: "#E0F4F8",
  },
  {
    value: "ong",
    label: "ONG / Association",
    icon: "fa-building",
    description: "Coordonnez des campagnes de santé et gérez les dons pour votre communauté.",
    color: "#0D7A5F",
    bg: "#E0F5EE",
  },
];

export default function Inscription() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [step,     setStep]     = useState(1); // 1 = choix rôle, 2 = formulaire
  const [role,     setRole]     = useState("");
  const [nom,      setNom]      = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const selectedRole = ROLES.find(r => r.value === role);

  const handleRoleSelect = (r) => {
    setRole(r);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) return setError("Les mots de passe ne correspondent pas.");
    if (password.length < 8)  return setError("Le mot de passe doit faire au moins 8 caractères.");

    setLoading(true);
    try {
      const user = await register({
        name: nom,
        email,
        password,
        password_confirmation: confirm,
        role,
      });
      if (role === "vulnerable") navigate("/verification");
      else navigate(getDashboard(user.role));
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        setError(Object.values(errors).flat().join(" "));
      } else {
        setError(err.response?.data?.message || "Erreur lors de l'inscription.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <section className="auth-section" style={{ padding: "2.5rem 1rem" }}>

        {/* Étape 1 — Choix du rôle */}
        {step === 1 && (
          <div style={{ width: "100%", maxWidth: "680px", animation: "fadeSlideUp 0.45s ease both" }}>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--green)", fontSize: "2rem", marginBottom: "0.5rem" }}>
                Créer votre compte
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
                Choisissez votre profil pour commencer
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  onClick={() => handleRoleSelect(r.value)}
                  style={{
                    background: "white",
                    border: "1.5px solid var(--border)",
                    borderRadius: "var(--r-xl)",
                    padding: "1.5rem 1.25rem",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    boxShadow: "var(--shadow-xs)",
                    fontFamily: "var(--font-body)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = r.color;
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "var(--shadow-xs)";
                  }}
                >
                  <div style={{
                    width: "44px", height: "44px",
                    borderRadius: "var(--r-lg)",
                    background: r.bg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: r.color, fontSize: "1.1rem",
                  }}>
                    <i className={`fas ${r.icon}`}></i>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: "var(--text-h)", fontSize: "0.95rem", marginBottom: "0.3rem" }}>
                      {r.label}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                      {r.description}
                    </div>
                  </div>
                  <div style={{ color: r.color, fontSize: "0.78rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    Choisir <i className="fas fa-arrow-right" style={{ fontSize: "0.7rem" }}></i>
                  </div>
                </button>
              ))}
            </div>

            <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
              Déjà un compte ?{" "}
              <Link to="/connexion" style={{ color: "var(--green)", fontWeight: 700 }}>
                Se connecter
              </Link>
            </p>
          </div>
        )}

        {/* Étape 2 — Formulaire */}
        {step === 2 && (
          <div className="auth-container">
            {/* Bouton retour */}
            <button
              onClick={handleBack}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "var(--text-muted)", fontSize: "0.85rem",
                display: "flex", alignItems: "center", gap: "0.4rem",
                marginBottom: "1.25rem", padding: 0, fontFamily: "var(--font-body)",
                transition: "color 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--green)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
            >
              <i className="fas fa-arrow-left" style={{ fontSize: "0.8rem" }}></i>
              Changer de profil
            </button>

            {/* Badge rôle sélectionné */}
            {selectedRole && (
              <div style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                background: selectedRole.bg,
                border: `1.5px solid ${selectedRole.color}20`,
                borderRadius: "var(--r-lg)",
                padding: "0.75rem 1rem",
                marginBottom: "1.5rem",
              }}>
                <div style={{
                  width: "36px", height: "36px",
                  borderRadius: "var(--r-md)",
                  background: "white",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: selectedRole.color, fontSize: "1rem", flexShrink: 0,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                }}>
                  <i className={`fas ${selectedRole.icon}`}></i>
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: selectedRole.color, fontSize: "0.875rem" }}>
                    {selectedRole.label}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                    {selectedRole.description}
                  </div>
                </div>
              </div>
            )}

            <h2 style={{ marginBottom: "0.25rem" }}>Créer votre compte</h2>
            <p className="auth-subtitle">Renseignez vos informations pour commencer</p>

            {error && (
              <div className="alert-error">
                <i className="fas fa-exclamation-circle"></i>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  placeholder="Nom complet"
                  required
                  value={nom}
                  onChange={e => setNom(e.target.value)}
                />
              </div>

              <div className="form-group">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  placeholder="Adresse email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  placeholder="Mot de passe (min. 8 caractères)"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                <i className="fas fa-shield-alt"></i>
                <input
                  type="password"
                  placeholder="Confirmer le mot de passe"
                  required
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-auth" disabled={loading}>
                {loading
                  ? <><i className="fas fa-spinner fa-spin"></i> Inscription en cours...</>
                  : <><i className="fas fa-check-circle"></i> Créer mon compte</>
                }
              </button>
            </form>

            <p className="ou">OU</p>

            <div className="social-login">
              <button className="btn-google" type="button">
                <i className="fab fa-google"></i> Continuer avec Google
              </button>
              <button className="btn-facebook" type="button">
                <i className="fab fa-facebook"></i> Continuer avec Facebook
              </button>
            </div>

            <p className="text-center">
              Déjà un compte ?{" "}
              <Link to="/connexion">Se connecter</Link>
            </p>
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}
