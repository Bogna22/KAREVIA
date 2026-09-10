import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Pages publiques
import Accueil             from "./pages/Accueil";
import Connexion           from "./pages/Connexion";
import Inscription         from "./pages/Inscription";
import AccesTarif          from "./pages/Acces-tarif";
import NotFound            from "./pages/NotFound";
import Unauthorized        from "./pages/Unauthorized";
import { Contact }         from "./pages/Pages_Info";
import { FAQ }             from "./pages/Pages_Info";
import { Mentions }        from "./pages/Pages_Info";

// Pages protégées
import Appointment         from "./pages/Appointment";
import PriseRendezvous     from "./pages/Prise-rendezvous";
import Verificationpatient from "./pages/Verificationpatient";
import Paiement            from "./pages/Paiement";
import TableaubordDonateur from "./pages/TableaubordDonateur";
import Profil              from "./pages/Profil";
import Notifications       from "./pages/Notifications";
import Donetdemandes       from "./pages/DonetDemandes";

// Tableaux de bord
import Tableaubordmedecin   from "./pages/Tableaubordmedecin";
import Tableaudebordpatient from "./pages/Tableaudebordpatient";
import TableaubordAdmin     from "./pages/TableaubordAdmin";
import TableaubordOng       from "./pages/TableauborddOng";

// Guards
import ProtectedRoute from "./components/ProtectedRoute";
import RoleGuard      from "./components/RoleGuard";
import PageLoader     from "./components/PageLoader";

import "./styles/main.css";

function App() {
  const { isAuthenticated, role, loading } = useAuth(); // ← RÉACTIF via context

  if (loading) return <PageLoader />;

  return (
    <Routes>
      {/* ═══ PUBLIQUES ═══ */}
      <Route path="/"            element={<Accueil />} />
      <Route path="/connexion"   element={
        isAuthenticated
          ? <Navigate to={getDashboard(role)} replace />
          : <Connexion />
      } />
      <Route path="/inscription" element={
        isAuthenticated
          ? <Navigate to={getDashboard(role)} replace />
          : <Inscription />
      } />
      <Route path="/acces-tarif" element={<AccesTarif />} />

      {/* ═══ PROTÉGÉES (auth uniquement) ═══ */}
      <Route path="/appointment" element={
        <ProtectedRoute><Appointment /></ProtectedRoute>
      }/>
      <Route path="/prise-rendezvous" element={
        <ProtectedRoute><PriseRendezvous /></ProtectedRoute>
      }/>
      <Route path="/profil" element={
        <ProtectedRoute><Profil /></ProtectedRoute>
      }/>
     <Route path="/donetdemandes" element={
  <ProtectedRoute><Donetdemandes /></ProtectedRoute>
}/>
      <Route path="/verification" element={
        <ProtectedRoute><Verificationpatient /></ProtectedRoute>
      }/>
      <Route path="/notifications" element={
        <ProtectedRoute><Notifications /></ProtectedRoute>
      }/>
      <Route path="/paiement" element={
        <ProtectedRoute><Paiement /></ProtectedRoute>
      }/>

      {/* ═══ TABLEAU DE BORD MÉDECIN ═══ */}
      <Route path="/medecin/dashboard" element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={["medecin"]}>
            <Tableaubordmedecin />
          </RoleGuard>
        </ProtectedRoute>
      }/>

      {/* ═══ TABLEAU DE BORD PATIENT ═══ */}
      <Route path="/patient/dashboard" element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={["patient", "vulnerable", "standard"]}>
            <Tableaudebordpatient />
          </RoleGuard>
        </ProtectedRoute>
      }/>

      {/* ═══ TABLEAU DE BORD ADMIN ═══ */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={["admin"]}>
            <TableaubordAdmin />
          </RoleGuard>
        </ProtectedRoute>
      }/>

      {/* ═══ TABLEAU DE BORD ONG ═══ */}
      <Route path="/ong/dashboard" element={
        <ProtectedRoute>
          <RoleGuard allowedRoles={["ong"]}>
            <TableaubordOng />
          </RoleGuard>
        </ProtectedRoute>
      }/>

      <Route path="/donateur/dashboard" element={
  <ProtectedRoute>
    <RoleGuard allowedRoles={["standard"]}>
      <TableaubordDonateur />
    </RoleGuard>
  </ProtectedRoute>
}/>
  <Route path="/contact"  element={<Contact />} />
<Route path="/faq"      element={<FAQ />} />
<Route path="/mentions" element={<Mentions />} />


      {/* ═══ ERREURS ═══ */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*"             element={<NotFound />} />
    </Routes>
  );
}

// Redirige vers le bon dashboard selon le rôle
export function getDashboard(role) {
  switch (role) {
    case "medecin":   return "/medecin/dashboard";
    case "admin":     return "/admin/dashboard";
    case "ong":       return "/ong/dashboard";
    case "standard":  return "/donateur/dashboard";  // ← AJOUTER
    case "vulnerable":return "/patient/dashboard";
    default:          return "/patient/dashboard";
  }
}
export default App;