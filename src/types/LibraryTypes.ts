
export type BookStatus = "available" | "borrowed" | "lost" | "damaged";

export interface BookType {
  id: string;
  title: string;
  author: string;
  description: string;
  cover_url: string;
  category: string;
  isbn: string;
  publication_year?: number;
  publisher: string;
  pages?: number;
  language: string;
  status: BookStatus;
  library_id: string;
  volumes: number;
}

export interface LibraryType {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  books: BookType[];
}
