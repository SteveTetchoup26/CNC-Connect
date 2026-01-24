import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="min-h-screen flex bg-muted/40">
      {/* Sidebar desktop - Fixed */}
      <div className="hidden md:block">
        <AdminSidebar collapsed={collapsed} />
      </div>

      {/* Main content area avec margin-left pour compenser la sidebar fixed */}
      <div 
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          collapsed ? "md:ml-16" : "md:ml-64"
        }`}
      >
        <AdminHeader 
          onMenuClick={() => setSidebarOpen(true)} 
          collapsed={collapsed}
          setCollapsed={setCollapsed} 
        />

        <main className="flex-1 p-6 overflow-auto">
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