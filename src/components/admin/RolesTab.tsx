
import React, { useState } from "react";
import { Users, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User as UserType } from "./types";
import { UserRole } from "./RoleTypes";
import UsersTabContent from "./roles/UsersTabContent";
import RolesTabContent from "./roles/RolesTabContent";

interface RolesTabProps {
  users: UserType[];
  updateUserRole: (userId: string, newRole: UserRole) => void;
  currentUserRole: UserRole;
}

const RolesTab = ({ users, updateUserRole, currentUserRole }: RolesTabProps) => {
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>(users);
  const [activeTab, setActiveTab] = useState<"users" | "permissions">("users");

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

  return (
    <div className="animate-fade-in">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "users" | "permissions")}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>المستخدمين والأدوار</span>
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>الصلاحيات</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UsersTabContent
            users={users}
            filteredUsers={filteredUsers}
            handleUserSearch={handleUserSearch}
            updateUserRole={updateUserRole}
            currentUserRole={currentUserRole}
          />
        </TabsContent>

        <TabsContent value="permissions">
          <RolesTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RolesTab;
