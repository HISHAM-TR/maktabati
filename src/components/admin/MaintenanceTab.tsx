
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
            <div className="flex items-center">
              <label className="switch">
                <input 
                  type="checkbox" 
                  className="ch" 
                  checked={maintenanceEnabled}
                  onChange={(e) => setMaintenanceEnabled(e.target.checked)}
                />
                <span className="slider" />
              </label>
              <style>{`
                .switch {
                  font-size: 17px;
                  position: relative;
                  display: inline-block;
                  width: 3.5em;
                  height: 1.5em;
                }
                .switch input {
                  opacity: 0;
                  width: 0;
                  height: 0;
                }
                .slider {
                  position: absolute;
                  cursor: pointer;
                  inset: 0;
                  background-color: #ccc;
                  transition: 0.4s;
                  border-radius: 1rem 0rem 1rem;
                }
                .slider:before {
                  position: absolute;
                  content: "";
                  height: 1.5em;
                  width: 1.4em;
                  left: 0em;
                  bottom: 0em;
                  background-color: white;
                  transition: 0.4s;
                  border-radius: 1rem 0rem 1rem;
                  border: 3px solid white;
                }
                .ch:checked + .slider {
                  background-color: #72eb67;
                }
                .ch:focus + .slider {
                  box-shadow: 0 0 1px #2196f3;
                }
                .ch:checked + .slider:before {
                  transform: translateX(2.2em);
                  background-color: green;
                  box-shadow: 0px 0px 40px 5px #72eb67;
                  border: 3px solid white;
                }
                .ch:checked + .slider::after {
                  content: "|";
                  color: white;
                  position: absolute;
                  right: 0.3rem;
                  top: -3.3px;
                  transform: rotate(45deg);
                }
              `}</style>
            </div>
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
