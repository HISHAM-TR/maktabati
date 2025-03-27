
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/App";
import HamburgerButton from "@/components/ui/HamburgerButton";
import Logo from "@/components/layout/Logo";
import DesktopNav from "@/components/layout/DesktopNav";
import UserAccount from "@/components/layout/UserAccount";
import MobileMenu from "@/components/layout/MobileMenu";

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
          <Logo />

          {/* قائمة سطح المكتب في الوسط */}
          <DesktopNav user={user} />
          
          {/* حساب المستخدم وأزرار تسجيل الدخول على اليسار */}
          <UserAccount user={user} handleLogout={handleLogout} />
          
          {/* زر القائمة المتنقلة */}
          <div className="md:hidden">
            <HamburgerButton isOpen={isMenuOpen} onClick={toggleMenu} />
          </div>
        </div>
      </div>
      
      {/* القائمة المتنقلة */}
      <MobileMenu isOpen={isMenuOpen} user={user} handleLogout={handleLogout} />
    </header>
  );
};

export default Header;
