
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Pencil, Trash2, UserPlus, UserCheck, UserX } from "lucide-react";
import { User } from "./types";
import { Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

export interface UsersTabProps {
  users: User[];
  filteredUsers: User[];
  handleUserSearch: (query: string) => void;
  openEditUserDialog: (user: User) => void;
  toggleUserStatus: (id: string, currentStatus: string) => void;
  setIsCreateUserDialogOpen: Dispatch<SetStateAction<boolean>>;
  handleDeleteUser: (userId: string) => void;
}

const UsersTab = ({
  users,
  filteredUsers,
  handleUserSearch,
  openEditUserDialog,
  toggleUserStatus,
  setIsCreateUserDialogOpen,
  handleDeleteUser
}: UsersTabProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const { isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.rpc('get_all_users');
        
        if (error) {
          throw error;
        }
        
        return data;
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("حدث خطأ أثناء جلب بيانات المستخدمين");
        return [];
      }
    },
    enabled: users.length === 0,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleUserSearch(query);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "مشرف";
      case "user":
        return "مستخدم";
      default:
        return role;
    }
  };

  const getUserStatusBadge = (status: string) => {
    if (status === "active") {
      return (
        <Badge className="bg-green-500 hover:bg-green-600">
          <UserCheck className="mr-1 h-3 w-3" />
          نشط
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="text-muted-foreground">
          <UserX className="mr-1 h-3 w-3" />
          غير نشط
        </Badge>
      );
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="text-2xl">إدارة المستخدمين</CardTitle>
          <div className="flex flex-col md:flex-row gap-2 md:items-center">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="بحث عن مستخدم..."
                className="pl-4 pr-10 w-full md:w-[300px]"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <Button onClick={() => setIsCreateUserDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              إضافة مستخدم
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الاسم</TableHead>
                <TableHead className="text-right">البريد الإلكتروني</TableHead>
                <TableHead className="text-right">الدور</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">عدد المكتبات</TableHead>
                <TableHead className="text-right">تاريخ التسجيل</TableHead>
                <TableHead className="text-center">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-6 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-8" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-24" />
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center space-x-1">
                          <Skeleton className="h-9 w-9 rounded-md" />
                          <Skeleton className="h-9 w-9 rounded-md" />
                          <Skeleton className="h-9 w-9 rounded-md" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    لا توجد نتائج.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell dir="ltr" className="text-right">
                      {user.email}
                    </TableCell>
                    <TableCell>{getRoleLabel(user.role)}</TableCell>
                    <TableCell>{getUserStatusBadge(user.status || "active")}</TableCell>
                    <TableCell>{user.libraryCount}</TableCell>
                    <TableCell>{user.registrationDate}</TableCell>
                    <TableCell>
                      <div className="flex justify-center space-x-reverse space-x-1">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openEditUserDialog(user)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Switch
                          checked={user.status === "active"}
                          onCheckedChange={() =>
                            toggleUserStatus(user.id, user.status || "active")
                          }
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsersTab;
