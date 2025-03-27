
import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/App";
import { Book, User, LogOut } from "lucide-react";
import ThemeSwitch from "@/components/ui/ThemeSwitch";
import HamburgerButton from "@/components/ui/HamburgerButton";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // إغلاق القائمة عند تغيير المسار
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // التعامل مع سلوك التمرير
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "glass shadow-sm py-3" : "bg-transparent py-4"
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo على اليمين */}
          <NavLink to="/" className="flex items-center space-x-reverse space-x-2">
            <Book className="h-6 w-6 text-primary" />
            <span className="font-semibold text-xl">نظام إدارة المكتبات</span>
          </NavLink>

          {/* قائمة سطح المكتب في الوسط */}
          <nav className="hidden md:flex items-center justify-center">
            <div className="flex space-x-reverse space-x-8">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `transition-colors hover:text-primary ${isActive ? "text-primary" : "text-foreground"}`
                }
              >
                الرئيسية
              </NavLink>
              
              {user && (
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => 
                    `transition-colors hover:text-primary ${isActive ? "text-primary" : "text-foreground"}`
                  }
                >
                  لوحة التحكم
                </NavLink>
              )}
              
              {user?.role === "admin" && (
                <NavLink 
                  to="/admin" 
                  className={({ isActive }) => 
                    `transition-colors hover:text-primary ${isActive ? "text-primary" : "text-foreground"}`
                  }
                >
                  المشرف
                </NavLink>
              )}
            </div>
          </nav>
          
          {/* حساب المستخدم وأزرار تسجيل الدخول على اليسار */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="flex items-center space-x-reverse space-x-4">
                <div className="flex items-center space-x-reverse space-x-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                
                <div className="flex items-center space-x-reverse space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleLogout}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                  <div className="scale-75 origin-right">
                    <ThemeSwitch />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-reverse space-x-4">
                <NavLink to="/login">
                  <Button variant="ghost">تسجيل الدخول</Button>
                </NavLink>
                <NavLink to="/register">
                  <Button>إنشاء حساب</Button>
                </NavLink>
                <div className="scale-75 origin-right">
                  <ThemeSwitch />
                </div>
              </div>
            )}
          </div>
          
          {/* زر القائمة المتنقلة */}
          <div className="md:hidden">
            <HamburgerButton isOpen={isMenuOpen} onClick={toggleMenu} />
          </div>
        </div>
      </div>
      
      {/* القائمة المتنقلة */}
      {isMenuOpen && (
        <div className="md:hidden glass animate-fade-in py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `py-2 px-4 rounded-lg transition-colors ${
                  isActive ? "bg-primary/10 text-primary" : "hover:bg-primary/5"
                }`
              }
            >
              الرئيسية
            </NavLink>
            
            {user ? (
              <>
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => 
                    `py-2 px-4 rounded-lg transition-colors ${
                      isActive ? "bg-primary/10 text-primary" : "hover:bg-primary/5"
                    }`
                  }
                >
                  لوحة التحكم
                </NavLink>
                
                {user.role === "admin" && (
                  <NavLink 
                    to="/admin" 
                    className={({ isActive }) => 
                      `py-2 px-4 rounded-lg transition-colors ${
                        isActive ? "bg-primary/10 text-primary" : "hover:bg-primary/5"
                      }`
                    }
                  >
                    المشرف
                  </NavLink>
                )}
                
                <div className="flex items-center justify-between py-2 px-4 border-t border-border">
                  <div className="flex items-center space-x-reverse space-x-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-reverse space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleLogout}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <LogOut className="h-4 w-4 ml-2" />
                      تسجيل الخروج
                    </Button>
                    <div className="scale-75">
                      <ThemeSwitch />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-2 pt-2 border-t border-border">
                <NavLink to="/login" className="w-full">
                  <Button variant="outline" className="w-full">تسجيل الدخول</Button>
                </NavLink>
                <NavLink to="/register" className="w-full">
                  <Button className="w-full">إنشاء حساب</Button>
                </NavLink>
                <div className="flex justify-center mt-2">
                  <div className="scale-75">
                    <ThemeSwitch />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
