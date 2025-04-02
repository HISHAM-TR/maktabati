
import React from "react";
import { Shield, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import RoleCards from "./RoleCards";
import PermissionsTable from "./PermissionsTable";

const RolesTabContent = () => {
  return (
    <>
      <div className="mb-4">
        <Alert>
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>تفاصيل الصلاحيات</AlertTitle>
          <AlertDescription>
            توضح هذه القائمة الصلاحيات المتاحة لكل دور في النظام. لا يمكن تعديل هذه الصلاحيات بشكل مباشر.
          </AlertDescription>
        </Alert>
      </div>

      <RoleCards />
      <PermissionsTable />
    </>
  );
};

export default RolesTabContent;
