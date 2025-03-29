
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
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Contact from "./pages/Contact";
import { Profile as ProfileType, Tables } from "./types/database";

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
  deleteUser: (userId: string) => Promise<void>;
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

  useEffect(() => {
    localStorage.setItem("libraries", JSON.stringify(libraries));
  }, [libraries]);

  useEffect(() => {
    // First, set up the auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        if (session?.user) {
          try {
            const { data: profileData, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (error) {
              console.error("Error fetching profile:", error);
              toast.error("حدث خطأ أثناء تحميل بيانات المستخدم");
              return;
            }

            if (profileData) {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                name: profileData.name,
                role: profileData.role as "admin" | "user",
                country: profileData.country,
                phoneNumber: profileData.phone_number,
                profileImage: profileData.profile_image,
                status: profileData.status
              });
            } else {
              // Handle the case where profile doesn't exist yet (new Google sign-in)
              if (event === 'SIGNED_IN') {
                const userData = {
                  id: session.user.id,
                  name: session.user.user_metadata.full_name || session.user.user_metadata.name || 'User',
                  email: session.user.email,
                  role: 'user',
                  profile_image: session.user.user_metadata.avatar_url || session.user.user_metadata.picture
                };

                const { error: insertError } = await supabase
                  .from('profiles')
                  .insert([userData]);

                if (insertError) {
                  console.error('Error creating user profile:', insertError);
                  toast.error('فشل إنشاء بيانات المستخدم');
                } else {
                  setUser({
                    id: userData.id,
                    email: userData.email || '',
                    name: userData.name,
                    role: 'user',
                    profileImage: userData.profile_image
                  });
                }
              }
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

    // Then, check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profileData, error }) => {
            if (error) {
              console.error('Error fetching user profile:', error);
              toast.error('حدث خطأ أثناء تحميل بيانات المستخدم');
              return;
            }

            if (profileData) {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                name: profileData.name,
                role: profileData.role as "admin" | "user",
                country: profileData.country,
                phoneNumber: profileData.phone_number,
                profileImage: profileData.profile_image,
                status: profileData.status
              });
            }
          });
      }
    });

    // Parse the URL hash for access token (for handling redirects from OAuth)
    if (window.location.hash && window.location.hash.includes('access_token')) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      if (accessToken) {
        // Clean the URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

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

      if (error) {
        console.error("Login error:", error);
        throw error;
      }
      
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

      toast.success("تم إنشاء الحساب بنجاح. الرجاء التحقق من بريدك الإلكتروني للتفعيل.");
      
    } catch (error: any) {
      console.error("Registration error:", error);
      throw new Error(error.message || "بيانات تسجيل غير صالحة");
    }
  };

  const updateUserInfo = async (updatedUser: User) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updatedUser.name,
          country: updatedUser.country,
          phone_number: updatedUser.phoneNumber,
          profile_image: updatedUser.profileImage
        })
        .eq('id', updatedUser.id);

      if (error) throw error;

      setUser(updatedUser);
      toast.success("تم تحديث الملف الشخصي بنجاح");
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error.message || "فشل تحديث الملف الشخصي");
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      if (!user || user.role !== "admin") {
        throw new Error("ليس لديك صلاحية حذف المستخدمين");
      }

      const { error } = await supabase.functions.invoke('admin-delete-user', {
        body: { userId }
      });

      if (error) throw error;
      
      toast.success("تم حذف المستخدم بنجاح");
    } catch (error: any) {
      console.error("Delete user error:", error);
      toast.error(error.message || "فشل حذف المستخدم");
      throw error;
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
      <AuthContext.Provider value={{ user, login, register, logout, updateUserInfo, deleteUser }}>
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
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/contact" element={<Contact />} />
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
