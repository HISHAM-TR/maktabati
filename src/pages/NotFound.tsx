
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = "الصفحة غير موجودة | نظام إدارة المكتبات";
    
    console.error(
      "خطأ 404: حاول المستخدم الوصول إلى مسار غير موجود:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen font-cairo" dir="rtl">
      <Header />
      
      <main className="flex-1 flex items-center justify-center pt-24 pb-16">
        <div className="container max-w-md mx-auto px-4 text-center animate-fade-in">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-12 w-12 text-primary" />
          </div>
          
          <h1 className="text-5xl font-bold mb-4">404</h1>
          <h2 className="text-3xl font-semibold mb-2">الصفحة غير موجودة</h2>
          <p className="text-muted-foreground mb-8 text-xl">
            الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
          </p>
          
          <Link to="/">
            <Button className="mx-auto text-lg py-6 px-8">
              <ArrowLeft className="h-5 w-5 ml-2" />
              العودة إلى الصفحة الرئيسية
            </Button>
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
