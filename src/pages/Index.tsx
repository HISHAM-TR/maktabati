
import { Link } from "react-router-dom";
import { useAuth } from "@/App";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { BookOpen, BookText, Library, Users, Scroll, BookMarked, BookCopy } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Index = () => {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTitleVisible(true);
      setTimeout(() => {
        setVisible(true);
      }, 1500);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f4e8]" dir="rtl">
      <Header />
      
      {/* الصفحة الرئيسية */}
      <main className="flex-1">
        {/* قسم الترحيب */}
        <section className="relative py-20 overflow-hidden bg-andalusian-library home-hero-section">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="max-w-3xl mx-auto text-center"
            >
              <div className="mb-6 relative">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-32 h-32 opacity-20 bg-[url('/islamic-ornament.svg')] bg-contain bg-no-repeat"
                ></motion.div>
                <motion.h1 
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className={`text-4xl md:text-5xl font-bold text-[#5c4c2a] dark:text-[#a08c5a] ${titleVisible ? 'border-r-[#8a6e3b]' : ''}`}
                >
                  مكتبتي الإسلامية
                </motion.h1>
              </div>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className={`text-xl mb-8 text-[#8a6e3b] ${visible ? 'visible' : ''} transition-all duration-300`}
              >
                منصة متكاملة لإدارة مكتبتك وتنظيم مخطوطاتك وكتبك بطريقة تحاكي المكتبات الإسلامية العريقة
              </motion.p>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="flex flex-wrap justify-center gap-4 mb-12"
              >
                {user ? (
                  <Link to="/dashboard">
                    <Button size="lg" className="gap-2 transition-transform hover:scale-105 duration-300 bg-[#8a6e3b] hover:bg-[#5c4c2a] text-[#f8f4e8]">
                      <BookOpen className="h-5 w-5" />
                      الذهاب إلى لوحة التحكم
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/register">
                      <Button size="lg" className="gap-2 transition-transform hover:scale-105 duration-300 bg-[#8a6e3b] hover:bg-[#5c4c2a] text-[#f8f4e8]">
                        <Users className="h-5 w-5" />
                        إنشاء حساب جديد
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="outline" size="lg" className="gap-2 transition-transform hover:scale-105 duration-300 border-[#8a6e3b] text-[#5c4c2a] hover:bg-[#8a6e3b]/10">
                        دخول إلى حسابك
                      </Button>
                    </Link>
                    <Link to="/demo-account">
                      <Button variant="secondary" size="lg" className="gap-2 transition-transform hover:scale-105 duration-300 bg-[#e8dfc1] text-[#5c4c2a] hover:bg-[#d8cba8]">
                        استخدام حساب تجريبي
                      </Button>
                    </Link>
                  </>
                )}
              </motion.div>
            </motion.div>
          </div>
          
          {/* خلفية زخرفية */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#e8dfc1]/30 to-transparent"></div>
          <div className="absolute left-0 top-0 w-full h-full bg-[url('/islamic-border.svg')] bg-contain bg-no-repeat opacity-10"></div>
          <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-[#8a6e3b]/10 blur-3xl animate-[pulse_4s_ease-in-out_infinite]"></div>
          <div className="absolute -right-40 -bottom-40 h-80 w-80 rounded-full bg-[#8a6e3b]/10 blur-3xl animate-[pulse_5s_ease-in-out_1s_infinite]"></div>
        </section>
        
        {/* قسم المميزات */}
        <section className="py-16 bg-[#e8dfc1]/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-andalusian-library opacity-5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-[#5c4c2a] dark:text-[#a08c5a] mb-3">مميزات المكتبة الإسلامية</h2>
              <div className="w-24 h-2 bg-[#8a6e3b]/30 mx-auto rounded-full"></div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-[#f8f4e8] p-6 rounded-lg border border-[#d8cba8] shadow-md flex flex-col items-center text-center transform transition-all hover:scale-105 duration-300 hover:border-[#8a6e3b]"
              >
                <div className="h-16 w-16 rounded-full bg-[#8a6e3b]/10 flex items-center justify-center mb-4 border border-[#8a6e3b]/20">
                  <Library className="h-8 w-8 text-[#8a6e3b]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#5c4c2a] dark:text-[#a08c5a]">إدارة مكتبتك</h3>
                <p className="text-[#8a6e3b]">
                  أنشئ مكتبات متعددة ونظم كتبك ومخطوطاتك حسب التصنيفات المختلفة بطريقة تحاكي المكتبات الإسلامية القديمة
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-[#f8f4e8] p-6 rounded-lg border border-[#d8cba8] shadow-md flex flex-col items-center text-center transform transition-all hover:scale-105 duration-300 hover:border-[#8a6e3b]"
              >
                <div className="h-16 w-16 rounded-full bg-[#8a6e3b]/10 flex items-center justify-center mb-4 border border-[#8a6e3b]/20">
                  <BookText className="h-8 w-8 text-[#8a6e3b]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#5c4c2a]">تنظيم المخطوطات</h3>
                <p className="text-[#8a6e3b]">
                  صنف كتبك حسب المؤلف، الموضوع، سنة النشر أو أي تصنيف يناسب مكتبتك
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="bg-[#f8f4e8] p-6 rounded-lg border border-[#d8cba8] shadow-md flex flex-col items-center text-center transform transition-all hover:scale-105 duration-300 hover:border-[#8a6e3b]"
              >
                <div className="h-16 w-16 rounded-full bg-[#8a6e3b]/10 flex items-center justify-center mb-4 border border-[#8a6e3b]/20">
                  <Scroll className="h-8 w-8 text-[#8a6e3b]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#5c4c2a]">فهرسة الكتب</h3>
                <p className="text-[#8a6e3b]">
                  فهرسة متقدمة للكتب والمخطوطات تسهل عملية البحث والوصول إلى المحتوى المطلوب
                </p>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* قسم كيفية الاستخدام */}
        <section className="py-16 relative">
          <div className="absolute inset-0 bg-[url('/islamic-manuscript.svg')] bg-no-repeat bg-right-bottom opacity-5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold text-[#5c4c2a] mb-3">كيفية استخدام المكتبة</h2>
              <div className="w-24 h-2 bg-[#8a6e3b]/30 mx-auto rounded-full mb-6"></div>
              <p className="text-center text-[#8a6e3b] mb-12 max-w-2xl mx-auto">
                بخطوات بسيطة يمكنك البدء في إدارة مكتبتك واستعراض مجموعة مخطوطاتك وكتبك
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="p-4 text-center transform transition-all hover:translate-y-[-5px] duration-300"
              >
                <div className="h-16 w-16 rounded-full bg-[#8a6e3b] flex items-center justify-center text-[#f8f4e8] font-bold mx-auto mb-4 shadow-md border-4 border-[#f8f4e8] animate-[pulse_3s_ease-in-out_infinite]">
                  ١
                </div>
                <h3 className="font-semibold mb-2 text-[#5c4c2a]">إنشاء حساب</h3>
                <p className="text-sm text-[#8a6e3b]">
                  سجل حساب جديد وأكمل معلومات ملفك الشخصي
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="p-4 text-center transform transition-all hover:translate-y-[-5px] duration-300"
              >
                <div className="h-16 w-16 rounded-full bg-[#8a6e3b] flex items-center justify-center text-[#f8f4e8] font-bold mx-auto mb-4 shadow-md border-4 border-[#f8f4e8] animate-[pulse_3s_ease-in-out_0.5s_infinite]">
                  ٢
                </div>
                <h3 className="font-semibold mb-2 text-[#5c4c2a]">أنشئ مكتبتك</h3>
                <p className="text-sm text-[#8a6e3b]">
                  قم بإنشاء تصنيف جديد وحدد فئاته
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="p-4 text-center transform transition-all hover:translate-y-[-5px] duration-300"
              >
                <div className="h-16 w-16 rounded-full bg-[#8a6e3b] flex items-center justify-center text-[#f8f4e8] font-bold mx-auto mb-4 shadow-md border-4 border-[#f8f4e8] animate-[pulse_3s_ease-in-out_1s_infinite]">
                  ٣
                </div>
                <h3 className="font-semibold mb-2 text-[#5c4c2a]">أضف مخطوطاتك</h3>
                <p className="text-sm text-[#8a6e3b]">
                  أضف كتبك ومخطوطاتك مع كافة المعلومات المتعلقة بها
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                viewport={{ once: true }}
                className="p-4 text-center transform transition-all hover:translate-y-[-5px] duration-300"
              >
                <div className="h-16 w-16 rounded-full bg-[#8a6e3b] flex items-center justify-center text-[#f8f4e8] font-bold mx-auto mb-4 shadow-md border-4 border-[#f8f4e8] animate-[pulse_3s_ease-in-out_1.5s_infinite]">
                  ٤
                </div>
                <h3 className="font-semibold mb-2 text-[#5c4c2a]">الفهرسة والتنظيم</h3>
                <p className="text-sm text-[#8a6e3b]">
                  استعرض ونظم مخطوطاتك وكتبك بطريقة تحاكي المكتبات الإسلامية القديمة
                </p>
              </motion.div>
            </div>

            {/* ميزات إضافية */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12"
            >
              <div className="flex items-center gap-3 bg-[#f8f4e8] p-4 rounded-lg border border-[#d8cba8] shadow-sm">
                <div className="h-10 w-10 rounded-full bg-[#8a6e3b]/10 flex items-center justify-center border border-[#8a6e3b]/20">
                  <BookMarked className="h-5 w-5 text-[#8a6e3b]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#5c4c2a]">تصنيف متقدم</h4>
                  <p className="text-xs text-[#8a6e3b]">تصنيف الكتب حسب العصور والمدارس الفكرية</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-[#f8f4e8] p-4 rounded-lg border border-[#d8cba8] shadow-sm">
                <div className="h-10 w-10 rounded-full bg-[#8a6e3b]/10 flex items-center justify-center border border-[#8a6e3b]/20">
                  <BookCopy className="h-5 w-5 text-[#8a6e3b]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#5c4c2a]">استعارة الكتب</h4>
                  <p className="text-xs text-[#8a6e3b]">نظام متكامل لإدارة استعارة وإعادة الكتب</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-[#f8f4e8] p-4 rounded-lg border border-[#d8cba8] shadow-sm">
                <div className="h-10 w-10 rounded-full bg-[#8a6e3b]/10 flex items-center justify-center border border-[#8a6e3b]/20">
                  <Scroll className="h-5 w-5 text-[#8a6e3b]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#5c4c2a]">حفظ المخطوطات</h4>
                  <p className="text-xs text-[#8a6e3b]">أدوات لحفظ وأرشفة المخطوطات النادرة</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* قسم الاتصال */}
        <section className="py-16 bg-[#e8dfc1]/70 relative overflow-hidden">
          <div className="absolute inset-0 bg-andalusian-library opacity-10"></div>
          <div className="absolute top-0 left-0 w-full h-20 bg-[url('/islamic-arch.svg')] bg-repeat-x bg-top opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-full h-20 bg-[url('/islamic-arch.svg')] bg-repeat-x bg-bottom opacity-20 transform rotate-180"></div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold mb-3 text-[#5c4c2a] dark:text-[#a08c5a]">ابدأ اليوم في تنظيم مكتبتك</h2>
              <div className="w-24 h-2 bg-[#8a6e3b]/30 mx-auto rounded-full mb-6"></div>
              <p className="text-lg text-[#8a6e3b] mb-8 max-w-2xl mx-auto">
                انضم إلى عشاق الكتب والمخطوطات الإسلامية واستمتع بتجربة فريدة في تنظيم مكتبتك
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link to="/register">
                <Button size="lg" className="gap-2 transform transition-all hover:scale-105 duration-300 bg-[#8a6e3b] hover:bg-[#5c4c2a] text-[#f8f4e8]">
                  <Users className="h-5 w-5" />
                  سجل الآن مجاناً
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="transform transition-all hover:scale-105 duration-300 border-[#8a6e3b] text-[#5c4c2a] hover:bg-[#8a6e3b]/10">
                  تسجيل الدخول إلى حسابك
                </Button>
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              viewport={{ once: true }}
              className="mt-12 opacity-20"
            >
              <div className="w-full h-12 bg-[url('/islamic-divider.svg')] bg-contain bg-no-repeat bg-center"></div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
