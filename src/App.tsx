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

export type User = {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  country?: string;
  phoneNumber?: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string, 
    email: string, 
    password: string, 
    additionalData?: { country?: string; phoneNumber?: string }
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
    console.log("تسجيل الدخول باستخدام:", email, password);
    
    if (email && password) {
      const mockUser = {
        id: "123",
        email,
        name: email.split("@")[0],
        role: email.includes("admin") ? "admin" as const : "user" as const,
        country: "السعودية",
        phoneNumber: "+966 5XXXXXXXX"
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
    additionalData?: { country?: string; phoneNumber?: string }
  ) => {
    console.log("التسجيل:", name, email, password, additionalData);
    
    if (name && email && password) {
      const mockUser = {
        id: "123",
        email,
        name,
        role: "user" as const,
        country: additionalData?.country || "السعودية",
        phoneNumber: additionalData?.phoneNumber || ""
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
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </BrowserRouter>
        </LibraryContext.Provider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
