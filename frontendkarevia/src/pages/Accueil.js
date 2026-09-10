import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDashboard } from "../App";
import Header from "../components/Header";
import Footer from "../components/Footer";
import '../styles/main.css';

const STATS = [
  { value: "2 400+", label: "Patients aidés",      icon: "fa-user-injured", color: "var(--green)"    },
  { value: "180+",   label: "Médecins bénévoles",  icon: "fa-user-md",      color: "var(--teal)"     },
  { value: "95 000", label: "FCFA collectés",       icon: "fa-coins",        color: "var(--gold)"     },
  { value: "12",     label: "ONG partenaires",      icon: "fa-hands-helping",color: "var(--coral)"    },
];

const STEPS = [
  { num: "01", title: "Inscrivez-vous",         desc: "Créez votre compte en 2 minutes selon votre profil.",  icon: "fa-user-plus",   color: "var(--green)" },
  { num: "02", title: "Complétez votre profil", desc: "Renseignez vos informations pour un suivi personnalisé.", icon: "fa-id-card",    color: "var(--teal)"  },
  { num: "03", title: "Agissez",                desc: "Consultez, donnez ou offrez vos compétences médicales.", icon: "fa-heart",       color: "var(--gold)"  },
];

const VALUES = [
  { icon: "fa-hands-helping", title: "Solidarité",     desc: "Unir les forces pour que personne ne soit laissé sans soins.", color: "var(--green)",  bg: "var(--green-light)"  },
  { icon: "fa-eye",           title: "Transparence",   desc: "Chaque don est tracé et son impact rendu visible.",            color: "var(--teal)",   bg: "var(--teal-light)"   },
  { icon: "fa-universal-access", title: "Accessibilité",desc: "Des soins de qualité pour tous, partout en Afrique.",        color: "var(--gold-dark)", bg: "var(--gold-light)" },
  { icon: "fa-chart-line",    title: "Impact",         desc: "Des résultats concrets, mesurables, qui changent des vies.",  color: "var(--coral)",  bg: "var(--coral-light)"  },
];

const PROFILES = [
  {
    to: "/inscription", icon: "fa-user-injured", title: "Je suis patient",
    desc: "Accédez à des consultations médicales, un suivi de santé et des soins solidaires.",
    color: "var(--green)", bg: "var(--green-light)", cta: "Prendre soin de moi",
  },
  {
    to: "/inscription", icon: "fa-user-md", title: "Je suis médecin",
    desc: "Proposez des consultations en présentiel ou en télémédecine et rejoignez notre réseau solidaire.",
    color: "var(--teal)", bg: "var(--teal-light)", cta: "Partager mes compétences",
  },
  {
    to: "/inscription", icon: "fa-hands-helping", title: "Je suis donateur",
    desc: "Contribuez financièrement à financer les soins des patients les plus vulnérables.",
    color: "var(--gold-dark)", bg: "var(--gold-light)", cta: "Soutenir la mission",
  },
  {
    to: "/inscription", icon: "fa-building", title: "Je suis une ONG",
    desc: "Coordonnez des campagnes de santé et gérez les dons pour votre communauté.",
    color: "var(--coral)", bg: "var(--coral-light)", cta: "Rejoindre en tant qu'ONG",
  },
];

export default function Accueil() {
  const { isAuthenticated, role } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Header />

      {/* ── HERO ────────────────────────────────────────── */}
      <section className="hero-section text-center">
        <div className="container">
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: "999px", padding: "0.4rem 1rem",
            fontSize: "0.8rem", color: "rgba(255,255,255,0.9)",
            marginBottom: "1.5rem", fontWeight: 500,
          }}>
            <i className="fas fa-heart" style={{ color: "#FFEEA8" }}></i>
            Plateforme humanitaire de santé en Afrique
          </div>

          <h1 style={{ color: "white", marginBottom: "1.25rem" }}>
            Soigner avec <em>cœur</em>,<br />partout et pour tous
          </h1>

          <p className="lead" style={{ maxWidth: "580px", margin: "0 auto 2.5rem" }}>
            Karevia connecte patients vulnérables, médecins bénévoles et donateurs
            pour rendre les soins accessibles à tous.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
            {isAuthenticated ? (
              <Link to={getDashboard(role)} className="btn-hero-primary">
                <i className="fas fa-th-large"></i> Mon tableau de bord
              </Link>
            ) : (
              <>
                <Link to="/inscription" className="btn-hero-primary">
                  <i className="fas fa-user-plus"></i> Créer un compte
                </Link>
                <Link to="/connexion" className="btn-hero-secondary">
                  <i className="fas fa-sign-in-alt"></i> Se connecter
                </Link>
              </>
            )}
            <Link to="/donetdemandes" className="btn-hero-gold">
              <i className="fas fa-gift"></i> Faire un don
            </Link>
          </div>

          {/* Stats hero */}
          <div style={{
            display: "flex", flexWrap: "wrap", justifyContent: "center",
            gap: "1.5rem", marginTop: "4rem",
          }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "var(--r-xl)",
                padding: "1rem 1.5rem",
                minWidth: "130px",
                backdropFilter: "blur(8px)",
              }}>
                <div style={{
                  fontFamily: "var(--font-display)", fontSize: "1.75rem",
                  fontStyle: "italic", color: "white", lineHeight: 1,
                  marginBottom: "0.25rem",
                }}>
                  {s.value}
                </div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ───────────────────────────── */}
      <section style={{ padding: "5rem 0", background: "var(--white)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h5 style={{ color: "var(--green)", marginBottom: "0.5rem" }}>Simple et rapide</h5>
            <h2>Comment ça marche ?</h2>
            <p style={{ color: "var(--text-muted)", maxWidth: "500px", margin: "0.75rem auto 0" }}>
              Rejoignez Karevia en 3 étapes et commencez à agir pour la santé solidaire.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.5rem",
          }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{
                background: "white",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-xl)",
                padding: "2rem 1.75rem",
                position: "relative",
                overflow: "hidden",
                boxShadow: "var(--shadow-xs)",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--shadow-xs)";
              }}>
                <div style={{
                  position: "absolute", top: "1.25rem", right: "1.25rem",
                  fontFamily: "var(--font-display)", fontSize: "3rem",
                  fontStyle: "italic", color: "var(--border)",
                  lineHeight: 1, userSelect: "none",
                }}>
                  {s.num}
                </div>
                <div style={{
                  width: 52, height: 52,
                  borderRadius: "var(--r-lg)",
                  background: s.color + "18",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: s.color, fontSize: "1.2rem",
                  marginBottom: "1.25rem",
                }}>
                  <i className={`fas ${s.icon}`}></i>
                </div>
                <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.5rem" }}>
                  {s.title}
                </h3>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROFILS ─────────────────────────────────────── */}
      <section style={{ padding: "5rem 0", background: "var(--bg)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h5 style={{ color: "var(--green)", marginBottom: "0.5rem" }}>Pour tout le monde</h5>
            <h2>Rejoignez la mission</h2>
            <p style={{ color: "var(--text-muted)", maxWidth: "480px", margin: "0.75rem auto 0" }}>
              Que vous soyez patient, médecin, donateur ou ONG, Karevia a une place pour vous.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.25rem",
          }}>
            {PROFILES.map((p, i) => (
              <Link key={i} to={p.to} style={{
                background: "white",
                border: "1.5px solid var(--border)",
                borderRadius: "var(--r-xl)",
                padding: "1.75rem",
                textDecoration: "none",
                display: "flex", flexDirection: "column", gap: "0.875rem",
                transition: "all 0.25s ease",
                boxShadow: "var(--shadow-xs)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = p.color;
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--shadow-xs)";
              }}>
                <div style={{
                  width: 48, height: 48,
                  borderRadius: "var(--r-lg)",
                  background: p.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: p.color, fontSize: "1.15rem",
                }}>
                  <i className={`fas ${p.icon}`}></i>
                </div>
                <div>
                  <h3 style={{
                    fontFamily: "var(--font-body)", fontWeight: 700,
                    fontSize: "1rem", color: "var(--text-h)", marginBottom: "0.4rem",
                  }}>
                    {p.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                    {p.desc}
                  </p>
                </div>
                <div style={{
                  display: "flex", alignItems: "center", gap: "0.4rem",
                  color: p.color, fontSize: "0.82rem", fontWeight: 700, marginTop: "auto",
                }}>
                  {p.cta} <i className="fas fa-arrow-right" style={{ fontSize: "0.72rem" }}></i>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALEURS ─────────────────────────────────────── */}
      <section style={{ padding: "5rem 0", background: "var(--white)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h5 style={{ color: "var(--green)", marginBottom: "0.5rem" }}>Ce qui nous guide</h5>
            <h2>Nos valeurs</h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.25rem",
          }}>
            {VALUES.map((v, i) => (
              <div key={i} style={{
                background: "white",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-xl)",
                padding: "1.75rem",
                textAlign: "center",
                boxShadow: "var(--shadow-xs)",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--shadow-xs)";
              }}>
                <div style={{
                  width: 52, height: 52,
                  borderRadius: "50%",
                  background: v.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: v.color, fontSize: "1.2rem",
                  margin: "0 auto 1.25rem",
                }}>
                  <i className={`fas ${v.icon}`}></i>
                </div>
                <h3 style={{
                  fontFamily: "var(--font-body)", fontWeight: 700,
                  fontSize: "1rem", color: "var(--text-h)", marginBottom: "0.5rem",
                }}>
                  {v.title}
                </h3>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────── */}
      <section style={{
        padding: "5rem 0",
        background: "linear-gradient(135deg, var(--green) 0%, var(--teal) 100%)",
        textAlign: "center",
      }}>
        <div className="container">
          <h2 style={{ color: "white", fontStyle: "italic", marginBottom: "1rem" }}>
            Prêt à faire la différence ?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.85)", maxWidth: "480px", margin: "0 auto 2rem", fontSize: "1rem" }}>
            Rejoignez des milliers de personnes qui agissent chaque jour pour une santé plus juste en Afrique.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
            <Link to="/inscription" className="btn-hero-primary">
              <i className="fas fa-rocket"></i> Commencer maintenant
            </Link>
            <Link to="/donetdemandes" className="btn-hero-gold">
              <i className="fas fa-gift"></i> Faire un don
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
