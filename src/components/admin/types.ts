
export interface User {
  id: string;
  name: string;
  email: string;
  status: string;
  registrationDate: string;
  lastLogin: string;
  libraryCount: number;
  role?: "owner" | "admin" | "moderator" | "user";
  phone?: string; // ✅ أضف هذا السطر لحل المشكلة
}

export interface Library {
  id: string;
  name: string;
  owner: string;
  ownerEmail: string;
  bookCount: number;
  creationDate: string;
}

export interface UserFormData {
  name: string;
  email: string;
  status: string;
  role: "owner" | "admin" | "moderator" | "user";
}

export type CreateUserFormValues = {
  name: string;
  email: string;
  password: string;
  role: "owner" | "admin" | "moderator" | "user";
};

export interface MaintenanceSettings {
  enabled: boolean;
  message: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: "new" | "read" | "replied";
}
