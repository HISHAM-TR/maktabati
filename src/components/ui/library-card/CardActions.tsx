
import { Edit, Trash2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

interface CardActionsProps {
  id: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  position?: "left" | "right";
}

const CardActions = ({ id, onEdit, onDelete, position = "right" }: CardActionsProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleDelete = () => {
    console.log("تنفيذ وظيفة الحذف للعنصر:", id);
    toast.success("تم حذف المكتبة بنجاح");
    onDelete(id);
  };
  
  const handleEdit = () => {
    console.log("تنفيذ وظيفة التعديل للعنصر:", id);
    onEdit(id);
  };

  return (
    <div className={`absolute ${position === "left" ? "left-2" : "right-2"} top-2 z-10`}>
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="p-0 h-8 w-8 rounded-full hover:bg-muted">
            <MoreVertical className="h-5 w-5" />
            <span className="sr-only">فتح القائمة</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={position === "left" ? "start" : "end"}>
          <DropdownMenuItem onClick={() => onEdit(id)} className="text-[var(--andalusian-primary)] hover:text-[var(--andalusian-secondary)] focus:text-[var(--andalusian-secondary)]">
            <Edit className="h-4 w-4 ml-2 text-[var(--andalusian-primary)]" />
            تعديل
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              handleDelete();
              setIsMenuOpen(false);
            }}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 ml-2" />
            حذف
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CardActions;
