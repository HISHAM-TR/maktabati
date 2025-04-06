
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CreateOwnerForm from "@/components/admin/CreateOwnerForm";
import { useAuth } from "@/App";
import { createDefaultOwner, fetchCurrentUser, updateUserProfile, signIn } from "@/lib/supabase-utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { InfoIcon, Edit, User, Mail, Key, Shield, Phone, MapPin } from "lucide-react";
import CountrySelect from "@/components/ui/CountrySelect";
import PhoneInput from "@/components/ui/PhoneInput";
import "@/components/ui/phone-input.css";
import { E164Number } from "libphonenumber-js/types";
import { Controller } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// تعريف مخطط التحقق من صحة البيانات
const profileSchema = z.object({
  name: z.string().min(2, { message: "الاسم يجب أن يحتوي على حرفين على الأقل" }),
  email: z.string().email({ message: "البريد الإلكتروني غير صحيح" }).optional(),
  country: z.string().min(2, { message: "يرجى اختيار الدولة" }),
  phoneNumber: z.string().optional(),
});

const Profile = () => {
  const { user, updateUserInfo, logout } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showOwnerForm, setShowOwnerForm] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  
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

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Header />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">الملف الشخصي</h1>

          {user && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>المعلومات الشخصية</span>
                </TabsTrigger>
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>تغيير البريد الإلكتروني</span>
                </TabsTrigger>
                <TabsTrigger value="password" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  <span>تغيير كلمة المرور</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Edit className="h-5 w-5" />
                      معلومات الحساب
                    </CardTitle>
                    <CardDescription>إدارة معلومات حسابك الشخصي</CardDescription>
                  </CardHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleUpdateProfile)}>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>البريد الإلكتروني</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    placeholder="البريد الإلكتروني"
                                    className="pl-3 pr-10 bg-gray-50"
                                    disabled
                                    value={user?.email}
                                  />
                                </div>
                              </FormControl>
                              <p className="text-xs text-muted-foreground">
                                لتغيير البريد الإلكتروني، انتقل إلى تبويب "تغيير البريد الإلكتروني"
                              </p>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>الاسم</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    placeholder="أدخل اسمك الكامل"
                                    className="pl-3 pr-10"
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
                              <FormLabel>الدولة</FormLabel>
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
                              <FormLabel>رقم الهاتف</FormLabel>
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

                        {user?.role && (
                          <div className="space-y-2">
                            <label className="block text-sm font-medium">الدور في النظام</label>
                            <div className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded-md">
                              <Shield className="h-4 w-4 text-primary" />
                              <span>{
                                user.role === "owner" ? "مالك النظام" :
                                user.role === "admin" ? "مشرف" :
                                user.role === "moderator" ? "مشرف محدود" : "مستخدم"
                              }</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="border-t bg-gray-50 flex justify-between">
                        <p className="text-sm text-muted-foreground">
                          آخر تسجيل دخول: {getLastLoginText()}
                        </p>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                          {form.formState.isSubmitting ? "جاري التحديث..." : "تحديث المعلومات الشخصية"}
                        </Button>
                      </CardFooter>
                    </form>
                  </Form>
                </Card>
              </TabsContent>

              <TabsContent value="email">
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      تغيير البريد الإلكتروني
                    </CardTitle>
                    <CardDescription>قم بتحديث عنوان البريد الإلكتروني المرتبط بحسابك</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleUpdateEmail}>
                    <CardContent className="space-y-4">
                      <Alert>
                        <InfoIcon className="h-4 w-4" />
                        <AlertTitle>هام</AlertTitle>
                        <AlertDescription>
                          سيتم إرسال رابط تأكيد إلى البريد الإلكتروني الجديد. يجب النقر على الرابط لتأكيد التغيير.
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-2">
                        <label htmlFor="current-email" className="block text-sm font-medium">
                          البريد الإلكتروني الحالي
                        </label>
                        <Input
                          id="current-email"
                          value={user.email}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="new-email" className="block text-sm font-medium">
                          البريد الإلكتروني الجديد
                        </label>
                        <Input
                          id="new-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="أدخل البريد الإلكتروني الجديد"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="current-password-email" className="block text-sm font-medium">
                          كلمة المرور الحالية
                        </label>
                        <Input
                          id="current-password-email"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="أدخل كلمة المرور الحالية للتأكيد"
                          required
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-gray-50 flex justify-end">
                      <Button type="submit" disabled={emailLoading}>
                        {emailLoading ? "جاري التحديث..." : "تحديث البريد الإلكتروني"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>

              <TabsContent value="password">
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      تغيير كلمة المرور
                    </CardTitle>
                    <CardDescription>قم بتحديث كلمة المرور لحسابك</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleUpdatePassword}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="current-password" className="block text-sm font-medium">
                          كلمة المرور الحالية
                        </label>
                        <Input
                          id="current-password"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="أدخل كلمة المرور الحالية"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="new-password" className="block text-sm font-medium">
                          كلمة المرور الجديدة
                        </label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="أدخل كلمة المرور الجديدة"
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          يجب أن تكون كلمة المرور على الأقل 6 أحرف
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="confirm-password" className="block text-sm font-medium">
                          تأكيد كلمة المرور الجديدة
                        </label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="أدخل كلمة المرور الجديدة مرة أخرى"
                          required
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-gray-50 flex justify-end">
                      <Button type="submit" disabled={passwordLoading}>
                        {passwordLoading ? "جاري التحديث..." : "تحديث كلمة المرور"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          <Card className="shadow-md mt-4">
            <CardContent className="p-4 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">هل تريد تسجيل الخروج من حسابك؟</p>
              <Button
                variant="outline"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                تسجيل الخروج
              </Button>
            </CardContent>
          </Card>

          {showOwnerForm && (
            <div className="mb-10 mt-10">
              <CreateOwnerForm />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
