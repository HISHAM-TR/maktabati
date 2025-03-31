
export type UserRole = "owner" | "admin" | "moderator" | "user";

export interface RolePermission {
  name: string;
  description: string;
  key: string;
  allowedRoles: UserRole[];
}

export const USER_ROLES: Record<UserRole, string> = {
  owner: "مالك النظام",
  admin: "مشرف",
  moderator: "مشرف محدود",
  user: "مستخدم"
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  owner: "صلاحيات كاملة للنظام وإدارة المشرفين",
  admin: "صلاحيات إدارية لكافة أجزاء النظام",
  moderator: "صلاحيات محدودة للإشراف على المحتوى والمستخدمين",
  user: "صلاحيات محدودة لإدارة المكتبات الشخصية"
};

export const PERMISSIONS: RolePermission[] = [
  { name: "إدارة المستخدمين", description: "إضافة وتعديل وحذف المستخدمين", key: "manage_users", allowedRoles: ["owner", "admin"] },
  { name: "إدارة الأدوار", description: "تعيين وتعديل أدوار المستخدمين", key: "manage_roles", allowedRoles: ["owner"] },
  { name: "وضع الصيانة", description: "تفعيل وضع الصيانة للموقع", key: "maintenance_mode", allowedRoles: ["owner", "admin"] },
  { name: "إدارة المكتبات", description: "الإشراف على جميع المكتبات", key: "manage_all_libraries", allowedRoles: ["owner", "admin", "moderator"] },
  { name: "إدارة التذاكر", description: "الرد على تذاكر الدعم الفني", key: "manage_tickets", allowedRoles: ["owner", "admin", "moderator"] },
  { name: "إعدادات الموقع", description: "تعديل إعدادات الموقع العامة", key: "site_settings", allowedRoles: ["owner", "admin"] },
  { name: "إدارة وسائل التواصل", description: "إدارة روابط التواصل الاجتماعي", key: "manage_social_media", allowedRoles: ["owner", "admin"] },
  { name: "عرض التقارير", description: "عرض إحصائيات وتقارير النظام", key: "view_reports", allowedRoles: ["owner", "admin", "moderator"] }
];
