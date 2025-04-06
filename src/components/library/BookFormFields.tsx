
import { useState } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import BorrowDateField from "./BorrowDateField";

export type BookFormData = {
  title: string;
  author: string;
  category: string;
  description: string;
  volumes: number;
  status: "available" | "borrowed" | "lost" | "damaged";
  borrowDate: Date | null;
  isRare: boolean;
  isReference: boolean;
  needsRepair: boolean;
};

interface BookFormFieldsProps {
  formData: BookFormData;
  setFormData: (data: BookFormData) => void;
  bookCategories: string[];
  setBookCategories: (categories: string[]) => void;
}

const BookFormFields = ({
  formData,
  setFormData,
  bookCategories,
  setBookCategories,
}: BookFormFieldsProps) => {
  const [newCategory, setNewCategory] = useState<string>("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error("يرجى إدخال اسم التصنيف");
      return;
    }

    if (bookCategories.includes(newCategory)) {
      toast.error("هذا التصنيف موجود بالفعل");
      return;
    }

    setBookCategories([...bookCategories, newCategory]);
    setFormData({ ...formData, category: newCategory });
    setNewCategory("");
    setIsAddingCategory(false);
    toast.success("تمت إضافة التصنيف الجديد");
  };

  return (
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
                <Plus className="h-4 w-4 ml-1" />
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
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="status" className="text-right text-lg pt-2">
          حالة الكتاب
        </Label>
        <div className="col-span-3">
          <RadioGroup 
            value={formData.status} 
            onValueChange={(value: "available" | "borrowed" | "lost" | "damaged") => 
              setFormData({ ...formData, status: value })
            }
            className="grid grid-cols-2 gap-4"
            dir="rtl"
          >
            <div className="flex items-center justify-end space-x-2 space-x-reverse">
              <Label htmlFor="available" className="text-lg cursor-pointer order-1">متاح</Label>
              <RadioGroupItem value="available" id="available" className="order-2" />
            </div>
            <div className="flex items-center justify-end space-x-2 space-x-reverse">
              <Label htmlFor="borrowed" className="text-lg cursor-pointer order-1">مستعار</Label>
              <RadioGroupItem value="borrowed" id="borrowed" className="order-2" />
            </div>
            <div className="flex items-center justify-end space-x-2 space-x-reverse">
              <Label htmlFor="lost" className="text-lg cursor-pointer order-1">مفقود</Label>
              <RadioGroupItem value="lost" id="lost" className="order-2" />
            </div>
            <div className="flex items-center justify-end space-x-2 space-x-reverse">
              <Label htmlFor="damaged" className="text-lg cursor-pointer order-1">تالف</Label>
              <RadioGroupItem value="damaged" id="damaged" className="order-2" />
            </div>
          </RadioGroup>
        </div>
      </div>
      
      {formData.status === "borrowed" && (
        <BorrowDateField 
          borrowDate={formData.borrowDate} 
          onDateChange={(date) => setFormData({ ...formData, borrowDate: date })}
        />
      )}
      
      <div className="grid grid-cols-4 items-start gap-4">
        <Label className="text-right text-lg pt-2">
          خيارات إضافية
        </Label>
        <div className="col-span-3 grid gap-3">
          <div className="flex items-center justify-end space-x-2 space-x-reverse">
            <Label htmlFor="isRare" className="text-lg cursor-pointer mr-2">
              كتاب نادر
            </Label>
            <input
              type="checkbox"
              id="isRare" 
              checked={(formData as BookFormData & { isRare?: boolean }).isRare ?? false}
              onChange={(e) => {
                const updatedData = { ...formData } as BookFormData & { isRare?: boolean };
                updatedData.isRare = e.target.checked;
                setFormData(updatedData as BookFormData);
              }}
            />
          </div>
          <div className="flex items-center justify-end space-x-2 space-x-reverse">
            <Label htmlFor="isReference" className="text-lg cursor-pointer mr-2">
              مرجع (غير قابل للإعارة)
            </Label>
            <input
              type="checkbox"
              id="isReference" 
              checked={(formData as BookFormData & { isReference?: boolean }).isReference ?? false}
              onChange={(e) => {
                const updatedData = { ...formData } as BookFormData & { isReference?: boolean };
                updatedData.isReference = e.target.checked;
                setFormData(updatedData as BookFormData);
              }}
            />
          </div>
          <div className="flex items-center justify-end space-x-2 space-x-reverse">
            <Label htmlFor="needsRepair" className="text-lg cursor-pointer mr-2">
              يحتاج إلى صيانة
            </Label>
            <input
              id="needsRepair" 
              checked={(formData as BookFormData & { needsRepair?: boolean }).needsRepair ?? false}
              onChange={(e) => {
                const updatedData = { ...formData } as BookFormData & { needsRepair?: boolean };
                updatedData.needsRepair = e.target.checked;
                setFormData(updatedData as BookFormData);
              }}
            />
          </div>
        </div>
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
  );
};

export default BookFormFields;
