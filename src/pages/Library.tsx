
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BookCard, { BookType } from "@/components/ui/BookCard";
import { useLibrary } from "@/App";

// Import our new components
import LibraryLoading from "@/components/library/LibraryLoading";
import LibraryHeading from "@/components/library/LibraryHeading";
import LibraryActions from "@/components/library/LibraryActions";
import EmptyLibraryState from "@/components/library/EmptyLibraryState";
import { BookDialogs, defaultFormData } from "@/components/library/BookDialogs";
import LibraryStats from "@/components/ui/stats/LibraryStats";

// Initial book categories
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

type ExtendedBookType = BookType & {
  volumes?: number;
};

const Library = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getLibrary, updateLibrary } = useLibrary();
  
  const [library, setLibrary] = useState<any>(null);
  const [books, setBooks] = useState<ExtendedBookType[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<ExtendedBookType[]>([]);
  const [bookCategories, setBookCategories] = useState<string[]>(initialBookCategories);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Add refs for our dialog components to call their methods
  const bookDialogsRef = useRef<{
    handleViewBook: (book: BookType) => void;
    handleEditDialogOpen: (book: BookType) => void;
  } | null>(null);

  useEffect(() => {
    document.title = "المكتبة | نظام إدارة المكتبات";
    
    if (id) {
      const foundLibrary = getLibrary(id);
      
      if (foundLibrary) {
        setLibrary(foundLibrary);
        setBooks(foundLibrary.books || []);
        setFilteredBooks(foundLibrary.books || []);
      } else {
        // Create an empty library for new IDs
        setLibrary({
          id,
          name: "مكتبة جديدة",
          description: "وصف المكتبة الجديدة",
          books: []
        });
        setBooks([]);
        setFilteredBooks([]);
      }
    }
  }, [id, getLibrary]);

  // When books are updated, update the library in context
  useEffect(() => {
    if (library && id) {
      const updatedLibrary = {
        ...library,
        books: books
      };
      updateLibrary(updatedLibrary);
    }
  }, [books, library, id, updateLibrary]);

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
        book.description?.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredBooks(results);
  };

  const handleDeleteBook = (id: string) => {
    const updatedBooks = books.filter((book) => book.id !== id);
    setBooks(updatedBooks);
    setFilteredBooks(updatedBooks);
    toast.success("تم حذف الكتاب بنجاح");
  };

  const getStatusCounts = () => {
    return {
      available: books.filter(book => book.status === "available").length,
      borrowed: books.filter(book => book.status === "borrowed").length,
      lost: books.filter(book => book.status === "lost").length,
      damaged: books.filter(book => book.status === "damaged").length
    };
  };

  const openAddBookDialog = () => {
    setIsAddDialogOpen(true);
  };

  if (!library) {
    return <LibraryLoading />;
  }

  return (
    <div className="flex flex-col min-h-screen font-cairo" dir="rtl">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <LibraryHeading name={library.name} description={library.description} />

          <LibraryStats
            totalLibraries={1}
            totalBooks={books.length}
            totalCategories={[...new Set(books.map(book => book.category))].length}
            totalVolumes={books.reduce((sum, book) => sum + (book.volumes || 1), 0)}
            statusCounts={getStatusCounts()}
          />

          <LibraryActions 
            onSearch={handleSearch} 
            onAddBookClick={openAddBookDialog} 
          />

          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onView={(book) => bookDialogsRef.current?.handleViewBook(book)}
                  onEdit={(book) => bookDialogsRef.current?.handleEditDialogOpen(book)}
                  onDelete={handleDeleteBook}
                />
              ))}
            </div>
          ) : (
            <EmptyLibraryState 
              booksExist={books.length > 0} 
              onAddBook={openAddBookDialog} 
            />
          )}
        </div>
      </main>

      <Footer />

      <BookDialogs
        books={books}
        setBooks={setBooks}
        setFilteredBooks={setFilteredBooks}
        bookCategories={bookCategories}
        setBookCategories={setBookCategories}
        libraryId={id || ""}
        ref={bookDialogsRef}
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
      />
    </div>
  );
};

export default Library;
