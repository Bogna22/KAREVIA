import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export function TableaubordOng() {
  const { user } = useAuth();
  const [dons,    setDons]    = useState([]);
  const [stats,   setStats]   = useState({ total: 0, beneficiaires: 0, zones: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("/ong/dashboard");
        setDons(data.dons || []);
        setStats(data.stats || {});
      } catch {
        setStats({ total: 18, beneficiaires: 63, zones: 4 });
        setDons([
          { id: 1, type: "Nourriture",   description: "Riz 50kg",           zone: "Centre", status: "distribué", created_at: "2025-01-10" },
          { id: 2, type: "Médicaments",  description: "Paracétamol x200",   zone: "Nord",   status: "en cours",  created_at: "2025-01-12" },
          { id: 3, type: "Transport",    description: "Ambulance x1 jour",  zone: "Sud",    status: "planifié",  created_at: "2025-01-20" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const STATUS_DON = {
    "distribué": { color: "var(--green)",      bg: "var(--green-light)" },
    "en cours":  { color: "var(--teal)",       bg: "var(--teal-light)"  },
    "planifié":  { color: "var(--gold-dark)",  bg: "var(--gold-light)"  },
  };

  return (
    <>
      <Header />
      <main className="container content">

        <div className="dashboard-header">
          <div>
            <h2>
              <i className="fas fa-hands-helping me-2" style={{ color: "var(--gold)" }}></i>
              Espace ONG
            </h2>
            <p>Bienvenue, <strong>{user?.name}</strong> — Gérez vos dons et campagnes.</p>
          </div>
          <Link to="/donetdemandes" className="btn btn-gold">
            <i className="fas fa-plus"></i> Nouveau don
          </Link>
        </div>

        <div className="stats-grid" style={{ marginBottom: "2rem" }}>
          {[
            { label: "Dons proposés",      value: stats.total,         icon: "fa-gift",           cls: "green" },
            { label: "Bénéficiaires aidés",value: stats.beneficiaires, icon: "fa-users",           cls: "teal"  },
            { label: "Zones couvertes",    value: stats.zones,         icon: "fa-map-marker-alt",  cls: "gold"  },
            { label: "Campagnes actives",  value: dons.filter(d => d.status === "en cours").length, icon: "fa-flag", cls: "coral" },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div className={`stat-icon ${s.cls}`}><i className={`fas ${s.icon}`}></i></div>
              <div className="stat-value">{loading ? "—" : s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h5 style={{ margin: 0 }}>
              <i className="fas fa-list me-2" style={{ color: "var(--green)" }}></i>
              Mes dons & campagnes
            </h5>
            <Link to="/donetdemandes" className="btn btn-sm btn-primary">
              <i className="fas fa-plus"></i> Ajouter
            </Link>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr><th>Type</th><th>Description</th><th>Zone</th><th>Statut</th><th>Date</th></tr>
              </thead>
              <tbody>
                {dons.map(d => {
                  const st = STATUS_DON[d.status] || { color: "var(--text-muted)", bg: "var(--bg)" };
                  return (
                    <tr key={d.id}>
                      <td><strong>{d.type}</strong></td>
                      <td style={{ color: "var(--text-muted)" }}>{d.description}</td>
                      <td>
                        <span style={{ padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 700, background: "var(--bg)", color: "var(--text-muted)" }}>
                          {d.zone}
                        </span>
                      </td>
                      <td>
                        <span style={{ padding: "0.25rem 0.7rem", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 700, background: st.bg, color: st.color, textTransform: "uppercase" }}>
                          {d.status}
                        </span>
                      </td>
                      <td style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                        {new Date(d.created_at).toLocaleDateString("fr-FR")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
export default TableaubordOng;
