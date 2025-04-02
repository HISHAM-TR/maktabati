
import React from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PERMISSIONS, USER_ROLES } from "../RoleTypes";

const PermissionsTable = () => {
  return (
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
  );
};

export default PermissionsTable;
