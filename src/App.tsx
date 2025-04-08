import React, { useState, createContext, useContext, useEffect, Suspense } from "react";
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
import Tickets from "./pages/Tickets";
import Maintenance from "./pages/Maintenance";
import DemoAccount from "./pages/Auth/DemoAccount";
import { MaintenanceSettings } from "./components/admin/types";
import { SocialMedia } from "./components/admin/SocialMediaTab";
import { Ticket } from "./components/tickets/TicketTypes";
import { LibraryType, BookType } from "./types/LibraryTypes";
import { UserRole } from "./components/admin/RoleTypes";
import { fetchCurrentUser, signOut } from "./lib/local-auth-utils";

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  country?: string;
  phoneNumber?: string;
  profileImage?: string;
  lastLogin?: string;
  libraryCount?: number;
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
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("يجب استخدام useAuth داخل AuthProvider");
  }
  return context;
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

type TicketContextType = {
  tickets: Ticket[];
  addTicket: (ticket: Ticket) => void;
  updateTicket: (ticket: Ticket) => void;
  getTicket: (id: string) => Ticket | undefined;
  updateTicketStatus: (ticketId: string, status: "open" | "in-progress" | "closed") => void;
  replyToTicket: (ticketId: string, message: string) => void;
};

export const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error("يجب استخدام useTickets داخل TicketProvider");
  }
  return context;
};

type AppContextType = {
  socialLinks: SocialMedia[];
  updateSocialLinks: (links: SocialMedia[]) => void;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("يجب استخدام useApp داخل AppProvider");
  }
  return context;
};

const queryClient = new QueryClient();

const initialSocialLinks: SocialMedia[] = [
  {
    id: "1",
    name: "فيسبوك",
    url: "https://www.facebook.com/",
    icon: "facebook",
    isActive: true
  },
  {
    id: "2",
    name: "تويتر",
    url: "https://twitter.com/",
    icon: "twitter",
    isActive: true
  },
  {
    id: "3",
    name: "انستغرام",
    url: "https://www.instagram.com/",
    icon: "instagram",
    isActive: true
  },
  {
    id: "4",
    name: "يوتيوب",
    url: "https://www.youtube.com/",
    icon: "youtube",
    isActive: false
  },
  {
    id: "5",
    name: "لينكد إن",
    url: "https://www.linkedin.com/",
    icon: "linkedin",
    isActive: false
  },
  {
    id: "6",
    name: "جيتهب",
    url: "https://github.com/",
    icon: "github",
    isActive: false
  }
];

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [libraries, setLibraries] = useState<Record<string, LibraryType>>({});
  const [maintenanceSettings, setMaintenanceSettings] = useState<MaintenanceSettings>({
    enabled: false,
    message: "الموقع تحت الصيانة حاليًا. يرجى العودة لاحقًا."
  });
  const [socialLinks, setSocialLinks] = useState<SocialMedia[]>(initialSocialLinks);
  const [tickets, setTickets] = useState<Ticket[]>([]);

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

    const savedMaintenanceSettings = localStorage.getItem("maintenanceSettings");
    if (savedMaintenanceSettings) {
      try {
        setMaintenanceSettings(JSON.parse(savedMaintenanceSettings));
      } catch (error) {
        console.error("Error parsing maintenance settings:", error);
        localStorage.removeItem("maintenanceSettings");
      }
    }

    const savedSocialLinks = localStorage.getItem("socialLinks");
    if (savedSocialLinks) {
      try {
        setSocialLinks(JSON.parse(savedSocialLinks));
      } catch (error) {
        console.error("Error parsing social links:", error);
        localStorage.removeItem("socialLinks");
      }
    }

    const savedTickets = localStorage.getItem("tickets");
    if (savedTickets) {
      try {
        setTickets(JSON.parse(savedTickets));
      } catch (error) {
        console.error("Error parsing tickets:", error);
        localStorage.removeItem("tickets");
      }
    }
    
    // Check for authenticated user
    const checkForUser = async () => {
      try {
        const currentUser = await fetchCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    
    checkForUser();
  }, []);

  useEffect(() => {
    localStorage.setItem("libraries", JSON.stringify(libraries));
  }, [libraries]);

  useEffect(() => {
    localStorage.setItem("maintenanceSettings", JSON.stringify(maintenanceSettings));
  }, [maintenanceSettings]);

  useEffect(() => {
    localStorage.setItem("socialLinks", JSON.stringify(socialLinks));
  }, [socialLinks]);

  useEffect(() => {
    localStorage.setItem("tickets", JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    const setupDb = async () => {
      try {
        // No need for database setup with local storage
      } catch (error) {
        console.error("Failed to setup database:", error);
      }
    };
    
    setupDb();
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

  const updateMaintenanceSettings = (settings: MaintenanceSettings) => {
    setMaintenanceSettings(settings);
  };

  const updateSocialLinks = (links: SocialMedia[]) => {
    setSocialLinks(links);
  };

  const addTicket = (ticket: Ticket) => {
    setTickets(prevTickets => [ticket, ...prevTickets]);
  };

  const updateTicket = (ticket: Ticket) => {
    setTickets(prevTickets => 
      prevTickets.map(t => t.id === ticket.id ? ticket : t)
    );
  };

  const getTicket = (id: string) => {
    return tickets.find(ticket => ticket.id === id);
  };

  const updateTicketStatus = (ticketId: string, status: "open" | "in-progress" | "closed") => {
    setTickets(prevTickets => 
      prevTickets.map(ticket => 
        ticket.id === ticketId 
          ? { 
              ...ticket, 
              status, 
              updatedAt: new Date().toISOString().split('T')[0] 
            } 
          : ticket
      )
    );
  };

  const replyToTicket = (ticketId: string, message: string) => {
    setTickets(prevTickets => 
      prevTickets.map(ticket => {
        if (ticket.id === ticketId) {
          const now = new Date().toISOString().split('T')[0];
          const newResponse = {
            id: `response-${Date.now()}`,
            ticketId,
            message,
            userId: "admin",
            userName: "فريق الدعم",
            isAdmin: true,
            createdAt: now
          };
          
          return {
            ...ticket,
            responses: [...(ticket.responses || []), newResponse],
            updatedAt: now
          };
        }
        return ticket;
      })
    );
  };

  const login = async (email: string, password: string) => {
    try {
      // Login is now handled by local storage
      // Get the authenticated user after successful login
      const currentUser = await fetchCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        localStorage.setItem("user", JSON.stringify(currentUser));
      } else {
        throw new Error("Failed to retrieve user data");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    additionalData?: { country?: string; phoneNumber?: string; profileImage?: string }
  ) => {
    // Note: This function is stub until full DB implementation
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

  const resetPassword = async (email: string) => {
    console.log("إعادة تعيين كلمة المرور لـ:", email);
    // Implementation will be handled by local storage
    await new Promise(resolve => setTimeout(resolve, 1000));
    return;
  };

  const updateUserInfo = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const RequireAuth = ({ children }: { children: JSX.Element }) => {
    if (maintenanceSettings.enabled && (!user || (user.role !== "owner" && user.role !== "admin"))) {
      return <Navigate to="/maintenance" />;
    }

    if (!user) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  const RequireAdmin = ({ children }: { children: JSX.Element }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }

    if (user.role !== "owner" && user.role !== "admin" && user.role !== "moderator") {
      return <Navigate to="/dashboard" />;
    }

    return children;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ user, login, register, logout, updateUserInfo, resetPassword }}>
        <LibraryContext.Provider value={{ libraries, addLibrary, updateLibrary, deleteLibrary, getLibrary }}>
          <MaintenanceContext.Provider value={{ maintenanceSettings, updateMaintenanceSettings }}>
            <TicketContext.Provider value={{ tickets, addTicket, updateTicket, getTicket, updateTicketStatus, replyToTicket }}>
              <AppContext.Provider value={{ socialLinks, updateSocialLinks }}>
                <BrowserRouter>
                  <TooltipProvider>
                    <Routes>
                      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
                      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
                      <Route path="/demo-account" element={user ? <Navigate to="/dashboard" /> : <Suspense fallback={<div className="flex justify-center items-center h-screen">جاري التحميل...</div>}><DemoAccount /></Suspense>} />
                      <Route path="/maintenance" element={<Maintenance message={maintenanceSettings.message} />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/contact" element={<Contact />} />
                      
                      <Route path="/" element={
                        maintenanceSettings.enabled && (!user || (user.role !== "owner" && user.role !== "admin")) 
                          ? <Navigate to="/maintenance" /> 
                          : <Index />
                      } />
                      
                      <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
                      <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
                      <Route path="/tickets" element={<RequireAuth><Tickets /></RequireAuth>} />
                      <Route path="/library/:id" element={<RequireAuth><Library /></RequireAuth>} />
                      <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
                      
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <Toaster />
                    <Sonner />
                  </TooltipProvider>
                </BrowserRouter>
              </AppContext.Provider>
            </TicketContext.Provider>
          </MaintenanceContext.Provider>
        </LibraryContext.Provider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
