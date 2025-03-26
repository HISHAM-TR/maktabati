
import { useState } from "react";
import { Link } from "react-router-dom";
import { Book, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LibraryCardProps {
  id: string;
  name: string;
  description: string;
  bookCount: number;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const LibraryCard = ({ 
  id, 
  name, 
  description, 
  bookCount, 
  onDelete, 
  onEdit 
}: LibraryCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = () => {
    toast.success("تم حذف المكتبة بنجاح");
    onDelete(id);
  };

  return (
    <Card 
      className={`card-hover overflow-hidden ${
        isHovered ? "shadow-md" : "shadow-sm"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-2 relative">
        <div className="absolute right-2 top-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(id)}>
                <Edit className="h-4 w-4 ml-2" />
                تعديل
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 ml-2" />
                حذف
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
          <Book className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="text-sm text-muted-foreground">
          {bookCount} {bookCount === 1 ? "كتاب" : "كتب"}
        </div>
      </CardContent>
      
      <CardFooter>
        <Link to={`/library/${id}`} className="w-full">
          <Button variant="outline" className="w-full">
            عرض المكتبة
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default LibraryCard;
