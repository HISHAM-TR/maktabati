
// تعريف أنواع الأدوار المتاحة في النظام
export type UserRole = "owner" | "admin" | "moderator" | "user";

// قائمة الأدوار المترجمة للعرض في الواجهة
export const USER_ROLES: Record<UserRole, string> = {
  owner: "مالك النظام",
  admin: "مدير",
  moderator: "مشرف",
  user: "مستخدم"
};

// وصف كل دور لعرضه في الواجهة
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  owner: "صلاحية وصول كاملة لجميع ميزات النظام وإدارة المستخدمين والأدوار",
  admin: "إدارة المحتوى والمستخدمين مع صلاحيات واسعة",
  moderator: "مراقبة المحتوى والمساعدة في إدارة المكتبات والتذاكر",
  user: "صلاحيات أساسية لإنشاء وإدارة المكتبات الشخصية"
};

// تعريف الصلاحيات المتاحة في النظام
export interface Permission {
  key: string;
  name: string;
  description: string;
  allowedRoles: UserRole[];
}

// قائمة الصلاحيات المتاحة في النظام
export const PERMISSIONS: Permission[] = [
  {
    key: "manage_users",
    name: "إدارة المستخدمين",
    description: "إضافة وتعديل وحذف المستخدمين وتغيير أدوارهم",
    allowedRoles: ["owner", "admin"]
  },
  {
    key: "manage_roles",
    name: "إدارة الأدوار",
    description: "تعيين وتغيير أدوار المستخدمين في النظام",
    allowedRoles: ["owner"]
  },
  {
    key: "manage_libraries",
    name: "إدارة المكتبات",
    description: "إدارة جميع المكتبات في النظام",
    allowedRoles: ["owner", "admin", "moderator"]
  },
  {
    key: "manage_tickets",
    name: "إدارة تذاكر الدعم",
    description: "الرد على تذاكر الدعم وإغلاقها",
    allowedRoles: ["owner", "admin", "moderator"]
  },
  {
    key: "manage_maintenance",
    name: "إدارة وضع الصيانة",
    description: "تفعيل وتعطيل وضع الصيانة وتعديل رسالة الصيانة",
    allowedRoles: ["owner", "admin"]
  },
  {
    key: "view_statistics",
    name: "عرض الإحصائيات",
    description: "الوصول إلى إحصائيات النظام والمستخدمين والمكتبات",
    allowedRoles: ["owner", "admin", "moderator"]
  }
];
