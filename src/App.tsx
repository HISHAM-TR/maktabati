
import React, { useState, createContext, useContext, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Library from "./pages/Library";
import Admin from "./pages/Admin";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { Profile as ProfileType } from "./types/database";

export type User = {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  country?: string;
  phoneNumber?: string;
  profileImage?: string;
  status?: string;
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

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [libraries, setLibraries] = useState<Record<string, LibraryType>>({});

  // تحميل المكتبات من التخزين المحلي (مؤقتًا حتى نقوم بالكامل بربط Supabase)
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
  }, []);

  // حفظ المكتبات في التخزين المحلي (مؤقتًا)
  useEffect(() => {
    localStorage.setItem("libraries", JSON.stringify(libraries));
  }, [libraries]);

  // التحقق من جلسة المستخدم عند تحميل التطبيق
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          try {
            // جلب بيانات الملف الشخصي من قاعدة البيانات
            const { data: profileData, error } = await supabase
              .from<ProfileType>('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (error) throw error;

            if (profileData) {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                name: profileData.name,
                role: profileData.role,
                country: profileData.country,
                phoneNumber: profileData.phone_number,
                profileImage: profileData.profile_image,
                status: profileData.status
              });
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
            toast.error('حدث خطأ أثناء تحميل بيانات المستخدم');
          }
        } else {
          setUser(null);
        }
      }
    );

    // التحقق من وجود جلسة حالية
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase
          .from<ProfileType>('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profileData, error }) => {
            if (error) {
              console.error('Error fetching user profile:', error);
              return;
            }

            if (profileData) {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                name: profileData.name,
                role: profileData.role,
                country: profileData.country,
                phoneNumber: profileData.phone_number,
                profileImage: profileData.profile_image,
                status: profileData.status
              });
            }
          });
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

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

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      // بيانات المستخدم سيتم تحميلها تلقائيًا من خلال مستمع onAuthStateChange
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "بيانات اعتماد غير صالحة");
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    additionalData?: { country?: string; phoneNumber?: string; profileImage?: string }
  ) => {
    try {
      // إنشاء حساب المستخدم
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            country: additionalData?.country,
            phone_number: additionalData?.phoneNumber,
            profile_image: additionalData?.profileImage
          }
        }
      });

      if (error) throw error;

      // التحقق من البريد الإلكتروني سيتم تفعيله من خلال Supabase
      toast.success("تم إنشاء الحساب بنجاح. الرجاء التحقق من بريدك الإلكتروني للتفعيل.");
      
    } catch (error: any) {
      console.error("Registration error:", error);
      throw new Error(error.message || "بيانات تسجيل غير صالحة");
    }
  };

  const updateUserInfo = async (updatedUser: User) => {
    try {
      // تحديث الملف الشخصي في قاعدة البيانات
      const { error } = await supabase
        .from<ProfileType>('profiles')
        .update({
          name: updatedUser.name,
          country: updatedUser.country,
          phone_number: updatedUser.phoneNumber,
          profile_image: updatedUser.profileImage
        })
        .eq('id', updatedUser.id);

      if (error) throw error;

      // تحديث حالة المستخدم في التطبيق
      setUser(updatedUser);
      toast.success("تم تحديث الملف الشخصي بنجاح");
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error.message || "فشل تحديث الملف الشخصي");
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ user, login, register, logout, updateUserInfo }}>
        <LibraryContext.Provider value={{ libraries, addLibrary, updateLibrary, deleteLibrary, getLibrary }}>
          <BrowserRouter>
            <TooltipProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
                <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
                <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
                <Route path="/library/:id" element={user ? <Library /> : <Navigate to="/login" />} />
                <Route path="/admin" element={user?.role === "admin" ? <Admin /> : <Navigate to="/dashboard" />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Sonner />
            </TooltipProvider>
          </BrowserRouter>
        </LibraryContext.Provider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
