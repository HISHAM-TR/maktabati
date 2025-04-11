
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, Lock, User, UserPlus, Phone, MapPin, Eye, EyeOff, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { signUp, fetchCurrentUser } from "@/lib/supabase-utils";
import { useAuth } from "@/App";
import CountrySelect from "@/components/ui/CountrySelect";
import PhoneInput from "@/components/ui/PhoneInput";
import "@/components/ui/phone-input.css";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "الاسم يجب أن يحتوي على حرفين على الأقل" }),
  email: z
    .string()
    .min(1, { message: "البريد الإلكتروني مطلوب" })
    .email({ message: "البريد الإلكتروني غير صحيح" }),
  password: z
    .string()
    .min(6, { message: "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل" }),
  confirmPassword: z
    .string()
    .min(6, { message: "تأكيد كلمة المرور مطلوب" }),
  phoneNumber: z
    .string()
    .optional(),
  country: z
    .string()
    .min(2, { message: "يرجى اختيار الدولة" })
});

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordChecks, setPasswordChecks] = useState({
    hasLowerCase: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSymbol: false
  });

  // التحقق من تسجيل الدخول عند تحميل الصفحة
  useEffect(() => {
    const checkAuth = async () => {
      const user = await fetchCurrentUser();
      if (user) {
        navigate("/dashboard");
      }
    };
    
    checkAuth();
  }, [navigate]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(
      formSchema.refine(
        (data) => data.password === data.confirmPassword,
        {
          message: "كلمات المرور غير متطابقة",
          path: ["confirmPassword"],
        }
      )
    ),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      country: "SA",
    },
  });

  // دالة لتقييم قوة كلمة المرور
  const evaluatePasswordStrength = (password: string) => {
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    const checks = { hasLowerCase, hasUpperCase, hasNumber, hasSymbol };
    setPasswordChecks(checks);
    
    // حساب قوة كلمة المرور (0-100)
    const strength = Object.values(checks).filter(Boolean).length * 25;
    setPasswordStrength(strength);
    
    return strength;
  };
  
  // معالج تغيير كلمة المرور
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    evaluatePasswordStrength(newPassword);
    form.setValue("password", newPassword);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setError(null);

    try {
      const { user } = await signUp(values.email, values.password, { 
        name: values.name,
        country: values.country,
        phoneNumber: values.phoneNumber
      });
      
      if (user) {
        // Temporarily disabled local storage registration
        // await register(values.name, values.email, values.password, {
        //   country: values.country,
        //   phoneNumber: values.phoneNumber
        // });
        toast.success("تم إنشاء الحساب بنجاح");
        navigate("/dashboard");
      } else {
        throw new Error("فشل إنشاء الحساب");
      }
    } catch (error: any) {
      const errorMessage = error.message || "فشل إنشاء الحساب";
      setError(errorMessage);
      toast.error("فشل إنشاء الحساب: " + errorMessage);
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
              <CardTitle className="text-2xl text-center">إنشاء حساب جديد</CardTitle>
              <CardDescription className="text-center">
                أدخل بياناتك لإنشاء حساب جديد في المنصة
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
                        <FormLabel>كلمة المرور</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="أدخل كلمة المرور"
                              type={showPassword ? "text" : "password"}
                              className="pl-10 pr-10"
                              value={password}
                              onChange={handlePasswordChange}
                              onBlur={field.onBlur}
                              name={field.name}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute left-0 top-0 h-full px-3"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </FormControl>
                        <div className="mt-2">
                          <Progress value={passwordStrength} className="h-2 mb-2" />
                          <div className="text-xs flex flex-wrap gap-2 mt-1">
                            <div className={`flex items-center gap-1 ${passwordChecks.hasLowerCase ? 'text-green-600' : 'text-gray-400'}`}>
                              {passwordChecks.hasLowerCase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                              <span>حرف صغير</span>
                            </div>
                            <div className={`flex items-center gap-1 ${passwordChecks.hasUpperCase ? 'text-green-600' : 'text-gray-400'}`}>
                              {passwordChecks.hasUpperCase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                              <span>حرف كبير</span>
                            </div>
                            <div className={`flex items-center gap-1 ${passwordChecks.hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
                              {passwordChecks.hasNumber ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                              <span>رقم</span>
                            </div>
                            <div className={`flex items-center gap-1 ${passwordChecks.hasSymbol ? 'text-green-600' : 'text-gray-400'}`}>
                              {passwordChecks.hasSymbol ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                              <span>رمز</span>
                            </div>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>تأكيد كلمة المرور</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="أعد إدخال كلمة المرور"
                              type={showConfirmPassword ? "text" : "password"}
                              className="pl-10 pr-10"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute left-0 top-0 h-full px-3"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
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

                  <PhoneInput
                    control={form.control}
                    name="phoneNumber"
                    label="رقم الهاتف"
                    placeholder="أدخل رقم الهاتف"
                    defaultCountry="SA"
                  />

                  <Button
                    type="submit"
                    className="w-full text-lg py-6"
                    disabled={loading}
                  >
                    {loading ? (
                      "جاري إنشاء الحساب..."
                    ) : (
                      <>
                        <UserPlus className="ml-2 h-5 w-5" />
                        إنشاء حساب
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm">
                لديك حساب بالفعل؟{" "}
                <Link
                  to="/login"
                  className="text-primary hover:underline font-medium"
                >
                  تسجيل الدخول
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
