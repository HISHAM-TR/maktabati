
import { NavLink } from "react-router-dom";
import { Book } from "lucide-react";

const Logo = () => {
  return (
    <NavLink to="/" className="flex items-center space-x-reverse space-x-2">
      <Book className="h-6 w-6 text-primary" />
      <span className="font-semibold text-xl">نظام إدارة المكتبات</span>
    </NavLink>
  );
};

export default Logo;
