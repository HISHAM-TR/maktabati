
import { useEffect } from "react";
import { AdminProvider } from "@/contexts/AdminContext";
import AdminLayout from "@/components/admin/AdminLayout";

const Admin = () => {
  useEffect(() => {
    document.title = "لوحة المشرف | نظام إدارة المكتبات";
  }, []);

  return (
    <AdminProvider>
      <AdminLayout />
    </AdminProvider>
  );
};

export default Admin;
