
import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import SocialIcons from "./SocialIcons";
import { useApp } from "@/App";

const Footer = () => {
  const { socialLinks } = useApp();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-[var(--andalusian-pattern)] to-[var(--andalusian-primary)/5] border-t border-andalusian-border pt-10 andalusian-footer dark:bg-gradient-to-b dark:from-[#1a1814] dark:to-[var(--andalusian-primary)/10]">
      <div className="container mx-auto px-4 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-right">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-4 text-muted-foreground">
              نظام متكامل لإدارة المكتبات الشخصية والعامة بطريقة سهلة وفعالة
            </p>
            <SocialIcons links={socialLinks} className="mt-4" />
          </div>
          
          <div className="md:col-span-1">
            <h4 className="font-bold text-lg mb-4 andalusian-title text-[var(--andalusian-primary)]" style={{ textShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>روابط سريعة</h4>
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-muted-foreground hover:text-[var(--andalusian-primary)] transition-colors">الرئيسية</Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-muted-foreground hover:text-[var(--andalusian-primary)] transition-colors">لوحة التحكم</Link>
                </li>
                <li>
                  <Link to="/login" className="text-muted-foreground hover:text-[var(--andalusian-primary)] transition-colors">تسجيل الدخول</Link>
                </li>
                <li>
                  <Link to="/register" className="text-muted-foreground hover:text-[var(--andalusian-primary)] transition-colors">إنشاء حساب</Link>
                </li>
              </ul>
            </nav>
          </div>
          
          <div className="md:col-span-1">
            <h4 className="font-bold text-lg mb-4 andalusian-title text-[var(--andalusian-primary)]" style={{ textShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>الدعم</h4>
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link to="/contact" className="text-muted-foreground hover:text-[var(--andalusian-primary)] transition-colors">اتصل بنا</Link>
                </li>
                <li>
                  <Link to="/terms" className="text-muted-foreground hover:text-[var(--andalusian-primary)] transition-colors">شروط الخدمة</Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-muted-foreground hover:text-[var(--andalusian-primary)] transition-colors">سياسة الخصوصية</Link>
                </li>
              </ul>
            </nav>
          </div>
          
          <div className="md:col-span-1">
            <h4 className="font-bold text-lg mb-4 text-[var(--andalusian-primary)]" style={{ textShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>اشترك في النشرة البريدية</h4>
            <p className="text-muted-foreground mb-4">
              احصل على آخر التحديثات والميزات الجديدة
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                className="flex-1 h-10 rounded-r-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button className="h-10 rounded-l-md bg-[var(--andalusian-primary)] px-3 text-primary-foreground hover:bg-[var(--andalusian-primary)]/90 transition-colors">
                اشتراك
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-andalusian-border mt-8 pt-6 text-center text-muted-foreground">
          <p>© {currentYear} نظام إدارة المكتبات. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
