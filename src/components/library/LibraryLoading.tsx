
import { Link } from "react-router-dom";
import { Book as BookIcon, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const LibraryLoading = () => {
  return (
    <div className="flex flex-col min-h-screen font-cairo" dir="rtl">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 text-center">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <BookIcon className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-4">جاري تحميل المكتبة...</h1>
          <p className="text-xl text-muted-foreground mb-8">
            يرجى الانتظار بينما يتم تحميل بيانات المكتبة.
          </p>
          <Link to="/dashboard">
            <Button className="text-lg py-6 px-8">
              <ChevronRight className="h-5 w-5 ml-2" />
              العودة إلى لوحة التحكم
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LibraryLoading;
