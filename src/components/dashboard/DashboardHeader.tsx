
import { User } from "@/App";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  user: User | null;
  onCreateLibraryClick: () => void;
}

const DashboardHeader = ({ user, onCreateLibraryClick }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 tracking-wide">لوحة التحكم</h1>
        <p className="text-muted-foreground text-lg">
          مرحبًا{user?.name ? ` ${user.name}` : ""}، قم بإدارة المكتبات والكتب الخاصة بك
        </p>
      </div>
      <Button
        onClick={onCreateLibraryClick}
        className="mt-4 md:mt-0 text-base py-5 px-6"
      >
        <Plus className="h-5 w-5 ml-2" />
        إنشاء مكتبة
      </Button>
    </div>
  );
};

export default DashboardHeader;
