
import { useState } from "react";
import { Book, MoreHorizontal, Edit, Trash2, Eye, Calendar, AlertCircle } from "lucide-react";
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
import { format } from "date-fns";

export interface BookType {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  status?: "available" | "borrowed" | "lost" | "damaged";
  borrowDate?: Date | null;
  returnDate?: Date | null;
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

  const getStatusBadge = () => {
    switch (book.status) {
      case "borrowed":
        return <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">مستعار</Badge>;
      case "lost":
        return <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">مفقود</Badge>;
      case "damaged":
        return <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200">تالف</Badge>;
      default:
        return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">متاح</Badge>;
    }
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
          <div className="flex flex-col">
            <Badge variant="outline" className="font-normal">
              {book.category}
            </Badge>
            <div className="mt-1">
              {getStatusBadge()}
            </div>
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
        
        {book.status === "borrowed" && book.borrowDate && (
          <div className="flex items-center mt-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 ml-1 text-blue-500" />
            <span>تاريخ الإعارة: {format(new Date(book.borrowDate), "yyyy-MM-dd")}</span>
          </div>
        )}
        
        {(book.status === "lost" || book.status === "damaged") && (
          <div className="flex items-center mt-2 text-xs text-muted-foreground">
            <AlertCircle className="h-3 w-3 ml-1 text-red-500" />
            <span>{book.status === "lost" ? "مفقود منذ" : "تالف منذ"}: {new Date().toLocaleDateString('ar-EG')}</span>
          </div>
        )}
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
