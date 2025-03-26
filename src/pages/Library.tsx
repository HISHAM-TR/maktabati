
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ChevronRight, 
  Plus, 
  Book as BookIcon, 
  User,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BookCard, { BookType } from "@/components/ui/BookCard";
import SearchBar from "@/components/ui/SearchBar";

// بيانات المكتبات الوهمية
const libraryData = {
  "1": {
    id: "1",
    name: "مجموعة الروايات",
    description: "مجموعتي من الروايات، بما في ذلك الخيال والخيال العلمي والتاريخي.",
  },
  "2": {
    id: "2",
    name: "كتب التقنية",
    description: "كتب البرمجة والتكنولوجيا المرجعية.",
  },
  "3": {
    id: "3",
    name: "الفلسفة",
    description: "مجموعة من نصوص الفلسفة الكلاسيكية والحديثة.",
  },
};

// بيانات الكتب الوهمية
const initialBooksData = {
  "1": [
    {
      id: "1-1",
      title: "سيد الخواتم",
      author: "ج.ر.ر. تولكين",
      category: "خيال",
      description: "رواية خيالية ملحمية عن مهمة لتدمير خاتم قوي.",
    },
    {
      id: "1-2",
      title: "كثبان",
      author: "فرانك هربرت",
      category: "خيال علمي",
      description: "رواية خيال علمي تدور في مستقبل بعيد وسط مجتمع إقطاعي بين النجوم.",
    },
    {
      id: "1-3",
      title: "كبرياء وتحامل",
      author: "جين أوستن",
      category: "كلاسيكي",
      description: "رواية رومانسية تتبع التطور العاطفي للبطلة إليزابيث بينيت.",
    },
  ],
  "2": [
    {
      id: "2-1",
      title: "كود نظيف",
      author: "روبرت سي. مارتن",
      category: "برمجة",
      description: "دليل لحرفية البرمجيات الرشيقة.",
    },
    {
      id: "2-2",
      title: "أنماط التصميم",
      author: "إريك جاما، ريتشارد هيلم، رالف جونسون، جون فليسيدس",
      category: "برمجة",
      description: "عناصر البرمجيات الموجهة للكائنات القابلة لإعادة الاستخدام.",
    },
  ],
  "3": [
    {
      id: "3-1",
      title: "الجمهورية",
      author: "أفلاطون",
      category: "فلسفة",
      description: "حوار سقراطي بخصوص العدالة، ونظام وطبيعة الدولة العادلة، والإنسان العادل.",
    },
    {
      id: "3-2",
      title: "ما وراء الخير والشر",
      author: "فريدريك نيتشه",
      category: "فلسفة",
      description: "مقدمة لفلسفة المستقبل.",
    },
  ],
};

// تصنيفات الكتب
const bookCategories = [
  "خيال",
  "خيال علمي",
  "كلاسيكي",
  "برمجة",
  "فلسفة",
  "سيرة ذاتية",
  "تاريخ",
  "تطوير ذاتي",
  "غموض",
  "إثارة",
];

const Library = () => {
  const { id } = useParams<{ id: string }>();
  const [library, setLibrary] = useState<any>(null);
  const [books, setBooks] = useState<BookType[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<BookType[]>([]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [activeBook, setActiveBook] = useState<BookType | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
  });

  // تحميل بيانات المكتبة عند التحميل
  useEffect(() => {
    document.title = "المكتبة | نظام إدارة المكتبات";
    
    if (id && libraryData[id as keyof typeof libraryData]) {
      setLibrary(libraryData[id as keyof typeof libraryData]);
      
      // تحميل الكتب لهذه المكتبة
      if (initialBooksData[id as keyof typeof initialBooksData]) {
        setBooks(initialBooksData[id as keyof typeof initialBooksData]);
        setFilteredBooks(initialBooksData[id as keyof typeof initialBooksData]);
      }
    }
  }, [id]);

  // معالجة البحث
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredBooks(books);
      return;
    }

    const results = books.filter(
      (book) =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.category.toLowerCase().includes(query.toLowerCase()) ||
        book.description.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredBooks(results);
  };

  // إضافة كتاب جديد
  const handleAddBook = () => {
    if (!formData.title.trim() || !formData.author.trim() || !formData.category) {
      toast.error("العنوان والمؤلف والتصنيف مطلوبين");
      return;
    }

    const newBook = {
      id: `${id}-${Date.now()}`,
      ...formData,
    };

    setBooks([newBook, ...books]);
    setFilteredBooks([newBook, ...books]);
    setIsAddDialogOpen(false);
    setFormData({
      title: "",
      author: "",
      category: "",
      description: "",
    });
    toast.success("تمت إضافة الكتاب بنجاح");
  };

  // تعديل كتاب
  const handleEditBook = () => {
    if (!activeBook) return;
    if (!formData.title.trim() || !formData.author.trim() || !formData.category) {
      toast.error("العنوان والمؤلف والتصنيف مطلوبين");
      return;
    }

    const updatedBooks = books.map((book) =>
      book.id === activeBook.id
        ? { ...book, ...formData }
        : book
    );

    setBooks(updatedBooks);
    setFilteredBooks(updatedBooks);
    setIsEditDialogOpen(false);
    setActiveBook(null);
    setFormData({
      title: "",
      author: "",
      category: "",
      description: "",
    });
    toast.success("تم تحديث الكتاب بنجاح");
  };

  // حذف كتاب
  const handleDeleteBook = (id: string) => {
    const updatedBooks = books.filter((book) => book.id !== id);
    setBooks(updatedBooks);
    setFilteredBooks(updatedBooks);
    toast.success("تم حذف الكتاب بنجاح");
  };

  // عرض تفاصيل الكتاب
  const handleViewBook = (book: BookType) => {
    setActiveBook(book);
    setIsViewDialogOpen(true);
  };

  // فتح مربع حوار التعديل
  const handleEditDialogOpen = (book: BookType) => {
    setActiveBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      description: book.description,
    });
    setIsEditDialogOpen(true);
  };

  if (!library) {
    return (
      <div className="flex flex-col min-h-screen font-cairo" dir="rtl">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <BookIcon className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-4">المكتبة غير موجودة</h1>
            <p className="text-xl text-muted-foreground mb-8">
              المكتبة التي تبحث عنها غير موجودة.
            </p>
            <Link to="/dashboard">
              <Button className="text-lg py-6 px-8">
                <ChevronRight className="h-5 w-5 ml-2" />
                العودة إلى لوحة التحكم
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-cairo" dir="rtl">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* رأس المكتبة */}
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <Link to="/dashboard" className="text-muted-foreground hover:text-primary ml-4">
                <ChevronRight className="h-5 w-5" />
              </Link>
              <h1 className="text-3xl font-bold">{library.name}</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl text-lg">
              {library.description}
            </p>
          </div>

          {/* شريط الإجراءات */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="mb-4 md:mb-0 md:w-1/2">
              <SearchBar
                onSearch={handleSearch}
                placeholder="ابحث عن الكتب حسب العنوان أو المؤلف أو التصنيف..."
              />
            </div>
            <Button
              onClick={() => {
                setFormData({
                  title: "",
                  author: "",
                  category: "",
                  description: "",
                });
                setIsAddDialogOpen(true);
              }}
              className="text-lg py-6 px-8"
            >
              <Plus className="h-5 w-5 ml-2" />
              إضافة كتاب
            </Button>
          </div>

          {/* شبكة الكتب */}
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onView={handleViewBook}
                  onEdit={handleEditDialogOpen}
                  onDelete={handleDeleteBook}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <BookIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">لم يتم العثور على كتب</h3>
              <p className="text-muted-foreground mb-6 text-lg">
                {books.length > 0
                  ? "جرب مصطلح بحث مختلفًا."
                  : "أضف أول كتاب إلى هذه المكتبة."}
              </p>
              <Button
                onClick={() => {
                  setFormData({
                    title: "",
                    author: "",
                    category: "",
                    description: "",
                  });
                  setIsAddDialogOpen(true);
                }}
                className="text-lg py-6 px-8"
              >
                <Plus className="h-5 w-5 ml-2" />
                إضافة كتاب
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* مربع حوار إضافة كتاب */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent dir="rtl" className="font-cairo">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right text-lg">
                التصنيف *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className="col-span-3 text-right py-6 text-lg">
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
          <DialogFooter className="flex-row-reverse sm:justify-end">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="text-lg py-6 px-8">
              إلغاء
            </Button>
            <Button onClick={handleAddBook} className="text-lg py-6 px-8">إضافة كتاب</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* مربع حوار تعديل كتاب */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent dir="rtl" className="font-cairo">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right text-lg">
                التصنيف *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className="col-span-3 text-right py-6 text-lg">
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
          <DialogFooter className="flex-row-reverse sm:justify-end">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="text-lg py-6 px-8">
              إلغاء
            </Button>
            <Button onClick={handleEditBook} className="text-lg py-6 px-8">حفظ التغييرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* مربع حوار عرض الكتاب */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[525px]" dir="rtl" className="font-cairo">
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
    </div>
  );
};

export default Library;
