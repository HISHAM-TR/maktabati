
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, createContext, useContext } from "react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Library from "./pages/Library";
import Admin from "./pages/Admin";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import NotFound from "./pages/NotFound";

type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
} | null;

type AuthContextType = {
  user: AuthUser;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<AuthUser>(null);

  // Mock authentication functions
  const login = async (email: string, password: string) => {
    // In a real app, this would make an API call
    console.log("Logging in with:", email, password);
    
    // Mock successful login
    if (email && password) {
      const mockUser = {
        id: "123",
        email,
        name: email.split("@")[0],
        role: email.includes("admin") ? "admin" as const : "user" as const,
      };
      
      setUser(mockUser);
      // In a real app, store auth token in localStorage/session
      localStorage.setItem("user", JSON.stringify(mockUser));
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const register = async (name: string, email: string, password: string) => {
    // In a real app, this would make an API call
    console.log("Registering:", name, email, password);
    
    // Mock successful registration
    if (name && email && password) {
      const mockUser = {
        id: "123",
        email,
        name,
        role: "user" as const,
      };
      
      setUser(mockUser);
      // In a real app, store auth token in localStorage/session
      localStorage.setItem("user", JSON.stringify(mockUser));
    } else {
      throw new Error("Invalid registration data");
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
          <Toaster />
          <Sonner />
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
        </TooltipProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
