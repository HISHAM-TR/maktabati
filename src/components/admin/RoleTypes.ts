
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
  owner: "صلاحيات كاملة للنظام وإدارة المشرفين والوصول لجميع البيانات",
  admin: "صلاحيات إدارية واسعة تشمل معظم أجزاء النظام",
  moderator: "صلاحيات محدودة للإشراف على المحتوى والمستخدمين",
  user: "صلاحيات محدودة لإدارة المكتبات الشخصية"
};

export const PERMISSIONS: RolePermission[] = [
  { name: "إدارة المستخدمين", description: "إضافة وتعديل وحذف المستخدمين", key: "manage_users", allowedRoles: ["owner", "admin"] },
  { name: "إدارة المشرفين", description: "تعيين وتعديل أدوار المشرفين", key: "manage_admins", allowedRoles: ["owner"] },
  { name: "إدارة الأدوار", description: "تعيين وتعديل أدوار المستخدمين", key: "manage_roles", allowedRoles: ["owner"] },
  { name: "وضع الصيانة", description: "تفعيل وضع الصيانة للموقع", key: "maintenance_mode", allowedRoles: ["owner", "admin"] },
  { name: "إدارة المكتبات", description: "الإشراف على جميع المكتبات", key: "manage_all_libraries", allowedRoles: ["owner", "admin", "moderator"] },
  { name: "عرض المكتبات والكتب", description: "الاطلاع على مكتبات المستخدمين وكتبهم", key: "view_all_libraries", allowedRoles: ["owner", "admin", "moderator"] },
  { name: "إدارة التذاكر", description: "الرد على تذاكر الدعم الفني", key: "manage_tickets", allowedRoles: ["owner", "admin", "moderator"] },
  { name: "إعدادات الموقع", description: "تعديل إعدادات الموقع العامة", key: "site_settings", allowedRoles: ["owner", "admin"] },
  { name: "إدارة وسائل التواصل", description: "إدارة روابط التواصل الاجتماعي", key: "manage_social_media", allowedRoles: ["owner", "admin"] },
  { name: "عرض التقارير", description: "عرض إحصائيات وتقارير النظام", key: "view_reports", allowedRoles: ["owner", "admin", "moderator"] },
  { name: "إدارة الإحصائيات", description: "إنشاء وتعديل الرسوم البيانية والإحصائيات", key: "manage_statistics", allowedRoles: ["owner", "admin"] }
];

export const hasPermission = (userRole: UserRole | undefined, permissionKey: string): boolean => {
  if (!userRole) return false;
  
  const permission = PERMISSIONS.find(p => p.key === permissionKey);
  if (!permission) return false;
  
  return permission.allowedRoles.includes(userRole);
};
