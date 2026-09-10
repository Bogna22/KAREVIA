import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{
      background: "var(--night)",
      borderTop: "none",
      position: "relative",
    }}>
      {/* Bande colorée en haut */}
      <div style={{
        height: "3px",
        background: "linear-gradient(90deg, var(--green), var(--teal), var(--gold))",
      }} />

      {/* Contenu principal */}
      <div style={{
        maxWidth: "1240px", margin: "0 auto",
        padding: "3rem 1.5rem 2rem",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "2rem",
      }}>
        {/* Logo & description */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <img
              src="/karevia0.png"
              alt="Karevia"
              style={{ height: 36, width: 36, borderRadius: "8px", objectFit: "cover", filter: "brightness(1.1)" }}
            />
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.3rem",
              fontStyle: "italic",
              color: "white",
            }}>
              Karevia
            </span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: 0 }}>
            Soigner avec cœur, partout et pour tous. Une plateforme humanitaire de santé en Afrique.
          </p>

          {/* Réseaux sociaux */}
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
            {[
              { icon: "fa-facebook-f", href: "#" },
              { icon: "fa-twitter",    href: "#" },
              { icon: "fa-instagram",  href: "#" },
              { icon: "fa-linkedin-in",href: "#" },
            ].map((s, i) => (
              <a key={i} href={s.href} style={{
                width: 34, height: 34,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "rgba(255,255,255,0.6)",
                fontSize: "0.8rem",
                transition: "all 0.2s ease",
                textDecoration: "none",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "var(--green)";
                e.currentTarget.style.borderColor = "var(--green)";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                e.currentTarget.style.color = "rgba(255,255,255,0.6)";
              }}>
                <i className={`fab ${s.icon}`}></i>
              </a>
            ))}
          </div>
        </div>

        {/* Liens rapides */}
        <div>
          <h6 style={{
            color: "rgba(255,255,255,0.4)", fontSize: "0.72rem",
            fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.1em", marginBottom: "1rem",
            fontFamily: "var(--font-body)",
          }}>
            Navigation
          </h6>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {[
              { to: "/",               label: "Accueil"        },
              { to: "/inscription",    label: "Inscription"    },
              { to: "/connexion",      label: "Connexion"      },
              { to: "/donetdemandes",  label: "Faire un don"   },
              { to: "/acces-tarif",    label: "Accès & Tarifs" },
            ].map((l, i) => (
              <Link key={i} to={l.to} style={{
                fontSize: "0.875rem",
                color: "rgba(255,255,255,0.55)",
                textDecoration: "none",
                transition: "color 0.15s",
                display: "flex", alignItems: "center", gap: "0.4rem",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--green-mid)"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}>
                <i className="fas fa-chevron-right" style={{ fontSize: "0.6rem", opacity: 0.5 }}></i>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Services */}
        <div>
          <h6 style={{
            color: "rgba(255,255,255,0.4)", fontSize: "0.72rem",
            fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.1em", marginBottom: "1rem",
            fontFamily: "var(--font-body)",
          }}>
            Services
          </h6>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {[
              { to: "/inscription", label: "Patients vulnérables" },
              { to: "/inscription", label: "Médecins bénévoles"   },
              { to: "/inscription", label: "Donateurs"            },
              { to: "/inscription", label: "ONG & Associations"   },
              { to: "/verification",label: "Vérification dossier" },
            ].map((l, i) => (
              <Link key={i} to={l.to} style={{
                fontSize: "0.875rem",
                color: "rgba(255,255,255,0.55)",
                textDecoration: "none",
                transition: "color 0.15s",
                display: "flex", alignItems: "center", gap: "0.4rem",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--green-mid)"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}>
                <i className="fas fa-chevron-right" style={{ fontSize: "0.6rem", opacity: 0.5 }}></i>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact & Légal */}
        <div>
          <h6 style={{
            color: "rgba(255,255,255,0.4)", fontSize: "0.72rem",
            fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.1em", marginBottom: "1rem",
            fontFamily: "var(--font-body)",
          }}>
            Informations
          </h6>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {[
              { to: "/contact",  icon: "fa-envelope",    label: "Contact"         },
              { to: "/faq",      icon: "fa-question-circle", label: "FAQ"         },
              { to: "/mentions", icon: "fa-file-alt",    label: "Mentions légales"},
            ].map((l, i) => (
              <Link key={i} to={l.to} style={{
                fontSize: "0.875rem",
                color: "rgba(255,255,255,0.55)",
                textDecoration: "none",
                transition: "color 0.15s",
                display: "flex", alignItems: "center", gap: "0.5rem",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--green-mid)"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}>
                <i className={`fas ${l.icon}`} style={{ fontSize: "0.8rem", opacity: 0.6 }}></i>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Email contact */}
          <div style={{ marginTop: "1.25rem" }}>
            <a href="mailto:contact@karevia.org" style={{
              fontSize: "0.825rem",
              color: "var(--green-mid)",
              textDecoration: "none",
              display: "flex", alignItems: "center", gap: "0.4rem",
            }}>
              <i className="fas fa-envelope" style={{ fontSize: "0.8rem" }}></i>
              contact@karevia.org
            </a>
          </div>
        </div>
      </div>

      {/* Bas du footer */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.08)",
        padding: "1.25rem 1.5rem",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.75rem",
        maxWidth: "1240px",
        margin: "0 auto",
      }}>
        <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", margin: 0 }}>
          © 2026 KAREVIA — Réalisé par <span style={{ color: "rgba(255,255,255,0.55)" }}>KY Bogna Arlette</span>
        </p>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {[
            { to: "/mentions", label: "Mentions légales" },
            { to: "/contact",  label: "Contact"          },
            { to: "/faq",      label: "FAQ"              },
          ].map((l, i) => (
            <Link key={i} to={l.to} style={{
              fontSize: "0.78rem",
              color: "rgba(255,255,255,0.35)",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "white"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
