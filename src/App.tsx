import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthLayout from "./components/shared/AuthLayout"; // Créez ce composant
import Home from './pages/Home';
import './index.css';
import EntranceExamDetails from './pages/EntranceExamDetails';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import MainLayout from './components/shared/MainLayout';
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from 'react';
import { getMeThunk } from './store/auth/authSlice';
import AuthProvider from './components/providers/AuthProvider';

function App() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(getMeThunk());
    }
  }, [token, dispatch]);
  return (
    <BrowserRouter>
      <AuthProvider>
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
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;