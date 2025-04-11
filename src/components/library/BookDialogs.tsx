
import { useState, forwardRef, useImperativeHandle } from "react";
import { format } from "date-fns";
import { User, Book as BookIcon, Pencil, Eye, Calendar, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import BookFormFields, { BookFormData } from "./BookFormFields";
import { BookType } from "@/components/ui/BookCard";

interface BookDialogsProps {
  books: BookType[];
  setBooks: (books: BookType[]) => void;
  setFilteredBooks: (books: BookType[]) => void;
  bookCategories: string[];
  setBookCategories: (categories: string[]) => void;
  libraryId: string;
  isAddDialogOpen?: boolean;
  setIsAddDialogOpen?: (isOpen: boolean) => void;
}

// Default form data
const defaultFormData: BookFormData = {
  title: "",
  author: "",
  category: "",
  description: "",
  volumes: 1,
  status: "available",
  borrowDate: null,
  isRare: false,
  isReference: false,
  needsRepair: false,
};

const BookDialogs = forwardRef<
  {
    handleViewBook: (book: BookType) => void;
    handleEditDialogOpen: (book: BookType) => void;
  },
  BookDialogsProps
>(({ 
  books, 
  setBooks, 
  setFilteredBooks,
  bookCategories,
  setBookCategories,
  libraryId,
  isAddDialogOpen = false,
  setIsAddDialogOpen
}, ref) => {
  // Use the prop if provided, otherwise use local state
  const [localIsAddDialogOpen, setLocalIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [activeBook, setActiveBook] = useState<BookType | null>(null);
  const [formData, setFormData] = useState<BookFormData>(defaultFormData);

  // Use either the prop setter or local state setter
  const handleAddDialogOpen = (isOpen: boolean) => {
    if (setIsAddDialogOpen) {
      setIsAddDialogOpen(isOpen);
    } else {
      setLocalIsAddDialogOpen(isOpen);
    }
  };

  // Use either the prop value or local state value
  const actualIsAddDialogOpen = setIsAddDialogOpen !== undefined ? isAddDialogOpen : localIsAddDialogOpen;

  const resetFormData = () => {
    setFormData(defaultFormData);
  };

  const handleAddBook = () => {
    if (!formData.title.trim() || !formData.author.trim() || !formData.category) {
      toast.error("العنوان والمؤلف والتصنيف مطلوبين");
      return;
    }

    const newBook = {
      id: `${libraryId}-${Date.now()}`,
      ...formData,
    };

    const updatedBooks = [newBook, ...books];
    setBooks(updatedBooks);
    setFilteredBooks(updatedBooks);
    handleAddDialogOpen(false);
    resetFormData();
    toast.success("تمت إضافة الكتاب بنجاح");
  };

  const handleEditBook = () => {
    if (!activeBook) {
      console.log("لا يوجد كتاب نشط للتعديل");
      return;
    }
    if (!formData.title.trim() || !formData.author.trim() || !formData.category) {
      toast.error("العنوان والمؤلف والتصنيف مطلوبين");
      return;
    }

    console.log("تعديل الكتاب:", activeBook.id, formData);
    
    const updatedBooks = books.map((book) =>
      book.id === activeBook.id
        ? { ...book, ...formData }
        : book
    );

    setBooks(updatedBooks);
    setFilteredBooks(updatedBooks);
    setIsEditDialogOpen(false);
    setActiveBook(null);
    resetFormData();
    toast.success("تم تحديث الكتاب بنجاح");
  };

  const handleViewBook = (book: BookType) => {
    setActiveBook(book);
    setIsViewDialogOpen(true);
  };

  const handleEditDialogOpen = (book: BookType) => {
    console.log("فتح حوار تعديل الكتاب:", book.id);
    setActiveBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      description: book.description || "",
      volumes: (book as any).volumes || 1,
      status: book.status || "available",
      borrowDate: book.borrowDate || null,
      isRare: (book as any).isRare || false,
      isReference: (book as any).isReference || false,
      needsRepair: (book as any).needsRepair || false,
    });
    setIsEditDialogOpen(true);
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    handleViewBook,
    handleEditDialogOpen
  }));

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "متاح";
      case "borrowed":
        return "مستعار";
      case "lost":
        return "مفقود";
      case "damaged":
        return "تالف";
      default:
        return "غير معروف";
    }
  };

  return (
    <>
      {/* Add Book Dialog */}
      <Dialog open={actualIsAddDialogOpen} onOpenChange={handleAddDialogOpen}>
        <DialogContent className="font-cairo">
          <DialogHeader>
            <DialogTitle className="text-2xl">إضافة كتاب جديد</DialogTitle>
            <DialogDescription className="text-lg">
              أضف كتابًا جديدًا إلى مكتبتك.
            </DialogDescription>
          </DialogHeader>
          <BookFormFields 
            formData={formData}
            setFormData={setFormData}
            bookCategories={bookCategories}
            setBookCategories={setBookCategories}
          />
          <DialogFooter className="flex-row-reverse sm:justify-end">
            <Button variant="outline" onClick={() => handleAddDialogOpen(false)} className="text-lg py-6 px-8">
              إلغاء
            </Button>
            <Button onClick={handleAddBook} className="text-lg py-6 px-8">إضافة كتاب</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Book Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        console.log("تغيير حالة حوار التعديل:", open);
        setIsEditDialogOpen(open);
      }}>
        <DialogContent className="font-cairo">
          <DialogHeader>
            <DialogTitle className="text-2xl">تعديل كتاب</DialogTitle>
            <DialogDescription className="text-lg">
              تحديث معلومات الكتاب.
            </DialogDescription>
          </DialogHeader>
          <BookFormFields 
            formData={formData}
            setFormData={setFormData}
            bookCategories={bookCategories}
            setBookCategories={setBookCategories}
          />
          <DialogFooter className="flex-row-reverse sm:justify-end">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="text-lg py-6 px-8">
              إلغاء
            </Button>
            <Button onClick={() => {
              console.log("تم النقر على زر حفظ التغييرات");
              handleEditBook();
            }} className="text-lg py-6 px-8">حفظ التغييرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Book Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="font-cairo sm:max-w-[525px]">
          {activeBook && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{activeBook.title}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center space-x-reverse space-x-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium text-lg">المؤلف:</span>
                  <span className="text-lg">{activeBook.author}</span>
                </div>
                <div className="flex items-center space-x-reverse space-x-2">
                  <BookIcon className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium text-lg">التصنيف:</span>
                  <span className="text-lg">{activeBook.category}</span>
                </div>
                <div className="flex items-center space-x-reverse space-x-2">
                  <BookIcon className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium text-lg">عدد المجلدات:</span>
                  <span className="text-lg">{(activeBook as any).volumes || 1}</span>
                </div>
                <div className="flex items-center space-x-reverse space-x-2">
                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium text-lg">الحالة:</span>
                  <span className="text-lg">{getStatusText(activeBook.status || "available")}</span>
                </div>
                
                {activeBook.status === "borrowed" && activeBook.borrowDate && (
                  <div className="flex items-center space-x-reverse space-x-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <span className="font-medium text-lg">تاريخ الإعارة:</span>
                    <span className="text-lg">{format(new Date(activeBook.borrowDate), "yyyy-MM-dd")}</span>
                  </div>
                )}
                
                {(activeBook as any).isRare && (
                  <div className="flex items-center space-x-reverse space-x-2">
                    <BookIcon className="h-5 w-5 text-amber-500" />
                    <span className="font-medium text-lg">كتاب نادر</span>
                  </div>
                )}
                
                {(activeBook as any).isReference && (
                  <div className="flex items-center space-x-reverse space-x-2">
                    <BookIcon className="h-5 w-5 text-indigo-500" />
                    <span className="font-medium text-lg">مرجع (غير قابل للإعارة)</span>
                  </div>
                )}
                
                {(activeBook as any).needsRepair && (
                  <div className="flex items-center space-x-reverse space-x-2">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    <span className="font-medium text-lg">يحتاج إلى صيانة</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-reverse space-x-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium text-lg">تمت الإضافة في:</span>
                  <span className="text-lg">{new Date().toLocaleDateString('ar-EG')}</span>
                </div>
                <div className="mt-4">
                  <h4 className="text-lg font-medium mb-2">الوصف:</h4>
                  <p className="text-muted-foreground text-lg">
                    {activeBook.description || "لا يوجد وصف متاح."}
                  </p>
                </div>
              </div>
              <DialogFooter className="flex-row-reverse sm:justify-end">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)} className="text-lg py-6 px-8">
                  إغلاق
                </Button>
                <Button onClick={() => {
                  setIsViewDialogOpen(false);
                  handleEditDialogOpen(activeBook);
                }} className="text-lg py-6 px-8">
                  تعديل الكتاب
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
    </>
  );
});

BookDialogs.displayName = "BookDialogs";

export { BookDialogs, defaultFormData };
export type { BookFormData };
