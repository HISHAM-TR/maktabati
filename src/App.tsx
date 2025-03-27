import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, createContext, useContext, useEffect } from "react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Library from "./pages/Library";
import Admin from "./pages/Admin";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import NotFound from "./pages/NotFound";

export type User = {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("يجب استخدام useAuth داخل AuthProvider");
  }
  return context;
};

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<User | null>(null);

  // Check for saved user on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // وظائف المصادقة التجريبية
  const login = async (email: string, password: string) => {
    // في تطبيق حقيقي، سيتم إجراء طلب API
    console.log("تسجيل الدخول باستخدام:", email, password);
    
    // محاكاة تسجيل دخول ناجح
    if (email && password) {
      const mockUser = {
        id: "123",
        email,
        name: email.split("@")[0],
        role: email.includes("admin") ? "admin" as const : "user" as const,
      };
      
      setUser(mockUser);
      // في تطبيق حقيقي، قم بتخزين رمز المصادقة في localStorage/session
      localStorage.setItem("user", JSON.stringify(mockUser));
    } else {
      throw new Error("بيانات اعتماد غير صالحة");
    }
  };

  const register = async (name: string, email: string, password: string) => {
    // في تطبيق حقيقي، سيتم إجراء طلب API
    console.log("التسجيل:", name, email, password);
    
    // محاكاة تسجيل ناجح
    if (name && email && password) {
      const mockUser = {
        id: "123",
        email,
        name,
        role: "user" as const,
      };
      
      setUser(mockUser);
      // في تطبيق حقيقي، قم بتخزين رمز المصادقة في localStorage/session
      localStorage.setItem("user", JSON.stringify(mockUser));
    } else {
      throw new Error("بيانات تسجيل غير صالحة");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ user, login, register, logout }}>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
              <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
              <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/library/:id" element={user ? <Library /> : <Navigate to="/login" />} />
              <Route path="/admin" element={user?.role === "admin" ? <Admin /> : <Navigate to="/dashboard" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
