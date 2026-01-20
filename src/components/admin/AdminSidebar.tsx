import { Sheet, SheetContent } from "@/components/ui/sheet";
import { NavLink } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";

type Props = {
  collapsed?: boolean;
  mobile?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const SidebarContent = ({ collapsed }: { collapsed?: boolean }) => (
  <div className="p-4 space-y-4">
    <h2
      className={`text-center text-lg font-semibold transition-all duration-300 ${
        collapsed ? "opacity-0 w-0 overflow-hidden" : ""
      }`}
    >
      SG
    </h2>

    <NavLink
      to="/admin/dashboard"
      className={({ isActive }) =>
        `flex items-center gap-2 rounded-sm text-sm transition-all duration-300 ${
          isActive
            ? "bg-primary text-white"
            : "hover:bg-muted text-gray-800"
        } ${
          collapsed
            ? "justify-center px-2 py-1"
            : "px-3 py-2"
        }`
      }
    >
      <LayoutDashboard className="min-h-4 min-w-4" />
      {!collapsed && <span>Dashboard</span>}
    </NavLink>
  </div>
);



const AdminSidebar = ({ collapsed, mobile, open, onOpenChange }: Props) => {
  // Sidebar mobile
  if (mobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent collapsed={false} />
        </SheetContent>
      </Sheet>
    );
  }

  // Sidebar desktop
  return (
    <aside
      className={`h-screen border-r bg-background transition-all duration-300 flex flex-col overflow-hidden ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <SidebarContent collapsed={collapsed} />
    </aside>
  );
};

export default AdminSidebar;
