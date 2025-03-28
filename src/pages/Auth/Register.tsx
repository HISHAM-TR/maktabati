
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/App";
import { Book, Mail, Lock, User, ArrowRight, Globe, Phone } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// قائمة رموز الدول
const countryCodes = [
  { code: "+966", country: "السعودية 🇸🇦" },
  { code: "+971", country: "الإمارات 🇦🇪" },
  { code: "+965", country: "الكويت 🇰🇼" },
  { code: "+974", country: "قطر 🇶🇦" },
  { code: "+973", country: "البحرين 🇧🇭" },
  { code: "+968", country: "عمان 🇴🇲" },
  { code: "+962", country: "الأردن 🇯🇴" },
  { code: "+20", country: "مصر 🇪🇬" },
  { code: "+961", country: "لبنان 🇱🇧" },
  { code: "+970", country: "فلسطين 🇵🇸" },
  { code: "+963", country: "سوريا 🇸🇾" },
  { code: "+964", country: "العراق 🇮🇶" },
  { code: "+216", country: "تونس 🇹🇳" },
  { code: "+212", country: "المغرب 🇲🇦" },
  { code: "+213", country: "الجزائر 🇩🇿" },
  { code: "+218", country: "ليبيا 🇱🇾" },
  { code: "+249", country: "السودان 🇸🇩" },
];

// قائمة الدول
const countries = [
  "السعودية",
  "الإمارات",
  "الكويت",
  "قطر",
  "البحرين",
  "عمان",
  "الأردن",
  "مصر",
  "لبنان",
  "فلسطين",
  "سوريا",
  "العراق",
  "تونس",
  "المغرب",
  "الجزائر",
  "ليبيا",
  "السودان",
];

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    phoneCode: "+966",
    phoneNumber: "",
    profileImage: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.country || !formData.phoneNumber) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("كلمتا المرور غير متطابقتين");
      return;
    }
    
    if (formData.password.length < 8) {
      toast.error("يجب أن تكون كلمة المرور 8 أحرف على الأقل");
      return;
    }
    
    if (!/^\d+$/.test(formData.phoneNumber)) {
      toast.error("رقم الهاتف يجب أن يتكون من أرقام فقط");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // إضافة معلومات إضافية للمستخدم
      const fullPhoneNumber = `${formData.phoneCode} ${formData.phoneNumber}`;
      await register(formData.name, formData.email, formData.password, {
        country: formData.country,
        phoneNumber: fullPhoneNumber,
        profileImage: formData.profileImage
      });
      toast.success("تم إنشاء الحساب بنجاح");
      navigate("/dashboard");
    } catch (error) {
      let message = "فشل إنشاء الحساب";
      if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // تحديث صورة الملف الشخصي
  const handleProfileImageChange = (imageBase64: string) => {
    setFormData({
      ...formData,
      profileImage: imageBase64
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary/30 px-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center space-x-reverse space-x-2">
            <Book className="h-8 w-8 text-primary" />
            <span className="font-semibold text-2xl">نظام إدارة المكتبات</span>
          </Link>
        </div>
        
        <Card className="w-full animate-fade-in glass border-0 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">إنشاء حساب جديد</CardTitle>
            <CardDescription className="text-center">
              أدخل معلوماتك لإنشاء حساب جديد
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-center mb-4">
                <ImageUpload 
                  initialImage={formData.profileImage}
                  onImageChange={handleProfileImageChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">الاسم الكامل</Label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="أحمد محمد"
                    className="pr-10"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="pr-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">البلد</Label>
                <div className="relative">
                  <Globe className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Select
                    value={formData.country}
                    onValueChange={(value) => setFormData({ ...formData, country: value })}
                    required
                  >
                    <SelectTrigger className="w-full pr-10">
                      <SelectValue placeholder="اختر البلد" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الجوال</Label>
                <div className="flex space-x-reverse space-x-2">
                  <div className="relative flex-1">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="5xxxxxxxx"
                      className="pr-10"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      required
                    />
                  </div>
                  <Select
                    value={formData.phoneCode}
                    onValueChange={(value) => setFormData({ ...formData, phoneCode: value })}
                  >
                    <SelectTrigger className="w-[110px]">
                      <SelectValue placeholder="+966" />
                    </SelectTrigger>
                    <SelectContent>
                      {countryCodes.map((item) => (
                        <SelectItem key={item.code} value={item.code}>
                          {item.country} {item.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    className="pr-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  يجب أن تكون كلمة المرور 8 أحرف على الأقل
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="pr-10"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري إنشاء الحساب...
                  </div>
                ) : (
                  <>
                    إنشاء حساب
                    <ArrowRight className="mr-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              لديك حساب بالفعل؟{" "}
              <Link to="/login" className="text-primary hover:underline">
                تسجيل الدخول
              </Link>
            </div>
          </CardFooter>
        </Card>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <Link to="/" className="hover:underline">
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
