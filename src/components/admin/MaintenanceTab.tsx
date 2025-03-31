
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MaintenanceSettings } from "./types";
import { Wrench, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface MaintenanceTabProps {
  settings: MaintenanceSettings;
  onSaveSettings: (settings: MaintenanceSettings) => void;
}

const MaintenanceTab = ({ settings, onSaveSettings }: MaintenanceTabProps) => {
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(settings.enabled);
  const [maintenanceMessage, setMaintenanceMessage] = useState(settings.message || "الموقع تحت الصيانة حاليًا. يرجى العودة لاحقًا.");

  const handleSaveSettings = () => {
    onSaveSettings({
      enabled: maintenanceEnabled,
      message: maintenanceMessage
    });
    toast.success("تم حفظ إعدادات الصيانة بنجاح");
  };

  return (
    <div className="animate-fade-in">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Wrench className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">وضع الصيانة</CardTitle>
              <CardDescription>
                عند تفعيل وضع الصيانة، سيكون بإمكان المشرفين فقط الوصول إلى الموقع
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-lg font-medium">تفعيل وضع الصيانة</h3>
              <p className="text-sm text-muted-foreground">
                عند التفعيل، سيتم توجيه جميع المستخدمين العاديين إلى صفحة الصيانة
              </p>
            </div>
            <Switch
              checked={maintenanceEnabled}
              onCheckedChange={setMaintenanceEnabled}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="maintenance-message" className="text-lg font-medium">رسالة الصيانة</label>
            <Textarea
              id="maintenance-message"
              className="h-24"
              placeholder="أدخل رسالة ستظهر للمستخدمين عند زيارة الموقع أثناء الصيانة"
              value={maintenanceMessage}
              onChange={(e) => setMaintenanceMessage(e.target.value)}
            />
          </div>
          
          {maintenanceEnabled && (
            <div className="flex items-start p-4 border border-yellow-200 bg-yellow-50 rounded-md">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
              <p className="text-sm text-yellow-700">
                تنبيه: عند تفعيل وضع الصيانة، سيتمكن المشرفون فقط من الوصول إلى الموقع. جميع المستخدمين الآخرين سيرون صفحة الصيانة.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveSettings} className="ml-auto text-lg py-6">
            حفظ الإعدادات
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MaintenanceTab;
