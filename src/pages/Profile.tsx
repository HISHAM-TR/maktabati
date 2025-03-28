import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/App";
import { toast } from "sonner";
import ImageUpload from "@/components/ui/ImageUpload";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Lock,
  Globe,
  Phone,
  Save,
  AlertTriangle,
  Check,
  Loader2,
  Flag
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const countries = [
  { name: "السعودية", flag: "🇸🇦" },
  { name: "الإمارات", flag: "🇦🇪" },
  { name: "الكويت", flag: "🇰🇼" },
  { name: "قطر", flag: "🇶🇦" },
  { name: "البحرين", flag: "🇧🇭" },
  { name: "عمان", flag: "🇴🇲" },
  { name: "الأردن", flag: "🇯🇴" },
  { name: "مصر", flag: "🇪🇬" },
  { name: "لبنان", flag: "🇱🇧" },
  { name: "فلسطين", flag: "🇵🇸" },
  { name: "سوريا", flag: "🇸🇾" },
  { name: "العراق", flag: "🇮🇶" },
  { name: "تونس", flag: "🇹🇳" },
  { name: "المغرب", flag: "🇲🇦" },
  { name: "الجزائر", flag: "🇩🇿" },
  { name: "ليبيا", flag: "🇱🇾" },
  { name: "السودان", flag: "🇸🇩" },
];

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateUserInfo } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordConfirmDialog, setShowPasswordConfirmDialog] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [actionAfterConfirmation, setActionAfterConfirmation] = useState<() => void>(() => {});

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    country: user?.country || "السعودية", 
    phoneCode: "+966",
    phoneNumber: "",
    profileImage: user?.profileImage || ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });

  useEffect(() => {
    if (user) {
      let phoneCode = "+966";
      let phoneNumber = "";
      
      if (user.phoneNumber) {
        const parts = user.phoneNumber.split(" ");
        if (parts.length > 1) {
          phoneCode = parts[0];
          phoneNumber = parts[1];
        } else {
          phoneNumber = user.phoneNumber;
        }
      }
      
      setProfileData({
        name: user.name,
        email: user.email,
        country: user.country || "السعودية",
        phoneCode,
        phoneNumber,
        profileImage: user.profileImage || ""
      });
      
      document.title = "الملف الشخصي | نظام إدارة المكتبات";
    }
  }, [user]);

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleUpdateProfile = () => {
    if (!profileData.name || !profileData.email || !profileData.country || !profileData.phoneNumber) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    
    if (!/^\d+$/.test(profileData.phoneNumber)) {
      toast.error("رقم الهاتف يجب أن يتكون من أرقام فقط");
      return;
    }
    
    setActionAfterConfirmation(() => async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const updatedUser = {
          ...user,
          name: profileData.name,
          email: profileData.email,
          country: profileData.country,
          phoneNumber: `${profileData.phoneCode} ${profileData.phoneNumber}`,
          profileImage: profileData.profileImage
        };
        
        updateUserInfo(updatedUser);
        
        toast.success("تم تحديث الملف الشخصي بنجاح");
        setShowPasswordConfirmDialog(false);
      } catch (error) {
        toast.error("حدث خطأ أثناء تحديث الملف الشخصي");
      } finally {
        setIsLoading(false);
      }
    });
    
    setShowPasswordConfirmDialog(true);
  };

  const handleChangePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmNewPassword) {
      toast.error("يرجى ملء جميع حقول كلمة المرور");
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast.error("يجب أن تكون كلمة المرور الجديدة 8 أحرف على الأقل");
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error("كلمتا المرور الجديدتين غير متطابقتين");
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      toast.success("تم تغيير كلمة المرور بنجاح");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleConfirmPasswordSubmit = () => {
    if (!confirmPassword) {
      toast.error("يرجى إدخال كلمة المرور للمتابعة");
      return;
    }
    
    actionAfterConfirmation();
    setConfirmPassword("");
  };

  const handleProfileImageChange = (imageBase64: string) => {
    setProfileData({
      ...profileData,
      profileImage: imageBase64
    });
  };

  const getCountryFlag = (countryName: string) => {
    const country = countries.find(c => c.name === countryName);
    return country ? country.flag : "🏳️";
  };

  return (
    <div className="flex flex-col min-h-screen cairo-regular" dir="rtl">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 cairo-bold">الملف الشخصي</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full md:w-[400px] grid-cols-2 mb-8">
              <TabsTrigger value="profile" className="cairo-medium">معلومات الحساب</TabsTrigger>
              <TabsTrigger value="security" className="cairo-medium">الأمان والخصوصية</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="cairo-semibold">المعلومات الشخصية</CardTitle>
                    <CardDescription className="cairo-regular">
                      قم بتحديث معلومات ملفك الشخصي وعنوان البريد الإلكتروني
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="cairo-medium">الاسم الكامل</Label>
                      <div className="relative">
                        <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          placeholder="الاسم الكامل"
                          className="pr-10 text-right cairo-regular"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="cairo-medium">البريد الإلكتروني</Label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="البريد الإلكتروني"
                          className="pr-10 text-right cairo-regular"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label htmlFor="country" className="cairo-medium">البلد</Label>
                      <div className="relative">
                        <Flag className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Select
                          value={profileData.country}
                          onValueChange={(value) => setProfileData({ ...profileData, country: value })}
                        >
                          <SelectTrigger className="w-full pr-10 text-right cairo-regular">
                            <SelectValue placeholder="اختر البلد">
                              <span className="flex items-center">
                                <span className="ml-2">{getCountryFlag(profileData.country)}</span>
                                {profileData.country}
                              </span>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="cairo-regular">
                            {countries.map((country) => (
                              <SelectItem key={country.name} value={country.name} className="text-right">
                                <span className="flex items-center">
                                  <span className="ml-2">{country.flag}</span>
                                  {country.name}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="cairo-medium">رقم الجوال</Label>
                      <div className="flex space-x-reverse space-x-2">
                        <div className="relative flex-1">
                          <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="5xxxxxxxx"
                            className="pr-10 text-right cairo-regular"
                            value={profileData.phoneNumber}
                            onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                          />
                        </div>
                        <Select
                          value={profileData.phoneCode}
                          onValueChange={(value) => setProfileData({ ...profileData, phoneCode: value })}
                        >
                          <SelectTrigger className="w-[110px] cairo-regular">
                            <SelectValue placeholder="+966">
                              <span className="flex items-center justify-center">
                                {profileData.phoneCode}
                              </span>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="cairo-regular">
                            {countryCodes.map((item) => (
                              <SelectItem key={item.code} value={item.code} className="text-right">
                                <span className="flex items-center">
                                  <span className="ml-2">{item.country}</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleUpdateProfile} disabled={isLoading} className="cairo-medium">
                      {isLoading ? (
                        <>
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                          جاري الحفظ...
                        </>
                      ) : (
                        <>
                          <Save className="ml-2 h-4 w-4" />
                          حفظ التغييرات
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="cairo-semibold">معلومات الحساب</CardTitle>
                    <CardDescription className="cairo-regular">
                      تفاصيل حسابك ومعلومات العضوية
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col items-center justify-center text-center space-y-3 py-5">
                      <ImageUpload 
                        initialImage={profileData.profileImage}
                        onImageChange={handleProfileImageChange}
                        className="mb-4"
                      />
                      <div>
                        <h3 className="font-medium text-lg cairo-semibold">{user.name}</h3>
                        <p className="text-muted-foreground cairo-regular">{user.email}</p>
                        <div className="text-xs text-muted-foreground mt-1 cairo-light">
                          عضو منذ {new Date().toLocaleDateString('ar-SA')}
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium cairo-medium">معلومات العضوية</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-left cairo-regular">مشرف</div>
                        <div className="text-right text-muted-foreground cairo-regular">الدور</div>
                        <div className="text-left text-green-600 cairo-regular">نشط</div>
                        <div className="text-right text-muted-foreground cairo-regular">الحالة</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="cairo-semibold">تغيير كلمة المرور</CardTitle>
                    <CardDescription className="cairo-regular">
                      قم بتحديث كلمة المرور الخاصة بك لضمان أمان حسابك
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="cairo-medium">كلمة المرور الحالية</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="currentPassword"
                          type="password"
                          className="pr-10 text-right cairo-regular"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="cairo-medium">كلمة المرور الجديدة</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="newPassword"
                          type="password"
                          className="pr-10 text-right cairo-regular"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground text-right cairo-light">
                        يجب أن تكون كلمة المرور 8 أحرف على الأقل
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmNewPassword" className="cairo-medium">تأكيد كلمة المرور الجديدة</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmNewPassword"
                          type="password"
                          className="pr-10 text-right cairo-regular"
                          value={passwordData.confirmNewPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleChangePassword} disabled={isLoading} className="cairo-medium">
                      {isLoading ? (
                        <>
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                          جاري التحديث...
                        </>
                      ) : (
                        <>
                          <Save className="ml-2 h-4 w-4" />
                          تحديث كلمة المرور
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="cairo-semibold">أمان الحساب</CardTitle>
                    <CardDescription className="cairo-regular">
                      إعدادات إضافية لضمان أمان حسابك
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium cairo-medium">آخر تسجيل دخول</h3>
                      <div className="text-sm text-muted-foreground text-right cairo-regular">
                        {new Date().toLocaleString('ar-SA')}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Button variant="outline" size="sm" className="cairo-medium">
                          إنهاء كافة الجلسات
                        </Button>
                        <h3 className="text-sm font-medium cairo-medium">الجلسات النشطة</h3>
                      </div>
                      <div className="text-sm text-muted-foreground text-right cairo-regular">
                        جلسة واحدة نشطة (هذا الجهاز)
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive" className="w-full cairo-medium">
                          <AlertTriangle className="ml-2 h-4 w-4" />
                          تسجيل الخروج من جميع الأجهزة
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="cairo-regular">
                        <DialogHeader>
                          <DialogTitle className="text-right cairo-semibold">تسجيل الخروج من جميع الأجهزة</DialogTitle>
                          <DialogDescription className="text-right">
                            هذا سيؤدي إلى تسجيل خروجك من جميع الأجهزة المتصلة بحسابك. هل أنت متأكد؟
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex justify-start">
                          <Button 
                            variant="destructive"
                            onClick={() => {
                              toast.success("تم تسجيل الخروج من جميع الأجهزة");
                              setTimeout(() => logout(), 1500);
                            }}
                            className="cairo-medium"
                          >
                            تأكيد
                          </Button>
                          <DialogClose asChild>
                            <Button variant="outline" className="cairo-medium">إلغاء</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
      
      <Dialog open={showPasswordConfirmDialog} onOpenChange={setShowPasswordConfirmDialog}>
        <DialogContent className="cairo-regular">
          <DialogHeader>
            <DialogTitle className="text-right cairo-semibold">تأكيد كلمة المرور</DialogTitle>
            <DialogDescription className="text-right">
              لحماية حسابك، يرجى إدخال كلمة المرور للمتابعة
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="password-confirm" className="cairo-medium">كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password-confirm"
                  type="password"
                  className="pr-10 text-right"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور الحالية"
                />
              </div>
            </div>
            <div className="flex items-center space-x-reverse space-x-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-green-500" />
              <span>لن نطلب كلمة المرور مرة أخرى لمدة 30 دقيقة</span>
            </div>
          </div>
          <DialogFooter className="flex justify-start">
            <Button onClick={handleConfirmPasswordSubmit} disabled={isLoading} className="cairo-medium">
              {isLoading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري التحقق...
                </>
              ) : (
                "تأكيد"
              )}
            </Button>
            <Button variant="outline" onClick={() => setShowPasswordConfirmDialog(false)} className="cairo-medium">
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
