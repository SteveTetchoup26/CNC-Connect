import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Candidatures from "./pages/Candidatures";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import EntranceExamDetails from "./pages/concours/EntranceExamDetails";

import MainLayout from "./components/shared/MainLayout";
import AuthLayout from "./components/shared/AuthLayout";
import AuthProvider from "./components/providers/AuthProvider";

import ProtectedRoute from "./components/routes/ProtectedRoute";
import GuestRoute from "./components/routes/GuestRoute";

import "./index.css";
import InscriptionConcours from "./pages/concours/InscriptionConcours";

import { Toaster } from 'sonner';
import ConcoursList from "./pages/concours/ConcoursList";
import ConcoursByRubrique from "./pages/concours/ConcoursByRubrique";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" richColors />
        <Routes>
          {/* Routes publiques */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/concours/:id" element={<EntranceExamDetails />} />
          </Route>

          {/* Routes privées */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<div>Dashboard</div>} />
              <Route path="/profile" element={<div>Profile</div>} />
              <Route path="/mes-inscriptions" element={<div>Mes inscriptions</div>} />
              <Route path="/concours" element={<ConcoursList />} />
              <Route path="/concours/:id/enrolment" element={<InscriptionConcours />} />
              <Route path="/concours/rubrique/:rubrique" element={<ConcoursByRubrique />} />

              <Route path="/mes-candidatures" element={<Candidatures />} />

            </Route>
          </Route>

          {/* Routes invité */}
          <Route element={<GuestRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
