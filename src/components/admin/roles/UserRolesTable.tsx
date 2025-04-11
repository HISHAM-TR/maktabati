
import React from "react";
import { User, CheckCircle, Trash } from "lucide-react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { USER_ROLES, UserRole } from "../RoleTypes";
import { User as UserType } from "../types";

interface UserRolesTableProps {
  filteredUsers: UserType[];
  updateUserRole: (userId: string, newRole: UserRole) => void;
  currentUserRole: UserRole;
}

const UserRolesTable = ({ filteredUsers, updateUserRole, currentUserRole, deleteUser }: UserRolesTableProps & { deleteUser: (userId: string) => void }) => {
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
  );
};

export default UserRolesTable;
