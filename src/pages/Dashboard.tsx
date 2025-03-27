
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LibraryStats from "@/components/ui/stats/LibraryStats";
import { useAuth } from "@/App";
import LibraryDialogs from "@/components/dashboard/LibraryDialogs";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import LibrariesSection from "@/components/dashboard/LibrariesSection";
import { Library } from "@/components/dashboard/LibrariesGrid";

// بيانات وهمية للمكتبات
const initialLibraries: Library[] = [
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

// بيانات وهمية للإحصائيات
const statsData = {
  totalLibraries: 3,
  totalBooks: 67,
  totalCategories: 10,
  totalVolumes: 85,
  statusCounts: {
    available: 45,
    borrowed: 12,
    lost: 3,
    damaged: 7
  }
};

const Dashboard = () => {
  const { user } = useAuth();
  const [libraries, setLibraries] = useState<Library[]>(initialLibraries);
  const [filteredLibraries, setFilteredLibraries] = useState<Library[]>(initialLibraries);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeLibrary, setActiveLibrary] = useState<Library | null>(null);
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

    const newLibrary: Library = {
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

  // فتح حوار الإنشاء
  const openCreateDialog = () => {
    setFormData({ name: "", description: "" });
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* رأس لوحة التحكم */}
          <DashboardHeader 
            user={user} 
            onCreateLibraryClick={openCreateDialog} 
          />

          {/* إحصائيات المكتبة */}
          <LibraryStats 
            totalLibraries={statsData.totalLibraries} 
            totalBooks={statsData.totalBooks} 
            totalCategories={statsData.totalCategories} 
            totalVolumes={statsData.totalVolumes} 
            statusCounts={statsData.statusCounts}
          />

          {/* قسم المكتبات */}
          <LibrariesSection 
            libraries={filteredLibraries}
            onSearch={handleSearch}
            onDeleteLibrary={handleDeleteLibrary}
            onEditLibrary={openEditDialog}
            onCreateLibraryClick={openCreateDialog}
          />
        </div>
      </main>

      <Footer />

      {/* حوارات إنشاء وتعديل المكتبة */}
      <LibraryDialogs 
        isCreateDialogOpen={isCreateDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        formData={formData}
        setFormData={setFormData}
        handleCreateLibrary={handleCreateLibrary}
        handleEditLibrary={handleEditLibrary}
      />
    </div>
  );
};

export default Dashboard;
