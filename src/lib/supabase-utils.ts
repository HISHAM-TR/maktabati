
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/App";
import { UserRole } from "@/components/admin/RoleTypes";
import { LibraryType, BookType } from "@/types/LibraryTypes";
import { toast } from "sonner";
import { ProfileRow, UserRoleRow } from "@/integrations/supabase/typings";

// Authentication functions
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login error:", error);
    throw error;
  }

  return data;
};

export const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });

  if (error) {
    console.error("Signup error:", error);
    throw error;
  }

  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Signout error:", error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + "/reset-password",
  });
  
  if (error) {
    console.error("Reset password error:", error);
    throw error;
  }
};

// User management functions
export const updateLastLogin = async (userId: string) => {
  try {
    await supabase
      .from("profiles")
      .update({ last_login: new Date().toISOString() })
      .eq("id", userId);
  } catch (error) {
    console.error("Error updating last login:", error);
  }
};

// Fetch current user with profile and role
export const fetchCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const authUser = session.user;
    if (!authUser) return null;

    // Fetch user profile
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return null;
    }

    // Fetch user role
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", authUser.id)
      .single();

    if (roleError) {
      console.error("Error fetching user role:", roleError);
      return null;
    }

    // Check role type and assign default if needed
    let userRole: UserRole;
    if (roleData.role === "owner") userRole = "owner";
    else if (roleData.role === "admin") userRole = "admin";
    else if (roleData.role === "moderator") userRole = "moderator";
    else userRole = "user";

    // Create user with profile info and role
    const user: User = {
      id: authUser.id,
      email: authUser.email || "",
      name: profileData.name || authUser.email?.split('@')[0] || "",
      role: userRole,
      country: "",
      phoneNumber: "",
      profileImage: profileData.avatar_url || "",
      lastLogin: profileData.last_login ? new Date(profileData.last_login).toLocaleDateString() : undefined,
      libraryCount: 0 // Will be updated later if needed
    };

    return user;
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
    // Create user in Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("Failed to create user");

    // Update role if not the default "user"
    if (role !== "user") {
      const { error: roleError } = await supabase
        .from("user_roles")
        .update({ role })
        .eq("user_id", authData.user.id);

      if (roleError) throw roleError;
    }

    return authData.user;
  } catch (error) {
    console.error("Error creating user with role:", error);
    throw error;
  }
};

export const updateUserRole = async (userId: string, newRole: UserRole) => {
  try {
    const { error } = await supabase
      .from("user_roles")
      .update({ role: newRole })
      .eq("user_id", userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, name: string) => {
  try {
    const { error } = await supabase
      .from("profiles")
      .update({ name })
      .eq("id", userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Library management
export const fetchUserLibraries = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("libraries")
      .select(`
        *,
        books (count)
      `)
      .eq("owner_id", userId);

    if (error) throw error;
    
    // Transform to LibraryType format
    const libraries = data.map(library => ({
      id: library.id,
      name: library.name,
      description: library.description || "",
      owner_id: library.owner_id,
      is_public: library.is_public || false,
      created_at: library.created_at,
      updated_at: library.updated_at,
      books: []
    } as LibraryType));
    
    return libraries;
  } catch (error) {
    console.error("Error fetching libraries:", error);
    throw error;
  }
};

export const createLibrary = async (
  name: string,
  description: string,
  is_public: boolean,
  owner_id: string
) => {
  try {
    const { data, error } = await supabase
      .from("libraries")
      .insert([
        { name, description, is_public, owner_id }
      ])
      .select()
      .single();

    if (error) throw error;
    
    // Transform to LibraryType
    const library: LibraryType = {
      id: data.id,
      name: data.name,
      description: data.description || "",
      owner_id: data.owner_id,
      is_public: data.is_public || false,
      created_at: data.created_at,
      updated_at: data.updated_at,
      books: []
    };
    
    return library;
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
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("libraries")
      .update({ name, description, is_public, updated_at: now })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    
    // Transform to LibraryType
    const library: LibraryType = {
      id: data.id,
      name: data.name,
      description: data.description || "",
      owner_id: data.owner_id,
      is_public: data.is_public || false,
      created_at: data.created_at,
      updated_at: data.updated_at,
      books: []
    };
    
    return library;
  } catch (error) {
    console.error("Error updating library:", error);
    throw error;
  }
};

export const deleteLibrary = async (id: string) => {
  try {
    const { error } = await supabase
      .from("libraries")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting library:", error);
    throw error;
  }
};

// Books management
export const fetchLibraryBooks = async (libraryId: string) => {
  try {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .eq("library_id", libraryId);

    if (error) throw error;
    
    // Transform to BookType
    const books = data.map(book => ({
      id: book.id,
      title: book.title,
      author: book.author || "",
      description: book.description || "",
      cover_url: book.cover_url || "",
      category: book.category || "general",
      isbn: book.isbn || "",
      publication_year: book.publication_year || undefined,
      publisher: book.publisher || "",
      pages: book.pages || undefined,
      language: book.language || "",
      status: book.status || "available",
      library_id: book.library_id,
      volumes: 1  // Default value, add to database if needed
    } as BookType));
    
    return books;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};

export const createBook = async (libraryId: string, bookData: Partial<BookType>) => {
  try {
    const { data, error } = await supabase
      .from("books")
      .insert([
        { 
          library_id: libraryId,
          title: bookData.title,
          author: bookData.author,
          description: bookData.description,
          cover_url: bookData.cover_url,
          isbn: bookData.isbn,
          publication_year: bookData.publication_year,
          publisher: bookData.publisher,
          pages: bookData.pages,
          language: bookData.language,
          status: bookData.status || "available"
        }
      ])
      .select()
      .single();

    if (error) throw error;
    
    // Transform to BookType
    const book: BookType = {
      id: data.id,
      title: data.title,
      author: data.author || "",
      description: data.description || "",
      cover_url: data.cover_url || "",
      category: data.category || "general",
      isbn: data.isbn || "",
      publication_year: data.publication_year || undefined,
      publisher: data.publisher || "",
      pages: data.pages || undefined,
      language: data.language || "",
      status: data.status || "available",
      library_id: data.library_id,
      volumes: 1  // Default value
    };
    
    return book;
  } catch (error) {
    console.error("Error creating book:", error);
    throw error;
  }
};

export const updateBook = async (id: string, bookData: Partial<BookType>) => {
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("books")
      .update({ 
        title: bookData.title,
        author: bookData.author,
        description: bookData.description,
        cover_url: bookData.cover_url,
        isbn: bookData.isbn,
        publication_year: bookData.publication_year,
        publisher: bookData.publisher,
        pages: bookData.pages,
        language: bookData.language,
        status: bookData.status,
        updated_at: now 
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    
    // Transform to BookType
    const book: BookType = {
      id: data.id,
      title: data.title,
      author: data.author || "",
      description: data.description || "",
      cover_url: data.cover_url || "",
      category: data.category || "general",
      isbn: data.isbn || "",
      publication_year: data.publication_year || undefined,
      publisher: data.publisher || "",
      pages: data.pages || undefined,
      language: data.language || "",
      status: data.status || "available",
      library_id: data.library_id,
      volumes: 1  // Default value
    };
    
    return book;
  } catch (error) {
    console.error("Error updating book:", error);
    throw error;
  }
};

export const deleteBook = async (id: string) => {
  try {
    const { error } = await supabase
      .from("books")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
};

// Site settings
export const fetchSiteSettings = async () => {
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") { // PGRST116 is "no rows returned"
      throw error;
    }

    // If no settings exist, create default settings
    if (!data) {
      return createDefaultSiteSettings();
    }

    return data;
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return createDefaultSiteSettings();
  }
};

export const createDefaultSiteSettings = async () => {
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .insert([
        { 
          maintenance_enabled: false,
          maintenance_message: "الموقع قيد الصيانة حالياً، يرجى المحاولة لاحقاً"
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating default site settings:", error);
    throw error;
  }
};

export const updateSiteSettings = async (settings: { maintenance_enabled: boolean, maintenance_message: string }) => {
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("site_settings")
      .update({ 
        maintenance_enabled: settings.maintenance_enabled, 
        maintenance_message: settings.maintenance_message,
        updated_at: now
      })
      .eq("id", (await fetchSiteSettings()).id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating site settings:", error);
    throw error;
  }
};

// Tickets system
export const createTicket = async (userId: string, subject: string, description: string, priority = "medium") => {
  try {
    const { data, error } = await supabase
      .from("tickets")
      .insert([
        { 
          user_id: userId, 
          subject, 
          description, 
          priority,
          status: "open" 
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
};

export const fetchUserTickets = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    throw error;
  }
};

export const fetchAllTickets = async () => {
  try {
    const { data, error } = await supabase
      .from("tickets")
      .select(`
        *,
        profiles (name, id),
        ticket_responses (count)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Transform the data to match expected format
    const tickets = data.map(ticket => ({
      id: ticket.id,
      subject: ticket.subject,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      user_id: ticket.user_id,
      userName: ticket.profiles?.name || "Unknown",
      responses: ticket.ticket_responses || [],
      created_at: new Date(ticket.created_at).toISOString().split('T')[0],
      updated_at: new Date(ticket.updated_at).toISOString().split('T')[0]
    }));
    
    return tickets;
  } catch (error) {
    console.error("Error fetching all tickets:", error);
    throw error;
  }
};

export const updateTicketStatus = async (ticketId: string, status: "open" | "in-progress" | "closed") => {
  try {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from("tickets")
      .update({ status, updated_at: now })
      .eq("id", ticketId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating ticket status:", error);
    throw error;
  }
};

export const replyToTicket = async (ticketId: string, userId: string, message: string, isAdmin = false) => {
  try {
    const { data, error } = await supabase
      .from("ticket_responses")
      .insert([
        { 
          ticket_id: ticketId, 
          user_id: userId, 
          message, 
          is_admin: isAdmin 
        }
      ])
      .select();

    if (error) throw error;
    
    // Also update the ticket's updated_at
    const now = new Date().toISOString();
    await supabase
      .from("tickets")
      .update({ updated_at: now })
      .eq("id", ticketId);
      
    return data[0];
  } catch (error) {
    console.error("Error replying to ticket:", error);
    throw error;
  }
};

export const fetchTicketResponses = async (ticketId: string) => {
  try {
    const { data, error } = await supabase
      .from("ticket_responses")
      .select(`
        *,
        profiles (name)
      `)
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching ticket responses:", error);
    throw error;
  }
};

// Social media links
export const fetchSocialLinks = async () => {
  try {
    const { data, error } = await supabase
      .from("social_links")
      .select("*");

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching social links:", error);
    throw error;
  }
};

export const updateSocialLinks = async (links: { platform: string, url: string, icon: string }[]) => {
  try {
    // First, delete all existing links
    await supabase
      .from("social_links")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000"); // This is just to make sure we have a valid filter
    
    // Then, insert the new links
    const { data, error } = await supabase
      .from("social_links")
      .insert(links);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating social links:", error);
    throw error;
  }
};

// Create default owner
export const createDefaultOwner = async () => {
  try {
    const response = await fetch(`${window.location.origin}/api/create-owner-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create owner account');
    }

    const result = await response.json();
    
    if (result.exists) {
      console.log("Owner account already exists");
    } else {
      toast.success("تم إنشاء حساب المالك بنجاح");
      console.log("Owner created with email: admin@admin.com and password: 123456");
    }
    
    return result;
  } catch (error) {
    console.error("Error creating default owner:", error);
    toast.error("فشل إنشاء حساب المالك: " + error.message);
    throw error;
  }
};
