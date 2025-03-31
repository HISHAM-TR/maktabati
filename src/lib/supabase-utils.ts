
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CreateUserFormValues, User, UserFormData } from "@/components/admin/types";

// دوال المستخدمين
export const signUp = async (email: string, password: string, userData: { name: string }) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
        },
      },
    });

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error signing up:", error.message);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    // تحديث آخر تسجيل دخول
    if (data.user) {
      await supabase
        .from('profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.user.id);
    }
    
    return data;
  } catch (error: any) {
    console.error("Error signing in:", error.message);
    throw error;
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error signing out:", error.message);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `https://maktabati.cc/reset-password`,
    });
    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error("Error resetting password:", error.message);
    throw error;
  }
};

export const fetchCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    // جلب بيانات الملف الشخصي
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // جلب بيانات دور المستخدم
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    // تحديد أعلى دور (owner > admin > moderator > user)
    let highestRole = 'user';
    if (userRoles && userRoles.length > 0) {
      if (userRoles.some(r => r.role === 'owner')) highestRole = 'owner';
      else if (userRoles.some(r => r.role === 'admin')) highestRole = 'admin';
      else if (userRoles.some(r => r.role === 'moderator')) highestRole = 'moderator';
    }

    // جلب عدد المكتبات
    const { count: libraryCount } = await supabase
      .from('libraries')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', user.id);

    return {
      id: user.id,
      email: user.email || '',
      name: profile?.name || user.email?.split('@')[0] || '',
      role: highestRole as 'owner' | 'admin' | 'moderator' | 'user',
      profileImage: profile?.avatar_url || '',
      libraryCount: libraryCount || 0
    };
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};

// إنشاء مستخدم من واجهة الإدارة
export const createUser = async (userData: CreateUserFormValues) => {
  try {
    // 1. إنشاء المستخدم في نظام المصادقة
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: {
        name: userData.name,
      }
    });

    if (authError) throw authError;

    if (!authData.user) throw new Error("فشل إنشاء المستخدم");
    
    // 2. إضافة دور المستخدم
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert([
        { user_id: authData.user.id, role: userData.role }
      ]);

    if (roleError) throw roleError;
    
    return authData.user;
  } catch (error: any) {
    console.error("Error creating user:", error.message);
    throw error;
  }
};

// تحديث بيانات المستخدم
export const updateUser = async (userId: string, userData: UserFormData) => {
  try {
    // تحديث بيانات الملف الشخصي
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ name: userData.name })
      .eq('id', userId);

    if (profileError) throw profileError;

    // تحديث دور المستخدم
    const { error: deleteRoleError } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    if (deleteRoleError) throw deleteRoleError;

    const { error: roleError } = await supabase
      .from('user_roles')
      .insert([
        { user_id: userId, role: userData.role }
      ]);

    if (roleError) throw roleError;

    // تحديث البريد الإلكتروني إذا كان مختلفًا
    // ملاحظة: هذا يتطلب صلاحيات الإدارة
    // ولن يكون متاحًا إلا للمشرف

    return true;
  } catch (error: any) {
    console.error("Error updating user:", error.message);
    throw error;
  }
};

// تفعيل/تعطيل المستخدم
export const toggleUserStatus = async (userId: string, status: string) => {
  try {
    const newStatus = status === 'active' ? 'inactive' : 'active';
    
    // في التطبيق الحقيقي، ستقوم بتحديث حالة المستخدم في قاعدة البيانات
    
    return newStatus;
  } catch (error: any) {
    console.error("Error toggling user status:", error.message);
    throw error;
  }
};

// استدعاء وظيفة الحافة (Edge Function) لإنشاء مستخدم مشرف
export const createOwnerAccount = async (email: string, password: string, name: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('create-owner', {
      body: { email, password, name }
    });

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error creating owner account:", error.message);
    throw error;
  }
};

// استرجاع قائمة المستخدمين
export const fetchUsers = async (): Promise<User[]> => {
  try {
    // جلب جميع المستخدمين من جدول profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');

    if (profilesError) throw profilesError;

    // جلب أدوار المستخدمين
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*');

    if (rolesError) throw rolesError;

    // جلب عدد المكتبات لكل مستخدم
    const { data: libraries, error: librariesError } = await supabase
      .from('libraries')
      .select('owner_id');

    if (librariesError) throw librariesError;

    // تحضير بيانات المستخدمين
    const userMap: { [key: string]: number } = {};
    libraries?.forEach(lib => {
      userMap[lib.owner_id] = (userMap[lib.owner_id] || 0) + 1;
    });

    // دمج البيانات
    const users: User[] = profiles?.map(profile => {
      // ابحث عن أعلى دور للمستخدم
      const userRoles = roles?.filter(r => r.user_id === profile.id) || [];
      let highestRole = 'user';
      if (userRoles.some(r => r.role === 'owner')) highestRole = 'owner';
      else if (userRoles.some(r => r.role === 'admin')) highestRole = 'admin';
      else if (userRoles.some(r => r.role === 'moderator')) highestRole = 'moderator';

      return {
        id: profile.id,
        name: profile.name || '',
        email: profile.email || profile.id.split('-')[0] + '@example.com', // بديل مؤقت
        status: 'active', // افتراضي
        registrationDate: new Date(profile.created_at).toLocaleDateString('ar-SA'),
        lastLogin: profile.last_login ? new Date(profile.last_login).toLocaleDateString('ar-SA') : '-',
        libraryCount: userMap[profile.id] || 0,
        role: highestRole as 'owner' | 'admin' | 'moderator' | 'user'
      };
    }) || [];

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

// دوال المكتبات
export const fetchLibraries = async (userId?: string) => {
  try {
    let query = supabase.from('libraries').select(`
      id,
      name,
      description,
      owner_id,
      is_public,
      created_at,
      profiles(name, id)
    `);

    if (userId) {
      query = query.eq('owner_id', userId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data.map(lib => ({
      id: lib.id,
      name: lib.name,
      description: lib.description,
      ownerId: lib.owner_id,
      owner: lib.profiles?.name || 'غير معروف',
      isPublic: lib.is_public,
      createdAt: new Date(lib.created_at).toLocaleDateString('ar-SA')
    }));
  } catch (error: any) {
    console.error("Error fetching libraries:", error.message);
    return [];
  }
};

export const createLibrary = async (name: string, description: string, isPublic: boolean, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('libraries')
      .insert([
        { name, description, is_public: isPublic, owner_id: userId }
      ])
      .select();

    if (error) throw error;
    
    return data[0];
  } catch (error: any) {
    console.error("Error creating library:", error.message);
    throw error;
  }
};

export const updateLibrary = async (id: string, name: string, description: string, isPublic: boolean) => {
  try {
    const { error } = await supabase
      .from('libraries')
      .update({ name, description, is_public: isPublic, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error("Error updating library:", error.message);
    throw error;
  }
};

export const deleteLibrary = async (id: string) => {
  try {
    const { error } = await supabase
      .from('libraries')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error("Error deleting library:", error.message);
    throw error;
  }
};

// دوال الكتب
export const fetchBooks = async (libraryId: string) => {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('library_id', libraryId);

    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error("Error fetching books:", error.message);
    return [];
  }
};

export const createBook = async (libraryId: string, bookData: any) => {
  try {
    const { data, error } = await supabase
      .from('books')
      .insert([
        { 
          library_id: libraryId,
          title: bookData.title,
          author: bookData.author,
          description: bookData.description,
          cover_url: bookData.coverUrl,
          isbn: bookData.isbn,
          publication_year: bookData.publicationYear,
          publisher: bookData.publisher,
          pages: bookData.pages,
          language: bookData.language,
          status: bookData.status || 'available'
        }
      ])
      .select();

    if (error) throw error;
    
    return data[0];
  } catch (error: any) {
    console.error("Error creating book:", error.message);
    throw error;
  }
};

export const updateBook = async (id: string, bookData: any) => {
  try {
    const { error } = await supabase
      .from('books')
      .update({ 
        title: bookData.title,
        author: bookData.author,
        description: bookData.description,
        cover_url: bookData.coverUrl,
        isbn: bookData.isbn,
        publication_year: bookData.publicationYear,
        publisher: bookData.publisher,
        pages: bookData.pages,
        language: bookData.language,
        status: bookData.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error("Error updating book:", error.message);
    throw error;
  }
};

export const deleteBook = async (id: string) => {
  try {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error("Error deleting book:", error.message);
    throw error;
  }
};

// دوال إعدادات الموقع
export const fetchSiteSettings = async () => {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    
    return data || { maintenance_enabled: false, maintenance_message: 'الموقع قيد الصيانة حالياً، يرجى المحاولة لاحقاً' };
  } catch (error: any) {
    console.error("Error fetching site settings:", error.message);
    return { maintenance_enabled: false, maintenance_message: 'الموقع قيد الصيانة حالياً، يرجى المحاولة لاحقاً' };
  }
};

export const updateSiteSettings = async (settings: { maintenance_enabled: boolean, maintenance_message: string }) => {
  try {
    const { data: existingData, error: fetchError } = await supabase
      .from('site_settings')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

    if (existingData) {
      // تحديث الإعدادات الموجودة
      const { error } = await supabase
        .from('site_settings')
        .update({ 
          maintenance_enabled: settings.maintenance_enabled, 
          maintenance_message: settings.maintenance_message,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingData.id);

      if (error) throw error;
    } else {
      // إنشاء إعدادات جديدة
      const { error } = await supabase
        .from('site_settings')
        .insert([{ 
          maintenance_enabled: settings.maintenance_enabled, 
          maintenance_message: settings.maintenance_message
        }]);

      if (error) throw error;
    }
    
    return true;
  } catch (error: any) {
    console.error("Error updating site settings:", error.message);
    throw error;
  }
};

// دوال التذاكر
export const createTicket = async (userId: string, ticketData: { subject: string, description: string, priority: string }) => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .insert([{
        user_id: userId,
        subject: ticketData.subject,
        description: ticketData.description,
        priority: ticketData.priority,
        status: 'open'
      }])
      .select();

    if (error) throw error;
    
    return data[0];
  } catch (error: any) {
    console.error("Error creating ticket:", error.message);
    throw error;
  }
};

export const fetchUserTickets = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        ticket_responses(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error("Error fetching user tickets:", error.message);
    return [];
  }
};

export const fetchAllTickets = async () => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        profiles(name),
        ticket_responses(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(ticket => ({
      id: ticket.id,
      subject: ticket.subject,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      userId: ticket.user_id,
      userName: ticket.profiles?.name || 'غير معروف',
      userEmail: ticket.user_id, // بديل مؤقت، يجب تحديثه لاحقًا
      createdAt: new Date(ticket.created_at).toLocaleDateString('ar-SA'),
      updatedAt: new Date(ticket.updated_at).toLocaleDateString('ar-SA'),
      responses: ticket.ticket_responses || []
    }));
  } catch (error: any) {
    console.error("Error fetching all tickets:", error.message);
    return [];
  }
};

export const updateTicketStatus = async (ticketId: string, status: 'open' | 'in-progress' | 'closed') => {
  try {
    const { error } = await supabase
      .from('tickets')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId);

    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error("Error updating ticket status:", error.message);
    throw error;
  }
};

export const replyToTicket = async (ticketId: string, userId: string, message: string, isAdmin: boolean) => {
  try {
    const { error } = await supabase
      .from('ticket_responses')
      .insert([{
        ticket_id: ticketId,
        user_id: userId,
        message,
        is_admin: isAdmin
      }]);

    if (error) throw error;

    // تحديث وقت تحديث التذكرة
    await supabase
      .from('tickets')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', ticketId);
    
    return true;
  } catch (error: any) {
    console.error("Error replying to ticket:", error.message);
    throw error;
  }
};

// دوال روابط التواصل الاجتماعي
export const fetchSocialLinks = async () => {
  try {
    const { data, error } = await supabase
      .from('social_links')
      .select('*');

    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error("Error fetching social links:", error.message);
    return [];
  }
};

export const updateSocialLinks = async (links: any[]) => {
  try {
    // حذف الروابط الحالية
    const { error: deleteError } = await supabase
      .from('social_links')
      .delete()
      .gte('id', '0'); // حذف جميع الصفوف

    if (deleteError) throw deleteError;

    // إضافة الروابط الجديدة
    if (links.length > 0) {
      const { error: insertError } = await supabase
        .from('social_links')
        .insert(links.map(link => ({
          platform: link.name,
          url: link.url,
          icon: link.icon,
        })));

      if (insertError) throw insertError;
    }
    
    return true;
  } catch (error: any) {
    console.error("Error updating social links:", error.message);
    throw error;
  }
};

// دوال تحميل الملفات
export const uploadImage = async (file: File, bucket: string, folder: string = '') => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder ? folder + '/' : ''}${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

    const { error } = await supabase
      .storage
      .from(bucket)
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (error: any) {
    console.error("Error uploading image:", error.message);
    throw error;
  }
};
