
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

// بيانات وهمية للمكتبات
const initialLibraries = [
  {
    id: "1",
    name: "مجموعة الروايات",
    description: "مجموعتي من الروايات تتضمن الفانتازيا والخيال العلمي والروايات التاريخية.",
    bookCount: 42,
  },
  {
    id: "2",
    name: "كتب التقنية",
    description: "كتب البرمجة ومراجع التكنولوجيا.",
    bookCount: 17,
  },
  {
    id: "3",
    name: "الفلسفة",
    description: "مجموعة من نصوص الفلسفة الكلاسيكية والحديثة.",
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

  // تعيين العنوان عند التحميل
  useEffect(() => {
    document.title = "لوحة التحكم | نظام إدارة المكتبات";
  }, []);

  // معالجة البحث
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

  // إنشاء مكتبة جديدة
  const handleCreateLibrary = () => {
    if (!formData.name.trim()) {
      toast.error("اسم المكتبة مطلوب");
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
    toast.success("تم إنشاء المكتبة بنجاح");
  };

  // تعديل المكتبة
  const handleEditLibrary = () => {
    if (!activeLibrary) return;
    if (!formData.name.trim()) {
      toast.error("اسم المكتبة مطلوب");
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
    toast.success("تم تحديث المكتبة بنجاح");
  };

  // حذف المكتبة
  const handleDeleteLibrary = (id: string) => {
    const updatedLibraries = libraries.filter((lib) => lib.id !== id);
    setLibraries(updatedLibraries);
    setFilteredLibraries(updatedLibraries);
  };

  // فتح حوار التعديل
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
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* رأس لوحة التحكم */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">مكتباتي</h1>
              <p className="text-muted-foreground">
                إدارة مجموعات الكتب الخاصة بك حسب المكتبة
              </p>
            </div>
            <Button
              onClick={() => {
                setFormData({ name: "", description: "" });
                setIsCreateDialogOpen(true);
              }}
              className="mt-4 md:mt-0"
            >
              <Plus className="h-5 w-5 ml-2" />
              إنشاء مكتبة
            </Button>
          </div>

          {/* شريط البحث */}
          <div className="mb-8">
            <SearchBar
              onSearch={handleSearch}
              placeholder="ابحث عن المكتبات حسب الاسم أو الوصف..."
            />
          </div>

          {/* شبكة المكتبات */}
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
              <h3 className="text-xl font-semibold mb-2">لم يتم العثور على مكتبات</h3>
              <p className="text-muted-foreground mb-6">
                {libraries.length > 0
                  ? "جرب مصطلح بحث مختلف."
                  : "قم بإنشاء مكتبتك الأولى للبدء."}
              </p>
              <Button
                onClick={() => {
                  setFormData({ name: "", description: "" });
                  setIsCreateDialogOpen(true);
                }}
              >
                <Plus className="h-5 w-5 ml-2" />
                إنشاء مكتبة
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* حوار إنشاء مكتبة */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إنشاء مكتبة جديدة</DialogTitle>
            <DialogDescription>
              قم بإنشاء مكتبة جديدة لتنظيم كتبك.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                الاسم
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="col-span-3"
                placeholder="أدخل اسم المكتبة"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                الوصف
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="col-span-3"
                placeholder="وصف المكتبة الخاصة بك"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button onClick={handleCreateLibrary}>إنشاء مكتبة</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* حوار تعديل المكتبة */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل المكتبة</DialogTitle>
            <DialogDescription>
              تحديث معلومات المكتبة الخاصة بك.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                الاسم
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
                الوصف
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
              إلغاء
            </Button>
            <Button onClick={handleEditLibrary}>حفظ التغييرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
