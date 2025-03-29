
// Custom Supabase database type definitions
// These types complement the auto-generated types in src/integrations/supabase/types.ts

export interface Profile {
  id: string;
  name: string;
  email?: string;
  role: "user" | "admin";
  status?: string;
  country?: string;
  phone_number?: string;
  profile_image?: string;
  created_at?: string;
  last_login?: string;
}

export interface Library {
  id: string;
  name: string;
  description: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  description?: string;
  status?: "available" | "borrowed" | "lost" | "damaged";
  library_id: string;
  borrow_date?: string;
  created_at: string;
  updated_at: string;
}

// Admin function result types
export interface AdminUserResult {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  registration_date: string;
  last_login: string | null;
}
