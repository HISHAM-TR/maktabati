
import React, { useState } from "react";
import { Shield, User, Mail, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const CreateOwnerForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "مدير النظام",
    email: "abouelfida2@gmail.com",
    password: "Hichem1989*",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // استخدام دالة invoke لاستدعاء Edge Function مباشرة
      const { data, error } = await supabase.functions.invoke('create-owner', {
        body: { 
          email: formData.email, 
          password: formData.password, 
          name: formData.name 
        }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || "فشل إنشاء حساب المالك");

      setSuccess("تم إنشاء حساب المالك بنجاح!");
      toast.success("تم إنشاء حساب المالك بنجاح!");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "حدث خطأ أثناء إنشاء حساب المالك");
      toast.error("فشل إنشاء حساب المالك: " + (err.message || "حدث خطأ غير معروف"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <CardTitle>إنشاء حساب المالك</CardTitle>
        </div>
        <CardDescription>
          أدخل بيانات حساب مالك النظام الذي سيملك كامل الصلاحيات على المنصة
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>خطأ</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-50 border-green-500">
            <AlertTitle className="text-green-700">تم بنجاح</AlertTitle>
            <AlertDescription className="text-green-700">
              {success}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="name">
              الاسم
            </label>
            <div className="relative">
              <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="أدخل اسم المالك"
                required
                className="pr-10"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="أدخل البريد الإلكتروني"
                required
                className="pr-10"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">
              كلمة المرور
            </label>
            <div className="relative">
              <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="أدخل كلمة المرور"
                required
                className="pr-10"
                disabled={loading}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin ml-2" /> جاري الإنشاء...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 ml-2" /> إنشاء حساب المالك
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        سيتم تعيين هذا المستخدم كمالك للنظام مع كامل الصلاحيات
      </CardFooter>
    </Card>
  );
};

export default CreateOwnerForm;
