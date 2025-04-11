import { UserRole } from "@/components/admin/RoleTypes";
import { toast } from "sonner";
import { LibraryType, BookType } from "@/types/LibraryTypes";

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  country?: string;
  phoneNumber?: string;
  profileImage?: string;
  lastLogin?: string;
  libraryCount?: number;
};

// Authentication functions
export const signIn = async (email: string, password: string) => {
  // التحقق من البريد الإلكتروني الخاص بالمشرف
  if (email.toLowerCase() === "abouelfida2@gmail.com" && password === "123456789") {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    let adminUser = users.find((u: any) => u.email.toLowerCase() === "abouelfida2@gmail.com");
    
    // إذا لم يكن المستخدم موجودًا، قم بإنشائه
    if (!adminUser) {
      adminUser = {
        id: `owner-${Date.now()}`,
        email: "abouelfida2@gmail.com",
        password: "123456789",
        name: "مالك النظام",
        role: "owner" as UserRole,
        lastLogin: new Date().toISOString()
      };
      
      users.push(adminUser);
    } else {
      // تحديث بيانات المستخدم الموجود
      adminUser.role = "owner";
      adminUser.lastLogin = new Date().toISOString();
    }
    
    // تحديث قائمة المستخدمين
    const updatedUsers = users.map((u: any) => 
      u.email.toLowerCase() === "abouelfida2@gmail.com" ? adminUser : u
    );
    
    if (!updatedUsers.some(u => u.email.toLowerCase() === "abouelfida2@gmail.com")) {
      updatedUsers.push(adminUser);
    }
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(adminUser));
    
    return adminUser;
  }
  
  // المصادقة العادية للمستخدمين الآخرين
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  
  if (!user) {
    throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
  }
  
  // تحديث آخر تسجيل دخول
  user.lastLogin = new Date().toISOString();
  localStorage.setItem('currentUser', JSON.stringify(user));
  
  // تحديث المستخدم في قائمة المستخدمين
  const updatedUsers = users.map((u: any) => 
    u.id === user.id ? { ...u, lastLogin: user.lastLogin } : u
  );
  localStorage.setItem('users', JSON.stringify(updatedUsers));
  
  return user;
};

export const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  if (users.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("هذا البريد الإلكتروني مسجل بالفعل");
  }
  
  const newUser = {
    id: Date.now().toString(),
    email,
    password,
    ...metadata,
    role: 'user' as UserRole,
    lastLogin: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  
  return { user: newUser };
};

export const signOut = async () => {
  localStorage.removeItem('currentUser');
};

export const resetPassword = async (email: string) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userExists = users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
  
  if (!userExists) {
    throw new Error("البريد الإلكتروني غير مسجل في النظام");
  }
  
  // في بيئة حقيقية، هنا سيتم إرسال بريد إلكتروني لإعادة تعيين كلمة المرور
  // لكن في بيئة التخزين المحلي، نحاكي فقط نجاح العملية
  console.log(`تم إرسال رابط إعادة تعيين كلمة المرور إلى: ${email}`);
  return { success: true };
};

// User management functions
export const updateLastLogin = async (userId: string) => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((user: any) => {
      if (user.id === userId) {
        return { ...user, lastLogin: new Date().toISOString() };
      }
      return user;
    });
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    return true;
  } catch (error) {
    console.error("Error updating last login:", error);
    return false;
  }
};

// Fetch current user with profile and role
export const fetchCurrentUser = async (): Promise<User | null> => {
  try {
    const userData = localStorage.getItem('currentUser');
    if (!userData) return null;
    
    const user = JSON.parse(userData);
    return user as User;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};

// User roles management
export const createUserWithRole = async (
  email: string,
  password: string,
  name: string,
  role: UserRole
) => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("هذا البريد الإلكتروني مسجل بالفعل");
    }
    
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      role,
      lastLogin: null
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    return newUser;
  } catch (error) {
    console.error("Error creating user with role:", error);
    throw error;
  }
};

export const updateUserRole = async (userId: string, newRole: UserRole) => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((user: any) => {
      if (user.id === userId) {
        return { ...user, role: newRole };
      }
      return user;
    });
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // تحديث المستخدم الحالي إذا كان هو نفسه
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (currentUser && currentUser.id === userId) {
      currentUser.role = newRole;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    return true;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, data: { name: string, country?: string, phone?: string }) => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((user: any) => {
      if (user.id === userId) {
        return { 
          ...user, 
          name: data.name, 
          ...(data.country ? { country: data.country } : {}),
          ...(data.phone ? { phoneNumber: data.phone } : {})
        };
      }
      return user;
    });
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // تحديث المستخدم الحالي إذا كان هو نفسه
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (currentUser && currentUser.id === userId) {
      currentUser.name = data.name;
      if (data.country) currentUser.country = data.country;
      if (data.phone) currentUser.phone = data.phone;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Library management
export const fetchUserLibraries = async (userId: string) => {
  try {
    const libraries = JSON.parse(localStorage.getItem('libraries') || '{}');
    const userLibraries = Object.values(libraries)
      .filter((lib: any) => lib.owner_id === userId)
      .map((lib: any) => ({
        ...lib,
        books: lib.books || []
      }));
    
    return userLibraries as LibraryType[];
  } catch (error) {
    console.error("Error fetching libraries:", error);
    return [];
  }
};

export const createLibrary = async (
  name: string,
  description: string,
  is_public: boolean,
  owner_id: string
) => {
  try {
    const libraries = JSON.parse(localStorage.getItem('libraries') || '{}');
    const now = new Date().toISOString();
    
    const newLibrary: LibraryType = {
      id: `lib-${Date.now()}`,
      name,
      description,
      is_public,
      owner_id,
      created_at: now,
      updated_at: now,
      books: []
    };
    
    libraries[newLibrary.id] = newLibrary;
    localStorage.setItem('libraries', JSON.stringify(libraries));
    
    return newLibrary;
  } catch (error) {
    console.error("Error creating library:", error);
    throw error;
  }
};

export const updateLibrary = async (
  id: string,
  name: string,
  description: string,
  is_public: boolean
) => {
  try {
    const libraries = JSON.parse(localStorage.getItem('libraries') || '{}');
    
    if (!libraries[id]) {
      throw new Error("المكتبة غير موجودة");
    }
    
    const now = new Date().toISOString();
    const updatedLibrary = {
      ...libraries[id],
      name,
      description,
      is_public,
      updated_at: now
    };
    
    libraries[id] = updatedLibrary;
    localStorage.setItem('libraries', JSON.stringify(libraries));
    
    return updatedLibrary;
  } catch (error) {
    console.error("Error updating library:", error);
    throw error;
  }
};

export const deleteLibrary = async (id: string) => {
  try {
    const libraries = JSON.parse(localStorage.getItem('libraries') || '{}');
    
    if (!libraries[id]) {
      throw new Error("المكتبة غير موجودة");
    }
    
    delete libraries[id];
    localStorage.setItem('libraries', JSON.stringify(libraries));
    
    return true;
  } catch (error) {
    console.error("Error deleting library:", error);
    throw error;
  }
};

// Books management
export const fetchLibraryBooks = async (libraryId: string) => {
  try {
    const libraries = JSON.parse(localStorage.getItem('libraries') || '{}');
    
    if (!libraries[libraryId]) {
      return [];
    }
    
    return libraries[libraryId].books || [];
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
};

export const createBook = async (libraryId: string, bookData: Partial<BookType>) => {
  try {
    const libraries = JSON.parse(localStorage.getItem('libraries') || '{}');
    
    if (!libraries[libraryId]) {
      throw new Error("المكتبة غير موجودة");
    }
    
    const now = new Date().toISOString();
    const newBook: BookType = {
      id: `book-${Date.now()}`,
      title: bookData.title || "",
      author: bookData.author || "",
      description: bookData.description || "",
      cover_url: bookData.cover_url || "",
      category: bookData.category || "general",
      isbn: bookData.isbn || "",
      publication_year: bookData.publication_year,
      publisher: bookData.publisher || "",
      pages: bookData.pages,
      language: bookData.language || "",
      status: bookData.status || "available",
      library_id: libraryId,
      volumes: bookData.volumes || 1,
      created_at: now,
      updated_at: now
    };
    
    if (!libraries[libraryId].books) {
      libraries[libraryId].books = [];
    }
    
    libraries[libraryId].books.push(newBook);
    localStorage.setItem('libraries', JSON.stringify(libraries));
    
    return newBook;
  } catch (error) {
    console.error("Error creating book:", error);
    throw error;
  }
};

export const updateBook = async (id: string, bookData: Partial<BookType>) => {
  try {
    const libraries = JSON.parse(localStorage.getItem('libraries') || '{}');
    let bookFound = false;
    let updatedBook: BookType | null = null;
    
    // البحث عن الكتاب في جميع المكتبات
    for (const libId in libraries) {
      if (libraries[libId].books) {
        const bookIndex = libraries[libId].books.findIndex((book: BookType) => book.id === id);
        
        if (bookIndex !== -1) {
          const now = new Date().toISOString();
          updatedBook = {
            ...libraries[libId].books[bookIndex],
            ...bookData,
            updated_at: now
          };
          
          libraries[libId].books[bookIndex] = updatedBook;
          bookFound = true;
          break;
        }
      }
    }
    
    if (!bookFound) {
      throw new Error("الكتاب غير موجود");
    }
    
    localStorage.setItem('libraries', JSON.stringify(libraries));
    return updatedBook as BookType;
  } catch (error) {
    console.error("Error updating book:", error);
    throw error;
  }
};

export const deleteBook = async (id: string) => {
  try {
    const libraries = JSON.parse(localStorage.getItem('libraries') || '{}');
    let bookFound = false;
    
    // البحث عن الكتاب في جميع المكتبات
    for (const libId in libraries) {
      if (libraries[libId].books) {
        const bookIndex = libraries[libId].books.findIndex((book: BookType) => book.id === id);
        
        if (bookIndex !== -1) {
          libraries[libId].books.splice(bookIndex, 1);
          bookFound = true;
          break;
        }
      }
    }
    
    if (!bookFound) {
      throw new Error("الكتاب غير موجود");
    }
    
    localStorage.setItem('libraries', JSON.stringify(libraries));
    return true;
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
};

// Site settings
export const fetchSiteSettings = async () => {
  try {
    const settings = localStorage.getItem('siteSettings');
    
    if (!settings) {
      return createDefaultSiteSettings();
    }
    
    return JSON.parse(settings);
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return createDefaultSiteSettings();
  }
};

export const createDefaultSiteSettings = async () => {
  try {
    const defaultSettings = { 
      id: "settings-1",
      maintenance_enabled: false,
      maintenance_message: "الموقع قيد الصيانة حالياً، يرجى المحاولة لاحقاً",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    localStorage.setItem('siteSettings', JSON.stringify(defaultSettings));
    return defaultSettings;
  } catch (error) {
    console.error("Error creating default site settings:", error);
    throw error;
  }
};

export const updateSiteSettings = async (settings: { maintenance_enabled: boolean, maintenance_message: string }) => {
  try {
    const currentSettings = await fetchSiteSettings();
    const updatedSettings = {
      ...currentSettings,
      maintenance_enabled: settings.maintenance_enabled,
      maintenance_message: settings.maintenance_message,
      updated_at: new Date().toISOString()
    };
    
    localStorage.setItem('siteSettings', JSON.stringify(updatedSettings));
    return true;
  } catch (error) {
    console.error("Error updating site settings:", error);
    throw error;
  }
};

// Tickets system
export const createTicket = async (userId: string, subject: string, description: string, priority = "medium") => {
  try {
    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    const now = new Date().toISOString();
    
    const newTicket = {
      id: `ticket-${Date.now()}`,
      user_id: userId,
      subject,
      description,
      priority,
      status: "open",
      created_at: now,
      updated_at: now,
      responses: []
    };
    
    tickets.push(newTicket);
    localStorage.setItem('tickets', JSON.stringify(tickets));
    
    return newTicket;
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
};

export const fetchUserTickets = async () => {
  try {
    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    return tickets.map((ticket: any) => {
      const user = users.find((u: any) => u.id === ticket.user_id);
      return {
        ...ticket,
        userName: user ? user.name : 'Unknown'
      };
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return [];
  }
};

export const fetchAllTickets = async () => {
  try {
    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    return tickets.map((ticket: any) => {
      const user = users.find((u: any) => u.id === ticket.user_id);
      return {
        ...ticket,
        userName: user ? user.name : "Unknown",
        created_at: new Date(ticket.created_at).toISOString().split('T')[0],
        updated_at: new Date(ticket.updated_at).toISOString().split('T')[0]
      };
    }).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } catch (error) {
    console.error("Error fetching all tickets:", error);
    throw error;
  }
};

export const updateTicketStatus = async (ticketId: string, status: "open" | "in-progress" | "closed") => {
  try {
    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    const now = new Date().toISOString();
    
    const updatedTickets = tickets.map((ticket: any) => {
      if (ticket.id === ticketId) {
        return { ...ticket, status, updated_at: now };
      }
      return ticket;
    });
    
    localStorage.setItem('tickets', JSON.stringify(updatedTickets));
    return true;
  } catch (error) {
    console.error("Error updating ticket status:", error);
    throw error;
  }
};

export const replyToTicket = async (ticketId: string, userId: string, message: string, isAdmin = false) => {
  try {
    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const now = new Date().toISOString();
    
    const user = users.find((u: any) => u.id === userId);
    const response = {
      id: `response-${Date.now()}`,
      ticket_id: ticketId,
      user_id: userId,
      message,
      is_admin: isAdmin,
      created_at: now,
      user_name: user ? user.name : (isAdmin ? "مدير النظام" : "مستخدم غير معروف")
    };
    
    const updatedTickets = tickets.map((ticket: any) => {
      if (ticket.id === ticketId) {
        return { 
          ...ticket, 
          updated_at: now,
          responses: [...(ticket.responses || []), response]
        };
      }
      return ticket;
    });
    
    localStorage.setItem('tickets', JSON.stringify(updatedTickets));
    return response;
  } catch (error) {
    console.error("Error replying to ticket:", error);
    throw error;
  }
};

export const fetchTicketResponses = async (ticketId: string) => {
  try {
    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    const ticket = tickets.find((t: any) => t.id === ticketId);
    
    if (!ticket) {
      return [];
    }
    
    return ticket.responses || [];
  } catch (error) {
    console.error("Error fetching ticket responses:", error);
    throw error;
  }
};

// Social media links
export const fetchSocialLinks = async () => {
  try {
    const links = localStorage.getItem('socialLinks');
    return links ? JSON.parse(links) : [];
  } catch (error) {
    console.error("Error fetching social links:", error);
    return [];
  }
};

export const updateSocialLinks = async (links: { platform: string, url: string, icon: string }[]) => {
  try {
    localStorage.setItem('socialLinks', JSON.stringify(links));
    return true;
  } catch (error) {
    console.error("Error updating social links:", error);
    throw error;
  }
};

// Create default owner
export const createDefaultOwner = async () => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const defaultOwnerEmail = "abouelfida2@gmail.com";
    const ownerExists = users.some((user: any) => user.email === defaultOwnerEmail);
    
    if (ownerExists) {
      console.log("Owner account already exists");
      // تحديث صلاحيات المستخدم الموجود إلى مالك النظام
      const updatedUsers = users.map((user: any) => {
        if (user.email === defaultOwnerEmail) {
          return { ...user, role: "owner" as UserRole, password: "123456789" };
        }
        return user;
      });
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // إذا كان المستخدم الحالي هو نفسه، قم بتحديث بياناته
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      if (currentUser && currentUser.email === defaultOwnerEmail) {
        currentUser.role = "owner";
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
      }
      
      return { exists: true };
    }
    
    // إنشاء حساب المالك الافتراضي
    const defaultOwner = {
      id: `owner-${Date.now()}`,
      email: defaultOwnerEmail,
      password: "123456789",
      name: "مالك النظام",
      role: "owner" as UserRole,
      lastLogin: new Date().toISOString()
    };
    
    users.push(defaultOwner);
    localStorage.setItem('users', JSON.stringify(users));
    
    toast.success("تم إنشاء حساب المالك بنجاح");
    console.log("Owner created with email: abouelfida2@gmail.com and password: 123456789");
    
    return { exists: false, owner: defaultOwner };
  } catch (error: any) {
    console.error("Error creating default owner:", error);
    toast.error("فشل إنشاء حساب المالك: " + error.message);
    throw error;
  }
};

// Function to setup the database initially
export const setupDatabase = async () => {
  try {
    // إنشاء المستخدمين الافتراضيين إذا لم يكونوا موجودين
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify([]));
    }
    
    // إنشاء المكتبات الافتراضية إذا لم تكن موجودة
    if (!localStorage.getItem('libraries')) {
      localStorage.setItem('libraries', JSON.stringify({}));
    }
    
    // إنشاء التذاكر الافتراضية إذا لم تكن موجودة
    if (!localStorage.getItem('tickets')) {
      localStorage.setItem('tickets', JSON.stringify([]));
    }
    
    // إنشاء إعدادات الموقع الافتراضية إذا لم تكن موجودة
    if (!localStorage.getItem('siteSettings')) {
      await createDefaultSiteSettings();
    }
    
    // إنشاء روابط التواصل الاجتماعي الافتراضية إذا لم تكن موجودة
    if (!localStorage.getItem('socialLinks')) {
      localStorage.setItem('socialLinks', JSON.stringify([]));
    }
    
    // إنشاء حساب المالك الافتراضي
    const ownerData = await createDefaultOwner();
    
    return {
      success: true,
      tables: {
        users: true,
        libraries: true,
        tickets: true,
        siteSettings: true,
        socialLinks: true
      },
      owner: ownerData
    };
  } catch (error) {
    console.error("Error setting up database:", error);
    throw error;
  }
};
