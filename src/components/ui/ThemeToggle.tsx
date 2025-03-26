
import React, { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>("dark-mode", false);

  // تطبيق السمة المحفوظة عند تحميل الصفحة
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="flex items-center gap-2">
      <Sun className="h-5 w-5 text-muted-foreground" />
      <Switch 
        checked={isDarkMode} 
        onCheckedChange={toggleTheme} 
        aria-label={isDarkMode ? "التبديل إلى الوضع النهاري" : "التبديل إلى الوضع الليلي"}
      />
      <Moon className="h-5 w-5 text-muted-foreground" />
    </div>
  );
};

export default ThemeToggle;
