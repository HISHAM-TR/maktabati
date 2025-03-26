
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LibraryCard from "@/components/ui/LibraryCard";
import SearchBar from "@/components/ui/SearchBar";
import { useAuth } from "@/App";

// Mock data for libraries
const initialLibraries = [
  {
    id: "1",
    name: "Fiction Collection",
    description: "My collection of fiction books, including fantasy, sci-fi, and historical fiction.",
    bookCount: 42,
  },
  {
    id: "2",
    name: "Tech Books",
    description: "Programming and technology reference books.",
    bookCount: 17,
  },
  {
    id: "3",
    name: "Philosophy",
    description: "Collection of classic and modern philosophy texts.",
    bookCount: 8,
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [libraries, setLibraries] = useState(initialLibraries);
  const [filteredLibraries, setFilteredLibraries] = useState(initialLibraries);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeLibrary, setActiveLibrary] = useState<{
    id: string;
    name: string;
    description: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Set title on mount
  useEffect(() => {
    document.title = "Dashboard | Library Management System";
  }, []);

  // Handle search
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredLibraries(libraries);
      return;
    }

    const results = libraries.filter(
      (library) =>
        library.name.toLowerCase().includes(query.toLowerCase()) ||
        library.description.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredLibraries(results);
  };

  // Create new library
  const handleCreateLibrary = () => {
    if (!formData.name.trim()) {
      toast.error("Library name is required");
      return;
    }

    const newLibrary = {
      id: `lib-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      bookCount: 0,
    };

    setLibraries([newLibrary, ...libraries]);
    setFilteredLibraries([newLibrary, ...libraries]);
    setIsCreateDialogOpen(false);
    setFormData({ name: "", description: "" });
    toast.success("Library created successfully");
  };

  // Edit library
  const handleEditLibrary = () => {
    if (!activeLibrary) return;
    if (!formData.name.trim()) {
      toast.error("Library name is required");
      return;
    }

    const updatedLibraries = libraries.map((lib) =>
      lib.id === activeLibrary.id
        ? { ...lib, name: formData.name, description: formData.description }
        : lib
    );

    setLibraries(updatedLibraries);
    setFilteredLibraries(updatedLibraries);
    setIsEditDialogOpen(false);
    setActiveLibrary(null);
    setFormData({ name: "", description: "" });
    toast.success("Library updated successfully");
  };

  // Delete library
  const handleDeleteLibrary = (id: string) => {
    const updatedLibraries = libraries.filter((lib) => lib.id !== id);
    setLibraries(updatedLibraries);
    setFilteredLibraries(updatedLibraries);
  };

  // Open edit dialog
  const openEditDialog = (id: string) => {
    const libraryToEdit = libraries.find((lib) => lib.id === id);
    if (libraryToEdit) {
      setActiveLibrary(libraryToEdit);
      setFormData({
        name: libraryToEdit.name,
        description: libraryToEdit.description,
      });
      setIsEditDialogOpen(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Libraries</h1>
              <p className="text-muted-foreground">
                Manage your book collections by library
              </p>
            </div>
            <Button
              onClick={() => {
                setFormData({ name: "", description: "" });
                setIsCreateDialogOpen(true);
              }}
              className="mt-4 md:mt-0"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Library
            </Button>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search libraries by name or description..."
            />
          </div>

          {/* Libraries Grid */}
          {filteredLibraries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLibraries.map((library) => (
                <LibraryCard
                  key={library.id}
                  id={library.id}
                  name={library.name}
                  description={library.description}
                  bookCount={library.bookCount}
                  onDelete={handleDeleteLibrary}
                  onEdit={openEditDialog}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Library className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No libraries found</h3>
              <p className="text-muted-foreground mb-6">
                {libraries.length > 0
                  ? "Try a different search term."
                  : "Create your first library to get started."}
              </p>
              <Button
                onClick={() => {
                  setFormData({ name: "", description: "" });
                  setIsCreateDialogOpen(true);
                }}
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Library
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Create Library Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Library</DialogTitle>
            <DialogDescription>
              Create a new library to organize your books.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="col-span-3"
                placeholder="Enter library name"
              />
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
                placeholder="Describe your library"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateLibrary}>Create Library</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Library Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Library</DialogTitle>
            <DialogDescription>
              Update your library information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="col-span-3"
              />
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
            <Button onClick={handleEditLibrary}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
