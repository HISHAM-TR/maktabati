
export interface User {
  id: string;
  name: string;
  email: string;
  status: string;
  registrationDate: string;
  lastLogin: string;
  libraryCount: number;
  role?: "user" | "admin";
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
  role: "user" | "admin";
}

export type CreateUserFormValues = {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
};

export interface MaintenanceSettings {
  enabled: boolean;
  message: string;
}
