
import { User as UserType } from "@/App";
import { Button } from "@/components/ui/button";
import { LogOut, User, Pencil } from "lucide-react";
import { NavLink } from "react-router-dom";
import ThemeSwitch from "@/components/ui/ThemeSwitch";

interface UserAccountProps {
  user: UserType | null;
  handleLogout: () => void;
}

const UserAccount = ({ user, handleLogout }: UserAccountProps) => {
  if (!user) {
    return (
      <div className="hidden md:flex items-center space-x-reverse space-x-4">
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
    );
  }

  return (
    <div className="hidden md:flex items-center space-x-reverse space-x-4">
      <NavLink to="/profile" className="flex items-center space-x-reverse space-x-2 hover:opacity-80 transition-opacity">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-4 w-4 text-primary" />
        </div>
        <span className="text-sm font-medium">{user.name}</span>
        <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-primary/10">
          <Pencil className="h-3 w-3" />
        </Button>
      </NavLink>
      
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
  );
};

export default UserAccount;
