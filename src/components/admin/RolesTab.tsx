
import React, { useState } from "react";
import { Shield, Users, CheckCircle, User, AlertCircle } from "lucide-react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { USER_ROLES, PERMISSIONS, UserRole, ROLE_DESCRIPTIONS } from "./RoleTypes";
import SearchBar from "@/components/ui/SearchBar";
import { User as UserType } from "./types";

interface RolesTabProps {
  users: UserType[];
  updateUserRole: (userId: string, newRole: UserRole) => void;
  currentUserRole: UserRole;
}

const RolesTab = ({ users, updateUserRole, currentUserRole }: RolesTabProps) => {
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>(users);
  const [activeTab, setActiveTab] = useState<"users" | "permissions">("users");

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

  // Sort roles by permission level
  const sortRoles = (roles: UserRole[]): UserRole[] => {
    const roleOrder: Record<UserRole, number> = {
      owner: 0,
      admin: 1,
      moderator: 2,
      user: 3
    };
    
    return [...roles].sort((a, b) => roleOrder[a] - roleOrder[b]);
  };

  return (
    <div className="animate-fade-in">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "users" | "permissions")}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>المستخدمين والأدوار</span>
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>الصلاحيات</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <div className="mb-4">
            <Alert>
              <Shield className="h-5 w-5" />
              <AlertTitle>إدارة الأدوار والصلاحيات</AlertTitle>
              <AlertDescription>
                يمكنك تعيين أدوار للمستخدمين حسب الصلاحيات المطلوبة. كل دور يتيح مجموعة محددة من الإمكانيات.
              </AlertDescription>
            </Alert>
          </div>

          <div className="flex justify-between items-center mb-6">
            <SearchBar
              onSearch={handleUserSearch}
              placeholder="ابحث عن المستخدمين بالاسم أو البريد الإلكتروني..."
            />
          </div>

          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <Table className="w-full">
                <TableCaption>قائمة المستخدمين وأدوارهم في النظام</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">المستخدم</TableHead>
                    <TableHead className="text-right">البريد الإلكتروني</TableHead>
                    <TableHead className="text-right">الدور الحالي</TableHead>
                    <TableHead className="text-right">تغيير الدور</TableHead>
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
                        <Badge 
                          variant={
                            user.role === "owner" ? "destructive" : 
                            user.role === "admin" ? "default" : 
                            user.role === "moderator" ? "secondary" : 
                            "outline"
                          }
                        >
                          {user.role ? USER_ROLES[user.role as UserRole] : "مستخدم"}
                          {user.role === "owner" && <CheckCircle className="h-3 w-3 ml-1" />}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {currentUserRole === "owner" ? (
                          <div className="flex flex-wrap space-x-reverse space-x-2">
                            {sortRoles(["admin", "moderator", "user"]).map((role) => (
                              <Button
                                key={role}
                                variant="outline"
                                size="sm"
                                disabled={user.role === role || user.role === "owner"}
                                onClick={() => updateUserRole(user.id, role)}
                                className="mb-1"
                              >
                                {USER_ROLES[role]}
                              </Button>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            تغيير الأدوار متاح فقط للمالك
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <div className="mb-4">
            <Alert>
              <AlertCircle className="h-5 w-5" />
              <AlertTitle>تفاصيل الصلاحيات</AlertTitle>
              <AlertDescription>
                توضح هذه القائمة الصلاحيات المتاحة لكل دور في النظام. لا يمكن تعديل هذه الصلاحيات بشكل مباشر.
              </AlertDescription>
            </Alert>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {Object.entries(USER_ROLES).map(([role, label]) => (
              <Card key={role}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge 
                      variant={
                        role === "owner" ? "destructive" : 
                        role === "admin" ? "default" : 
                        role === "moderator" ? "secondary" : 
                        "outline"
                      }
                      className="px-2 py-1"
                    >
                      {label}
                    </Badge>
                    <Shield className={`h-5 w-5 ${
                      role === "owner" ? "text-destructive" : 
                      role === "admin" ? "text-primary" : 
                      role === "moderator" ? "text-secondary" : 
                      "text-muted-foreground"
                    }`} />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {ROLE_DESCRIPTIONS[role as UserRole]}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <Table className="w-full">
                <TableCaption>قائمة الصلاحيات المتاحة لكل دور</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الصلاحية</TableHead>
                    <TableHead className="text-right">الوصف</TableHead>
                    <TableHead className="text-right">الأدوار المسموح لها</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {PERMISSIONS.map((permission) => (
                    <TableRow key={permission.key}>
                      <TableCell className="font-medium text-right">
                        {permission.name}
                      </TableCell>
                      <TableCell className="text-right">{permission.description}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-wrap gap-2">
                          {permission.allowedRoles.map(role => (
                            <Badge 
                              key={role}
                              variant={
                                role === "owner" ? "destructive" : 
                                role === "admin" ? "default" : 
                                role === "moderator" ? "secondary" : 
                                "outline"
                              }
                            >
                              {USER_ROLES[role]}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RolesTab;
