
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Header />
      
      <main className="container mx-auto px-4 py-20 flex-1">
        <div className="max-w-3xl mx-auto bg-card rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-3xl font-bold">سياسة الخصوصية</h1>
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-6">آخر تحديث: {new Date().toLocaleDateString('ar-SA')}</p>
            
            <h2 className="text-xl font-semibold mb-4">1. المقدمة</h2>
            <p className="mb-4">
              نحن في نظام إدارة المكتبات نقدر خصوصيتك وملتزمون بحماية بياناتك الشخصية. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتك عند استخدام خدماتنا.
            </p>
            
            <h2 className="text-xl font-semibold mb-4">2. المعلومات التي نجمعها</h2>
            <p className="mb-4">قد نجمع المعلومات التالية:</p>
            <ul className="list-disc mr-8 mb-4 space-y-2">
              <li>معلومات شخصية مثل الاسم والبريد الإلكتروني ورقم الهاتف</li>
              <li>معلومات تسجيل الدخول وبيانات الاعتماد</li>
              <li>معلومات عن استخدامك للموقع</li>
              <li>معلومات تقنية مثل عنوان IP ونوع المتصفح</li>
              <li>أي معلومات أخرى تزودنا بها طواعية</li>
            </ul>
            
            <h2 className="text-xl font-semibold mb-4">3. كيف نستخدم معلوماتك</h2>
            <p className="mb-4">نستخدم المعلومات التي نجمعها للأغراض التالية:</p>
            <ul className="list-disc mr-8 mb-4 space-y-2">
              <li>توفير وإدارة وتحسين خدماتنا</li>
              <li>التواصل معك بشأن حسابك والمعاملات والتحديثات</li>
              <li>تخصيص وتحسين تجربة المستخدم</li>
              <li>تحليل كيفية استخدام المستخدمين لخدماتنا</li>
              <li>الامتثال للالتزامات القانونية</li>
            </ul>
            
            <h2 className="text-xl font-semibold mb-4">4. حماية البيانات</h2>
            <p className="mb-4">
              نحن نتخذ تدابير أمنية معقولة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو الإفصاح أو التعديل أو التدمير. ومع ذلك، لا يمكن ضمان أمان أي عملية نقل أو تخزين إلكتروني بنسبة 100٪.
            </p>
            
            <h2 className="text-xl font-semibold mb-4">5. مشاركة المعلومات</h2>
            <p className="mb-4">
              لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة. قد نشارك معلوماتك في الظروف التالية:
            </p>
            <ul className="list-disc mr-8 mb-4 space-y-2">
              <li>مع مقدمي الخدمات الذين يساعدوننا في تشغيل موقعنا وتقديم خدماتنا</li>
              <li>عندما يكون ذلك مطلوبًا قانونًا</li>
              <li>لحماية حقوقنا أو ممتلكاتنا</li>
            </ul>
            
            <h2 className="text-xl font-semibold mb-4">6. حقوقك</h2>
            <p className="mb-4">
              لديك الحق في الوصول إلى معلوماتك الشخصية التي نحتفظ بها وتصحيحها وحذفها. كما يمكنك الاعتراض على معالجة بياناتك وطلب تقييد استخدامها.
            </p>
            
            <h2 className="text-xl font-semibold mb-4">7. التغييرات على سياسة الخصوصية</h2>
            <p className="mb-4">
              قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنخطرك بأي تغييرات جوهرية عن طريق نشر الإصدار الجديد على موقعنا.
            </p>
            
            <div className="mt-8">
              <p className="text-muted-foreground">
                إذا كانت لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى 
                <Link to="/contact" className="text-primary hover:underline mr-1 ml-1">الاتصال بنا</Link>.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
