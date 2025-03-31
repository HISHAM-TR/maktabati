
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Wrench } from "lucide-react";

interface MaintenanceProps {
  message?: string;
}

const Maintenance = ({ message = "الموقع تحت الصيانة حاليًا. يرجى العودة لاحقًا." }: MaintenanceProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center" dir="rtl">
      <div className="p-8 rounded-lg bg-card border border-border shadow-lg max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="h-24 w-24 rounded-full bg-secondary/30 flex items-center justify-center">
            <Wrench className="h-12 w-12 text-primary" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">تحت الصيانة</h1>
        
        <div className="flex items-center justify-center mb-6">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
          <p className="text-lg text-muted-foreground">{message}</p>
        </div>
        
        <Button 
          onClick={() => navigate("/login")} 
          variant="outline" 
          className="mt-4 w-full text-lg py-6"
        >
          تسجيل الدخول
        </Button>
      </div>
    </div>
  );
};

export default Maintenance;
