
import { useState } from "react";
import { Book, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
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

export interface BookType {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
}

interface BookCardProps {
  book: BookType;
  onView: (book: BookType) => void;
  onEdit: (book: BookType) => void;
  onDelete: (id: string) => void;
}

const BookCard = ({ book, onView, onEdit, onDelete }: BookCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(book.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(book);
  };

  const handleView = () => {
    onView(book);
  };

  return (
    <Card 
      className={`card-hover overflow-hidden cursor-pointer ${
        isHovered ? "shadow-md" : "shadow-sm"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleView}
    >
      <CardHeader className="pb-2 relative">
        <div className="absolute left-2 top-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onView(book);
              }}>
                <Eye className="h-4 w-4 ml-2 text-blue-500" />
                عرض
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="h-4 w-4 ml-2 text-green-500" />
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
        
        <div className="flex items-center mb-2">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-2">
            <Book className="h-5 w-5 text-primary" />
          </div>
          <div>
            <Badge variant="outline" className="font-normal">
              {book.category}
            </Badge>
          </div>
        </div>
        
        <CardTitle className="text-xl line-clamp-1">{book.title}</CardTitle>
        <CardDescription className="text-sm line-clamp-1">
          {book.author}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {book.description || "لا يوجد وصف متاح."}
        </p>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-1">
        <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-700" onClick={(e) => {
          e.stopPropagation();
          onView(book);
        }}>
          <Eye className="h-4 w-4 ml-1" />
          عرض
        </Button>
        
        <Button variant="ghost" size="sm" className="text-green-500 hover:text-green-700" onClick={(e) => {
          e.stopPropagation();
          onEdit(book);
        }}>
          <Edit className="h-4 w-4 ml-1" />
          تعديل
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookCard;
