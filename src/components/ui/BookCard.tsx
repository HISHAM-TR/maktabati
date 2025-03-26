
import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

export type BookType = {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
};

interface BookCardProps {
  book: BookType;
  onView: (book: BookType) => void;
  onEdit: (book: BookType) => void;
  onDelete: (id: string) => void;
}

const BookCard = ({ book, onView, onEdit, onDelete }: BookCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = () => {
    toast.success(`"${book.title}" deleted successfully`);
    onDelete(book.id);
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
              <DropdownMenuItem onClick={() => onView(book)}>
                <Eye className="h-4 w-4 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(book)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <Badge variant="outline" className="w-fit mb-2">
          {book.category}
        </Badge>
        <CardTitle className="text-xl line-clamp-1">{book.title}</CardTitle>
        <CardDescription className="text-sm">by {book.author}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {book.description}
        </p>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary"
          onClick={() => onView(book)}
        >
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onEdit(book)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookCard;
