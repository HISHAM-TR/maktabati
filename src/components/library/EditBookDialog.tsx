
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BookFormData } from "./AddBookDialog";
import { BookType } from "@/components/ui/BookCard";

interface EditBookDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEditBook: (book: BookFormData) => void;
  bookCategories: string[];
  activeBook: (BookType & { volumes?: number }) | null;
}

const EditBookDialog = ({ 
  isOpen, 
  onOpenChange, 
  onEditBook, 
  bookCategories,
  activeBook
}: EditBookDialogProps) => {
  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    author: "",
    category: "",
    description: "",
    volumes: 1,
  });
  
  const [newCategory, setNewCategory] = useState<string>("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Update form data when activeBook changes
  useEffect(() => {
    if (activeBook) {
      setFormData({
        title: activeBook.title,
        author: activeBook.author,
        category: activeBook.category,
        description: activeBook.description || "",
        volumes: activeBook.volumes || 1,
      });
    }
  }, [activeBook]);

  const handleEditBook = () => {
    if (!formData.title.trim() || !formData.author.trim() || !formData.category) {
      toast.error("العنوان والمؤلف والتصنيف مطلوبين");
      return;
    }

    onEditBook(formData);
    resetForm();
  };

  const resetForm = () => {
    if (!activeBook) {
      setFormData({
        title: "",
        author: "",
        category: "",
        description: "",
        volumes: 1,
      });
    }
    setNewCategory("");
    setIsAddingCategory(false);
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error("يرجى إدخال اسم التصنيف");
      return;
    }

    if (bookCategories.includes(newCategory)) {
      toast.error("هذا التصنيف موجود بالفعل");
      return;
    }

    // This signals the parent to add a new category
    onEditBook({ 
      ...formData, 
      category: newCategory,
      title: "_NEW_CATEGORY_", // Special marker to indicate this is a category addition
      author: "", 
      description: "", 
      volumes: 1 
    });
    
    setFormData({ ...formData, category: newCategory });
    setNewCategory("");
    setIsAddingCategory(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) resetForm();
      onOpenChange(open);
    }}>
      <DialogContent className="font-cairo">
        <DialogHeader>
          <DialogTitle className="text-2xl">تعديل كتاب</DialogTitle>
          <DialogDescription className="text-lg">
            تحديث معلومات الكتاب.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-title" className="text-right text-lg">
              العنوان *
            </Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="col-span-3 text-right py-6 text-lg"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-author" className="text-right text-lg">
              المؤلف *
            </Label>
            <Input
              id="edit-author"
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              className="col-span-3 text-right py-6 text-lg"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="edit-category" className="text-right text-lg pt-3">
              التصنيف *
            </Label>
            <div className="col-span-3">
              {isAddingCategory ? (
                <div className="flex flex-col space-y-2">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="text-right py-6 text-lg"
                    placeholder="أدخل اسم التصنيف الجديد"
                  />
                  <div className="flex gap-2 justify-end">
                    <Button onClick={handleAddCategory} className="text-lg">
                      إضافة
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingCategory(false)}
                      className="text-lg"
                    >
                      إلغاء
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger className="text-right py-6 text-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {bookCategories.map((category) => (
                        <SelectItem key={category} value={category} className="text-lg">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingCategory(true)}
                    className="text-lg"
                  >
                    <Plus className="h-4 w-4 ms-1" />
                    تصنيف جديد
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-volumes" className="text-right text-lg">
              عدد المجلدات
            </Label>
            <Input
              id="edit-volumes"
              type="number"
              min="1"
              value={formData.volumes}
              onChange={(e) =>
                setFormData({ ...formData, volumes: parseInt(e.target.value) || 1 })
              }
              className="col-span-3 text-right py-6 text-lg"
              placeholder="أدخل عدد المجلدات"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-description" className="text-right text-lg">
              الوصف
            </Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="col-span-3 text-right py-4 text-lg"
              rows={4}
            />
          </div>
        </div>
        <DialogFooter className="flex-row sm:justify-end">
          <Button onClick={handleEditBook} className="text-lg py-6 px-8">حفظ التغييرات</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="text-lg py-6 px-8 mr-2">
            إلغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditBookDialog;
