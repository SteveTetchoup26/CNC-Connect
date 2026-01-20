import {
  LayoutDashboard,
  Users,
  Trophy,
  FileText,
  CalendarDays,
  Building2,
  GraduationCap,
  Settings,
} from "lucide-react";


export type AdminNavItem = {
  label: string;
  path: string;
  icon: React.ElementType;
};

export const adminNavigation: AdminNavItem[] = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Utilisateurs",
    path: "/admin/users",
    icon: Users,
  },
  {
    label: "Concours",
    path: "/admin/concours",
    icon: Trophy,
  },
  {
    label: "Candidatures",
    path: "/admin/candidatures",
    icon: FileText,
  },
  {
    label: "Sessions",
    path: "/admin/sessions",
    icon: CalendarDays,
  },
  {
    label: "Centres",
    path: "/admin/centres",
    icon: Building2,
  },
  {
    label: "Ecoles",
    path: "/admin/ecoles",
    icon: GraduationCap,
  },
  {
    label: "Paramètres",
    path: "/admin/settings",
    icon: Settings,
  },
];

