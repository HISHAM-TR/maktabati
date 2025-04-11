
import React from "react";
import { User, Calendar, Mail, X, Check, UserPlus } from "lucide-react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import SearchBar from "@/components/ui/SearchBar";
import { User as UserType } from "@/components/admin/types";

interface UsersTabProps {
  users: UserType[];
  filteredUsers: UserType[];
  handleUserSearch: (query: string) => void;
  openEditUserDialog: (user: UserType) => void;
  toggleUserStatus: (id: string, currentStatus: string) => void;
  setIsCreateUserDialogOpen: (open: boolean) => void;
}

const UsersTab = ({
  filteredUsers,
  handleUserSearch,
  openEditUserDialog,
  toggleUserStatus,
  setIsCreateUserDialogOpen
}: UsersTabProps) => {
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
              {filteredUsers.map((user) => (
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
                      {user.role === "owner" ? "مالك النظام" : 
                       user.role === "admin" ? "مشرف" : 
                       user.role === "moderator" ? "مشرف محدود" : "مستخدم"}
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersTab;
