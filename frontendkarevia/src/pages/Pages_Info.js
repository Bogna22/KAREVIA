// ============================================================
//  Contact.jsx
// ============================================================
import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export function Contact() {
  const [form, setForm] = useState({ nom: "", email: "", sujet: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici tu peux connecter à une API email
    setSent(true);
  };

  return (
    <>
      <Header />
      <section className="auth-section" style={{ alignItems: "flex-start", paddingTop: "3rem" }}>
        <div style={{ width: "100%", maxWidth: "680px" }}>

          {/* En-tête */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{
              width: 60, height: 60, borderRadius: "50%",
              background: "var(--green-light)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 1rem",
              color: "var(--green)", fontSize: "1.4rem",
            }}>
              <i className="fas fa-envelope"></i>
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--green)" }}>
              Contactez-nous
            </h2>
            <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
              Une question, une suggestion ? Notre équipe vous répond dans les 24h.
            </p>
          </div>

          {sent ? (
            <div className="card" style={{ textAlign: "center", padding: "3rem 2rem" }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "var(--green-light)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 1.25rem",
                color: "var(--green)", fontSize: "1.5rem",
              }}>
                <i className="fas fa-check"></i>
              </div>
              <h3 style={{ marginBottom: "0.5rem" }}>Message envoyé !</h3>
              <p style={{ color: "var(--text-muted)", margin: 0 }}>
                Merci de nous avoir contactés. Nous reviendrons vers vous très prochainement.
              </p>
            </div>
          ) : (
            <div className="card">
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label>Nom complet</label>
                    <input
                      type="text" placeholder="Votre nom" required
                      value={form.nom}
                      onChange={e => setForm({...form, nom: e.target.value})}
                    />
                  </div>
                  <div>
                    <label>Email</label>
                    <input
                      type="email" placeholder="votre@email.com" required
                      value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label>Sujet</label>
                  <select value={form.sujet} onChange={e => setForm({...form, sujet: e.target.value})} required>
                    <option value="">-- Choisissez un sujet --</option>
                    <option value="question">Question générale</option>
                    <option value="don">À propos d'un don</option>
                    <option value="medecin">Je suis médecin bénévole</option>
                    <option value="ong">Partenariat ONG</option>
                    <option value="technique">Problème technique</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label>Message</label>
                  <textarea
                    placeholder="Décrivez votre demande..."
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm({...form, message: e.target.value})}
                    style={{ resize: "vertical" }}
                  />
                </div>

                <button type="submit" className="btn-auth">
                  <i className="fas fa-paper-plane"></i> Envoyer le message
                </button>
              </form>

              {/* Infos contact */}
              <div style={{
                marginTop: "1.5rem", paddingTop: "1.5rem",
                borderTop: "1px solid var(--border)",
                display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "1rem",
              }}>
                {[
                  { icon: "fa-envelope", label: "Email",       value: "contact@karevia.org" },
                  { icon: "fa-clock",    label: "Disponibilité",value: "Lun–Ven, 8h–18h"   },
                  { icon: "fa-globe",    label: "Région",       value: "Afrique de l'Ouest" },
                ].map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: "var(--r-md)",
                      background: "var(--green-light)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "var(--green)", fontSize: "0.875rem", flexShrink: 0,
                    }}>
                      <i className={`fas ${c.icon}`}></i>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {c.label}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-h)", marginTop: "0.1rem" }}>
                        {c.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}


// ============================================================
//  FAQ.jsx
// ============================================================
export function FAQ() {
  const [open, setOpen] = useState(null);

  const FAQS = [
    {
      cat: "Général",
      items: [
        { q: "Qu'est-ce que Karevia ?", a: "Karevia est une plateforme humanitaire de santé qui connecte patients vulnérables, médecins bénévoles, donateurs et ONG en Afrique pour rendre les soins accessibles à tous." },
        { q: "Karevia est-il gratuit ?", a: "L'accès à Karevia est gratuit pour les patients vulnérables vérifiés. Les médecins et donateurs s'inscrivent gratuitement. Des forfaits solidaires sont disponibles pour les patients standard." },
        { q: "Dans quels pays Karevia est-il disponible ?", a: "Karevia est actuellement disponible en Afrique de l'Ouest (Côte d'Ivoire, Sénégal, Mali, Burkina Faso, Guinée). Nous étendons notre présence progressivement." },
      ],
    },
    {
      cat: "Patients",
      items: [
        { q: "Comment bénéficier des soins gratuits ?", a: "Pour accéder aux soins gratuits, inscrivez-vous en tant que 'patient vulnérable', puis soumettez vos justificatifs (carte d'indigence, attestation de ressources). Notre équipe vérifie votre dossier sous 48h." },
        { q: "Puis-je prendre rendez-vous en ligne ?", a: "Oui ! Une fois connecté, vous pouvez consulter les créneaux disponibles des médecins et prendre rendez-vous en présentiel ou en téléconsultation." },
        { q: "Comment fonctionne la téléconsultation ?", a: "La téléconsultation se fait via un lien vidéo sécurisé que vous recevez par email avant le rendez-vous. Vous avez besoin d'un smartphone ou ordinateur avec caméra." },
      ],
    },
    {
      cat: "Médecins",
      items: [
        { q: "Comment rejoindre le réseau de médecins ?", a: "Inscrivez-vous en choisissant le profil 'Médecin', renseignez votre spécialité et vos disponibilités. Notre équipe vérifie votre diplôme et active votre compte sous 72h." },
        { q: "Est-ce que je suis rémunéré ?", a: "Les consultations pour patients vulnérables sont bénévoles. Pour les patients standard, un tarif solidaire est appliqué et vous reversé mensuellement." },
      ],
    },
    {
      cat: "Dons",
      items: [
        { q: "Comment faire un don ?", a: "Cliquez sur 'Faire un don', choisissez un montant ou une campagne spécifique, et payez par carte bancaire, Mobile Money ou virement. Vous recevez un reçu fiscal." },
        { q: "Où va mon argent ?", a: "100% de votre don finance directement les soins des patients vulnérables. Les frais de fonctionnement de Karevia sont couverts par des subventions et partenariats institutionnels." },
        { q: "Puis-je cibler un patient ou une région ?", a: "Oui, vous pouvez choisir de soutenir une campagne spécifique, une région ou laisser Karevia allouer votre don là où le besoin est le plus urgent." },
      ],
    },
  ];

  return (
    <>
      <Header />
      <div style={{ background: "var(--bg)", minHeight: "100vh", padding: "4rem 0" }}>
        <div className="container" style={{ maxWidth: "780px" }}>

          {/* En-tête */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{
              width: 60, height: 60, borderRadius: "50%",
              background: "var(--teal-light)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 1rem",
              color: "var(--teal)", fontSize: "1.4rem",
            }}>
              <i className="fas fa-question-circle"></i>
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--green)" }}>
              Questions fréquentes
            </h2>
            <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
              Tout ce que vous devez savoir sur Karevia.
            </p>
          </div>

          {/* Accordéons */}
          {FAQS.map((section, si) => (
            <div key={si} style={{ marginBottom: "2rem" }}>
              <h5 style={{
                color: "var(--green)", marginBottom: "0.875rem",
                display: "flex", alignItems: "center", gap: "0.5rem",
              }}>
                <span style={{
                  width: 28, height: 28, borderRadius: "var(--r-md)",
                  background: "var(--green-light)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.7rem",
                }}>
                  {si + 1}
                </span>
                {section.cat}
              </h5>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {section.items.map((item, ii) => {
                  const key = `${si}-${ii}`;
                  const isOpen = open === key;
                  return (
                    <div key={ii} style={{
                      background: "white",
                      border: `1.5px solid ${isOpen ? "var(--green)" : "var(--border)"}`,
                      borderRadius: "var(--r-lg)",
                      overflow: "hidden",
                      transition: "border-color 0.2s",
                    }}>
                      <button
                        onClick={() => setOpen(isOpen ? null : key)}
                        style={{
                          width: "100%", background: "none", border: "none",
                          padding: "1rem 1.25rem",
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          gap: "1rem", cursor: "pointer",
                          fontFamily: "var(--font-body)", textAlign: "left",
                        }}
                      >
                        <span style={{ fontWeight: 600, color: "var(--text-h)", fontSize: "0.9rem" }}>
                          {item.q}
                        </span>
                        <i className={`fas fa-chevron-${isOpen ? "up" : "down"}`}
                           style={{ color: "var(--green)", fontSize: "0.8rem", flexShrink: 0 }}></i>
                      </button>
                      {isOpen && (
                        <div style={{
                          padding: "0 1.25rem 1.25rem",
                          fontSize: "0.875rem", color: "var(--text-muted)",
                          lineHeight: 1.7,
                          borderTop: "1px solid var(--border)",
                          paddingTop: "1rem",
                        }}>
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* CTA contact */}
          <div style={{
            textAlign: "center", marginTop: "3rem", padding: "2rem",
            background: "var(--green-light)", borderRadius: "var(--r-xl)",
            border: "1px solid var(--green-light)",
          }}>
            <p style={{ color: "var(--green-dark)", fontWeight: 600, marginBottom: "1rem" }}>
              Vous n'avez pas trouvé votre réponse ?
            </p>
            <a href="/contact" className="btn btn-primary">
              <i className="fas fa-envelope me-2"></i>Contactez-nous
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}


// ============================================================
//  Mentions.jsx
// ============================================================
export function Mentions() {
  return (
    <>
      <Header />
      <div style={{ background: "var(--bg)", minHeight: "100vh", padding: "4rem 0" }}>
        <div className="container" style={{ maxWidth: "780px" }}>

          {/* En-tête */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{
              width: 60, height: 60, borderRadius: "50%",
              background: "var(--gold-light)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 1rem",
              color: "var(--gold-dark)", fontSize: "1.4rem",
            }}>
              <i className="fas fa-file-alt"></i>
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--green)" }}>
              Mentions légales
            </h2>
            <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
              Dernière mise à jour : avril 2026
            </p>
          </div>

          {/* Sections */}
          {[
            {
              title: "Éditeur du site",
              content: `Karevia est une plateforme humanitaire de santé développée par KY Bogna Arlette.
Email : contact@karevia.org
Région : Afrique de l'Ouest`,
            },
            {
              title: "Hébergement",
              content: `Le site est hébergé sur des serveurs sécurisés. Les données des utilisateurs sont stockées dans le respect des réglementations en vigueur.`,
            },
            {
              title: "Propriété intellectuelle",
              content: `L'ensemble du contenu de ce site (textes, images, logos, icônes) est la propriété exclusive de Karevia. Toute reproduction partielle ou totale est interdite sans autorisation préalable.`,
            },
            {
              title: "Protection des données personnelles",
              content: `Karevia collecte des données personnelles dans le but de fournir ses services de santé solidaire. Ces données sont traitées de manière confidentielle et ne sont pas revendues à des tiers.
Vous disposez d'un droit d'accès, de rectification et de suppression de vos données en nous contactant à : contact@karevia.org`,
            },
            {
              title: "Cookies",
              content: `Karevia utilise des cookies techniques nécessaires au fonctionnement du site (authentification, préférences). Aucun cookie publicitaire ou de traçage n'est utilisé.`,
            },
            {
              title: "Limitation de responsabilité",
              content: `Karevia s'efforce de fournir des informations médicales fiables mais ne se substitue pas à un avis médical professionnel. Les consultations sur la plateforme sont réalisées par des médecins qualifiés et enregistrés.`,
            },
            {
              title: "Contact",
              content: `Pour toute question relative aux présentes mentions légales, contactez-nous à : contact@karevia.org`,
            },
          ].map((section, i) => (
            <div key={i} className="card" style={{ marginBottom: "1rem", padding: "1.5rem" }}>
              <h4 style={{
                fontFamily: "var(--font-body)", fontWeight: 700,
                fontSize: "1rem", color: "var(--green)",
                marginBottom: "0.75rem",
                display: "flex", alignItems: "center", gap: "0.5rem",
              }}>
                <span style={{
                  width: 24, height: 24, borderRadius: "50%",
                  background: "var(--green-light)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.7rem", color: "var(--green)", fontWeight: 700, flexShrink: 0,
                }}>
                  {i + 1}
                </span>
                {section.title}
              </h4>
              <p style={{
                margin: 0, fontSize: "0.875rem",
                color: "var(--text-muted)", lineHeight: 1.8,
                whiteSpace: "pre-line",
              }}>
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
