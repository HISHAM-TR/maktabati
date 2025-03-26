
import { Link } from "react-router-dom";
import { useAuth } from "@/App";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchBar from "@/components/ui/SearchBar";
import { Button } from "@/components/ui/button";
import { BookOpen, BookText, Library, Users } from "lucide-react";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Header />
      
      {/* الصفحة الرئيسية */}
      <main className="flex-1">
        {/* قسم الترحيب */}
        <section className="relative py-20 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                نظام إدارة المكتبات الشخصية
              </h1>
              <p className="text-xl mb-8 text-muted-foreground">
                منصة متكاملة لإدارة مكتبتك الشخصية وتنظيم كتبك بطريقة سهلة وفعالة
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {user ? (
                  <Link to="/dashboard">
                    <Button size="lg" className="gap-2">
                      <BookOpen className="h-5 w-5" />
                      الذهاب إلى لوحة التحكم
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/register">
                      <Button size="lg" className="gap-2">
                        <Users className="h-5 w-5" />
                        إنشاء حساب جديد
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="outline" size="lg" className="gap-2">
                        دخول إلى حسابك
                      </Button>
                    </Link>
                  </>
                )}
              </div>
              
              <div className="relative max-w-md mx-auto">
                <SearchBar 
                  onSearch={(query) => console.log("البحث عن:", query)} 
                  placeholder="ابحث عن كتاب أو مؤلف..."
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  يمكنك البحث عن الكتب، المؤلفين، أو التصنيفات
                </p>
              </div>
            </div>
          </div>
          
          {/* خلفية زخرفية */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
          <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl"></div>
          <div className="absolute -right-40 -bottom-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl"></div>
        </section>
        
        {/* قسم المميزات */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">مميزات نظام إدارة المكتبات</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Library className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">إدارة مكتبتك الشخصية</h3>
                <p className="text-muted-foreground">
                  أنشئ مكتبات متعددة ونظم كتبك حسب التصنيفات المختلفة بطريقة سهلة
                </p>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <BookText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">تنظيم المجموعات</h3>
                <p className="text-muted-foreground">
                  صنف كتبك حسب المؤلف، الموضوع، سنة النشر أو أي تصنيف تختاره
                </p>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">إدارة مستخدمي المكتبة</h3>
                <p className="text-muted-foreground">
                  تحكم في صلاحيات المستخدمين ومن يمكنه الوصول إلى كتبك
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* قسم كيفية الاستخدام */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">كيفية استخدام النظام</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              بخطوات بسيطة يمكنك البدء في إدارة مكتبتك الشخصية واستعراض مجموعة كتبك
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="p-4 text-center">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="font-semibold mb-2">إنشاء حساب</h3>
                <p className="text-sm text-muted-foreground">
                  سجل حساب جديد وأكمل معلومات ملفك الشخصي
                </p>
              </div>
              
              <div className="p-4 text-center">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-semibold mb-2">أنشئ مكتبتك</h3>
                <p className="text-sm text-muted-foreground">
                  قم بإنشاء مكتبة جديدة وحدد تصنيفاتها
                </p>
              </div>
              
              <div className="p-4 text-center">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-semibold mb-2">أضف كتبك</h3>
                <p className="text-sm text-muted-foreground">
                  أضف كتبك مع كافة المعلومات المتعلقة بها
                </p>
              </div>
              
              <div className="p-4 text-center">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="font-semibold mb-2">البحث والتنظيم</h3>
                <p className="text-sm text-muted-foreground">
                  استعرض ونظم كتبك بشكل سهل وسريع
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* قسم الاتصال */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">ابدأ اليوم في تنظيم مكتبتك</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              انضم إلى آلاف المستخدمين الذين ينظمون مكتباتهم الشخصية باستخدام نظامنا
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="gap-2">
                  <Users className="h-5 w-5" />
                  سجل الآن مجاناً
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  تسجيل الدخول إلى حسابك
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
