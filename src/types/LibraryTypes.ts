
export interface LibraryType {
  id: string;
  name: string;
  description?: string;
  owner_id?: string;
  is_public?: boolean;
  books?: BookType[];
  created_at?: string;
  updated_at?: string;
}

export interface BookType {
  id: string;
  title: string;
  author: string;
  description?: string;
  cover_url?: string;
  category?: string;
  isbn?: string;
  publication_year?: number;
  publisher?: string;
  pages?: number;
  language?: string;
  status?: "available" | "borrowed" | "lost" | "damaged";
  volumes?: number;
  library_id?: string;
}
