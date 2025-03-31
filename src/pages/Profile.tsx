
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
import { fetchCurrentUser } from "@/lib/supabase-utils";

const Profile = () => {
  const { user, updateUserInfo, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOwnerForm, setShowOwnerForm] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
    } else {
      navigate("/login");
    }

    // التحقق من وجود مستخدم مالك
    const checkOwner = async () => {
      try {
        // افترض أن المستخدم المالك غير موجود
        setShowOwnerForm(true);
      } catch (error) {
        console.error("Error checking for owner:", error);
      }
    };

    checkOwner();
  }, [user, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      if (name !== user.name) {
        const updatedUser = { ...user, name };
        updateUserInfo(updatedUser);
        toast.success("تم تحديث الملف الشخصي بنجاح");
      }
    } catch (error: any) {
      toast.error("فشل تحديث الملف الشخصي: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Header />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">الملف الشخصي</h1>

          {user && (
            <Card className="shadow-md mb-8">
              <CardHeader>
                <CardTitle>معلومات الحساب</CardTitle>
                <CardDescription>إدارة معلومات حسابك الشخصي</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium">
                      البريد الإلكتروني
                    </label>
                    <Input
                      id="email"
                      value={user.email}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-muted-foreground">
                      لا يمكن تغيير البريد الإلكتروني المرتبط بحسابك
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium">
                      الاسم
                    </label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>

                  <div className="pt-2">
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? "جاري التحديث..." : "تحديث الملف الشخصي"}
                    </Button>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="border-t bg-gray-50 flex justify-between">
                <p className="text-sm text-muted-foreground">
                  آخر تسجيل دخول:{" "}
                  {user.lastLogin || new Date().toLocaleDateString()}
                </p>
                <Button
                  variant="ghost"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  تسجيل الخروج
                </Button>
              </CardFooter>
            </Card>
          )}

          {showOwnerForm && (
            <div className="mb-10">
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
