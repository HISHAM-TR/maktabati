
import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/App";

// Import components
import DashboardTab from "@/components/admin/DashboardTab";
import UsersTab from "@/components/admin/UsersTab";
import LibrariesTab from "@/components/admin/LibrariesTab";
import EditUserDialog from "@/components/admin/EditUserDialog";
import CreateUserDialog from "@/components/admin/CreateUserDialog";

// Import types
import { User, Library, UserFormData, CreateUserFormValues } from "@/components/admin/types";
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const { deleteUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filteredLibraries, setFilteredLibraries] = useState<Library[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userFormData, setUserFormData] = useState<UserFormData>({
    name: "",
    email: "",
    status: "",
    role: "user"
  });

  useEffect(() => {
    document.title = "لوحة المشرف | نظام إدارة المكتبات";
    fetchUsers();
    fetchLibraries();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.rpc('get_all_users');
      
      if (error) throw error;

      if (data) {
        // تحويل البيانات إلى التنسيق المطلوب للواجهة
        const formattedUsers: User[] = await Promise.all(
          data.map(async (user: any) => {
            // جلب المعلومات الإضافية من الملف الشخصي
            const { data: profileData } = await supabase
              .from('profiles')
              .select('status')
              .eq('id', user.id)
              .single();

            // جلب عدد المكتبات
            const { data: libraryData } = await supabase
              .from('libraries')
              .select('id')
              .eq('user_id', user.id);

            return {
              id: user.id,
              name: user.name,
              email: user.email,
              status: profileData?.status || 'active',
              registrationDate: new Date(user.created_at).toLocaleDateString('ar-SA'),
              lastLogin: '-', // سيتم تحديثه لاحقًا
              libraryCount: libraryData?.length || 0,
              role: user.role as "user" | "admin"
            };
          })
        );

        setUsers(formattedUsers);
        setFilteredUsers(formattedUsers);
      }
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error("فشل في جلب بيانات المستخدمين: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLibraries = async () => {
    try {
      const { data, error } = await supabase
        .from('libraries')
        .select(`
          id,
          name,
          created_at,
          profiles:user_id (
            name,
            email
          )
        `);
      
      if (error) throw error;

      if (data) {
        // تحويل البيانات إلى التنسيق المطلوب للواجهة
        const formattedLibraries: Library[] = await Promise.all(
          data.map(async (library: any) => {
            // جلب عدد الكتب في المكتبة
            const { data: booksData } = await supabase
              .from('books')
              .select('id')
              .eq('library_id', library.id);

            return {
              id: library.id,
              name: library.name,
              owner: library.profiles?.name || 'غير معروف',
              ownerEmail: library.profiles?.email || 'غير معروف',
              bookCount: booksData?.length || 0,
              creationDate: new Date(library.created_at).toLocaleDateString('ar-SA')
            };
          })
        );

        setLibraries(formattedLibraries);
        setFilteredLibraries(formattedLibraries);
      }
    } catch (error: any) {
      console.error("Error fetching libraries:", error);
      toast.error("فشل في جلب بيانات المكتبات: " + error.message);
    }
  };

  const handleUserSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredUsers(users);
      return;
    }

    const results = users.filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredUsers(results);
  };

  const handleLibrarySearch = (query: string) => {
    if (!query.trim()) {
      setFilteredLibraries(libraries);
      return;
    }

    const results = libraries.filter(
      (library) =>
        library.name.toLowerCase().includes(query.toLowerCase()) ||
        library.owner.toLowerCase().includes(query.toLowerCase()) ||
        library.ownerEmail.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredLibraries(results);
  };

  const openEditUserDialog = (user: User) => {
    setActiveUser(user);
    setUserFormData({
      name: user.name,
      email: user.email,
      status: user.status || "active",
      role: user.role || "user"
    });
    setIsEditUserDialogOpen(true);
  };

  const handleEditUser = async () => {
    if (!activeUser) return;
    if (!userFormData.name.trim() || !userFormData.email.trim()) {
      toast.error("الاسم والبريد الإلكتروني مطلوبان");
      return;
    }

    try {
      // تحديث بيانات المستخدم في قاعدة البيانات
      const updateData = {
        name: userFormData.name,
        status: userFormData.status,
        role: userFormData.role
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', activeUser.id);

      if (error) throw error;

      // تحديث قائمة المستخدمين
      const updatedUsers = users.map((user) =>
        user.id === activeUser.id
          ? { ...user, ...userFormData }
          : user
      );

      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setIsEditUserDialogOpen(false);
      setActiveUser(null);
      toast.success("تم تحديث المستخدم بنجاح");
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast.error("فشل في تحديث بيانات المستخدم: " + error.message);
    }
  };

  const handleCreateUser = async (values: CreateUserFormValues) => {
    try {
      // إنشاء حساب المستخدم في Supabase
      const { data, error } = await supabase.auth.admin.createUser({
        email: values.email,
        password: values.password,
        email_confirm: true,
        user_metadata: {
          name: values.name,
          role: values.role
        }
      });

      if (error) throw error;

      if (data.user) {
        // إضافة المستخدم الجديد إلى القائمة
        const newUser: User = {
          id: data.user.id,
          name: values.name,
          email: values.email,
          status: "active",
          registrationDate: new Date().toLocaleDateString('ar-SA'),
          lastLogin: "-",
          libraryCount: 0,
          role: values.role
        };

        const updatedUsers = [newUser, ...users];
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        
        setIsCreateUserDialogOpen(false);
        
        toast.success(`تم إنشاء المستخدم ${values.name} بنجاح`);
      }
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast.error("فشل في إنشاء المستخدم: " + error.message);
    }
  };

  const toggleUserStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      
      // استدعاء دالة قاعدة البيانات لتغيير حالة المستخدم
      const { data, error } = await supabase.rpc('admin_toggle_user_status', {
        user_id: id,
        new_status: newStatus
      });
      
      if (error) throw error;
      
      // تحديث قائمة المستخدمين
      const updatedUsers = users.map(user =>
        user.id === id ? { ...user, status: newStatus } : user
      );
      
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      
      toast.success(`تم تغيير حالة المستخدم إلى ${newStatus === "active" ? "نشط" : "غير نشط"}`);
    } catch (error: any) {
      console.error("Error toggling user status:", error);
      toast.error("فشل في تغيير حالة المستخدم: " + error.message);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      if (window.confirm("هل أنت متأكد من رغبتك في حذف هذا المستخدم؟ هذا الإجراء لا يمكن التراجع عنه.")) {
        await deleteUser(userId);
        
        // تحديث قائمة المستخدمين بعد الحذف
        const updatedUsers = users.filter(user => user.id !== userId);
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
      }
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error("فشل في حذف المستخدم: " + error.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 text-right">
          <h1 className="text-3xl font-bold mb-8">لوحة المشرف</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="dashboard">لوحة المعلومات</TabsTrigger>
              <TabsTrigger value="users">المستخدمون</TabsTrigger>
              <TabsTrigger value="libraries">المكتبات</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <DashboardTab users={users} libraries={libraries} />
            </TabsContent>

            <TabsContent value="users">
              <UsersTab
                users={filteredUsers}
                filteredUsers={filteredUsers}
                handleUserSearch={handleUserSearch}
                openEditUserDialog={openEditUserDialog}
                toggleUserStatus={toggleUserStatus}
                setIsCreateUserDialogOpen={setIsCreateUserDialogOpen}
                handleDeleteUser={handleDeleteUser}
              />
            </TabsContent>

            <TabsContent value="libraries">
              <LibrariesTab
                filteredLibraries={filteredLibraries}
                handleLibrarySearch={handleLibrarySearch}
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

export default Admin;
