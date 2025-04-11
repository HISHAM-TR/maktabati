import { User } from "../App";
import { UserRole } from "../components/admin/RoleTypes";
import { toast } from "sonner";
import { Ticket } from "../components/tickets/TicketTypes";

/**
 * وظيفة لإنشاء حساب مستخدم تجريبي للنظام
 * يمكن استخدام هذا الحساب للتجربة والاختبار دون الحاجة للتسجيل
 */
export const createDemoAccount = async (): Promise<User> => {
  try {
    // التحقق من وجود حساب تجريبي سابق
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    let demoUser = users.find((u: any) => u.email === "demo@maktabati.com");
    
    // إذا كان الحساب التجريبي موجودًا بالفعل، قم بإعادته
    if (demoUser) {
      // تحديث وقت آخر تسجيل دخول
      demoUser.lastLogin = new Date().toISOString();
      
      // تحديث قائمة المستخدمين
      const updatedUsers = users.map((u: any) => 
        u.email === "demo@maktabati.com" ? demoUser : u
      );
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      localStorage.setItem('currentUser', JSON.stringify(demoUser));
      localStorage.setItem('user', JSON.stringify(demoUser));
      
      toast.success("تم تسجيل الدخول بحساب تجريبي بنجاح");
      return demoUser as User;
    }
    
    // إنشاء حساب تجريبي جديد
    const now = new Date().toISOString();
    const newDemoUser: User = {
      id: `demo-${Date.now()}`,
      email: "demo@maktabati.com",
      name: "مستخدم تجريبي",
      role: "user" as UserRole,
      country: "السعودية",
      phoneNumber: "0500000000",
      profileImage: "",
      lastLogin: now,
      libraryCount: 0
    };
    
    // إضافة كلمة المرور للمستخدم التجريبي (لا تظهر في واجهة المستخدم)
    const demoUserWithPassword = {
      ...newDemoUser,
      password: "demo12345"
    };
    
    // إضافة المستخدم التجريبي إلى قائمة المستخدمين
    users.push(demoUserWithPassword);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newDemoUser));
    localStorage.setItem('user', JSON.stringify(newDemoUser));
    
    // إنشاء مكتبة افتراضية للمستخدم التجريبي
    createDemoLibrary(newDemoUser.id);
    
    // إنشاء تذاكر افتراضية للمستخدم التجريبي
    createDemoTickets(newDemoUser.id, newDemoUser.name, newDemoUser.email);
    
    toast.success("تم إنشاء حساب تجريبي بنجاح");
    return newDemoUser;
  } catch (error) {
    console.error("Error creating demo account:", error);
    toast.error("حدث خطأ أثناء إنشاء الحساب التجريبي");
    throw error;
  }
};

/**
 * وظيفة مساعدة لإنشاء مكتبة افتراضية للمستخدم التجريبي
 */
const createDemoLibrary = (userId: string) => {
  try {
    const libraries = JSON.parse(localStorage.getItem('libraries') || '{}');
    const now = new Date().toISOString();
    
    // إنشاء مكتبة افتراضية
    const demoLibrary = {
      id: `demo-lib-${Date.now()}`,
      name: "مكتبتي التجريبية",
      description: "هذه مكتبة تجريبية تم إنشاؤها تلقائيًا للحساب التجريبي",
      owner_id: userId,
      is_public: true,
      created_at: now,
      updated_at: now,
      books: [
        {
          id: `demo-book-1-${Date.now()}`,
          title: "أساسيات البرمجة",
          author: "أحمد محمد",
          description: "كتاب تعليمي عن أساسيات البرمجة للمبتدئين",
          cover_url: "https://via.placeholder.com/150",
          category: "تقنية",
          isbn: "9789776824011",
          publication_year: 2022,
          publisher: "دار المعرفة",
          pages: 250,
          language: "العربية",
          status: "available",
          library_id: `demo-lib-${Date.now()}`,
          volumes: 1,
          created_at: now,
          updated_at: now
        },
        {
          id: `demo-book-2-${Date.now()}`,
          title: "رواية الأمل",
          author: "سارة العلي",
          description: "رواية عن الأمل والتفاؤل في الحياة",
          cover_url: "https://via.placeholder.com/150",
          category: "أدب",
          isbn: "9789776824022",
          publication_year: 2021,
          publisher: "دار الأدب",
          pages: 180,
          language: "العربية",
          status: "available",
          library_id: `demo-lib-${Date.now()}`,
          volumes: 1,
          created_at: now,
          updated_at: now
        }
      ]
    };
    
    libraries[demoLibrary.id] = demoLibrary;
    localStorage.setItem('libraries', JSON.stringify(libraries));
    
    return demoLibrary;
  } catch (error) {
    console.error("Error creating demo library:", error);
    throw error;
  }
};

/**
 * وظيفة مساعدة لإنشاء تذاكر افتراضية للمستخدم التجريبي
 */
const createDemoTickets = (userId: string, userName: string, userEmail: string) => {
  try {
    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    const now = new Date().toISOString();
    
    // إنشاء معرفات فريدة للتذاكر
    const ticket1Id = `demo-ticket-1-${Date.now()}`;
    const ticket2Id = `demo-ticket-2-${Date.now()}`;
    
    // إنشاء تذاكر افتراضية
    const demoTickets: Ticket[] = [
      {
        id: ticket1Id,
        subject: "استفسار عن إضافة كتب",
        description: "كيف يمكنني إضافة كتب متعددة دفعة واحدة إلى مكتبتي؟",
        status: "open",
        priority: "medium",
        type: "technical",
        userId: userId,
        userName: userName,
        userEmail: userEmail,
        createdAt: now,
        updatedAt: now,
        responses: []
      },
      {
        id: ticket2Id,
        subject: "طلب ميزة جديدة",
        description: "أقترح إضافة ميزة لمشاركة المكتبات مع الأصدقاء.",
        status: "in-progress",
        priority: "low",
        type: "other",
        userId: userId,
        userName: userName,
        userEmail: userEmail,
        createdAt: now,
        updatedAt: now,
        responses: [
          {
            id: `demo-response-1-${Date.now()}`,
            ticketId: ticket2Id,
            message: "شكراً لاقتراحك! سنضع هذه الميزة في خطة التطوير المستقبلية.",
            userId: "admin",
            userName: "فريق الدعم",
            isAdmin: true,
            createdAt: now
          }
        ]
      }
    ];
    
    // إضافة التذاكر الافتراضية إلى قائمة التذاكر
    tickets.push(...demoTickets);
    localStorage.setItem('tickets', JSON.stringify(tickets));
    
    return demoTickets;
  } catch (error) {
    console.error("Error creating demo tickets:", error);
    throw error;
  }
};