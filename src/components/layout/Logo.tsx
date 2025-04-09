
import { NavLink } from "react-router-dom";

const Logo = () => {
  return (
    <NavLink to="/" className="flex items-center space-x-reverse space-x-2">
      <img src="/logo.svg" alt="شعار المكتبة" className="h-10 w-10" />
      <span className="font-semibold text-xl">نظام إدارة المكتبات</span>
    </NavLink>
  );
};

export default Logo;
