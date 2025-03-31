
import React, { useState, createContext, useContext, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Library from "./pages/Library";
import Admin from "./pages/Admin";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import Maintenance from "./pages/Maintenance";
import { MaintenanceSettings } from "./components/admin/types";

export type User = {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  country?: string;
  phoneNumber?: string;
  profileImage?: string; // Added profile image field
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string, 
    email: string, 
    password: string, 
    additionalData?: { country?: string; phoneNumber?: string; profileImage?: string }
  ) => Promise<void>;
  logout: () => void;
  updateUserInfo: (updatedUser: User) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("يجب استخدام useAuth داخل AuthProvider");
  }
  return context;
};

export type LibraryType = {
  id: string;
  name: string;
  description: string;
  books?: any[];
};

type LibraryContextType = {
  libraries: Record<string, LibraryType>;
  addLibrary: (library: LibraryType) => void;
  updateLibrary: (library: LibraryType) => void;
  deleteLibrary: (id: string) => void;
  getLibrary: (id: string) => LibraryType | undefined;
};

export const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error("يجب استخدام useLibrary داخل LibraryProvider");
  }
  return context;
};

// إضافة سياق جديد لإعدادات الصيانة
type MaintenanceContextType = {
  maintenanceSettings: MaintenanceSettings;
  updateMaintenanceSettings: (settings: MaintenanceSettings) => void;
};

export const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export const useMaintenance = () => {
  const context = useContext(MaintenanceContext);
  if (context === undefined) {
    throw new Error("يجب استخدام useMaintenance داخل MaintenanceProvider");
  }
  return context;
};

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [libraries, setLibraries] = useState<Record<string, LibraryType>>({});
  const [maintenanceSettings, setMaintenanceSettings] = useState<MaintenanceSettings>({
    enabled: false,
    message: "الموقع تحت الصيانة حاليًا. يرجى العودة لاحقًا."
  });

  useEffect(() => {
    const savedLibraries = localStorage.getItem("libraries");
    if (savedLibraries) {
      try {
        setLibraries(JSON.parse(savedLibraries));
      } catch (error) {
        console.error("Error parsing saved libraries:", error);
        localStorage.removeItem("libraries");
      }
    }

    // استرجاع إعدادات الصيانة من التخزين المحلي
    const savedMaintenanceSettings = localStorage.getItem("maintenanceSettings");
    if (savedMaintenanceSettings) {
      try {
        setMaintenanceSettings(JSON.parse(savedMaintenanceSettings));
      } catch (error) {
        console.error("Error parsing maintenance settings:", error);
        localStorage.removeItem("maintenanceSettings");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("libraries", JSON.stringify(libraries));
  }, [libraries]);

  useEffect(() => {
    localStorage.setItem("maintenanceSettings", JSON.stringify(maintenanceSettings));
  }, [maintenanceSettings]);

  const addLibrary = (library: LibraryType) => {
    setLibraries(prevLibraries => {
      const updatedLibraries = { ...prevLibraries, [library.id]: library };
      return updatedLibraries;
    });
  };

  const updateLibrary = (library: LibraryType) => {
    setLibraries(prevLibraries => {
      if (!prevLibraries[library.id]) return prevLibraries;
      return { ...prevLibraries, [library.id]: library };
    });
  };

  const deleteLibrary = (id: string) => {
    setLibraries(prevLibraries => {
      const updatedLibraries = { ...prevLibraries };
      delete updatedLibraries[id];
      return updatedLibraries;
    });
  };

  const getLibrary = (id: string) => {
    return libraries[id];
  };

  const updateMaintenanceSettings = (settings: MaintenanceSettings) => {
    setMaintenanceSettings(settings);
  };

  const login = async (email: string, password: string) => {
    console.log("تسجيل الدخول باستخدام:", email, password);
    
    if (email === "admin@admin.com" && password === "123456") {
      const mockUser = {
        id: "admin",
        email,
        name: "مدير النظام",
        role: "admin" as const,
        country: "السعودية",
        phoneNumber: "+966 5XXXXXXXX",
        profileImage: "" // Default empty profile image
      };
      
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
    } else if (email && password && password.length >= 6) {
      const mockUser = {
        id: "123",
        email,
        name: email.split("@")[0],
        role: "user" as const,
        country: "السعودية",
        phoneNumber: "+966 5XXXXXXXX",
        profileImage: "" // Default empty profile image
      };
      
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
    } else {
      throw new Error("بيانات اعتماد غير صالحة");
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    additionalData?: { country?: string; phoneNumber?: string; profileImage?: string }
  ) => {
    console.log("التسجيل:", name, email, password, additionalData);
    
    if (name && email && password) {
      const mockUser = {
        id: "123",
        email,
        name,
        role: "user" as const,
        country: additionalData?.country || "السعودية",
        phoneNumber: additionalData?.phoneNumber || "",
        profileImage: additionalData?.profileImage || ""
      };
      
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
    } else {
      throw new Error("بيانات تسجيل غير صالحة");
    }
  };

  const updateUserInfo = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // مكون للتحقق من حالة الصيانة
  const RequireAuth = ({ children }: { children: JSX.Element }) => {
    // إذا كان وضع الصيانة مفعل والمستخدم ليس مشرفًا، توجيه إلى صفحة الصيانة
    if (maintenanceSettings.enabled && (!user || user.role !== "admin")) {
      return <Navigate to="/maintenance" />;
    }

    if (!user) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  // مكون للتحقق من صلاحية المشرف
  const RequireAdmin = ({ children }: { children: JSX.Element }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }

    if (user.role !== "admin") {
      return <Navigate to="/dashboard" />;
    }

    return children;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ user, login, register, logout, updateUserInfo }}>
        <LibraryContext.Provider value={{ libraries, addLibrary, updateLibrary, deleteLibrary, getLibrary }}>
          <MaintenanceContext.Provider value={{ maintenanceSettings, updateMaintenanceSettings }}>
            <BrowserRouter>
              <TooltipProvider>
                <Routes>
                  {/* صفحات عامة متاحة دائماً */}
                  <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
                  <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
                  <Route path="/maintenance" element={<Maintenance message={maintenanceSettings.message} />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/contact" element={<Contact />} />
                  
                  {/* الصفحات التي تتطلب تحقق من وضع الصيانة */}
                  <Route path="/" element={
                    maintenanceSettings.enabled && (!user || user.role !== "admin") 
                      ? <Navigate to="/maintenance" /> 
                      : <Index />
                  } />
                  
                  {/* الصفحات المحمية */}
                  <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
                  <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
                  <Route path="/library/:id" element={<RequireAuth><Library /></RequireAuth>} />
                  <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
                  
                  {/* صفحة غير موجودة */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
                <Sonner />
              </TooltipProvider>
            </BrowserRouter>
          </MaintenanceContext.Provider>
        </LibraryContext.Provider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
