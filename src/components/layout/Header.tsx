
import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/App";
import { Menu, X, Book, User, LogOut } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Handle scroll behavior
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

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "glass shadow-sm py-3" : "bg-transparent py-4"
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <NavLink to="/" className="flex items-center space-x-2">
          <Book className="h-6 w-6 text-primary" />
          <span className="font-semibold text-xl">Library Manager</span>
        </NavLink>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `transition-colors hover:text-primary ${isActive ? "text-primary" : "text-foreground"}`
            }
          >
            Home
          </NavLink>
          
          {user ? (
            <>
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => 
                  `transition-colors hover:text-primary ${isActive ? "text-primary" : "text-foreground"}`
                }
              >
                Dashboard
              </NavLink>
              
              {user.role === "admin" && (
                <NavLink 
                  to="/admin" 
                  className={({ isActive }) => 
                    `transition-colors hover:text-primary ${isActive ? "text-primary" : "text-foreground"}`
                  }
                >
                  Admin
                </NavLink>
              )}
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <NavLink to="/login">
                <Button variant="ghost">Login</Button>
              </NavLink>
              <NavLink to="/register">
                <Button>Register</Button>
              </NavLink>
            </div>
          )}
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {/* Mobile Menu */}
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
              Home
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
                  Dashboard
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
                    Admin
                  </NavLink>
                )}
                
                <div className="flex items-center justify-between py-2 px-4 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleLogout}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-2 pt-2 border-t border-border">
                <NavLink to="/login" className="w-full">
                  <Button variant="outline" className="w-full">Login</Button>
                </NavLink>
                <NavLink to="/register" className="w-full">
                  <Button className="w-full">Register</Button>
                </NavLink>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
