
import React from "react";
import { Users, Library, BookOpen, BarChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  name: string;
  email: string;
  status: string;
  registrationDate: string;
  lastLogin: string;
  libraryCount: number;
  role?: "user" | "admin";
}

interface Library {
  id: string;
  name: string;
  owner: string;
  ownerEmail: string;
  bookCount: number;
  creationDate: string;
}

interface DashboardTabProps {
  users: User[];
  libraries: Library[];
}

const DashboardTab = ({ users, libraries }: DashboardTabProps) => {
  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.status === "active").length;
  const totalLibraries = libraries.length;
  const totalBooks = libraries.reduce((sum, lib) => sum + lib.bookCount, 0);

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي المستخدمين
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeUsers} مستخدم نشط
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي المكتبات
            </CardTitle>
            <Library className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLibraries}</div>
            <p className="text-xs text-muted-foreground mt-1">
              عبر {activeUsers} مستخدم
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي الكتب
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBooks}</div>
            <p className="text-xs text-muted-foreground mt-1">
              متوسط {(totalBooks / totalLibraries).toFixed(1)} لكل مكتبة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              نمو المستخدمين
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              في آخر 30 يوم
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>المستخدمون الجدد</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ التسجيل</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.slice(0, 5).map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.name}
                    </TableCell>
                    <TableCell>
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
                    <TableCell>{user.registrationDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>المكتبات الحديثة</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>المالك</TableHead>
                  <TableHead>الكتب</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {libraries.slice(0, 5).map((library) => (
                  <TableRow key={library.id}>
                    <TableCell className="font-medium">
                      {library.name}
                    </TableCell>
                    <TableCell>{library.owner}</TableCell>
                    <TableCell>{library.bookCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardTab;
