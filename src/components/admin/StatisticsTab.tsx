
import React, { useState, useEffect } from "react";
import { Bar, Line, Pie } from "recharts";
import { BarChart, LineChart, PieChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, BarChart2, LineChart as LineChartIcon, PieChart as PieChartIcon, Users, Book, Library } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { User, Library as LibraryType } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { LibraryType as FullLibraryType, BookType } from "@/types/LibraryTypes";

interface StatisticsTabProps {
  users: User[];
  libraries: LibraryType[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const StatisticsTab = ({ users, libraries }: StatisticsTabProps) => {
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(false);
  const [libraryStats, setLibraryStats] = useState<any[]>([]);
  const [bookStats, setBookStats] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any[]>([]);
  const [activityStats, setActivityStats] = useState<any[]>([]);

  useEffect(() => {
    const prepareUserStats = () => {
      // تحليل بيانات المستخدمين
      const roleCount = {
        owner: 0,
        admin: 0,
        moderator: 0,
        user: 0
      };

      const statusCount = {
        active: 0,
        inactive: 0,
        pending: 0
      };

      users.forEach(user => {
        if (user.role) roleCount[user.role as keyof typeof roleCount]++;
        if (user.status) statusCount[user.status as keyof typeof statusCount]++;
      });

      const roleData = [
        { name: "مالك النظام", value: roleCount.owner },
        { name: "مشرف", value: roleCount.admin },
        { name: "مشرف محدود", value: roleCount.moderator },
        { name: "مستخدم", value: roleCount.user }
      ];

      const statusData = [
        { name: "نشط", value: statusCount.active },
        { name: "غير نشط", value: statusCount.inactive },
        { name: "معلق", value: statusCount.pending }
      ];

      setUserStats([...roleData, ...statusData]);
    };

    const prepareLibraryStats = () => {
      // تحليل بيانات المكتبات
      const ownerBooks = {};
      libraries.forEach(lib => {
        if (lib.owner in ownerBooks) {
          ownerBooks[lib.owner] += lib.bookCount;
        } else {
          ownerBooks[lib.owner] = lib.bookCount;
        }
      });

      const libData = Object.keys(ownerBooks).map(owner => ({
        name: owner,
        books: ownerBooks[owner]
      })).sort((a, b) => b.books - a.books).slice(0, 5);

      setLibraryStats(libData);
    };

    const prepareActivityStats = () => {
      // بيانات نشاط المستخدمين (محاكاة)
      const lastWeek = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return {
          day: date.toLocaleDateString('ar-SA', { weekday: 'short' }),
          تسجيلات_دخول: Math.floor(Math.random() * 10) + 1,
          كتب_مضافة: Math.floor(Math.random() * 5),
          مكتبات_جديدة: Math.floor(Math.random() * 3)
        };
      }).reverse();

      setActivityStats(lastWeek);
    };

    const fetchBookData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('books')
          .select('category, status')
          .limit(1000);

        if (error) throw error;

        // تحليل بيانات الكتب
        const categoryCount = {};
        const statusCount = {
          available: 0,
          borrowed: 0,
          lost: 0,
          damaged: 0
        };

        data.forEach(book => {
          // تصنيف الكتب
          if (book.category) {
            if (book.category in categoryCount) {
              categoryCount[book.category]++;
            } else {
              categoryCount[book.category] = 1;
            }
          }

          // حالة الكتب
          if (book.status) {
            statusCount[book.status as keyof typeof statusCount]++;
          }
        });

        const categoryData = Object.keys(categoryCount)
          .map(cat => ({ name: cat, count: categoryCount[cat] }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 8);

        const statusData = [
          { name: "متاح", value: statusCount.available },
          { name: "معار", value: statusCount.borrowed },
          { name: "مفقود", value: statusCount.lost },
          { name: "تالف", value: statusCount.damaged }
        ];

        setBookStats([...categoryData, ...statusData]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching book data:", error);
        setLoading(false);
      }
    };

    prepareUserStats();
    prepareLibraryStats();
    prepareActivityStats();
    fetchBookData();
  }, [users, libraries]);

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <Alert>
          <InfoIcon className="h-5 w-5" />
          <AlertTitle>لوحة الإحصائيات</AlertTitle>
          <AlertDescription>
            عرض تفصيلي للإحصائيات والرسوم البيانية لمساعدة المشرفين في متابعة ومراقبة النظام
          </AlertDescription>
        </Alert>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>المستخدمين</span>
          </TabsTrigger>
          <TabsTrigger value="libraries" className="flex items-center gap-2">
            <Library className="h-4 w-4" />
            <span>المكتبات</span>
          </TabsTrigger>
          <TabsTrigger value="books" className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            <span>الكتب</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <LineChartIcon className="h-4 w-4" />
            <span>النشاط</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  <span>توزيع أدوار المستخدمين</span>
                </CardTitle>
                <CardDescription>توزيع المستخدمين حسب أدوارهم في النظام</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={userStats.slice(0, 4)}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {userStats.slice(0, 4).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5" />
                  <span>حالة المستخدمين</span>
                </CardTitle>
                <CardDescription>توزيع المستخدمين حسب حالة الحساب</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={userStats.slice(4, 7)}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="عدد المستخدمين" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="libraries">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                <span>أكثر المستخدمين امتلاكاً للكتب</span>
              </CardTitle>
              <CardDescription>ترتيب المستخدمين حسب عدد الكتب في مكتباتهم</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={libraryStats}
                    margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="books" name="عدد الكتب" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="books">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  <span>توزيع الكتب حسب الحالة</span>
                </CardTitle>
                <CardDescription>توزيع الكتب حسب حالتها في النظام</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={bookStats.slice(-4)}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {bookStats.slice(-4).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5" />
                  <span>توزيع التصنيفات</span>
                </CardTitle>
                <CardDescription>توزيع الكتب حسب تصنيفاتها</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={bookStats.slice(0, -4)}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="عدد الكتب" fill="#00C49F" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChartIcon className="h-5 w-5" />
                <span>نشاط النظام الأسبوعي</span>
              </CardTitle>
              <CardDescription>رصد نشاط المستخدمين في الأسبوع الماضي</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={activityStats}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="تسجيلات_دخول" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="كتب_مضافة" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="مكتبات_جديدة" stroke="#ff7300" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatisticsTab;
