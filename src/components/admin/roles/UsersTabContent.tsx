
import React from "react";
import { Shield } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import SearchBar from "@/components/ui/SearchBar";
import UserRolesTable from "./UserRolesTable";
import { User as UserType } from "../types";
import { UserRole } from "../RoleTypes";

interface UsersTabContentProps {
  users: UserType[];
  filteredUsers: UserType[];
  handleUserSearch: (query: string) => void;
  updateUserRole: (userId: string, newRole: UserRole) => void;
  currentUserRole: UserRole;
}

const UsersTabContent = ({
  filteredUsers,
  handleUserSearch,
  updateUserRole,
  currentUserRole
}: UsersTabContentProps) => {
  return (
    <>
      <div className="mb-4">
        <Alert>
          <Shield className="h-5 w-5" />
          <AlertTitle>إدارة الأدوار والصلاحيات</AlertTitle>
          <AlertDescription>
            يمكنك تعيين أدوار للمستخدمين حسب الصلاحيات المطلوبة. كل دور يتيح مجموعة محددة من الإمكانيات.
          </AlertDescription>
        </Alert>
      </div>

      <div className="flex justify-between items-center mb-6">
        <SearchBar
          onSearch={handleUserSearch}
          placeholder="ابحث عن المستخدمين بالاسم أو البريد الإلكتروني..."
        />
      </div>

      <UserRolesTable 
        filteredUsers={filteredUsers} 
        updateUserRole={updateUserRole} 
        currentUserRole={currentUserRole} 
      />
    </>
  );
};

export default UsersTabContent;
