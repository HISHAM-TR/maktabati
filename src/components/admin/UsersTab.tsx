
import React from "react";
import { User, Calendar, Mail, X, Check, UserPlus } from "lucide-react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import SearchBar from "@/components/ui/SearchBar";
import { User as UserType } from "@/components/admin/types";

const switchStyles = `
  .switch {
    font-size: 17px;
    position: relative;
    display: inline-block;
    width: 3.5em;
    height: 1.5em;
  }
  
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .slider {
    position: absolute;
    cursor: pointer;
    inset: 0;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 1rem 0rem 1rem;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 1.5em;
    width: 1.4em;
    left: 0em;
    bottom: 0em;
    background-color: white;
    transition: 0.4s;
    border-radius: 1rem 0rem 1rem;
    border: 3px solid white;
  }

  .ch:checked + .slider {
    background-color: #72eb67;
  }

  .ch:focus + .slider {
    box-shadow: 0 0 1px #2196f3;
  }

  .ch:checked + .slider:before {
    transform: translateX(2.2em);
    background-color: green;
    box-shadow: 0px 0px 40px 5px #72eb67;
    border: 3px solid white;
  }

  .ch:checked + .slider::after {
    content: "|";
    color: white;
    position: absolute;
    right: 0.3rem;
    top: -3.3px;
    transform: rotate(45deg);
  }
`;

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
      <style>{switchStyles}</style>
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
                      <label className="switch">
                        <input 
                          className="ch" 
                          type="checkbox" 
                          checked={user.status === "active"}
                          onChange={() => toggleUserStatus(user.id, user.status)}
                        />
                        <span className="slider" />
                      </label>
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
