import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
export default function Verificationpatient() {
  const [carteId, setCarteId] = useState(null);
  const [justificatif, setJustificatif] = useState(null);

  const envoyerDocuments = () => {
    if (!carteId || !justificatif) {
      alert("Veuillez télécharger les deux documents avant d'envoyer.");
      return;
    }

    // plus tard tu feras un fetch() pour l'envoi backend
    alert("Documents envoyés avec succès !");
  };

  return (
    <div className="dashboard-bg">
      <Header />

      <section className="auth-section">
        <div className="auth-container">

          <h2>Vérification d'identité</h2>

          <p style={{ textAlign: "center", marginBottom: "15px" }}>
            Les patients vulnérables doivent fournir des justificatifs.
          </p>

          {/* Upload carte d'identité */}
          <div className="form-group">
            <label style={{ color: "white" }}>📄 Carte d'identité :</label>
            <input type="file" onChange={(e) => setCarteId(e.target.files[0])} />
          </div>

          {/* Upload justificatif médical/social */}
          <div className="form-group">
            <label style={{ color: "white" }}>📝 Justificatif médical / social :</label>
            <input type="file" onChange={(e) => setJustificatif(e.target.files[0])} />
          </div>

          <button className="btn-auth" onClick={envoyerDocuments}>
            Envoyer vos documents
          </button>

          <p style={{ marginTop: "15px", textAlign: "center" }}>
            ⏳ Votre demande sera vérifiée sous 24 à 48h.
          </p>

          <p style={{ marginTop: "5px", textAlign: "center" }}>
            Un badge <strong>“Vérifié”</strong> apparaîtra sur votre compte si approuvé.
          </p>

        </div>
      </section>

      <Footer />
    </div>
  );
}
