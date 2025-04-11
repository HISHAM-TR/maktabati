import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CreateOwnerForm from "@/components/admin/CreateOwnerForm";
import { useAuth } from "@/App";
import { createDefaultOwner, fetchCurrentUser, updateUserProfile, signIn } from "@/lib/supabase-utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { InfoIcon, Edit, User, Mail, Key, Shield, Phone, MapPin, LogOut, Save, AlertTriangle, Upload, Lock, UserCog } from "lucide-react";
import CountrySelect from "@/components/ui/CountrySelect";
import PhoneInput from "@/components/ui/PhoneInput";
import "@/components/ui/phone-input.css";
import { E164Number } from "libphonenumber-js";
import { Controller } from "react-hook-form";
import { useForm } from "react-hook-form";
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
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [showOwnerForm, setShowOwnerForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // استخدام نموذج React Hook Form مع مخطط التحقق
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      country: user?.country || "SA",
      phoneNumber: user?.phoneNumber || "",
    },
  });

  // تحديث بيانات المستخدم عند تغيير المستخدم
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
        country: user.country || "SA",
        phoneNumber: user.phone || "",
      });
    }
  }, [user, form]);

  // معالجة تحديث الملف الشخصي
  const handleUpdateProfile = async (data) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await updateUserProfile(user.id, {
        name: data.name,
        country: data.country,
        phone: data.phoneNumber,
      });

      if (error) throw error;
      
      // تحديث بيانات المستخدم في الحالة
      const updatedUser = await fetchCurrentUser();
      if (updatedUser) {
        setUser(updatedUser);
        toast.success("تم تحديث الملف الشخصي بنجاح");
      }
    } catch (error) {
      console.error("خطأ في تحديث الملف الشخصي:", error);
      toast.error("حدث خطأ أثناء تحديث الملف الشخصي");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 bg-[url('/islamic-pattern-light.svg')] bg-repeat bg-opacity-5 dark:bg-[url('/islamic-pattern.svg')] dark:bg-opacity-5">
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
            className="text-3xl font-bold mb-10 text-right relative pr-2 andalusian-title"
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
            <Tabs defaultValue="account" className="w-full andalusian-border">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-background/80 p-1 rounded-lg shadow-sm border border-andalusian-border">
                <TabsTrigger value="account" className="text-base font-medium data-[state=active]:bg-muted data-[state=active]:text-primary">
                  <UserCog className="h-4 w-4 ml-2" />
                  معلومات الحساب
                </TabsTrigger>
                <TabsTrigger value="security" className="text-base font-medium data-[state=active]:bg-muted data-[state=active]:text-primary">
                  <Lock className="h-4 w-4 ml-2" />
                  الأمان والخصوصية
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
                  <Card className="shadow-lg border border-andalusian-border overflow-hidden rounded-xl bg-background andalusian-card">
                    <CardHeader className="bg-muted/10 border-b border-andalusian-border">
                      <CardTitle className="text-xl font-bold andalusian-title">المعلومات الشخصية</CardTitle>
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
                            <p className="font-semibold">{user?.name || "المستخدم"}</p>
                          </div>

                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                  <User className="h-4 w-4" />
                                  الاسم الكامل
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="أدخل اسمك الكامل" 
                                    {...field} 
                                    className="focus-visible:ring-primary focus-visible:ring-offset-1 transition-all duration-200 border-muted/50"
                                  />
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
                                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                  <MapPin className="h-4 w-4" />
                                  الدولة
                                </FormLabel>
                                <FormControl>
                                  <CountrySelect 
                                    value={field.value} 
                                    onValueChange={field.onChange}
                                  />
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
                                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                  <Phone className="h-4 w-4" />
                                  رقم الهاتف
                                </FormLabel>
                                <FormControl>
                                  <Controller
                                    name="phoneNumber"
                                    control={form.control}
                                    render={({ field }) => (
                                      <PhoneInput
                                        defaultCountry="SA"
                                        placeholder="أدخل رقم الهاتف"
                                        value={field.value}
                                        onChange={(value) => field.onChange(value)}
                                        className="focus-visible:ring-primary focus-visible:ring-offset-1 transition-all duration-200 border-muted/50"
                                      />
                                    )}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                        <CardFooter className="border-t border-andalusian-border bg-muted/10 flex justify-end">
                          <Button type="submit" disabled={isLoading} className="andalusian-button">
                            {isLoading ? "جاري التحديث..." : "حفظ التغييرات"}
                          </Button>
                        </CardFooter>
                      </form>
                    </Form>
                  </Card>

                  {/* بطاقة معلومات الحساب */}
                  <Card className="shadow-lg border border-andalusian-border overflow-hidden rounded-xl bg-background andalusian-card">
                    <CardHeader className="bg-muted/10 border-b border-andalusian-border">
                      <CardTitle className="text-xl font-bold andalusian-title">معلومات الحساب</CardTitle>
                      <CardDescription className="text-muted-foreground mt-1">تفاصيل حسابك ومعلومات العضوية</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg border border-muted/50 bg-muted/10">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <Mail className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">البريد الإلكتروني</p>
                            <p className="text-sm text-muted-foreground">{user?.email || "لا يوجد بريد إلكتروني"}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 rounded-lg border border-muted/50 bg-muted/10">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <Shield className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">نوع الحساب</p>
                            <p className="text-sm text-muted-foreground">{user?.role === "admin" ? "مدير" : "مستخدم"}</p>
                          </div>
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
                  <Card className="shadow-lg border border-andalusian-border overflow-hidden rounded-xl bg-background andalusian-card">
                    <CardHeader className="bg-muted/10 border-b border-andalusian-border pb-3">
                      <CardTitle className="text-lg font-bold andalusian-title">البريد الإلكتروني</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <Alert className="bg-muted/30 border-muted/50">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>تغيير البريد الإلكتروني</AlertTitle>
                        <AlertDescription>
                          لتغيير البريد الإلكتروني، يرجى التواصل مع إدارة الموقع.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>

                  {/* بطاقة تغيير كلمة المرور */}
                  <Card className="shadow-lg border border-andalusian-border overflow-hidden rounded-xl bg-background andalusian-card">
                    <CardHeader className="bg-muted/10 border-b border-andalusian-border pb-3">
                      <CardTitle className="text-lg font-bold andalusian-title">كلمة المرور</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <Alert className="bg-muted/30 border-muted/50">
                        <Key className="h-4 w-4" />
                        <AlertTitle>تغيير كلمة المرور</AlertTitle>
                        <AlertDescription>
                          لتغيير كلمة المرور، يرجى استخدام خيار "نسيت كلمة المرور" في صفحة تسجيل الدخول.
                        </AlertDescription>
                      </Alert>
                      <Button 
                        variant="outline" 
                        className="w-full border-destructive/30 text-destructive hover:bg-destructive/10"
                        onClick={async () => {
                          try {
                            await supabase.auth.signOut();
                            // استخدام وظيفة تسجيل الخروج المحلية أيضًا
                            localStorage.removeItem('currentUser');
                            setUser(null);
                            navigate("/auth/login");
                            toast.success("تم تسجيل الخروج بنجاح");
                          } catch (error) {
                            console.error("خطأ في تسجيل الخروج:", error);
                            toast.error("حدث خطأ أثناء تسجيل الخروج");
                          }
                        }}
                      >
                        <LogOut className="h-4 w-4 ml-2" />
                        تسجيل الخروج
                      </Button>
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

      <Footer className="andalusian-footer" />
    </>
  );
};

export default Profile;
