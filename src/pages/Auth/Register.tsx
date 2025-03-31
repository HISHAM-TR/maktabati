
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, Lock, User, UserPlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/App";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PasswordStrengthMeter from "@/components/ui/password-strength";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

const formSchema = z.object({
  name: z.string().min(3, { message: "الاسم يجب أن يحتوي على 3 أحرف على الأقل" }),
  email: z
    .string()
    .min(1, { message: "البريد الإلكتروني مطلوب" })
    .email({ message: "البريد الإلكتروني غير صحيح" }),
  password: z
    .string()
    .min(8, { message: "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل" })
    .regex(/[A-Z]/, { message: "يجب أن تحتوي على حرف كبير واحد على الأقل" })
    .regex(/[a-z]/, { message: "يجب أن تحتوي على حرف صغير واحد على الأقل" })
    .regex(/\d/, { message: "يجب أن تحتوي على رقم واحد على الأقل" })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "يجب أن تحتوي على رمز خاص واحد على الأقل" }),
  terms: z.boolean().refine(val => val === true, {
    message: "يجب الموافقة على شروط الخدمة للمتابعة",
  }),
});

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      terms: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setError(null);

    try {
      await register(values.name, values.email, values.password);
      toast.success("تم إنشاء الحساب بنجاح");
      navigate("/dashboard");
    } catch (error) {
      setError((error as Error).message);
      toast.error("فشل إنشاء الحساب: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const password = form.watch("password");

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Header />

      <main className="flex-1 flex items-center justify-center py-24 px-4">
        <div className="max-w-md w-full">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">إنشاء حساب جديد</CardTitle>
              <CardDescription className="text-center">
                أدخل بياناتك لإنشاء حساب جديد
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
                              type="password"
                              className="pl-3 pr-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <PasswordStrengthMeter password={password} className="mt-2" />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-reverse space-x-3 space-y-0 rounded-md p-4 border">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            أوافق على{" "}
                            <Link
                              to="/terms"
                              className="text-primary hover:underline"
                              target="_blank"
                            >
                              شروط الخدمة
                            </Link>{" "}
                            و{" "}
                            <Link
                              to="/privacy"
                              className="text-primary hover:underline"
                              target="_blank"
                            >
                              سياسة الخصوصية
                            </Link>
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
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
              <div className="flex items-center justify-center space-x-reverse space-x-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-muted-foreground">
                  أو سجل الدخول باستخدام حساب جوجل
                </span>
              </div>
              <Button variant="outline" className="w-full relative">
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google"
                  className="h-5 w-5 absolute right-3"
                />
                المتابعة باستخدام جوجل
              </Button>
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
