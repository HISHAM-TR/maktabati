
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, Lock, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ForgotPasswordDialog from "@/components/auth/ForgotPasswordDialog";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { signIn, fetchCurrentUser, createDefaultOwner } from "@/lib/supabase-utils";
import { useAuth } from "@/App";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "البريد الإلكتروني مطلوب" })
    .email({ message: "البريد الإلكتروني غير صحيح" }),
  password: z
    .string()
    .min(6, { message: "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل" }),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  // التحقق من تسجيل الدخول عند تحميل الصفحة
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await fetchCurrentUser();
        if (user) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };
    
    checkAuth();
    
    // Try to create the default owner account
    const setupDefaultOwner = async () => {
      try {
        await createDefaultOwner();
      } catch (error) {
        console.error("Error creating default owner:", error);
      }
    };
    
    setupDefaultOwner();
  }, [navigate]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setError(null);

    try {
      // Show a tip for the default admin account
      if (values.email.toLowerCase() !== "admin@admin.com") {
        toast.info("يمكنك استخدام حساب المدير الافتراضي: admin@admin.com / 123456");
      }
      
      // Try to sign in with Supabase
      await signIn(values.email, values.password);
      
      // Update login state 
      await login(values.email, values.password);
      
      toast.success("تم تسجيل الدخول بنجاح");
      navigate("/dashboard");
    } catch (error: any) {
      const errorMessage = error.message || "فشل تسجيل الدخول";
      setError(errorMessage);
      toast.error("فشل تسجيل الدخول: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Header />

      <main className="flex-1 flex items-center justify-center py-24 px-4">
        <div className="max-w-md w-full">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">تسجيل الدخول</CardTitle>
              <CardDescription className="text-center">
                أدخل بياناتك لتسجيل الدخول إلى حسابك
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTitle>خطأ</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                              placeholder="أدخل بريدك الإلكتروني"
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
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>كلمة المرور</FormLabel>
                          <Button
                            variant="link"
                            className="p-0 h-auto text-sm"
                            type="button"
                            onClick={() => setIsForgotPasswordOpen(true)}
                          >
                            نسيت كلمة المرور؟
                          </Button>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="أدخل كلمة المرور"
                              type="password"
                              className="pl-3 pr-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full text-lg py-6"
                    disabled={loading}
                  >
                    {loading ? (
                      "جاري تسجيل الدخول..."
                    ) : (
                      <>
                        <LogIn className="ml-2 h-5 w-5" />
                        تسجيل الدخول
                      </>
                    )}
                  </Button>
                </form>
              </Form>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-700">
                  للدخول كمشرف، استخدم الحساب التالي:
                  <br />
                  البريد الإلكتروني: <strong>admin@admin.com</strong>
                  <br />
                  كلمة المرور: <strong>123456</strong>
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm">
                ليس لديك حساب؟{" "}
                <Link
                  to="/register"
                  className="text-primary hover:underline font-medium"
                >
                  إنشاء حساب جديد
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>

      <Footer />

      <ForgotPasswordDialog
        isOpen={isForgotPasswordOpen}
        setIsOpen={setIsForgotPasswordOpen}
      />
    </div>
  );
};

export default Login;
