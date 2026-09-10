import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDashboard } from "../App";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Unauthorized() {
  const { role } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <main className="container content" style={{ textAlign: "center", paddingTop: 80, paddingBottom: 80 }}>
        <div style={{ fontSize: 80, marginBottom: 16 }}>🚫</div>
        <h1 style={{ fontSize: 48, fontWeight: 700, color: "#dc3545" }}>403</h1>
        <h2>Accès non autorisé</h2>
        <p className="text-muted">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        <button className="btn btn-primary mt-3" onClick={() => navigate(getDashboard(role))}>
          <i className="fas fa-arrow-left"></i> Mon tableau de bord
        </button>
      </main>
      <Footer />
    </>
  );
}