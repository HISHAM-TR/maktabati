
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
