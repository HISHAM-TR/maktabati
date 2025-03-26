
import { useState } from "react";
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

interface AddBookDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddBook: (book: BookFormData) => void;
  bookCategories: string[];
}

export interface BookFormData {
  title: string;
  author: string;
  category: string;
  description: string;
  volumes: number;
}

const AddBookDialog = ({ 
  isOpen, 
  onOpenChange, 
  onAddBook, 
  bookCategories 
}: AddBookDialogProps) => {
  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    author: "",
    category: "",
    description: "",
    volumes: 1,
  });
  
  const [newCategory, setNewCategory] = useState<string>("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const handleAddBook = () => {
    if (!formData.title.trim() || !formData.author.trim() || !formData.category) {
      toast.error("العنوان والمؤلف والتصنيف مطلوبين");
      return;
    }

    onAddBook(formData);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      category: "",
      description: "",
      volumes: 1,
    });
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
    onAddBook({ 
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
          <DialogTitle className="text-2xl">إضافة كتاب جديد</DialogTitle>
          <DialogDescription className="text-lg">
            أضف كتابًا جديدًا إلى مكتبتك.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right text-lg">
              العنوان *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="col-span-3 text-right py-6 text-lg"
              placeholder="أدخل عنوان الكتاب"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="author" className="text-right text-lg">
              المؤلف *
            </Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              className="col-span-3 text-right py-6 text-lg"
              placeholder="أدخل اسم المؤلف"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="category" className="text-right text-lg pt-3">
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
                      <SelectValue placeholder="اختر تصنيفًا" />
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
            <Label htmlFor="volumes" className="text-right text-lg">
              عدد المجلدات
            </Label>
            <Input
              id="volumes"
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
            <Label htmlFor="description" className="text-right text-lg">
              الوصف
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="col-span-3 text-right py-4 text-lg"
              placeholder="أدخل وصف الكتاب"
              rows={4}
            />
          </div>
        </div>
        <DialogFooter className="flex-row sm:justify-end">
          <Button onClick={handleAddBook} className="text-lg py-6 px-8">إضافة كتاب</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="text-lg py-6 px-8 mr-2">
            إلغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookDialog;
