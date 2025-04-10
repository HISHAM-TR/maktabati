
import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdmin } from "@/contexts/AdminContext";
// Remove unused imports

// تستورد مكونات علامات التبويب المختلفة
import DashboardTab from "@/components/admin/DashboardTab";
import UsersTab from "@/components/admin/UsersTab";
import LibrariesTab from "@/components/admin/LibrariesTab";
import MaintenanceTab from "@/components/admin/MaintenanceTab";
import EditUserDialog from "@/components/admin/EditUserDialog";
import CreateUserDialog from "@/components/admin/CreateUserDialog";
import TicketsTab from "@/components/admin/TicketsTab";
import RolesTab from "@/components/admin/RolesTab";
import SocialMediaTab from "@/components/admin/SocialMediaTab";
import StatisticsTab from "@/components/admin/StatisticsTab";
import { UserRole } from "@/components/admin/RoleTypes";
import { User } from "@/components/admin/types";

// استيراد Hooks الخاصة بالتطبيق
import { useMaintenance, useApp, useTickets } from "@/App";

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const {
    activeTab,
    setActiveTab,
    users,
    libraries,
    filteredUsers,
    filteredLibraries,
    handleUserSearch,
    handleLibrarySearch,
    openEditUserDialog,
    toggleUserStatus,
    setIsCreateUserDialogOpen,
    isEditUserDialogOpen,
    setIsEditUserDialogOpen,
    activeUser,
    userFormData,
    setUserFormData,
    handleEditUser,
    isCreateUserDialogOpen,
    handleCreateUser,
    updateUserRole,
    tickets
  } = useAdmin();

  const { maintenanceSettings, updateMaintenanceSettings } = useMaintenance();
  const { socialLinks, updateSocialLinks } = useApp();
  const { updateTicketStatus, replyToTicket } = useTickets();

  // التحقق من وجود المستخدم النشط قبل محاولة عرض البيانات
  React.useEffect(() => {
    // يمكننا هنا استدعاء دالة createDefaultOwner إذا لزم الأمر
    try {
      const setupDatabase = async () => {
        const { setupDatabase: setupDatabaseFunc } = await import("@/lib/supabase-utils");
        await setupDatabaseFunc();
      };
      setupDatabase();
    } catch (error) {
      console.error("Error setting up database:", error);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f4e8] dark:bg-[#1a1814]" dir="rtl">
      <Header />

      <main className="flex-1 pt-24 pb-16 bg-andalusian-library">
        <div className="container mx-auto px-4 text-right">
          <h1 className="text-3xl font-bold mb-8 andalusian-title">لوحة المشرف</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl" className="andalusian-admin-panel">
            <TabsList className="grid w-full grid-cols-8 mb-8 border-b border-andalusian-border">
              <TabsTrigger value="dashboard">لوحة المعلومات</TabsTrigger>
              <TabsTrigger value="users">المستخدمون</TabsTrigger>
              <TabsTrigger value="roles">الأدوار والصلاحيات</TabsTrigger>
              <TabsTrigger value="tickets">تذاكر الدعم</TabsTrigger>
              <TabsTrigger value="libraries">المكتبات</TabsTrigger>
              <TabsTrigger value="statistics">الإحصائيات</TabsTrigger>
              <TabsTrigger value="social">التواصل الاجتماعي</TabsTrigger>
              <TabsTrigger value="maintenance">إعدادات الصيانة</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <DashboardTab 
                users={users || []}
                libraries={libraries || []}
              />
            </TabsContent>

            <TabsContent value="users">
              <UsersTab
                users={users}
                filteredUsers={filteredUsers}
                handleUserSearch={handleUserSearch}
                openEditUserDialog={openEditUserDialog}
                toggleUserStatus={toggleUserStatus}
                setIsCreateUserDialogOpen={setIsCreateUserDialogOpen}
              />
            </TabsContent>

            <TabsContent value="roles">
              <RolesTab
                users={users}
                updateUserRole={updateUserRole}
                currentUserRole={"owner" as UserRole}
              />
            </TabsContent>

            <TabsContent value="tickets">
              <TicketsTab
                tickets={tickets}
                updateTicketStatus={updateTicketStatus}
                replyToTicket={replyToTicket}
              />
            </TabsContent>

            <TabsContent value="libraries">
              <LibrariesTab
                filteredLibraries={filteredLibraries}
                handleLibrarySearch={handleLibrarySearch}
              />
            </TabsContent>

            <TabsContent value="statistics">
              <StatisticsTab 
                users={users}
                libraries={libraries}
              />
            </TabsContent>

            <TabsContent value="social">
              <SocialMediaTab
                socialLinks={socialLinks}
                updateSocialLinks={updateSocialLinks}
              />
            </TabsContent>

            <TabsContent value="maintenance">
              <MaintenanceTab
                settings={maintenanceSettings}
                onSaveSettings={updateMaintenanceSettings}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      <EditUserDialog
        isOpen={isEditUserDialogOpen}
        setIsOpen={setIsEditUserDialogOpen}
        activeUser={activeUser}
        userFormData={userFormData}
        setUserFormData={setUserFormData}
        handleEditUser={handleEditUser}
      />

      <CreateUserDialog
        isOpen={isCreateUserDialogOpen}
        setIsOpen={setIsCreateUserDialogOpen}
        handleCreateUser={handleCreateUser}
      />
    </div>
  );
};

export default AdminLayout;
