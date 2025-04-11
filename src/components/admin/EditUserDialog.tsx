
import React from "react";
import { Mail, Check, AlertCircle, Shield } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { User, UserFormData } from "./types";

interface EditUserDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeUser: User | null;
  userFormData: UserFormData;
  setUserFormData: React.Dispatch<React.SetStateAction<UserFormData>>;
  handleEditUser: () => void;
}

const EditUserDialog = ({
  isOpen,
  setIsOpen,
  activeUser,
  userFormData,
  setUserFormData,
  handleEditUser,
}: EditUserDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="rtl:text-right ltr:text-left">
        <DialogHeader>
          <DialogTitle>تعديل المستخدم</DialogTitle>
          <DialogDescription>
            تحديث معلومات المستخدم. انقر على حفظ عند الانتهاء.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              الاسم
            </Label>
            <Input
              id="name"
              value={userFormData.name}
              onChange={(e) =>
                setUserFormData({ ...userFormData, name: e.target.value })
              }
              className="col-span-3 text-right"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              البريد الإلكتروني
            </Label>
            <div className="col-span-3 flex items-center space-x-reverse space-x-2">
              <Input
                id="email"
                value={userFormData.email}
                onChange={(e) =>
                  setUserFormData({ ...userFormData, email: e.target.value })
                }
                className="flex-1 text-right"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  toast.success("تم إرسال بريد التحقق");
                }}
                title="إرسال بريد التحقق"
              >
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              الصلاحيات
            </Label>
            <div className="col-span-3">
              <RadioGroup
                value={userFormData.role}
                onValueChange={(value) => 
                  setUserFormData({ ...userFormData, role: value as "user" | "admin" })
                }
                className="flex flex-row space-x-reverse space-x-4"
                dir="rtl"
              >
                <div className="flex items-center space-x-reverse space-x-2">
                  <RadioGroupItem value="user" id="user" />
                  <Label htmlFor="user" className="cursor-pointer">مستخدم</Label>
                </div>
                <div className="flex items-center space-x-reverse space-x-2">
                  <RadioGroupItem value="admin" id="admin" />
                  <Label htmlFor="admin" className="cursor-pointer">مشرف</Label>
                </div>
              </RadioGroup>
              <div className="mt-2 flex items-center">
                <Shield className="h-4 w-4 text-muted-foreground ml-2" />
                <span className="text-xs text-muted-foreground">
                  {userFormData.role === "admin" 
                    ? "يملك المشرف كافة الصلاحيات في النظام" 
                    : "المستخدم العادي يمكنه إدارة مكتباته الخاصة فقط"}
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              الحالة
            </Label>
            <div className="col-span-3 flex items-center space-x-reverse space-x-2">
              <Badge
                variant={
                  userFormData.status === "active"
                    ? "default"
                    : userFormData.status === "inactive"
                    ? "secondary"
                    : "outline"
                }
                className="py-1 px-2"
              >
                {userFormData.status === "active" ? "نشط" : 
                 userFormData.status === "inactive" ? "غير نشط" : "معلق"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newStatus =
                    userFormData.status === "active"
                      ? "inactive"
                      : "active";
                  setUserFormData({ ...userFormData, status: newStatus });
                }}
              >
                تبديل الحالة
              </Button>
              {userFormData.status === "pending" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setUserFormData({ ...userFormData, status: "active" });
                    toast.success("تم إرسال بريد تفعيل المستخدم");
                  }}
                >
                  <Check className="h-4 w-4 ml-2" />
                  موافقة
                </Button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="text-right">
              <AlertCircle className="h-4 w-4 text-destructive inline ml-2" />
            </div>
            <div className="col-span-3">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  toast.success("تم إرسال بريد إعادة تعيين كلمة المرور للمستخدم");
                }}
              >
                إرسال إعادة تعيين كلمة المرور
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter className="flex-row-reverse sm:justify-start">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            إلغاء
          </Button>
          <Button onClick={handleEditUser}>حفظ التغييرات</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
