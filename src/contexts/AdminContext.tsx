
import { createContext, useContext, useState, ReactNode } from "react";
import { User, Library, MaintenanceSettings } from "@/components/admin/types";
import { Ticket } from "@/components/tickets/TicketTypes";
import { SocialMedia } from "@/components/admin/SocialMediaTab";
import { UserRole } from "@/components/admin/RoleTypes";

// البيانات الأولية للمستخدمين
const initialUsers: User[] = [
  {
    id: "1",
    name: "أحمد محمد",
    email: "ahmed@example.com",
    status: "active",
    registrationDate: "2023-01-15",
    lastLogin: "2023-06-20",
    libraryCount: 3,
    role: "user"
  },
  {
    id: "2",
    name: "سارة علي",
    email: "sara@example.com",
    status: "active",
    registrationDate: "2023-02-10",
    lastLogin: "2023-06-18",
    libraryCount: 2,
    role: "user"
  },
  {
    id: "3",
    name: "عمر خالد",
    email: "omar@example.com",
    status: "inactive",
    registrationDate: "2023-03-05",
    lastLogin: "2023-05-12",
    libraryCount: 1,
    role: "user"
  },
  {
    id: "4",
    name: "نورا سالم",
    email: "noura@example.com",
    status: "active",
    registrationDate: "2023-06-21",
    lastLogin: "2023-06-21",
    libraryCount: 4,
    role: "user"
  },
  {
    id: "5",
    name: "فهد محمد",
    email: "fahad@example.com",
    status: "pending",
    registrationDate: "2023-06-15",
    lastLogin: "-",
    libraryCount: 0,
    role: "admin"
  },
];

// البيانات الأولية للمكتبات
const initialLibrariesData = [
  {
    id: "1",
    name: "مجموعة الروايات",
    owner: "أحمد محمد",
    ownerEmail: "ahmed@example.com",
    bookCount: 42,
    creationDate: "2023-02-10",
  },
  {
    id: "2",
    name: "كتب التقنية",
    owner: "أحمد محمد",
    ownerEmail: "ahmed@example.com",
    bookCount: 17,
    creationDate: "2023-03-15",
  },
  {
    id: "3",
    name: "الفلسفة",
    owner: "أحمد محمد",
    ownerEmail: "ahmed@example.com",
    bookCount: 8,
    creationDate: "2023-04-20",
  },
  {
    id: "4",
    name: "الأدب الكلاسيكي",
    owner: "سارة علي",
    ownerEmail: "sara@example.com",
    bookCount: 25,
    creationDate: "2023-02-28",
  },
  {
    id: "5",
    name: "العلوم",
    owner: "سارة علي",
    ownerEmail: "sara@example.com",
    bookCount: 13,
    creationDate: "2023-05-05",
  },
  {
    id: "6",
    name: "كتب التاريخ",
    owner: "عمر خالد",
    ownerEmail: "omar@example.com",
    bookCount: 9,
    creationDate: "2023-04-12",
  },
  {
    id: "7",
    name: "وصفات الطبخ",
    owner: "نورا سالم",
    ownerEmail: "noura@example.com",
    bookCount: 16,
    creationDate: "2023-03-10",
  },
  {
    id: "8",
    name: "أدلة السفر",
    owner: "نورا سالم",
    ownerEmail: "noura@example.com",
    bookCount: 11,
    creationDate: "2023-04-05",
  },
  {
    id: "9",
    name: "مجموعة الشعر",
    owner: "نورا سالم",
    ownerEmail: "noura@example.com",
    bookCount: 22,
    creationDate: "2023-05-15",
  },
  {
    id: "10",
    name: "كتب الفن",
    owner: "نورا سالم",
    ownerEmail: "noura@example.com",
    bookCount: 7,
    creationDate: "2023-06-01",
  },
];

// البيانات الأولية للتذاكر
const initialTickets: Ticket[] = [
  {
    id: "ticket-1",
    subject: "مشكلة في تسجيل الدخول",
    description: "لا أستطيع تسجيل الدخول إلى حسابي. يظهر خطأ عند إدخال كلمة المرور الصحيحة.",
    status: "open",
    priority: "high",
    userId: "1",
    userName: "أحمد محمد",
    userEmail: "ahmed@example.com",
    createdAt: "2023-06-10",
    updatedAt: "2023-06-10",
    responses: []
  },
  {
    id: "ticket-2",
    subject: "استفسار عن إضافة كتب",
    description: "كيف يمكنني إضافة كتب متعددة دفعة واحدة إلى مكتبتي؟",
    status: "in-progress",
    priority: "medium",
    userId: "2",
    userName: "سارة علي",
    userEmail: "sara@example.com",
    createdAt: "2023-06-12",
    updatedAt: "2023-06-13",
    responses: [
      {
        id: "response-1",
        ticketId: "ticket-2",
        message: "شكراً لتواصلك معنا. حالياً لا توجد ميزة لإضافة كتب متعددة دفعة واحدة، لكننا نعمل على تطويرها.",
        userId: "admin",
        userName: "فريق الدعم",
        isAdmin: true,
        createdAt: "2023-06-13"
      }
    ]
  },
  {
    id: "ticket-3",
    subject: "طلب ميزة جديدة",
    description: "أقترح إضافة ميزة لمشاركة المكتبات مع الأصدقاء.",
    status: "closed",
    priority: "low",
    userId: "4",
    userName: "نورا سالم",
    userEmail: "noura@example.com",
    createdAt: "2023-06-05",
    updatedAt: "2023-06-07",
    responses: [
      {
        id: "response-2",
        ticketId: "ticket-3",
        message: "شكراً لاقتراحك! سنضع هذه الميزة في خطة التطوير المستقبلية.",
        userId: "admin",
        userName: "فريق الدعم",
        isAdmin: true,
        createdAt: "2023-06-06"
      },
      {
        id: "response-3",
        ticketId: "ticket-3",
        message: "شكراً لكم! أتطلع لرؤية هذه الميزة قريباً.",
        userId: "4",
        userName: "نورا سالم",
        isAdmin: false,
        createdAt: "2023-06-06"
      },
      {
        id: "response-4",
        ticketId: "ticket-3",
        message: "تم إغلاق التذكرة. سنعلمك عند إضافة هذه الميزة.",
        userId: "admin",
        userName: "فريق الدعم",
        isAdmin: true,
        createdAt: "2023-06-07"
      }
    ]
  }
];

interface AdminContextData {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  libraries: Library[];
  setLibraries: React.Dispatch<React.SetStateAction<Library[]>>;
  filteredUsers: User[];
  setFilteredUsers: React.Dispatch<React.SetStateAction<User[]>>;
  filteredLibraries: Library[];
  setFilteredLibraries: React.Dispatch<React.SetStateAction<Library[]>>;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  activeUser: User | null;
  setActiveUser: React.Dispatch<React.SetStateAction<User | null>>;
  isEditUserDialogOpen: boolean;
  setIsEditUserDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isCreateUserDialogOpen: boolean;
  setIsCreateUserDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userFormData: {
    name: string;
    email: string;
    status: string;
    role: UserRole;
  };
  setUserFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    status: string;
    role: UserRole;
  }>>;
  tickets: Ticket[];
  handleUserSearch: (query: string) => void;
  handleLibrarySearch: (query: string) => void;
  openEditUserDialog: (user: User) => void;
  handleEditUser: () => void;
  toggleUserStatus: (id: string, currentStatus: string) => void;
  updateUserRole: (userId: string, newRole: UserRole) => void;
  handleCreateUser: (values: any) => void;
}

const AdminContext = createContext<AdminContextData | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [libraries, setLibraries] = useState<Library[]>(initialLibrariesData);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(initialUsers);
  const [filteredLibraries, setFilteredLibraries] = useState<Library[]>(initialLibrariesData);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  const [userFormData, setUserFormData] = useState<{
    name: string;
    email: string;
    status: string;
    role: UserRole;
  }>({
    name: "",
    email: "",
    status: "",
    role: "user"
  });

  const handleUserSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredUsers(users);
      return;
    }

    const results = users.filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredUsers(results);
  };

  const handleLibrarySearch = (query: string) => {
    if (!query.trim()) {
      setFilteredLibraries(libraries);
      return;
    }

    const results = libraries.filter(
      (library) =>
        library.name.toLowerCase().includes(query.toLowerCase()) ||
        library.owner.toLowerCase().includes(query.toLowerCase()) ||
        library.ownerEmail.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredLibraries(results);
  };

  const openEditUserDialog = (user: User) => {
    setActiveUser(user);
    setUserFormData({
      name: user.name,
      email: user.email,
      status: user.status,
      role: user.role || "user"
    });
    setIsEditUserDialogOpen(true);
  };

  const handleEditUser = () => {
    if (!activeUser) return;
    if (!userFormData.name.trim() || !userFormData.email.trim()) {
      return;
    }

    const updatedUsers = users.map((user) =>
      user.id === activeUser.id
        ? { ...user, ...userFormData }
        : user
    );

    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setIsEditUserDialogOpen(false);
    setActiveUser(null);
  };

  const handleCreateUser = (values: any) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: values.name,
      email: values.email,
      status: "active",
      registrationDate: new Date().toISOString().split('T')[0],
      lastLogin: "-",
      libraryCount: 0,
      role: values.role
    };

    const updatedUsers = [newUser, ...users];
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    
    setIsCreateUserDialogOpen(false);
  };

  const toggleUserStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, status: newStatus } : user
    );

    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
  };

  const deleteUser = (userId: string) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, role: newRole } : user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
  };

  return (
    <AdminContext.Provider value={{
      users,
      setUsers,
      libraries,
      setLibraries,
      filteredUsers,
      setFilteredUsers,
      filteredLibraries,
      setFilteredLibraries,
      activeTab,
      setActiveTab,
      activeUser,
      setActiveUser,
      isEditUserDialogOpen,
      setIsEditUserDialogOpen,
      isCreateUserDialogOpen,
      setIsCreateUserDialogOpen,
      userFormData,
      setUserFormData,
      tickets: initialTickets,
      handleUserSearch,
      handleLibrarySearch,
      openEditUserDialog,
      handleEditUser,
      toggleUserStatus,
      updateUserRole,
      handleCreateUser
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
