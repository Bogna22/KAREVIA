import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDashboard } from "../App";

export default function Header() {
  const { isAuthenticated, user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/connexion");
  };

  return (
    <header className="header">
      <div className="header-logo">
        <img src="/karevia0.png" className="logo" alt="Logo Karevia" />
        <div>
          <h1>Karevia</h1>
          <p className="slogan">"Soigner avec cœur, partout et pour tous."</p>
        </div>
      </div>

      <nav>
        <Link to="/">Accueil</Link>

        {!isAuthenticated ? (
          <>
            <Link to="/inscription">Inscription</Link>
            <Link to="/connexion">Connexion</Link>
          </>
        ) : (
          <>
            <Link to={getDashboard(role)}>Mon tableau de bord</Link>
            <Link to="/profil">Mon profil</Link>
            <Link to="/notifications">Notifications</Link>
            <button
              onClick={handleLogout}
              style={{
                background: "none",
                border: "1px solid currentColor",
                borderRadius: "6px",
                padding: "6px 14px",
                cursor: "pointer",
                color: "inherit",
                fontSize: "inherit",
              }}
            >
              Se déconnecter
            </button>
          </>
        )}
      </nav>
    </header>
  );
}