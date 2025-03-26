
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ChevronLeft, 
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

// Mock library data
const libraryData = {
  "1": {
    id: "1",
    name: "Fiction Collection",
    description: "My collection of fiction books, including fantasy, sci-fi, and historical fiction.",
  },
  "2": {
    id: "2",
    name: "Tech Books",
    description: "Programming and technology reference books.",
  },
  "3": {
    id: "3",
    name: "Philosophy",
    description: "Collection of classic and modern philosophy texts.",
  },
};

// Mock books data
const initialBooksData = {
  "1": [
    {
      id: "1-1",
      title: "The Lord of the Rings",
      author: "J.R.R. Tolkien",
      category: "Fantasy",
      description: "An epic fantasy novel about a quest to destroy a powerful ring.",
    },
    {
      id: "1-2",
      title: "Dune",
      author: "Frank Herbert",
      category: "Science Fiction",
      description: "A science fiction novel set in a distant future amidst a feudal interstellar society.",
    },
    {
      id: "1-3",
      title: "Pride and Prejudice",
      author: "Jane Austen",
      category: "Classic",
      description: "A romantic novel following the emotional development of protagonist Elizabeth Bennet.",
    },
  ],
  "2": [
    {
      id: "2-1",
      title: "Clean Code",
      author: "Robert C. Martin",
      category: "Programming",
      description: "A handbook of agile software craftsmanship.",
    },
    {
      id: "2-2",
      title: "Design Patterns",
      author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
      category: "Programming",
      description: "Elements of Reusable Object-Oriented Software.",
    },
  ],
  "3": [
    {
      id: "3-1",
      title: "Republic",
      author: "Plato",
      category: "Philosophy",
      description: "A Socratic dialogue concerning justice, the order and character of the just city-state, and the just man.",
    },
    {
      id: "3-2",
      title: "Beyond Good and Evil",
      author: "Friedrich Nietzsche",
      category: "Philosophy",
      description: "Prelude to a Philosophy of the Future.",
    },
  ],
};

// Book categories
const bookCategories = [
  "Fantasy",
  "Science Fiction",
  "Classic",
  "Programming",
  "Philosophy",
  "Biography",
  "History",
  "Self-Help",
  "Mystery",
  "Thriller",
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

  // Load library data on mount
  useEffect(() => {
    document.title = "Library | Library Management System";
    
    if (id && libraryData[id as keyof typeof libraryData]) {
      setLibrary(libraryData[id as keyof typeof libraryData]);
      
      // Load books for this library
      if (initialBooksData[id as keyof typeof initialBooksData]) {
        setBooks(initialBooksData[id as keyof typeof initialBooksData]);
        setFilteredBooks(initialBooksData[id as keyof typeof initialBooksData]);
      }
    }
  }, [id]);

  // Handle search
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

  // Add new book
  const handleAddBook = () => {
    if (!formData.title.trim() || !formData.author.trim() || !formData.category) {
      toast.error("Title, author, and category are required");
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
    toast.success("Book added successfully");
  };

  // Edit book
  const handleEditBook = () => {
    if (!activeBook) return;
    if (!formData.title.trim() || !formData.author.trim() || !formData.category) {
      toast.error("Title, author, and category are required");
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
    toast.success("Book updated successfully");
  };

  // Delete book
  const handleDeleteBook = (id: string) => {
    const updatedBooks = books.filter((book) => book.id !== id);
    setBooks(updatedBooks);
    setFilteredBooks(updatedBooks);
  };

  // View book details
  const handleViewBook = (book: BookType) => {
    setActiveBook(book);
    setIsViewDialogOpen(true);
  };

  // Open edit dialog
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
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <BookIcon className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Library Not Found</h1>
            <p className="text-xl text-muted-foreground mb-8">
              The library you are looking for does not exist.
            </p>
            <Link to="/dashboard">
              <Button>
                <ChevronLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Library Header */}
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <Link to="/dashboard" className="text-muted-foreground hover:text-primary mr-4">
                <ChevronLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-3xl font-bold">{library.name}</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              {library.description}
            </p>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="mb-4 md:mb-0 md:w-1/2">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search books by title, author, or category..."
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
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Book
            </Button>
          </div>

          {/* Books Grid */}
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
              <h3 className="text-xl font-semibold mb-2">No books found</h3>
              <p className="text-muted-foreground mb-6">
                {books.length > 0
                  ? "Try a different search term."
                  : "Add your first book to this library."}
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
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Book
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Add Book Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Book</DialogTitle>
            <DialogDescription>
              Add a new book to your library.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="col-span-3"
                placeholder="Enter book title"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="author" className="text-right">
                Author *
              </Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                className="col-span-3"
                placeholder="Enter author name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {bookCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="col-span-3"
                placeholder="Enter book description"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBook}>Add Book</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Book Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
            <DialogDescription>
              Update book information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">
                Title *
              </Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-author" className="text-right">
                Author *
              </Label>
              <Input
                id="edit-author"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right">
                Category *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bookCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="col-span-3"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditBook}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Book Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          {activeBook && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{activeBook.title}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Author:</span>
                  <span>{activeBook.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookIcon className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Category:</span>
                  <span>{activeBook.category}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Added on:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Description:</h4>
                  <p className="text-muted-foreground">
                    {activeBook.description || "No description available."}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setIsViewDialogOpen(false);
                  handleEditDialogOpen(activeBook);
                }}>
                  Edit Book
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
