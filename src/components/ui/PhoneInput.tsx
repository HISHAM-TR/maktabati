import React from 'react';
import PhoneInputWithCountry from 'react-phone-number-input/react-hook-form';
import 'react-phone-number-input/style.css';
import { Control } from 'react-hook-form';
import { Label } from "@/components/ui/label";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface PhoneInputProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  defaultCountry?: string;
  required?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  control,
  name,
  label,
  placeholder = "أدخل رقم الهاتف",
  className = "",
  defaultCountry = "SA",
  required = false,
}) => {
  return (
    <FormItem className={className}>
      {label && <FormLabel>{label}{required && <span className="text-destructive mr-1">*</span>}</FormLabel>}
      <FormControl>
        <div className="relative">
          <PhoneInputWithCountry
            name={name}
            control={control}
            international
            defaultCountry={defaultCountry as any}
            countryCallingCodeEditable={false}
            placeholder={placeholder}
            labels={{
              SA: "السعودية",
              AE: "الإمارات",
              KW: "الكويت",
              QA: "قطر",
              BH: "البحرين",
              OM: "عمان",
              EG: "مصر",
              JO: "الأردن",
              LB: "لبنان",
              IQ: "العراق",
              YE: "اليمن",
              PS: "فلسطين",
              SY: "سوريا",
              SD: "السودان",
              LY: "ليبيا",
              TN: "تونس",
              DZ: "الجزائر",
              MA: "المغرب",
              MR: "موريتانيا",
            }}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default PhoneInput;
