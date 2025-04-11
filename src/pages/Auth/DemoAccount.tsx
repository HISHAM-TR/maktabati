import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { createDemoAccount } from "@/lib/demo-account-utils";
import { useAuth } from "@/App";

const DemoAccount = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateDemoAccount = async () => {
    setLoading(true);
    setError(null);

    try {
      // إنشاء حساب تجريبي
      const demoUser = await createDemoAccount();
      
      // تسجيل الدخول بالحساب التجريبي
      await login(demoUser.email, "demo12345");
      
      toast.success("تم إنشاء حساب تجريبي بنجاح");
      navigate("/dashboard");
    } catch (error: any) {
      setError(error.message || "حدث خطأ أثناء إنشاء الحساب التجريبي");
      toast.error("فشل إنشاء الحساب التجريبي");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">حساب تجريبي</CardTitle>
              <CardDescription>
                يمكنك إنشاء حساب تجريبي للتعرف على النظام دون الحاجة للتسجيل
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  سيتم إنشاء حساب تجريبي مع بيانات افتراضية ومكتبة تحتوي على بعض الكتب للتجربة.
                </p>
                <p className="text-sm text-muted-foreground">
                  بيانات الحساب التجريبي:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>البريد الإلكتروني: demo@maktabati.com</li>
                  <li>كلمة المرور: demo12345</li>
                  <li>الاسم: مستخدم تجريبي</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleCreateDemoAccount}
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري إنشاء الحساب...
                  </>
                ) : (
                  "إنشاء حساب تجريبي"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DemoAccount;