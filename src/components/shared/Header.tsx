import { useState, useRef, useEffect } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
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
import { useTheme } from "../theme-provider";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { theme, setTheme } = useTheme();

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Fermer le menu utilisateur en cliquant en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
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
    navigate("/auth/login");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white dark:bg-black shadow-sm sticky top-0 z-50">
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
            <Link
              to="/"
              className="bg-primary p-2 rounded-lg hidden md:flex w-12 h-12 items-center justify-center"
            >
              <span className="text-xl md:text-2xl font-bold text-white">
                CC
              </span>
            </Link>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link dark:text-white!">
              Accueil
            </Link>

            {!isAuthenticated && (
              <>
                <Link to="#apropos" className="nav-link dark:text-white!">
                  À propos
                </Link>
                <Link to="#contact" className="nav-link dark:text-white!">
                  Contact
                </Link>
              </>
            )}

            {isAuthenticated && (
              <>
                <Link to="/concours" className="nav-link dark:text-white!">
                  Concours
                </Link>
                <Link
                  to="/mes-candidatures"
                  className="nav-link dark:text-white!"
                >
                  Mes candidatures
                </Link>
                <Link to="/dashboard" className="nav-link dark:text-white!">
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
                <Button
                  onClick={() => navigate("/auth/login")}
                  className="hidden md:block bg-secondary hover:bg-secondary-hover! text-white px-5 py-2 rounded-full transition-colors"
                >
                  Connexion
                </Button>

                <Button
                  onClick={() => navigate("/auth/register")}
                  className="bg-transparent! hidden md:block border border-secondary text-secondary px-5 py-2 rounded-full hover:bg-secondary/10! transition-colors"
                >
                  Inscription
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>
                {/* Search - Desktop only */}
                <button
                  title="search"
                  className="hidden md:block p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Search - Mobile */}
                <button
                  title="search"
                  className="md:hidden p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Notifications */}
                <button
                  title="search"
                  className="relative p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
                </button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                      <AvatarImage src="/avatar.png" />
                      <AvatarFallback>{ user?.prenom?.charAt(0) }{ user?.nom?.charAt(0) }</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Mon profil</DropdownMenuItem>
                    <DropdownMenuItem>Paramètres</DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={handleLogout}
                    >
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden fixed left-0 right-0 bg-white dark:bg-black shadow-lg border-t border-gray-100 z-50"
              style={{ top: "4rem" }}
            >
              <div className="px-4 py-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
                <nav className="flex flex-col space-y-2">
                  <div className="mb-4">
                    <Link
                      to="/"
                      className="bg-primary p-2 rounded-lg inline-flex w-12 h-12 items-center justify-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-xl font-bold text-white">CC</span>
                    </Link>
                  </div>

                  <Link
                    to="/"
                    className="text-gray-700 dark:text-white! hover:text-primary font-medium transition-colors py-2 px-2 rounded-lg hover:bg-muted"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Accueil
                  </Link>

                  {!isAuthenticated && (
                    <>
                      <Link
                        to="#apropos"
                        className="text-gray-700 dark:text-white! hover:text-primary font-medium transition-colors py-2 px-2 rounded-lg hover:bg-muted"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        À propos
                      </Link>
                      <Link
                        to="#contact"
                        className="text-gray-700 dark:text-white! hover:text-primary font-medium transition-colors py-2 px-2 rounded-lg hover:bg-muted"
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
                        className="text-gray-700 hover:text-primary dark:text-white! font-medium transition-colors py-2 px-2 rounded-lg hover:bg-muted"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Concours
                      </Link>
                      <Link
                        to="/mes-inscriptions"
                        className="text-gray-700 hover:text-primary dark:text-white! font-medium transition-colors py-2 px-2 rounded-lg hover:bg-muted"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Mes inscriptions
                      </Link>
                      <Link
                        to="/dashboard"
                        className="text-gray-700 hover:text-primary dark:text-white! font-medium transition-colors py-2 px-2 rounded-lg hover:bg-muted"
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
