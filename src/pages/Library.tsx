
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BookIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BookCard, { BookType } from "@/components/ui/BookCard";
import SearchBar from "@/components/ui/SearchBar";
import LibraryHeader from "@/components/library/LibraryHeader";
import NoBooks from "@/components/library/NoBooks";
import AddBookDialog, { BookFormData } from "@/components/library/AddBookDialog";
import EditBookDialog from "@/components/library/EditBookDialog";
import ViewBookDialog from "@/components/library/ViewBookDialog";

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

const initialBooksData = {
  "1": [
    {
      id: "1-1",
      title: "سيد الخواتم",
      author: "ج.ر.ر. تولكين",
      category: "خيال",
      description: "رواية خيالية ملحمية عن مهمة لتدمير خاتم قوي.",
      volumes: 3,
    },
    {
      id: "1-2",
      title: "كثبان",
      author: "فرانك هربرت",
      category: "خيال علمي",
      description: "رواية خيال علمي تدور في مستقبل بعيد وسط مجتمع إقطاعي بين النجوم.",
      volumes: 1,
    },
    {
      id: "1-3",
      title: "كبرياء وتحامل",
      author: "جين أوستن",
      category: "كلاسيكي",
      description: "رواية رومانسية تتبع التطور العاطفي للبطلة إليزابيث بينيت.",
      volumes: 1,
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
    },
    {
      id: "2-2",
      title: "أنماط التصميم",
      author: "إريك جاما، ريتشارد هيلم، رالف جونسون، جون فليسيدس",
      category: "برمجة",
      description: "عناصر البرمجيات الموجهة للكائنات القابلة لإعادة الاستخدام.",
      volumes: 1,
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
    },
    {
      id: "3-2",
      title: "ما وراء الخير والشر",
      author: "فريدريك نيتشه",
      category: "فلسفة",
      description: "مقدمة لفلسفة المستقبل.",
      volumes: 1,
    },
  ],
};

const initialBookCategories = [
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
  const [books, setBooks] = useState<ExtendedBookType[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<ExtendedBookType[]>([]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [activeBook, setActiveBook] = useState<ExtendedBookType | null>(null);
  
  const [bookCategories, setBookCategories] = useState<string[]>(initialBookCategories);

  useEffect(() => {
    document.title = "المكتبة | نظام إدارة المكتبات";
    
    if (id && libraryData[id as keyof typeof libraryData]) {
      setLibrary(libraryData[id as keyof typeof libraryData]);
      
      if (initialBooksData[id as keyof typeof initialBooksData]) {
        setBooks(initialBooksData[id as keyof typeof initialBooksData]);
        setFilteredBooks(initialBooksData[id as keyof typeof initialBooksData]);
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

  const handleAddBook = (formData: BookFormData) => {
    // Check if this is a new category addition
    if (formData.title === "_NEW_CATEGORY_") {
      setBookCategories([...bookCategories, formData.category]);
      toast.success("تمت إضافة التصنيف الجديد");
      return;
    }

    const newBook = {
      id: `${id}-${Date.now()}`,
      title: formData.title,
      author: formData.author,
      category: formData.category,
      description: formData.description,
      volumes: formData.volumes,
    };

    setBooks([newBook, ...books]);
    setFilteredBooks([newBook, ...books]);
    setIsAddDialogOpen(false);
    toast.success("تمت إضافة الكتاب بنجاح");
  };

  const handleEditBook = (formData: BookFormData) => {
    if (!activeBook) return;

    // Check if this is a new category addition
    if (formData.title === "_NEW_CATEGORY_") {
      setBookCategories([...bookCategories, formData.category]);
      toast.success("تمت إضافة التصنيف الجديد");
      return;
    }

    const updatedBooks = books.map((book) =>
      book.id === activeBook.id
        ? { 
            ...book, 
            title: formData.title,
            author: formData.author,
            category: formData.category,
            description: formData.description,
            volumes: formData.volumes,
          }
        : book
    );

    setBooks(updatedBooks);
    setFilteredBooks(updatedBooks);
    setIsEditDialogOpen(false);
    setActiveBook(null);
    toast.success("تم تحديث الكتاب بنجاح");
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
    setIsEditDialogOpen(true);
  };

  const handleViewToEditTransition = () => {
    setIsViewDialogOpen(false);
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
          <LibraryHeader 
            id={library.id}
            name={library.name}
            description={library.description}
            onAddBookClick={() => setIsAddDialogOpen(true)}
          />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="mb-4 md:mb-0 md:w-1/2">
              <SearchBar
                onSearch={handleSearch}
                placeholder="ابحث عن الكتب حسب العنوان أو المؤلف أو التصنيف..."
              />
            </div>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="text-lg py-6 px-8"
            >
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
            <NoBooks 
              hasBooks={books.length > 0}
              onAddBookClick={() => setIsAddDialogOpen(true)}
            />
          )}
        </div>
      </main>

      <Footer />

      <AddBookDialog 
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddBook={handleAddBook}
        bookCategories={bookCategories}
      />

      <EditBookDialog 
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onEditBook={handleEditBook}
        bookCategories={bookCategories}
        activeBook={activeBook}
      />

      <ViewBookDialog 
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        onEditClick={handleViewToEditTransition}
        activeBook={activeBook}
      />
    </div>
  );
};

export default Library;
