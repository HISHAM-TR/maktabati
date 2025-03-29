
import { Book } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const TermsOfService = () => {
  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Header />
      
      <main className="container mx-auto px-4 py-20 flex-1">
        <div className="max-w-3xl mx-auto bg-card rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-center mb-6">
            <Book className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-3xl font-bold">شروط الخدمة</h1>
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-6">آخر تحديث: {new Date().toLocaleDateString('ar-SA')}</p>
            
            <h2 className="text-xl font-semibold mb-4">1. مقدمة</h2>
            <p className="mb-4">
              مرحبًا بك في نظام إدارة المكتبات. تحدد شروط الخدمة هذه القواعد والتنظيمات لاستخدام موقع نظام إدارة المكتبات.
            </p>
            <p className="mb-4">
              من خلال الوصول إلى هذا الموقع، نفترض أنك تقبل شروط الخدمة هذه بالكامل. لا تستمر في استخدام نظام إدارة المكتبات إذا كنت لا توافق على جميع الشروط المذكورة في هذه الصفحة.
            </p>
            
            <h2 className="text-xl font-semibold mb-4">2. ترخيص الاستخدام</h2>
            <p className="mb-4">
              ما لم يُذكر خلاف ذلك، فإن نظام إدارة المكتبات و/أو المرخصين له يمتلكون حقوق الملكية الفكرية لجميع المواد الموجودة على نظام إدارة المكتبات. جميع حقوق الملكية الفكرية محفوظة.
            </p>
            <p className="mb-4">
              يُمكنك الوصول إلى محتوى نظام إدارة المكتبات للاستخدام الشخصي الخاص بك، مع مراعاة القيود المنصوص عليها في شروط الخدمة هذه.
            </p>
            
            <h2 className="text-xl font-semibold mb-4">3. القيود</h2>
            <p className="mb-4">لا يجوز لك:</p>
            <ul className="list-disc mr-8 mb-4 space-y-2">
              <li>إعادة نشر المواد من نظام إدارة المكتبات</li>
              <li>بيع أو تأجير أو الترخيص من الباطن للمواد من نظام إدارة المكتبات</li>
              <li>نسخ المواد من نظام إدارة المكتبات</li>
              <li>إعادة توزيع المحتوى من نظام إدارة المكتبات</li>
            </ul>
            
            <h2 className="text-xl font-semibold mb-4">4. حسابك</h2>
            <p className="mb-4">
              إذا كنت تستخدم حسابًا على خدمتنا، فأنت مسؤول عن الحفاظ على أمان حسابك، وأنت مسؤول بالكامل عن جميع الأنشطة التي تحدث تحت حسابك وأي إجراءات أخرى يتم اتخاذها فيما يتعلق بحسابك.
            </p>
            
            <h2 className="text-xl font-semibold mb-4">5. إلغاء الخدمة</h2>
            <p className="mb-4">
              نحتفظ بالحق في إنهاء أو تعليق حسابك وإمكانية الوصول إلى الخدمة على الفور، دون إشعار مسبق أو مسؤولية، لأي سبب مهما كان، بما في ذلك على سبيل المثال لا الحصر إذا قمت بانتهاك شروط الخدمة.
            </p>
            
            <h2 className="text-xl font-semibold mb-4">6. التعديل على الشروط</h2>
            <p className="mb-4">
              نحتفظ بالحق في تعديل هذه الشروط من وقت لآخر حسب تقديرنا، وبالتالي عليك مراجعتها بشكل دوري. سيتم اعتبار استمرار استخدامك للخدمة بعد نشر التعديلات على شروط الخدمة بمثابة موافقة على التغييرات.
            </p>
            
            <div className="mt-8">
              <p className="text-muted-foreground">
                إذا كانت لديك أي أسئلة حول شروط الخدمة هذه، يرجى 
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

export default TermsOfService;
