import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CreateOwnerForm from "@/components/admin/CreateOwnerForm";
import { useAuth, useTickets } from "@/App";
import { createDefaultOwner, fetchCurrentUser, updateUserProfile, signIn } from "@/lib/supabase-utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { InfoIcon, Edit, User, Mail, Key, Shield, Phone, MapPin, LogOut, Save, AlertTriangle, Upload, Lock, UserCog, MessageSquare, Plus } from "lucide-react";
import CountrySelect from "@/components/ui/CountrySelect";
import PhoneInput from "@/components/ui/PhoneInput";
import "@/components/ui/phone-input.css";
import { E164Number } from "libphonenumber-js";
import { Controller } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Ticket, TicketFormData } from "@/components/tickets/TicketTypes";
import CreateTicketDialog from "@/components/tickets/CreateTicketDialog";
import ViewTicketDialog from "@/components/tickets/ViewTicketDialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// تعريف مخطط التحقق من صحة البيانات
const profileSchema = z.object({
  name: z.string().min(2, { message: "الاسم يجب أن يحتوي على حرفين على الأقل" }),
  email: z.string().email({ message: "البريد الإلكتروني غير صحيح" }).optional(),
  country: z.string().min(2, { message: "يرجى اختيار الدولة" }),
  phoneNumber: z.string().optional(),
});

const Profile = () => {
  const { user, updateUserInfo, logout } = useAuth();
  const { tickets, addTicket, updateTicketStatus, replyToTicket } = useTickets();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showOwnerForm, setShowOwnerForm] = useState(false);
  const [isCreateTicketDialogOpen, setIsCreateTicketDialogOpen] = useState(false);
  const [isViewTicketDialogOpen, setIsViewTicketDialogOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  
  // استخدام React Hook Form للتحكم في نموذج الملف الشخصي
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      country: "SA",
      phoneNumber: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.setValue("name", user.name || "");
      form.setValue("country", user.country || "SA");
      form.setValue("phoneNumber", user.phoneNumber || "");
      form.setValue("email", user.email || "");
      setEmail(user.email || "");
    } else {
      navigate("/login");
    }

    // التحقق من وجود مستخدم مالك
    const checkOwner = async () => {
      try {
        // Try to create default owner (this will do nothing if owner already exists)
        await createDefaultOwner();
        setShowOwnerForm(false);
      } catch (error) {
        console.error("Error checking for owner:", error);
        setShowOwnerForm(true);
      }
    };

    checkOwner();
  }, [user, navigate, form]);

  const handleUpdateProfile = async (values: z.infer<typeof profileSchema>) => {
    if (!user) return;

    try {
      // تحديث بيانات المستخدم في قاعدة البيانات
      await updateUserProfile(user.id, values.name, values.country, values.phoneNumber);
      
      // تحديث بيانات المستخدم في الحالة المحلية
      const updatedUser = { 
        ...user, 
        name: values.name,
        country: values.country,
        phoneNumber: values.phoneNumber
      };
      updateUserInfo(updatedUser);
      toast.success("تم تحديث الملف الشخصي بنجاح");
    } catch (error: any) {
      toast.error("فشل تحديث الملف الشخصي: " + error.message);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !currentPassword) return;

    setEmailLoading(true);
    try {
      // أولاً، التحقق من كلمة المرور الحالية
      await signIn(user.email, currentPassword);

      // ثم تحديث البريد الإلكتروني
      const { error } = await supabase.auth.updateUser({ email });

      if (error) throw error;

      toast.success("تم إرسال رابط تأكيد إلى البريد الإلكتروني الجديد");
      setCurrentPassword("");
    } catch (error: any) {
      toast.error("فشل تحديث البريد الإلكتروني: " + (error.message || "تأكد من كلمة المرور الحالية"));
    } finally {
      setEmailLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !currentPassword) return;

    if (newPassword !== confirmPassword) {
      toast.error("كلمة المرور الجديدة غير متطابقة مع التأكيد");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("يجب أن تكون كلمة المرور الجديدة أكثر من 6 أحرف");
      return;
    }

    setPasswordLoading(true);
    try {
      // أولاً، التحقق من كلمة المرور الحالية
      await signIn(user.email, currentPassword);

      // ثم تحديث كلمة المرور
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast.success("تم تحديث كلمة المرور بنجاح");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error("فشل تحديث كلمة المرور: " + (error.message || "تأكد من كلمة المرور الحالية"));
    } finally {
      setPasswordLoading(false);
    }
  };

  // Helper function to format last login date
  const getLastLoginText = () => {
    if (user && user.lastLogin) {
      return user.lastLogin;
    }
    return new Date().toLocaleDateString();
  };

  // دالة لإنشاء تذكرة جديدة
  const handleCreateTicket = (values: TicketFormData) => {
    if (!user) {
      toast.error("يجب تسجيل الدخول لإنشاء تذكرة دعم");
      return;
    }

    const newTicket: Ticket = {
      id: `ticket-${Date.now()}`,
      subject: values.subject,
      description: values.description,
      status: "open",
      priority: values.priority,
      type: "technical", // يمكن تعديلها لاحقاً لتكون قابلة للاختيار
      userId: user.id,
      userName: user.name || "مستخدم",
      userEmail: user.email,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      responses: []
    };

    addTicket(newTicket);
    setIsCreateTicketDialogOpen(false);
    toast.success("تم إنشاء تذكرة الدعم بنجاح! سنرد عليك في أقرب وقت ممكن.");
  };

  // دالة لفتح نافذة عرض التذكرة
  const openViewTicketDialog = (ticket: Ticket) => {
    setActiveTicket(ticket);
    setIsViewTicketDialogOpen(true);
  };

  // دالة لعرض حالة التذكرة
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="secondary" className="flex items-center gap-1">جديدة</Badge>;
      case "in-progress":
        return <Badge variant="default" className="flex items-center gap-1">قيد المعالجة</Badge>;
      case "closed":
        return <Badge variant="outline" className="flex items-center gap-1">مغلقة</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // دالة لعرض أولوية التذكرة
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">عالية</Badge>;
      case "medium":
        return <Badge variant="default">متوسطة</Badge>;
      case "low":
        return <Badge variant="outline">منخفضة</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  // تصفية التذاكر الخاصة بالمستخدم الحالي
  const userTickets = user ? tickets.filter(ticket => ticket.userId === user.id) : [];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/20" dir="rtl">
      <Header />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-bold mb-10 text-right relative pr-2"
          >
            <span className="relative inline-block">
              الملف الشخصي
              <motion.div 
                className="absolute -bottom-2 right-0 left-0 h-1 bg-primary/60 rounded-full"
                initial={{ width: 0, x: "50%" }}
                animate={{ width: "100%", x: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              />
            </span>
          </motion.h1>

          {user && (
            <Tabs defaultValue={window.location.search.includes('tab=tickets') ? 'tickets' : 'account'} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-background/80 p-1 rounded-lg shadow-sm border border-border">
                <TabsTrigger value="account" className="text-base font-medium data-[state=active]:bg-muted data-[state=active]:text-primary">
                  <UserCog className="h-4 w-4 ml-2" />
                  معلومات الحساب
                </TabsTrigger>
                <TabsTrigger value="security" className="text-base font-medium data-[state=active]:bg-muted data-[state=active]:text-primary">
                  <Lock className="h-4 w-4 ml-2" />
                  الأمان والخصوصية
                </TabsTrigger>
                <TabsTrigger value="tickets" className="text-base font-medium data-[state=active]:bg-muted data-[state=active]:text-primary">
                  <MessageSquare className="h-4 w-4 ml-2" />
                  تذاكر الدعم
                </TabsTrigger>
              </TabsList>

              <TabsContent value="account" className="space-y-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  {/* بطاقة المعلومات الشخصية */}
                  <Card className="shadow-lg border border-muted/30 overflow-hidden rounded-xl bg-background">
                    <CardHeader className="bg-muted/10 border-b border-muted/20">
                      <CardTitle className="text-xl font-bold">المعلومات الشخصية</CardTitle>
                      <CardDescription className="text-muted-foreground mt-1">قم بتحديث معلومات ملفك الشخصي</CardDescription>
                    </CardHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleUpdateProfile)}>
                        <CardContent className="space-y-5 p-6">
                          <div className="text-center mb-6">
                            <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto flex items-center justify-center mb-2">
                              <User className="h-12 w-12 text-primary" />
                            </div>
                            <p className="text-sm text-muted-foreground">الاسم الكامل</p>
                            <p className="font-semibold">{user?.name || "hichemmadina"}</p>
                          </div>

                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>الاسم الكامل</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      placeholder="أدخل اسمك الكامل"
                                      className="pl-3 pr-10 bg-background text-right"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>البلد</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <MapPin className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <div className="pr-10">
                                      <CountrySelect
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="اختر الدولة"
                                      />
                                    </div>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>رقم الجوال</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Phone className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <div className="pr-10">
                                      <PhoneInput
                                        control={form.control}
                                        name="phoneNumber"
                                        placeholder="أدخل رقم الهاتف"
                                        defaultCountry={form.getValues().country || "SA"}
                                      />
                                    </div>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                        <CardFooter className="border-t bg-muted/10 flex justify-end">
                          <Button type="submit" disabled={form.formState.isSubmitting} className="bg-primary text-primary-foreground hover:bg-primary/90">
                            {form.formState.isSubmitting ? "جاري التحديث..." : "حفظ التغييرات"}
                          </Button>
                        </CardFooter>
                      </form>
                    </Form>
                  </Card>

                  {/* بطاقة معلومات الحساب */}
                  <Card className="shadow-lg border border-muted/30 overflow-hidden rounded-xl bg-background">
                    <CardHeader className="bg-muted/10 border-b border-muted/20">
                      <CardTitle className="text-xl font-bold">معلومات الحساب</CardTitle>
                      <CardDescription className="text-muted-foreground mt-1">تفاصيل حسابك ومعلومات العضوية</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center mb-6">
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                          <User className="h-12 w-12 text-primary" />
                        </div>
                        <Button variant="outline" className="flex items-center gap-2 bg-background text-foreground hover:bg-muted/50 border-border">
                          <Upload className="h-4 w-4" />
                          إضافة صورة
                        </Button>
                      </div>

                      <div className="space-y-4 text-right">
                        <h3 className="font-bold text-lg">{user?.name || "hichemmadina"}</h3>
                        <p className="text-muted-foreground">{user?.email || "hichemmadina@gmail.com"}</p>
                        <p className="text-xs text-muted-foreground">عضو منذ {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "١٤/٠٢/٢٠٢٣"}</p>
                      </div>

                      <Separator className="my-6" />

                      <div className="grid grid-cols-2 gap-4 text-right">
                        <div>
                          <h4 className="text-sm font-medium">المشترك</h4>
                          <p className="text-sm text-green-600">نشط</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">الحالة</h4>
                          <p className="text-sm">فعال</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  {/* بطاقة تغيير البريد الإلكتروني */}
                  <Card className="shadow-lg border border-muted/30 overflow-hidden rounded-xl bg-background">
                    <CardHeader className="bg-muted/10 border-b border-muted/20 pb-3">
                      <CardTitle className="text-lg font-bold">البريد الإلكتروني</CardTitle>
                    </CardHeader>
                    <form onSubmit={handleUpdateEmail}>
                      <CardContent className="space-y-4 p-6">
                        <div className="space-y-2">
                          <label htmlFor="current-email" className="block text-sm font-medium text-right">
                            البريد الإلكتروني الحالي
                          </label>
                          <Input
                            id="current-email"
                            value={user?.email}
                            disabled
                            className="bg-muted/10 text-right"
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="new-email" className="block text-sm font-medium text-right">
                            البريد الإلكتروني الجديد
                          </label>
                          <Input
                            id="new-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="أدخل البريد الإلكتروني الجديد"
                            required
                            className="bg-background text-right"
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="current-password-email" className="block text-sm font-medium text-right">
                            كلمة المرور الحالية
                          </label>
                          <Input
                            id="current-password-email"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="أدخل كلمة المرور الحالية للتأكيد"
                            required
                            className="bg-background text-right"
                          />
                        </div>
                      </CardContent>
                      <CardFooter className="border-t bg-muted/10 flex justify-end">
                        <Button type="submit" disabled={emailLoading} className="bg-primary text-primary-foreground hover:bg-primary/90">
                          {emailLoading ? "جاري التحديث..." : "تحديث البريد الإلكتروني"}
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>

                  {/* بطاقة تغيير كلمة المرور */}
                  <Card className="shadow-lg border border-muted/30 overflow-hidden rounded-xl bg-background">
                    <CardHeader className="bg-muted/10 border-b border-muted/20 pb-3">
                      <CardTitle className="text-lg font-bold">كلمة المرور</CardTitle>
                    </CardHeader>
                    <form onSubmit={handleUpdatePassword}>
                      <CardContent className="space-y-4 p-6">
                        <div className="space-y-2">
                          <label htmlFor="current-password" className="block text-sm font-medium text-right">
                            كلمة المرور الحالية
                          </label>
                          <Input
                            id="current-password"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="أدخل كلمة المرور الحالية"
                            required
                            className="bg-background text-right"
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="new-password" className="block text-sm font-medium text-right">
                            كلمة المرور الجديدة
                          </label>
                          <Input
                            id="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="أدخل كلمة المرور الجديدة"
                            required
                            className="bg-background text-right"
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="confirm-password" className="block text-sm font-medium text-right">
                            تأكيد كلمة المرور الجديدة
                          </label>
                          <Input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="أدخل كلمة المرور الجديدة مرة أخرى"
                            required
                            className="bg-background text-right"
                          />
                        </div>
                      </CardContent>
                      <CardFooter className="border-t bg-muted/10 flex justify-end">
                        <Button type="submit" disabled={passwordLoading} className="bg-primary text-primary-foreground hover:bg-primary/90">
                          {passwordLoading ? "جاري التحديث..." : "تحديث كلمة المرور"}
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="tickets" className="space-y-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="space-y-6"
                >
                  <Card className="shadow-lg border border-muted/30 overflow-hidden rounded-xl bg-background">
                    <CardHeader className="bg-muted/10 border-b border-muted/20 flex flex-row justify-between items-center">
                      <div>
                        <CardTitle className="text-xl font-bold">تذاكر الدعم الفني</CardTitle>
                        <CardDescription className="text-muted-foreground mt-1">يمكنك عرض تذاكرك السابقة وإنشاء تذاكر جديدة</CardDescription>
                      </div>
                      <Button 
                        onClick={() => setIsCreateTicketDialogOpen(true)} 
                        className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        إنشاء تذكرة جديدة
                      </Button>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                      <Table className="w-full">
                        <TableCaption>قائمة تذاكر الدعم الفني الخاصة بك</TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-right">الموضوع</TableHead>
                            <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                            <TableHead className="text-right">الحالة</TableHead>
                            <TableHead className="text-right">الأولوية</TableHead>
                            <TableHead className="text-right">الإجراءات</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {userTickets.length > 0 ? (
                            userTickets.map((ticket) => (
                              <TableRow key={ticket.id}>
                                <TableCell className="font-medium text-right">
                                  <div className="flex items-center space-x-reverse space-x-2">
                                    <MessageSquare className="h-4 w-4 text-primary" />
                                    <span>{ticket.subject}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="text-sm">{ticket.createdAt}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {ticket.updatedAt !== ticket.createdAt && `تحديث: ${ticket.updatedAt}`}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  {getStatusBadge(ticket.status)}
                                </TableCell>
                                <TableCell className="text-right">
                                  {getPriorityBadge(ticket.priority)}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openViewTicketDialog(ticket)}
                                  >
                                    عرض التفاصيل
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="h-24 text-center">
                                لا توجد تذاكر دعم فني حالياً
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          )}

          {showOwnerForm && (
            <div className="mb-10 mt-10">
              <CreateOwnerForm />
            </div>
          )}
        </motion.div>
      </main>

      <Footer />

      {/* حوار إنشاء تذكرة جديدة */}
      <CreateTicketDialog
        isOpen={isCreateTicketDialogOpen}
        setIsOpen={setIsCreateTicketDialogOpen}
        handleCreateTicket={handleCreateTicket}
      />

      {/* حوار عرض تفاصيل التذكرة */}
      {activeTicket && (
        <ViewTicketDialog
          isOpen={isViewTicketDialogOpen}
          setIsOpen={setIsViewTicketDialogOpen}
          ticket={activeTicket}
          updateTicketStatus={updateTicketStatus}
          replyToTicket={replyToTicket}
        />
      )}
    </div>
  );
};

export default Profile;