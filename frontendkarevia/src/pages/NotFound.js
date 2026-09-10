import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export function NotFound() {
  return (
    <>
      <Header />
      <main className="container content" style={{ textAlign: "center", paddingTop: 80, paddingBottom: 80 }}>
        <div style={{ fontSize: 80, marginBottom: 16 }}>🔍</div>
        <h1 style={{ fontSize: 48, fontWeight: 700, color: "var(--primary)" }}>404</h1>
        <h2>Page introuvable</h2>
        <p className="text-muted">La page que vous cherchez n'existe pas ou a été déplacée.</p>
        <Link to="/" className="btn btn-primary mt-3">
          <i className="fas fa-home"></i> Retour à l'accueil
        </Link>
      </main>
      <Footer />
    </>
  );
}

export default NotFound;