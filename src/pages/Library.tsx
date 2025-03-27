import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ChevronRight, 
  Plus, 
  Book as BookIcon, 
  User,
  Calendar,
  AlertCircle
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
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import LibraryStats from "@/components/ui/stats/LibraryStats";

type ExtendedBookType = BookType & {
  volumes?: number;
};

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

const initialBooksData: {
  [key: string]: ExtendedBookType[]
} = {
  "1": [
    {
      id: "1-1",
      title: "سيد الخواتم",
      author: "ج.ر.ر. تولكين",
      category: "خيال",
      description: "رواية خيالية ملحمية عن مهمة لتدمير خاتم قوي.",
      volumes: 3,
      status: "available" as "available" | "borrowed" | "lost" | "damaged",
    },
    {
      id: "1-2",
      title: "كثبان",
      author: "فرانك هربرت",
      category: "خيال علمي",
      description: "رواية خيال علمي تدور في مستقبل بعيد وسط مجتمع إقطاعي بين النجوم.",
      volumes: 1,
      status: "borrowed" as "available" | "borrowed" | "lost" | "damaged",
      borrowDate: new Date(2023, 5, 15),
    },
    {
      id: "1-3",
      title: "كبرياء وتحامل",
      author: "جين أوستن",
      category: "كلاسيكي",
      description: "رواية رومانسية تتبع التطور العاطفي للبطلة إليزابيث بينيت.",
      volumes: 1,
      status: "lost" as "available" | "borrowed" | "lost" | "damaged",
    },
  ],
  "2": [
    {
      id: "2-1",
      title: "كود نظيف",
      author: "روبرت سي. مارتن",
      category: "برمجة",
      description: "دليل لحرفية البرمجيات الرشيقة.",
      volumes: 1,
      status: "available" as "available" | "borrowed" | "lost" | "damaged",
    },
    {
      id: "2-2",
      title: "أنماط التصميم",
      author: "إريك جاما، ريتشارد هيلم، رالف جونسون، جون فليسيدس",
      category: "برمجة",
      description: "عناصر البرمجيات الموجهة للكائنات القابلة لإعادة الاستخدام.",
      volumes: 1,
      status: "damaged" as "available" | "borrowed" | "lost" | "damaged",
    },
  ],
  "3": [
    {
      id: "3-1",
      title: "الجمهورية",
      author: "أفلاطون",
      category: "فلسفة",
      description: "حوار سقراطي بخصوص العدالة، ونظام وطبيعة الدولة العادلة، والإنسان العادل.",
      volumes: 1,
      status: "available" as "available" | "borrowed" | "lost" | "damaged",
    },
    {
      id: "3-2",
      title: "ما وراء الخير والشر",
      author: "فريدريك نيتشه",
      category: "فلسفة",
      description: "مقدمة لفلسفة المستقبل.",
      volumes: 1,
      status: "borrowed" as "available" | "borrowed" | "lost" | "damaged",
      borrowDate: new Date(2023, 4, 10),
    },
  ],
};

const Library = () => {
  const { id } = useParams<{ id: string }>();
  const [library, setLibrary] = useState<any>(null);
  const [books, setBooks] = useState<ExtendedBookType[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<ExtendedBookType[]>([]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [activeBook, setActiveBook] = useState<ExtendedBookType | null>(null);
  
  const [bookCategories, setBookCategories] = useState<string[]>(initialBookCategories);
  const [newCategory, setNewCategory] = useState<string>("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
    volumes: 1,
    status: "available" as "available" | "borrowed" | "lost" | "damaged",
    borrowDate: null as Date | null,
  });

  useEffect(() => {
    document.title = "المكتبة | نظام إدارة المكتبات";
    
    if (id && libraryData[id as keyof typeof libraryData]) {
      setLibrary(libraryData[id as keyof typeof libraryData]);
      
      if (initialBooksData[id as keyof typeof initialBooksData]) {
        const booksData = initialBooksData[id as keyof typeof initialBooksData] as ExtendedBookType[];
        setBooks(booksData);
        setFilteredBooks(booksData);
      }
    }
  }, [id]);

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
    resetFormData();
    toast.success("تمت إضافة الكتاب بنجاح");
  };

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
    resetFormData();
    toast.success("تم تحديث الكتاب بنجاح");
  };

  const resetFormData = () => {
    setFormData({
      title: "",
      author: "",
      category: "",
      description: "",
      volumes: 1,
      status: "available",
      borrowDate: null,
    });
  };

  const handleDeleteBook = (id: string) => {
    const updatedBooks = books.filter((book) => book.id !== id);
    setBooks(updatedBooks);
    setFilteredBooks(updatedBooks);
    toast.success("تم حذف الكتاب بنجاح");
  };

  const handleViewBook = (book: ExtendedBookType) => {
    setActiveBook(book);
    setIsViewDialogOpen(true);
  };

  const handleEditDialogOpen = (book: ExtendedBookType) => {
    setActiveBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      description: book.description || "",
      volumes: book.volumes || 1,
      status: book.status || "available",
      borrowDate: book.borrowDate || null,
    });
    setIsEditDialogOpen(true);
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

    setBookCategories([...bookCategories, newCategory]);
    setFormData({ ...formData, category: newCategory });
    setNewCategory("");
    setIsAddingCategory(false);
    toast.success("تمت إضافة التصنيف الجديد");
  };

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

  const getStatusCounts = () => {
    return {
      available: books.filter(book => book.status === "available").length,
      borrowed: books.filter(book => book.status === "borrowed").length,
      lost: books.filter(book => book.status === "lost").length,
      damaged: books.filter(book => book.status === "damaged").length
    };
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
          <div className="mb-8 flex justify-between items-center">
            <div>
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
          </div>

          <LibraryStats
            totalLibraries={1}
            totalBooks={books.length}
            totalCategories={[...new Set(books.map(book => book.category))].length}
            totalVolumes={books.reduce((sum, book) => sum + (book.volumes || 1), 0)}
            statusCounts={getStatusCounts()}
          />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="mb-4 md:mb-0 md:w-1/2">
              <SearchBar
                onSearch={handleSearch}
                placeholder="ابحث عن الكتب حسب العنوان أو المؤلف أو التصنيف..."
                label="البحث في المكتبة:"
              />
            </div>
            <Button
              onClick={() => {
                resetFormData();
                setIsAddDialogOpen(true);
              }}
              className="text-lg py-6 px-8"
            >
              <Plus className="h-5 w-5 ml-2" />
              إضافة كتاب
            </Button>
          </div>

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
                  resetFormData();
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

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                >
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="available" id="available" />
                    <Label htmlFor="available" className="text-lg cursor-pointer">متاح</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="borrowed" id="borrowed" />
                    <Label htmlFor="borrowed" className="text-lg cursor-pointer">مستعار</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="lost" id="lost" />
                    <Label htmlFor="lost" className="text-lg cursor-pointer">مفقود</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="damaged" id="damaged" />
                    <Label htmlFor="damaged" className="text-lg cursor-pointer">تالف</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            {formData.status === "borrowed" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-lg">
                  تاريخ الإعارة
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-right font-normal text-lg py-6",
                          !formData.borrowDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="ml-2 h-4 w-4" />
                        {formData.borrowDate ? (
                          format(formData.borrowDate, "yyyy-MM-dd")
                        ) : (
                          <span>اختر تاريخ الإعارة</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={formData.borrowDate || undefined}
                        onSelect={(date) => setFormData({ ...formData, borrowDate: date })}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
            
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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
                      <Plus className="h-4 w-4 ml-1" />
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
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit-status" className="text-right text-lg pt-2">
                حالة الكتاب
              </Label>
              <div className="col-span-3">
                <RadioGroup 
                  value={formData.status} 
                  onValueChange={(value: "available" | "borrowed" | "lost" | "damaged") => 
                    setFormData({ ...formData, status: value })
                  }
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="available" id="edit-available" />
                    <Label htmlFor="edit-available" className="text-lg cursor-pointer">متاح</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="borrowed" id="edit-borrowed" />
                    <Label htmlFor="edit-borrowed" className="text-lg cursor-pointer">مستعار</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="lost" id="edit-lost" />
                    <Label htmlFor="edit-lost" className="text-lg cursor-pointer">مفقود</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="damaged" id="edit-damaged" />
                    <Label htmlFor="edit-damaged" className="text-lg cursor-pointer">تالف</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            {formData.status === "borrowed" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-lg">
                  تاريخ الإعارة
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-right font-normal text-lg py-6",
                          !formData.borrowDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="ml-2 h-4 w-4" />
                        {formData.borrowDate ? (
                          format(formData.borrowDate, "yyyy-MM-dd")
                        ) : (
                          <span>اختر تاريخ الإعارة</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={formData.borrowDate || undefined}
                        onSelect={(date) => setFormData({ ...formData, borrowDate: date })}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
            
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
                  <span className="text-lg">{activeBook.volumes || 1}</span>
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
                    <span className="text-lg">{format(new Date(activeBook.borrowDate),
