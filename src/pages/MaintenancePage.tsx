
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/App";
import { Book, AlertTriangle, Settings, ArrowLeft } from "lucide-react";

const MaintenancePage = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary/30 px-4" dir="rtl">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-reverse space-x-2">
            <Book className="h-12 w-12 text-primary" />
            <span className="font-semibold text-3xl">نظام إدارة المكتبات</span>
          </div>
        </div>

        <div className="p-8 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-yellow-100 rounded-full">
              <Settings className="h-16 w-16 text-yellow-600 animate-spin-slow" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold mb-4">الموقع قيد الصيانة</h1>
          
          <p className="text-gray-600 mb-8">
            نعتذر عن الإزعاج. نحن نقوم حاليًا بإجراء بعض التحديثات والصيانة. سيكون الموقع متاحًا قريبًا.
          </p>

          <div className="flex justify-center">
            <Link to="/login">
              <Button variant="outline" className="flex items-center">
                <ArrowLeft className="ml-2 h-4 w-4" />
                تسجيل الدخول
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          &copy; {new Date().getFullYear()} نظام إدارة المكتبات. جميع الحقوق محفوظة.
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
