import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthLayout from "./components/shared/AuthLayout"; // Créez ce composant
import Home from './pages/Home';
import './index.css';
import EntranceExamDetails from './pages/EntranceExamDetails';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import MainLayout from './components/shared/MainLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes avec layout principal */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/concours/:id" element={<EntranceExamDetails />} />
        </Route>

        {/* Routes avec layout d'authentification */}
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;