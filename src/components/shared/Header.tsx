import { useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/auth/authSlice";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Fermer le menu utilisateur en cliquant en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleLogout = () => {
    dispatch(logout());
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    navigate("/");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Left side: Menu + Logo (Mobile) / Logo (Desktop) */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>

            {/* Logo */}
            <Link to="/" className="bg-primary p-2 rounded-lg hidden md:block">
              <span className="text-xl md:text-2xl font-bold text-white">
                SG
              </span>
            </Link>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link">
              Accueil
            </Link>

            {!isAuthenticated && (
              <>
                <Link to="#apropos" className="nav-link">
                  À propos
                </Link>
                <Link to="#contact" className="nav-link">
                  Contact
                </Link>
              </>
            )}

            {isAuthenticated && (
              <>
                <Link to="/concours" className="nav-link">
                  Concours
                </Link>
                <Link to="/mes-inscriptions" className="nav-link">
                  Mes inscriptions
                </Link>
                <Link to="/dashboard" className="nav-link">
                  Dashboard
                </Link>
              </>
            )}
          </nav>

          {/* Right actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {!isAuthenticated ? (
              <>
                {/* Desktop buttons */}
                <button
                  onClick={() => navigate("/auth/login")}
                  className="hidden md:block bg-secondary hover:bg-secondary-hover text-white px-5 py-2 rounded-full transition-colors"
                >
                  Connexion
                </button>

                <button
                  onClick={() => navigate("/auth/register")}
                  className="hidden md:block border border-secondary text-secondary px-5 py-2 rounded-full hover:bg-secondary/10 transition-colors"
                >
                  Inscription
                </button>
              </>
            ) : (
              <>
                {/* Search - Desktop only */}
                <button className="hidden md:block p-2 hover:bg-muted rounded-full transition-colors">
                  <Search className="w-5 h-5" />
                </button>

                {/* Search - Mobile */}
                <button className="md:hidden p-2 hover:bg-muted rounded-full transition-colors">
                  <Search className="w-5 h-5" />
                </button>

                {/* Notifications */}
                <button className="relative p-2 hover:bg-muted rounded-full transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
                </button>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-2 md:px-3 py-2 rounded-full hover:bg-muted transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                      {user ? (
                          user.prenom.charAt(0).toUpperCase()
                        ) : (
                          <User className="w-4 h-4" />
                        )
                      }
                    </div>
                    <ChevronDown className="hidden md:block w-4 h-4" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border">
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setIsUserMenuOpen(false);
                        }}
                        className="menu-item"
                      >
                        <User className="w-4 h-4" /> Profil
                      </button>
                      <button
                        onClick={() => {
                          navigate("/settings");
                          setIsUserMenuOpen(false);
                        }}
                        className="menu-item"
                      >
                        <Settings className="w-4 h-4" /> Paramètres
                      </button>
                      <button
                        onClick={handleLogout}
                        className="menu-item text-red-600"
                      >
                        <LogOut className="w-4 h-4" /> Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="bg-primary p-2 rounded-lg w-max">
                <span className="text-xl md:text-2xl font-bold text-white">
                  SG
                </span>
              </Link>
              <Link
                to="/"
                className="text-gray-700 hover:text-primary font-medium transition-colors py-2 px-2 rounded-lg hover:bg-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>

              {!isAuthenticated && (
                <>
                  <Link
                    to="#apropos"
                    className="text-gray-700 hover:text-primary font-medium transition-colors py-2 px-2 rounded-lg hover:bg-muted"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    À propos
                  </Link>
                  <Link
                    to="#contact"
                    className="text-gray-700 hover:text-primary font-medium transition-colors py-2 px-2 rounded-lg hover:bg-muted"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </>
              )}

              {isAuthenticated && (
                <>
                  <Link
                    to="/concours"
                    className="text-gray-700 hover:text-primary font-medium transition-colors py-2 px-2 rounded-lg hover:bg-muted"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Concours
                  </Link>
                  <Link
                    to="/mes-inscriptions"
                    className="text-gray-700 hover:text-primary font-medium transition-colors py-2 px-2 rounded-lg hover:bg-muted"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mes inscriptions
                  </Link>
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-primary font-medium transition-colors py-2 px-2 rounded-lg hover:bg-muted"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </>
              )}

              {/* Boutons d'authentification pour non-authentifiés */}
              {!isAuthenticated && (
                <div className="pt-4 space-y-2">
                  <button
                    onClick={() => handleNavigation("/auth/login")}
                    className="w-full bg-secondary hover:bg-secondary-hover text-white px-6 py-2.5 rounded-full font-medium transition-colors"
                  >
                    Connexion
                  </button>
                  <button
                    onClick={() => handleNavigation("/auth/register")}
                    className="w-full border border-secondary text-secondary px-6 py-2.5 rounded-full font-medium hover:bg-secondary/10 transition-colors"
                  >
                    Inscription
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;