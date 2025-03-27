
import React from "react";
import { Mail, Check, AlertCircle } from "lucide-react";
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
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  status: string;
  registrationDate: string;
  lastLogin: string;
  libraryCount: number;
  role?: "user" | "admin";
}

interface EditUserDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeUser: User | null;
  userFormData: {
    name: string;
    email: string;
    status: string;
    role: "user" | "admin";
  };
  setUserFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    status: string;
    role: "user" | "admin";
  }>>;
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
