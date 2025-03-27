
import { useEffect, useState } from "react";
import {
  Users,
  Library,
  BookOpen,
  BarChart,
  User,
  Calendar,
  Mail,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import SearchBar from "@/components/ui/SearchBar";

// بيانات وهمية للمستخدمين
const initialUsers = [
  {
    id: "1",
    name: "أحمد محمد",
    email: "ahmed@example.com",
    status: "active",
    registrationDate: "2023-01-15",
    lastLogin: "2023-06-20",
    libraryCount: 3,
  },
  {
    id: "2",
    name: "سارة علي",
    email: "sara@example.com",
    status: "active",
    registrationDate: "2023-02-10",
    lastLogin: "2023-06-18",
    libraryCount: 2,
  },
  {
    id: "3",
    name: "عمر خالد",
    email: "omar@example.com",
    status: "inactive",
    registrationDate: "2023-03-05",
    lastLogin: "2023-05-12",
    libraryCount: 1,
  },
  {
    id: "4",
    name: "نورا سالم",
    email: "noura@example.com",
    status: "active",
    registrationDate: "2023-04-20",
    lastLogin: "2023-06-21",
    libraryCount: 4,
  },
  {
    id: "5",
    name: "فهد محمد",
    email: "fahad@example.com",
    status: "pending",
    registrationDate: "2023-06-15",
    lastLogin: "-",
    libraryCount: 0,
  },
];

// بيانات وهمية للمكتبات
const initialLibrariesData = [
  {
    id: "1",
    name: "مجموعة الروايات",
    owner: "أحمد محمد",
    ownerEmail: "ahmed@example.com",
    bookCount: 42,
    creationDate: "2023-02-10",
  },
  {
    id: "2",
    name: "كتب التقنية",
    owner: "أحمد محمد",
    ownerEmail: "ahmed@example.com",
    bookCount: 17,
    creationDate: "2023-03-15",
  },
  {
    id: "3",
    name: "الفلسفة",
    owner: "أحمد محمد",
    ownerEmail: "ahmed@example.com",
    bookCount: 8,
    creationDate: "2023-04-20",
  },
  {
    id: "4",
    name: "الأدب الكلاسيكي",
    owner: "سارة علي",
    ownerEmail: "sara@example.com",
    bookCount: 25,
    creationDate: "2023-02-28",
  },
  {
    id: "5",
    name: "العلوم",
    owner: "سارة علي",
    ownerEmail: "sara@example.com",
    bookCount: 13,
    creationDate: "2023-05-05",
  },
  {
    id: "6",
    name: "كتب التاريخ",
    owner: "عمر خالد",
    ownerEmail: "omar@example.com",
    bookCount: 9,
    creationDate: "2023-04-12",
  },
  {
    id: "7",
    name: "وصفات الطبخ",
    owner: "نورا سالم",
    ownerEmail: "noura@example.com",
    bookCount: 16,
    creationDate: "2023-03-10",
  },
  {
    id: "8",
    name: "أدلة السفر",
    owner: "نورا سالم",
    ownerEmail: "noura@example.com",
    bookCount: 11,
    creationDate: "2023-04-05",
  },
  {
    id: "9",
    name: "مجموعة الشعر",
    owner: "نورا سالم",
    ownerEmail: "noura@example.com",
    bookCount: 22,
    creationDate: "2023-05-15",
  },
  {
    id: "10",
    name: "كتب الفن",
    owner: "نورا سالم",
    ownerEmail: "noura@example.com",
    bookCount: 7,
    creationDate: "2023-06-01",
  },
];

const Admin = () => {
  const [users, setUsers] = useState(initialUsers);
  const [libraries, setLibraries] = useState(initialLibrariesData);
  const [filteredUsers, setFilteredUsers] = useState(initialUsers);
  const [filteredLibraries, setFilteredLibraries] = useState(initialLibrariesData);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeUser, setActiveUser] = useState<any>(null);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    status: "",
  });

  // تعيين العنوان عند التحميل
  useEffect(() => {
    document.title = "لوحة المشرف | نظام إدارة المكتبات";
  }, []);

  // حساب الإحصائيات
  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.status === "active").length;
  const totalLibraries = libraries.length;
  const totalBooks = libraries.reduce((sum, lib) => sum + lib.bookCount, 0);

  // معالجة بحث المستخدمين
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

  // معالجة بحث المكتبات
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

  // تعديل المستخدم
  const openEditUserDialog = (user: any) => {
    setActiveUser(user);
    setUserFormData({
      name: user.name,
      email: user.email,
      status: user.status,
    });
    setIsEditUserDialogOpen(true);
  };

  const handleEditUser = () => {
    if (!activeUser) return;
    if (!userFormData.name.trim() || !userFormData.email.trim()) {
      toast.error("الاسم والبريد الإلكتروني مطلوبان");
      return;
    }

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
  };

  // تبديل حالة المستخدم
  const toggleUserStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, status: newStatus } : user
    );

    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    toast.success(`تم تغيير حالة المستخدم إلى ${newStatus === "active" ? "نشط" : "غير نشط"}`);
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

            {/* علامة تبويب لوحة المعلومات */}
            <TabsContent value="dashboard" className="animate-fade-in">
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
            </TabsContent>

            {/* علامة تبويب المستخدمين */}
            <TabsContent value="users" className="animate-fade-in">
              <div className="mb-6">
                <SearchBar
                  onSearch={handleUserSearch}
                  placeholder="ابحث عن المستخدمين بالاسم أو البريد الإلكتروني..."
                />
              </div>

              <Card>
                <CardContent className="p-0 overflow-x-auto">
                  <Table className="w-full">
                    <TableCaption>قائمة جميع المستخدمين المسجلين</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">الاسم</TableHead>
                        <TableHead className="text-right">البريد الإلكتروني</TableHead>
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
            </TabsContent>

            {/* علامة تبويب المكتبات */}
            <TabsContent value="libraries" className="animate-fade-in">
              <div className="mb-6">
                <SearchBar
                  onSearch={handleLibrarySearch}
                  placeholder="ابحث عن المكتبات بالاسم أو المالك..."
                />
              </div>

              <Card>
                <CardContent className="p-0 overflow-x-auto">
                  <Table className="w-full">
                    <TableCaption>قائمة جميع المكتبات</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">الاسم</TableHead>
                        <TableHead className="text-right">المالك</TableHead>
                        <TableHead className="text-right">الكتب</TableHead>
                        <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLibraries.map((library) => (
                        <TableRow key={library.id}>
                          <TableCell className="font-medium text-right">
                            <div className="flex items-center space-x-reverse space-x-2">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <Library className="h-4 w-4 text-primary" />
                              </div>
                              <span>{library.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center space-x-reverse space-x-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>{library.owner}</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {library.ownerEmail}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{library.bookCount}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center space-x-reverse space-x-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{library.creationDate}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              عرض
                            </Button>
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
      </main>

      <Footer />

      {/* حوار تعديل المستخدم */}
      <Dialog
        open={isEditUserDialogOpen}
        onOpenChange={setIsEditUserDialogOpen}
      >
        <DialogContent className="rtl:text-right ltr:text-left">
          <DialogHeader>
            <DialogTitle>تعديل المستخدم</DialogTitle>
            <DialogDescription>
              تحديث معلومات المستخدم. انقر على حفظ عند الانتهاء.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                الاسم
              </Label>
              <Input
                id="name"
                value={userFormData.name}
                onChange={(e) =>
                  setUserFormData({ ...userFormData, name: e.target.value })
                }
                className="col-span-3 text-right"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                البريد الإلكتروني
              </Label>
              <div className="col-span-3 flex items-center space-x-reverse space-x-2">
                <Input
                  id="email"
                  value={userFormData.email}
                  onChange={(e) =>
                    setUserFormData({ ...userFormData, email: e.target.value })
                  }
                  className="flex-1 text-right"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    toast.success("تم إرسال بريد التحقق");
                  }}
                  title="إرسال بريد التحقق"
                >
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                الحالة
              </Label>
              <div className="col-span-3 flex items-center space-x-reverse space-x-2">
                <Badge
                  variant={
                    userFormData.status === "active"
                      ? "default"
                      : userFormData.status === "inactive"
                      ? "secondary"
                      : "outline"
                  }
                  className="py-1 px-2"
                >
                  {userFormData.status === "active" ? "نشط" : 
                   userFormData.status === "inactive" ? "غير نشط" : "معلق"}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newStatus =
                      userFormData.status === "active"
                        ? "inactive"
                        : "active";
                    setUserFormData({ ...userFormData, status: newStatus });
                  }}
                >
                  تبديل الحالة
                </Button>
                {userFormData.status === "pending" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setUserFormData({ ...userFormData, status: "active" });
                      toast.success("تم إرسال بريد تفعيل المستخدم");
                    }}
                  >
                    <Check className="h-4 w-4 ml-2" />
                    موافقة
                  </Button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">
                <AlertCircle className="h-4 w-4 text-destructive inline ml-2" />
              </div>
              <div className="col-span-3">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    toast.success("تم إرسال بريد إعادة تعيين كلمة المرور للمستخدم");
                  }}
                >
                  إرسال إعادة تعيين كلمة المرور
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-row-reverse sm:justify-start">
            <Button
              variant="outline"
              onClick={() => setIsEditUserDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button onClick={handleEditUser}>حفظ التغييرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
