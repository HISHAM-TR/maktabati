import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReactCountryFlag from "react-country-flag";

// قائمة الدول العربية مع رموزها
const ARAB_COUNTRIES = [
  { code: "SA", name: "السعودية" },
  { code: "AE", name: "الإمارات" },
  { code: "KW", name: "الكويت" },
  { code: "QA", name: "قطر" },
  { code: "BH", name: "البحرين" },
  { code: "OM", name: "عمان" },
  { code: "EG", name: "مصر" },
  { code: "JO", name: "الأردن" },
  { code: "LB", name: "لبنان" },
  { code: "IQ", name: "العراق" },
  { code: "YE", name: "اليمن" },
  { code: "PS", name: "فلسطين" },
  { code: "SY", name: "سوريا" },
  { code: "SD", name: "السودان" },
  { code: "LY", name: "ليبيا" },
  { code: "TN", name: "تونس" },
  { code: "DZ", name: "الجزائر" },
  { code: "MA", name: "المغرب" },
  { code: "MR", name: "موريتانيا" },
  { code: "SO", name: "الصومال" },
  { code: "DJ", name: "جيبوتي" },
  { code: "KM", name: "جزر القمر" },
];

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onChange,
  placeholder = "اختر الدولة",
  className = "",
}) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`w-full ${className}`}>
        <SelectValue placeholder={placeholder}>
          {value && (
            <div className="flex items-center space-x-reverse space-x-2">
              <ReactCountryFlag
                countryCode={value}
                svg
                style={{
                  width: '1.2em',
                  height: '1.2em',
                }}
              />
              <span>{ARAB_COUNTRIES.find(country => country.code === value)?.name || value}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {ARAB_COUNTRIES.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            <div className="flex items-center space-x-reverse space-x-2">
              <ReactCountryFlag
                countryCode={country.code}
                svg
                style={{
                  width: '1.2em',
                  height: '1.2em',
                }}
              />
              <span>{country.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CountrySelect;