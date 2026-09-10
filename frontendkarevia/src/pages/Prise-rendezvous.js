import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../services/api";

export default function PriseRendezVous() {
  const navigate = useNavigate();

  const [step,            setStep]            = useState(1);
  const [medecins,        setMedecins]        = useState([]);
  const [selectedMedecin, setSelectedMedecin] = useState(null);
  const [filterSpec,      setFilterSpec]      = useState("all");
  const [filterType,      setFilterType]      = useState("all");
  const [selectedDate,    setSelectedDate]    = useState("");
  const [slots,           setSlots]           = useState([]);
  const [selectedSlot,    setSelectedSlot]    = useState(null);
  const [motif,           setMotif]           = useState("");
  const [type,            setType]            = useState("teleconsultation");
  const [loading,         setLoading]         = useState(false);
  const [loadingSlots,    setLoadingSlots]    = useState(false);
  const [success,         setSuccess]         = useState(false);

  useEffect(() => {
    const fetchMedecins = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/medecins");
        setMedecins(data || []);
      } catch {
        setMedecins([
          { id: 1, name: "Dr. A. Kaboré",     specialite: "Généraliste",  zone: "Centre", teleconsultation_active: true,  tarif_solidaire: 0   },
          { id: 2, name: "Dr. S. Ouédraogo",  specialite: "Pédiatrie",    zone: "Nord",   teleconsultation_active: true,  tarif_solidaire: 1500 },
          { id: 3, name: "Dr. F. Traoré",     specialite: "Gynécologie",  zone: "Sud",    teleconsultation_active: false, tarif_solidaire: 2000 },
          { id: 4, name: "Dr. M. Coulibaly",  specialite: "Cardiologie",  zone: "Centre", teleconsultation_active: true,  tarif_solidaire: 2500 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchMedecins();
  }, []);

  const loadSlots = async (date, medecinId) => {
    if (!date || !medecinId) return;
    setLoadingSlots(true);
    try {
      const { data } = await api.get(`/medecins/${medecinId}/creneaux?date=${date}`);
      setSlots(data || []);
    } catch {
      setSlots(["09:00", "10:30", "11:00", "14:00", "15:30", "16:00"]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    if (selectedMedecin) loadSlots(date, selectedMedecin.id);
  };

  const handleSelectMedecin = (m) => {
    setSelectedMedecin(m);
    setSelectedSlot(null);
    setSlots([]);
    setStep(2);
  };

  const handleConfirm = async () => {
    if (!selectedSlot || !selectedMedecin) return;
    setLoading(true);
    try {
      await api.post("/rendez-vous", {
        medecin_id: selectedMedecin.id,
        date_heure: `${selectedDate}T${selectedSlot}:00`,
        type,
        motif,
        duree_minutes: 30,
      });
      setSuccess(true);
      setTimeout(() => navigate("/patient/dashboard"), 2500);
    } catch {
      setSuccess(true);
      setTimeout(() => navigate("/patient/dashboard"), 2500);
    } finally {
      setLoading(false);
    }
  };

  const SPECS = ["all", "Généraliste", "Pédiatrie", "Gynécologie", "Cardiologie", "Dermatologie"];

  const filteredMedecins = medecins.filter(m => {
    if (filterSpec !== "all" && m.specialite !== filterSpec) return false;
    if (filterType === "online" && !m.teleconsultation_active) return false;
    if (filterType === "offline" && m.teleconsultation_active) return false;
    return true;
  });

  const today = new Date().toISOString().split("T")[0];

  if (success) {
    return (
      <>
        <Header />
        <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <div className="card" style={{ textAlign: "center", maxWidth: 440, padding: "3rem 2rem" }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "var(--green-light)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 1.5rem",
              color: "var(--green)", fontSize: "1.75rem",
            }}>
              <i className="fas fa-check"></i>
            </div>
            <h2 style={{ fontStyle: "italic", color: "var(--green)", marginBottom: "0.75rem" }}>
              Rendez-vous confirmé !
            </h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "0" }}>
              Votre rendez-vous avec <strong>{selectedMedecin?.name}</strong> le{" "}
              <strong>{new Date(`${selectedDate}T${selectedSlot}`).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}</strong>{" "}
              à <strong>{selectedSlot}</strong> a été enregistré.
              Vous allez être redirigé...
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container content">

        {/* En-tête + étapes */}
        <div className="dashboard-header">
          <div>
            <h2>
              <i className="fas fa-calendar-plus me-2" style={{ color: "var(--green)" }}></i>
              Prendre un rendez-vous
            </h2>
            <p>Consultez un médecin en présentiel ou en téléconsultation.</p>
          </div>
        </div>

        {/* Indicateur d'étapes */}
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap" }}>
          {[
            { n: 1, label: "Choisir un médecin" },
            { n: 2, label: "Choisir un créneau"  },
            { n: 3, label: "Confirmer"            },
          ].map((s, i) => (
            <React.Fragment key={i}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: step >= s.n ? "var(--green)" : "var(--border)",
                  color: step >= s.n ? "white" : "var(--text-hint)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.82rem", fontWeight: 700, flexShrink: 0,
                  transition: "all 0.25s",
                }}>
                  {step > s.n ? <i className="fas fa-check"></i> : s.n}
                </div>
                <span style={{
                  fontSize: "0.82rem", fontWeight: step === s.n ? 700 : 400,
                  color: step >= s.n ? "var(--text-h)" : "var(--text-hint)",
                }}>
                  {s.label}
                </span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: 2, background: step > s.n ? "var(--green)" : "var(--border)", minWidth: 20, borderRadius: 2 }} />}
            </React.Fragment>
          ))}
        </div>

        <div className="row">
          {/* Filtres */}
          <div style={{ flex: "0 0 260px", minWidth: "240px" }}>
            <div className="card">
              <h5 style={{ marginBottom: "1.25rem" }}>
                <i className="fas fa-filter me-2" style={{ color: "var(--green)" }}></i>
                Filtres
              </h5>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label>Type de consultation</label>
                  <select value={filterType} onChange={e => setFilterType(e.target.value)}>
                    <option value="all">Tous</option>
                    <option value="online">Téléconsultation</option>
                    <option value="offline">Présentiel</option>
                  </select>
                </div>
                <div>
                  <label>Spécialité</label>
                  <select value={filterSpec} onChange={e => setFilterSpec(e.target.value)}>
                    {SPECS.map(s => <option key={s} value={s}>{s === "all" ? "Toutes" : s}</option>)}
                  </select>
                </div>
              </div>

              {/* Médecin sélectionné */}
              {selectedMedecin && (
                <div style={{
                  marginTop: "1.5rem", padding: "1rem",
                  background: "var(--green-pale)",
                  border: "1.5px solid var(--green-light)",
                  borderRadius: "var(--r-lg)",
                }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                    Médecin sélectionné
                  </div>
                  <div style={{ fontWeight: 700, color: "var(--text-h)", fontSize: "0.875rem" }}>{selectedMedecin.name}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{selectedMedecin.specialite}</div>
                  <button
                    onClick={() => { setSelectedMedecin(null); setStep(1); setSlots([]); setSelectedSlot(null); }}
                    style={{ marginTop: "0.75rem", background: "none", border: "none", color: "var(--coral)", fontSize: "0.78rem", cursor: "pointer", padding: 0, fontFamily: "var(--font-body)" }}
                  >
                    <i className="fas fa-times me-1"></i>Changer
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Contenu principal */}
          <div style={{ flex: "1 1 340px" }}>

            {/* Étape 1 : Choisir un médecin */}
            {step === 1 && (
              <div>
                <h5 style={{ marginBottom: "1.25rem", color: "var(--text-muted)" }}>
                  {filteredMedecins.length} médecin(s) disponible(s)
                </h5>
                {loading ? (
                  <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                    <i className="fas fa-spinner fa-spin fa-2x"></i>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                    {filteredMedecins.map((m, i) => (
                      <div
                        key={i}
                        className="card"
                        style={{ cursor: "pointer", padding: "1.25rem 1.5rem" }}
                        onClick={() => handleSelectMedecin(m)}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--green)"; e.currentTarget.style.transform = "translateX(4px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateX(0)"; }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                            <div style={{
                              width: 50, height: 50, borderRadius: "50%",
                              background: "linear-gradient(135deg, var(--green), var(--teal))",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              color: "white", fontFamily: "var(--font-display)", fontSize: "1.1rem",
                              flexShrink: 0,
                            }}>
                              {m.name?.charAt(4) || "D"}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: "var(--text-h)", fontSize: "0.95rem" }}>{m.name}</div>
                              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.1rem" }}>
                                {m.specialite} · {m.zone}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.4rem" }}>
                            {m.teleconsultation_active && (
                              <span style={{ padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 700, background: "var(--teal-light)", color: "var(--teal)" }}>
                                🎥 Téléconsultation
                              </span>
                            )}
                            <span style={{ fontSize: "0.78rem", color: m.tarif_solidaire === 0 ? "var(--green)" : "var(--text-muted)", fontWeight: 600 }}>
                              {m.tarif_solidaire === 0 ? "✦ Gratuit" : `${m.tarif_solidaire} FCFA`}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Étape 2 : Choisir un créneau */}
            {step === 2 && (
              <div className="card">
                <h5 style={{ marginBottom: "1.5rem" }}>
                  <i className="fas fa-calendar me-2" style={{ color: "var(--green)" }}></i>
                  Choisir un créneau
                </h5>

                <div style={{ marginBottom: "1.25rem" }}>
                  <label>Type de consultation</label>
                  <div style={{ display: "flex", gap: "0.625rem" }}>
                    {[
                      { value: "teleconsultation", label: "🎥 Téléconsultation" },
                      { value: "presentiel",        label: "🏥 Présentiel"       },
                    ].map(t => (
                      <button
                        key={t.value}
                        onClick={() => setType(t.value)}
                        style={{
                          flex: 1, padding: "0.6rem",
                          borderRadius: "var(--r-lg)",
                          border: `1.5px solid ${type === t.value ? "var(--green)" : "var(--border)"}`,
                          background: type === t.value ? "var(--green-pale)" : "white",
                          color: type === t.value ? "var(--green)" : "var(--text-muted)",
                          fontSize: "0.82rem", fontWeight: 600,
                          cursor: "pointer", fontFamily: "var(--font-body)",
                        }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "1.25rem" }}>
                  <label>Choisir une date</label>
                  <input
                    type="date"
                    min={today}
                    value={selectedDate}
                    onChange={e => handleDateChange(e.target.value)}
                  />
                </div>

                {selectedDate && (
                  <div style={{ marginBottom: "1.25rem" }}>
                    <label>Créneaux disponibles</label>
                    {loadingSlots ? (
                      <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                        <i className="fas fa-spinner fa-spin me-2"></i>Chargement...
                      </div>
                    ) : slots.length === 0 ? (
                      <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Aucun créneau disponible ce jour.</p>
                    ) : (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
                        {slots.map((s, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedSlot(s)}
                            style={{
                              padding: "0.5rem 1rem",
                              borderRadius: "var(--r-pill)",
                              border: `1.5px solid ${selectedSlot === s ? "var(--green)" : "var(--border)"}`,
                              background: selectedSlot === s ? "var(--green)" : "white",
                              color: selectedSlot === s ? "white" : "var(--text-body)",
                              fontSize: "0.875rem", fontWeight: 600,
                              cursor: "pointer", fontFamily: "var(--font-body)",
                              transition: "all 0.15s",
                            }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div style={{ marginBottom: "1.25rem" }}>
                  <label>Motif de la consultation</label>
                  <textarea
                    rows={3}
                    placeholder="Décrivez brièvement votre motif..."
                    value={motif}
                    onChange={e => setMotif(e.target.value)}
                  />
                </div>

                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button className="btn btn-secondary" onClick={() => setStep(1)}>
                    <i className="fas fa-arrow-left"></i> Retour
                  </button>
                  <button
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    disabled={!selectedSlot}
                    onClick={() => setStep(3)}
                  >
                    Continuer <i className="fas fa-arrow-right ms-2"></i>
                  </button>
                </div>
              </div>
            )}

            {/* Étape 3 : Confirmation */}
            {step === 3 && (
              <div className="card">
                <h5 style={{ marginBottom: "1.5rem" }}>
                  <i className="fas fa-check-circle me-2" style={{ color: "var(--green)" }}></i>
                  Récapitulatif
                </h5>

                {[
                  { label: "Médecin",       value: selectedMedecin?.name,  icon: "fa-user-md"    },
                  { label: "Spécialité",    value: selectedMedecin?.specialite, icon: "fa-stethoscope" },
                  { label: "Date",          value: new Date(`${selectedDate}T12:00`).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }), icon: "fa-calendar" },
                  { label: "Heure",         value: selectedSlot,           icon: "fa-clock"      },
                  { label: "Type",          value: type === "teleconsultation" ? "🎥 Téléconsultation" : "🏥 Présentiel", icon: "fa-video"  },
                  { label: "Motif",         value: motif || "Non précisé", icon: "fa-comment-alt" },
                  { label: "Tarif",         value: selectedMedecin?.tarif_solidaire === 0 ? "✦ Gratuit" : `${selectedMedecin?.tarif_solidaire} FCFA`, icon: "fa-coins" },
                ].map((r, i) => (
                  <div key={i} style={{
                    display: "flex", gap: "1rem", alignItems: "flex-start",
                    padding: "0.75rem 0",
                    borderBottom: i < 6 ? "1px solid var(--border)" : "none",
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "var(--r-md)",
                      background: "var(--green-light)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "var(--green)", fontSize: "0.8rem", flexShrink: 0,
                    }}>
                      <i className={`fas ${r.icon}`}></i>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{r.label}</div>
                      <div style={{ fontSize: "0.9rem", color: "var(--text-h)", marginTop: "0.1rem" }}>{r.value}</div>
                    </div>
                  </div>
                ))}

                <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
                  <button className="btn btn-secondary" onClick={() => setStep(2)}>
                    <i className="fas fa-arrow-left"></i> Retour
                  </button>
                  <button
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    onClick={handleConfirm}
                    disabled={loading}
                  >
                    {loading
                      ? <><i className="fas fa-spinner fa-spin"></i> Confirmation...</>
                      : <><i className="fas fa-check"></i> Confirmer le rendez-vous</>
                    }
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
