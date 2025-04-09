
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FormData {
  name: string;
  description: string;
}

interface LibraryDialogsProps {
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  formData: FormData;
  setFormData: (data: FormData) => void;
  handleCreateLibrary: () => void;
  handleEditLibrary: () => void;
}

const LibraryDialogs = ({
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  formData,
  setFormData,
  handleCreateLibrary,
  handleEditLibrary,
}: LibraryDialogsProps) => {
  return (
    <>
      {/* حوار إنشاء تصنيف */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="font-cairo">
          <DialogHeader>
            <DialogTitle className="text-xl tracking-wide">إنشاء تصنيف جديد</DialogTitle>
            <DialogDescription className="text-base">
              قم بإنشاء تصنيف جديد لتنظيم كتبك.
            </DialogDescription>
              قم بإنشاء تصنيف جديد لتنظيم كتبك.
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-base">
                الاسم
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="col-span-3 text-right py-5 text-base"
                placeholder="أدخل اسم التصنيف"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right text-base">
                الوصف
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="col-span-3 text-right py-3 text-base"
                placeholder="وصف التصنيف الخاص بك"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter className="flex-row-reverse sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
              className="text-base"
            >
              إلغاء
            </Button>
            <Button onClick={handleCreateLibrary} className="text-base py-5 px-6">إنشاء تصنيف</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* حوار تعديل المكتبة */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="font-cairo">
          <DialogHeader>
            <DialogTitle className="text-xl tracking-wide">تعديل المكتبة</DialogTitle>
            <DialogDescription className="text-base">
              تحديث معلومات المكتبة الخاصة بك.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right text-base">
                الاسم
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="col-span-3 text-right py-5 text-base"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right text-base">
                الوصف
              </Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="col-span-3 text-right py-3 text-base"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter className="flex-row-reverse sm:justify-end">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="text-base">
              إلغاء
            </Button>
            <Button onClick={handleEditLibrary} className="text-base py-5 px-6">حفظ التغييرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LibraryDialogs;
