
import { User } from "@/App";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  user: User | null;
  onCreateLibraryClick: () => void;
}

const DashboardHeader = ({ user, onCreateLibraryClick }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 tracking-wide andalusian-title">لوحة التحكم</h1>
        <p className="text-muted-foreground text-lg">
          مرحبًا{user?.name ? ` ${user.name}` : ""}، قم بإدارة المكتبات والكتب الخاصة بك
        </p>
      </div>
      <div className="flex gap-3 mt-4 md:mt-0">
        <Button
          onClick={onCreateLibraryClick}
          className="text-base py-5 px-6 andalusian-button"
        >
          <Plus className="h-5 w-5 ml-2" />
          إنشاء تصنيف
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
