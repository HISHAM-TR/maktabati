
import { User as UserType } from "@/App";
import { Button } from "@/components/ui/button";
import { LogOut, User, Pencil } from "lucide-react";
import { NavLink } from "react-router-dom";
import ThemeSwitch from "@/components/ui/ThemeSwitch";

interface MobileMenuProps {
  isOpen: boolean;
  user: UserType | null;
  handleLogout: () => void;
}

const MobileMenu = ({ isOpen, user, handleLogout }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
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
            
            <NavLink 
              to="/profile" 
              className={({ isActive }) => 
                `py-2 px-4 rounded-lg transition-colors ${
                  isActive ? "bg-primary/10 text-primary" : "hover:bg-primary/5"
                }`
              }
            >
              <div className="flex items-center space-x-reverse space-x-2">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-3 w-3 text-primary" />
                </div>
                <span>الملف الشخصي</span>
                <Pencil className="h-3 w-3 text-muted-foreground" />
              </div>
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
            
            <div className="flex items-center justify-between py-2 px-4 border-t border-border mt-2">
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
  );
};

export default MobileMenu;
