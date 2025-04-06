import { User } from "../App";

// دالة لجلب المستخدم الحالي من التخزين المحلي
export const fetchCurrentUser = async (): Promise<User | null> => {
  try {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData) as User;
      
      // التحقق من البريد الإلكتروني الخاص بالمشرف وضمان أن له صلاحيات كاملة
      if (user.email.toLowerCase() === "abouelfida2@gmail.com") {
        user.role = "owner";
      }
      
      return user;
    }
    
    // التحقق من وجود المستخدم في التخزين المحلي للمصادقة
    const currentUserData = localStorage.getItem("currentUser");
    if (currentUserData) {
      const currentUser = JSON.parse(currentUserData) as User;
      
      // التحقق من البريد الإلكتروني الخاص بالمشرف وضمان أن له صلاحيات كاملة
      if (currentUser.email.toLowerCase() === "abouelfida2@gmail.com") {
        currentUser.role = "owner";
      }
      
      // حفظ المستخدم في التخزين المحلي للمستخدم
      localStorage.setItem("user", JSON.stringify(currentUser));
      
      return currentUser;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};

// دالة لتسجيل الخروج من النظام
export const signOut = async (): Promise<void> => {
  try {
    localStorage.removeItem("user");
  } catch (error) {
    console.error("Error during sign out:", error);
    throw error;
  }
};