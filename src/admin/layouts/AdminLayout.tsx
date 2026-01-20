import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);


  return (
    <div className="min-h-screen flex bg-muted/40">
      {/* Sidebar desktop */}
      <div className="hidden md:block">
        <AdminSidebar collapsed={collapsed}  />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} collapsed={collapsed}
  setCollapsed={setCollapsed} />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {/* Sidebar mobile */}
      <AdminSidebar
        mobile
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
      />
    </div>
  );
};

export default AdminLayout;
