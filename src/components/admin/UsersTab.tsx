
import React, { useEffect, useState } from "react";
import { User, Calendar, Mail, X, Check, UserPlus } from "lucide-react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import SearchBar from "@/components/ui/SearchBar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AdminUserResult } from "@/types/database";
import { User as UserType } from "@/components/admin/types";

interface UsersTabProps {
  openEditUserDialog: (user: UserType) => void;
  setIsCreateUserDialogOpen: (open: boolean) => void;
}

const UsersTab = ({
  openEditUserDialog,
  setIsCreateUserDialogOpen
}: UsersTabProps) => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // جلب بيانات المستخدمين من Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase.rpc('get_all_users');
        
        if (error) {
          throw error;
        }

        if (data) {
          // تحويل البيانات إلى التنسيق المطلوب للواجهة
          const formattedUsers: UserType[] = data.map((user: any) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            status: user.status || 'active',
            registrationDate: new Date(user.created_at).toLocaleDateString('ar-SA'),
            lastLogin: user.last_login ? new Date(user.last_login).toLocaleDateString('ar-SA') : '-',
            libraryCount: 0, // سنقوم بتحديثها لاحقًا
            role: user.role as "user" | "admin"
          }));

          // جلب عدد المكتبات لكل مستخدم
          for (const user of formattedUsers) {
            const { data: libraryData, error: libraryError } = await supabase
              .from('libraries')
              .select('id')
              .eq('user_id', user.id);
            
            if (!libraryError && libraryData) {
              user.libraryCount = libraryData.length;
            }
          }

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

    fetchUsers();
  }, []);

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
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === id ? { ...user, status: newStatus } : user
        )
      );
      
      setFilteredUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === id ? { ...user, status: newStatus } : user
        )
      );
      
      toast.success(`تم تغيير حالة المستخدم إلى ${newStatus === "active" ? "نشط" : "غير نشط"}`);
    } catch (error: any) {
      console.error("Error toggling user status:", error);
      toast.error("فشل في تغيير حالة المستخدم: " + error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <Button 
          onClick={() => setIsCreateUserDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          إضافة مستخدم جديد
        </Button>
        <div className="flex-1 mr-4">
          <SearchBar
            onSearch={handleUserSearch}
            placeholder="ابحث عن المستخدمين بالاسم أو البريد الإلكتروني..."
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table className="w-full">
            <TableCaption>قائمة جميع المستخدمين المسجلين</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الاسم</TableHead>
                <TableHead className="text-right">البريد الإلكتروني</TableHead>
                <TableHead className="text-right">الدور</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">تاريخ التسجيل</TableHead>
                <TableHead className="text-right">آخر تسجيل دخول</TableHead>
                <TableHead className="text-right">المكتبات</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    لا توجد بيانات للعرض
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium text-right">
                      <div className="flex items-center space-x-reverse space-x-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <span>{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{user.email}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={user.role === "admin" ? "secondary" : "outline"}>
                        {user.role === "admin" ? "مشرف" : "مستخدم"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          user.status === "active"
                            ? "default"
                            : user.status === "inactive"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {user.status === "active" ? "نشط" : 
                          user.status === "inactive" ? "غير نشط" : "معلق"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center space-x-reverse space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{user.registrationDate}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{user.lastLogin}</TableCell>
                    <TableCell className="text-right">{user.libraryCount}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex space-x-reverse space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditUserDialog(user)}
                        >
                          تعديل
                        </Button>
                        <Button
                          variant={
                            user.status === "active"
                              ? "destructive"
                              : "default"
                          }
                          size="sm"
                          onClick={() =>
                            toggleUserStatus(user.id, user.status)
                          }
                        >
                          {user.status === "active" ? (
                            <>
                              <X className="h-4 w-4 ml-1" />
                              تعطيل
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4 ml-1" />
                              تفعيل
                            </>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersTab;
