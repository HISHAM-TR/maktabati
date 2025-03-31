
import React, { useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Check, BookText } from "lucide-react";

const Terms = () => {
  useEffect(() => {
    document.title = "شروط الخدمة | نظام إدارة المكتبات";
  }, []);

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 text-center">
              <BookText className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h1 className="text-3xl font-bold mb-2">شروط الخدمة</h1>
              <p className="text-muted-foreground">
                آخر تحديث: {new Date().toLocaleDateString('ar-EG')}
              </p>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl">1. قبول الشروط</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  باستخدامك لنظام إدارة المكتبات، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على هذه الشروط، يرجى التوقف عن استخدام الموقع والخدمات فورًا.
                </p>
                <p>
                  نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم نشر التغييرات على هذه الصفحة، وستكون سارية المفعول فور نشرها.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl">2. الحسابات والتسجيل</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  عند إنشاء حساب في نظام إدارة المكتبات، يتوجب عليك تقديم معلومات دقيقة وكاملة وحديثة. أنت مسؤول عن الحفاظ على سرية كلمة المرور الخاصة بك وعن جميع الأنشطة التي تحدث تحت حسابك.
                </p>
                <div className="flex items-start p-4 border border-yellow-200 bg-yellow-50 rounded-md">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 ml-2 mt-0.5" />
                  <p className="text-sm text-yellow-700">
                    يجب عليك إبلاغنا فورًا بأي استخدام غير مصرح به لحسابك أو أي خرق أمني آخر.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl">3. استخدام الخدمة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  نظام إدارة المكتبات يسمح للمستخدمين بإنشاء وإدارة مكتبات رقمية لتنظيم وتتبع الكتب. يجب استخدام الخدمة بطريقة تتوافق مع جميع القوانين المعمول بها والأنظمة وسياساتنا.
                </p>
                <p>
                  يحظر استخدام نظام إدارة المكتبات لأي غرض غير قانوني أو محظور بموجب هذه الشروط.
                </p>
                <ul className="list-disc list-inside space-y-2 pr-4">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 ml-2 mt-0.5 shrink-0" />
                    <span>يمكنك إنشاء وإدارة مكتبات متعددة</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 ml-2 mt-0.5 shrink-0" />
                    <span>يمكنك إضافة وتنظيم الكتب وتتبع حالتها</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 ml-2 mt-0.5 shrink-0" />
                    <span>يمكنك البحث في مجموعة الكتب الخاصة بك</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl">4. حقوق الملكية الفكرية</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  جميع الحقوق والملكية والمصلحة في الخدمة وجميع محتوى الخدمة هي ملك حصري لنظام إدارة المكتبات والمرخصين لها. يتم منحك ترخيصًا محدودًا وغير حصري وغير قابل للتحويل لاستخدام الخدمة وفقًا لهذه الشروط.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
