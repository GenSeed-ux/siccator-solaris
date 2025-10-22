import { Outlet } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <main className="flex-1 bg-background">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
