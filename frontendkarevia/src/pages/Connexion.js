import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDashboard } from "../App";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Connexion() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const redirectTo = location.state?.from?.pathname || null;

  const handleConnexion = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login({ email, password });
      navigate(redirectTo || getDashboard(user.role), { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <section className="auth-section">
        <div className="auth-container">

          {/* Icône */}
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "var(--green-light)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1.25rem",
            color: "var(--green)", fontSize: "1.3rem",
          }}>
            <i className="fas fa-user-circle"></i>
          </div>

          <h2 style={{ textAlign: "center" }}>Connexion</h2>
          <p className="auth-subtitle" style={{ textAlign: "center" }}>
            Content de vous revoir ! Connectez-vous à votre espace.
          </p>

          {error && (
            <div className="alert-error">
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleConnexion} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label>Adresse email</label>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <label style={{ margin: 0 }}>Mot de passe</label>
                <Link to="/reset-password" style={{ fontSize: "0.78rem", color: "var(--green)", fontWeight: 600 }}>
                  Oublié ?
                </Link>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <i className="fas fa-lock"></i>
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="Votre mot de passe"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  style={{ paddingRight: "3rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  style={{
                    position: "absolute", right: "0.9rem", top: "50%",
                    transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--text-hint)", fontSize: "0.9rem", padding: 0,
                  }}
                >
                  <i className={`fas ${showPwd ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </div>

            <button className="btn-auth" type="submit" disabled={loading} style={{ marginTop: "0.5rem" }}>
              {loading
                ? <><i className="fas fa-spinner fa-spin"></i> Connexion...</>
                : <><i className="fas fa-sign-in-alt"></i> Se connecter</>
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

          <p className="text-center" style={{ marginTop: "1rem" }}>
            Pas encore de compte ?{" "}
            <Link to="/inscription" style={{ fontWeight: 700 }}>Créer un compte</Link>
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}
