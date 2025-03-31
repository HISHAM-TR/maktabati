
import React, { useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, Info } from "lucide-react";

const Privacy = () => {
  useEffect(() => {
    document.title = "سياسة الخصوصية | نظام إدارة المكتبات";
  }, []);

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h1 className="text-3xl font-bold mb-2">سياسة الخصوصية</h1>
              <p className="text-muted-foreground">
                آخر تحديث: {new Date().toLocaleDateString('ar-EG')}
              </p>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl">مقدمة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  نحن في نظام إدارة المكتبات نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح سياسة الخصوصية هذه كيفية جمع واستخدام ومعالجة وحماية بياناتك عند استخدام موقعنا وخدماتنا.
                </p>
                <p>
                  يرجى قراءة سياسة الخصوصية هذه بعناية لفهم كيفية تعاملنا مع بياناتك.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <Info className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl">البيانات التي نجمعها</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>قد نجمع الأنواع التالية من البيانات:</p>
                <ul className="list-disc list-inside space-y-2 pr-4">
                  <li>
                    <strong>معلومات الحساب:</strong> عند التسجيل، نجمع اسمك وبريدك الإلكتروني وكلمة المرور.
                  </li>
                  <li>
                    <strong>بيانات الملف الشخصي:</strong> قد تختار تقديم معلومات إضافية مثل البلد ورقم الهاتف وصورة الملف الشخصي.
                  </li>
                  <li>
                    <strong>محتوى المكتبة:</strong> المعلومات المتعلقة بالمكتبات والكتب التي تضيفها أو تديرها.
                  </li>
                  <li>
                    <strong>بيانات الاستخدام:</strong> معلومات حول كيفية استخدامك للموقع ووقت الوصول وصفحات الزيارة.
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <Lock className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl">كيف نستخدم بياناتك</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>نستخدم بياناتك للأغراض التالية:</p>
                <ul className="list-disc list-inside space-y-2 pr-4">
                  <li>
                    توفير وإدارة وتحسين خدماتنا.
                  </li>
                  <li>
                    تسهيل إنشاء وإدارة حسابك ومكتباتك.
                  </li>
                  <li>
                    التواصل معك بشأن الخدمات والتحديثات والإشعارات.
                  </li>
                  <li>
                    تحليل كيفية استخدام المستخدمين للموقع لتحسين تجربة المستخدم.
                  </li>
                  <li>
                    ضمان أمان وسلامة خدماتنا.
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <Eye className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl">حقوقك وخياراتك</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  لديك حقوق معينة فيما يتعلق ببياناتك الشخصية، بما في ذلك:
                </p>
                <ul className="list-disc list-inside space-y-2 pr-4">
                  <li>
                    الوصول إلى بياناتك الشخصية.
                  </li>
                  <li>
                    تصحيح بياناتك غير الدقيقة.
                  </li>
                  <li>
                    حذف بياناتك في ظروف معينة.
                  </li>
                  <li>
                    الاعتراض على معالجة بياناتك.
                  </li>
                  <li>
                    طلب تقييد معالجة بياناتك.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
