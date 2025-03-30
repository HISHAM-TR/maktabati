
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/App";
import { Book, Mail, Lock, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Try regular login
      try {
        await login(formData.email, formData.password);
        toast.success("تم تسجيل الدخول بنجاح");
        navigate("/dashboard");
      } catch (loginError: any) {
        // If the error is about email confirmation, try to log in using direct authentication
        if (loginError?.message?.includes("Email not confirmed") || loginError?.code === "email_not_confirmed") {
          // Login failed due to email not confirmed, try to sign up a new session
          const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          });
          
          if (signInError) {
            throw signInError;
          }
          
          if (data.user) {
            toast.success("تم تسجيل الدخول بنجاح");
            navigate("/dashboard");
            return;
          }
        }
        
        throw loginError;
      }
    } catch (error) {
      let message = "فشل تسجيل الدخول";
      
      if (error instanceof Error) {
        if (error.message.includes("Invalid login credentials")) {
          message = "بيانات الدخول غير صحيحة";
        } else if (error.message.includes("User not found")) {
          message = "المستخدم غير موجود";
        } else if (error.message.includes("Email not confirmed")) {
          message = "البريد الإلكتروني غير مؤكد. يرجى التحقق من بريدك الإلكتروني أو التواصل مع المسؤول";
        } else {
          message = error.message;
        }
      }
      
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDefaultAdminLogin = () => {
    setFormData({
      email: "admin@admin.com",
      password: "123456"
    });
    toast.info("تم تعبئة بيانات المشرف الافتراضي، انقر على زر تسجيل الدخول الآن");
  };

  const handleResetPassword = async () => {
    if (!resetEmail || !resetEmail.includes('@')) {
      toast.error("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }

    setResetLoading(true);
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      
      setResetEmailSent(true);
      toast.success("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني");
    } catch (error) {
      let message = "فشل إرسال رابط إعادة تعيين كلمة المرور";
      if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary/30 px-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center space-x-reverse space-x-2">
            <Book className="h-8 w-8 text-primary" />
            <span className="font-semibold text-2xl">نظام إدارة المكتبات</span>
          </Link>
        </div>
        
        <Card className="w-full animate-fade-in glass border-0 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">تسجيل الدخول</CardTitle>
            <CardDescription className="text-center">
              أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى حسابك
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="pr-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">كلمة المرور</Label>
                  <Button 
                    type="button"
                    variant="link" 
                    className="text-sm text-primary p-0 h-auto"
                    onClick={() => setForgotPasswordOpen(true)}
                  >
                    نسيت كلمة المرور؟
                  </Button>
                </div>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    className="pr-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري تسجيل الدخول...
                  </div>
                ) : (
                  <>
                    تسجيل الدخول
                    <ArrowRight className="mr-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Button
                variant="outline"
                type="button"
                onClick={handleDefaultAdminLogin}
                className="text-sm"
              >
                تسجيل دخول كمشرف
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              ليس لديك حساب؟{" "}
              <Link to="/register" className="text-primary hover:underline">
                إنشاء حساب جديد
              </Link>
            </div>
          </CardFooter>
        </Card>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <Link to="/" className="hover:underline">
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>

      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">إعادة تعيين كلمة المرور</DialogTitle>
            <DialogDescription className="text-right">
              {!resetEmailSent ? 
                "أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور." : 
                "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد الخاص بك."
              }
            </DialogDescription>
          </DialogHeader>
          
          {!resetEmailSent ? (
            <>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-right block">البريد الإلكتروني</Label>
                  <Input 
                    id="reset-email" 
                    type="email" 
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="text-right"
                  />
                </div>
              </div>
              <DialogFooter className="sm:justify-start flex-row-reverse">
                <Button 
                  type="submit" 
                  onClick={handleResetPassword}
                  disabled={resetLoading}
                >
                  {resetLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري الإرسال...
                    </div>
                  ) : "إرسال رابط إعادة التعيين"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setForgotPasswordOpen(false)}>
                  إلغاء
                </Button>
              </DialogFooter>
            </>
          ) : (
            <DialogFooter className="sm:justify-start flex-row-reverse">
              <Button type="button" onClick={() => {
                setForgotPasswordOpen(false);
                setResetEmailSent(false);
                setResetEmail("");
              }}>
                إغلاق
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
