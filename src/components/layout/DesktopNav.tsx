
import { NavLink } from "react-router-dom";
import { User } from "@/App";

interface DesktopNavProps {
  user: User | null;
}

const DesktopNav = ({ user }: DesktopNavProps) => {
  return (
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
        
        {user && (user.role === "admin" || user.role === "owner" || user.role === "moderator") && (
          <NavLink 
            to="/admin" 
            className={({ isActive }) => 
              `transition-colors hover:text-primary ${isActive ? "text-primary" : "text-foreground"}`
            }
          >
            لوحة المشرفين
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default DesktopNav;
