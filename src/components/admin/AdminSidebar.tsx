/* eslint-disable @typescript-eslint/no-explicit-any */
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { adminNavigation } from "@/config/adminNavigation";
import { NavLink } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  collapsed?: boolean;
  mobile?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const SidebarContent = ({ collapsed }: { collapsed?: boolean }) => (
  <div className="p-4 space-y-4">
    {/* Logo */}
    <h2
      className={`text-center text-lg font-semibold transition-all duration-300 ${
        collapsed ? "opacity-0 w-0 overflow-hidden" : ""
      }`}
    >
      SG
    </h2>

    {/* Navigation */}
    <nav className="space-y-1">
      {adminNavigation.map((item: any) => {
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `
                flex items-center rounded-sm text-sm transition-all duration-300
                ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground"
                }
                ${collapsed ? "justify-center px-2 py-2" : "gap-2 px-3 py-2"}
              `
            }
          >
            {collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center justify-center">
                    <item.icon className="h-4 w-4" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ) : (
              <>
                <item.icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  </div>
);

const AdminSidebar = ({ collapsed, mobile, open, onOpenChange }: Props) => {
  // Mobile
  if (mobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent collapsed={false} />
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop
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
