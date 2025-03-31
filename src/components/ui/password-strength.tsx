
import React, { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "./progress";

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password, className }) => {
  const [strength, setStrength] = useState(0);
  const [criteria, setCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    const newCriteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    
    setCriteria(newCriteria);
    
    const metCriteriaCount = Object.values(newCriteria).filter(Boolean).length;
    setStrength(metCriteriaCount * 20); // 20% for each met criteria
  }, [password]);

  const getStrengthLevel = () => {
    if (strength <= 20) return "ضعيفة جدًا";
    if (strength <= 40) return "ضعيفة";
    if (strength <= 60) return "متوسطة";
    if (strength <= 80) return "قوية";
    return "قوية جدًا";
  };

  const getStrengthColor = () => {
    if (strength <= 20) return "bg-red-500";
    if (strength <= 40) return "bg-orange-500";
    if (strength <= 60) return "bg-yellow-500";
    if (strength <= 80) return "bg-lime-500";
    return "bg-green-500";
  };

  const CriteriaItem = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center space-x-reverse space-x-2 rtl:text-right ltr:text-left">
      {met ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <X className="h-4 w-4 text-gray-400" />
      )}
      <span className={cn("text-xs", met ? "text-green-600 dark:text-green-400" : "text-muted-foreground")}>
        {text}
      </span>
    </div>
  );

  return (
    <div className={cn("space-y-2", className)}>
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span>قوة كلمة المرور: {getStrengthLevel()}</span>
          <span>{strength}%</span>
        </div>
        <Progress value={strength} className={cn("h-1", getStrengthColor())} />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        <CriteriaItem met={criteria.length} text="8 أحرف على الأقل" />
        <CriteriaItem met={criteria.uppercase} text="حرف كبير (A-Z)" />
        <CriteriaItem met={criteria.lowercase} text="حرف صغير (a-z)" />
        <CriteriaItem met={criteria.number} text="رقم (0-9)" />
        <CriteriaItem met={criteria.special} text="رمز خاص (@#$%...)" />
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
