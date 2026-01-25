import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Bell, Menu, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/auth/authSlice";
import { useRef, useState } from "react";

type Props = {
  onMenuClick: () => void;
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
};

const AdminHeader = ({ onMenuClick, collapsed, setCollapsed }: Props) => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    dispatch(logout());
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    navigate("/admin/login");
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b bg-background flex items-center px-4 md:px-6 gap-3">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="hidden md:flex"
      >
        <ChevronLeft
          className={`h-4 w-4 transition-transform ${
            collapsed ? "rotate-180" : ""
          }`}
        />
      </Button>

      {/* Hamburger (mobile only) */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="relative w-full max-w-md hidden md:block">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Rechercher..." className="pl-9" />
      </div>

      {/* Search mobile */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="top" className="h-auto p-3">
            <div className="relative mt-6">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher..." className="pl-9" />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="ml-auto flex items-center gap-2 md:gap-3">
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

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-xs flex items-center justify-center">
            3
          </Badge>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src="/avatar.png" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem>Mon profil</DropdownMenuItem>
            <DropdownMenuItem>Paramètres</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AdminHeader;
