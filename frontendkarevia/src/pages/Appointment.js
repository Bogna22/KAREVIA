import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";



function Appointment() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
    reason: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici tu peux envoyer les données vers ton backend (API REST ou Firebase)
    console.log("Rendez-vous soumis :", formData);
    alert("Votre rendez-vous a été enregistré !");
    setFormData({
      name: "",
      email: "",
      date: "",
      time: "",
      reason: "",
    });
  };

  return (
    <div className="appointment-container">
      <h1>Prise de rendez-vous</h1>
      <form onSubmit={handleSubmit} className="appointment-form">
        <label>
          Nom :
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email :
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Date :
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Heure :
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Motif du rendez-vous :
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Expliquez brièvement le motif"
          />
        </label>

        <button type="submit">Confirmer</button>
      </form>
    </div>
  );
}

export default Appointment;
