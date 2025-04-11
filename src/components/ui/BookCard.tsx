
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Book, Pencil, Eye, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import HamburgerMenu from "./HamburgerMenu";

export type BookType = {
  id: string;
  title: string;
  author: string;
  category: string;
  description?: string;
  status?: "available" | "borrowed" | "lost" | "damaged";
  borrowDate?: Date;
  isRare?: boolean;
  isReference?: boolean;
  needsRepair?: boolean;
};

interface BookCardProps {
  book: BookType;
  onView: (book: BookType) => void;
  onEdit: (book: BookType) => void;
  onDelete: (id: string) => void;
}

const BookCard = ({ book, onView, onEdit, onDelete }: BookCardProps) => {
  const getStatusBadge = () => {
    switch (book.status) {
      case "available":
        return <Badge className="bg-green-500 hover:bg-green-600">متاح</Badge>;
      case "borrowed":
        return <Badge className="bg-blue-500 hover:bg-blue-600">مستعار</Badge>;
      case "lost":
        return <Badge className="bg-red-500 hover:bg-red-600">مفقود</Badge>;
      case "damaged":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">تالف</Badge>;
      default:
        return <Badge className="bg-green-500 hover:bg-green-600">متاح</Badge>;
    }
  };

  return (
    <Card className="overflow-hidden border border-muted h-full flex flex-col" dir="rtl">
      <CardContent className="pt-6 px-6 flex-grow">
        <div className="flex justify-between items-start">
          <div className="h-12 w-12 rounded-full flex items-center justify-center bg-primary/10 mb-4">
            <Book className="h-6 w-6 text-primary" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <Button variant="ghost" size="icon" className="p-0 h-8 w-8">
                <HamburgerMenu />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => onView(book)}>
                <Eye className="h-4 w-4 ml-2" />
                عرض التفاصيل
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(book)}>
                <Pencil className="h-4 w-4 ml-2" />
                تعديل
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(book.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 ml-2" />
                حذف
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <h3 className="text-xl font-bold mb-1 line-clamp-1 text-right">{book.title}</h3>
        <p className="text-muted-foreground mb-2 line-clamp-1 text-right">{book.author}</p>
        <div className="flex flex-wrap space-x-reverse space-x-2 mb-3 justify-end gap-y-2">
          <Badge variant="outline">{book.category}</Badge>
          {getStatusBadge()}
          {book.isRare && <Badge className="bg-amber-500 hover:bg-amber-600">نادر</Badge>}
          {book.isReference && <Badge className="bg-indigo-500 hover:bg-indigo-600">مرجع</Badge>}
          {book.needsRepair && <Badge className="bg-orange-500 hover:bg-orange-600">صيانة</Badge>}
        </div>
        <p className="text-muted-foreground text-sm line-clamp-3 text-right">
          {book.description || "لا يوجد وصف متاح"}
        </p>
      </CardContent>
      <CardFooter className="border-t px-6 py-3 bg-muted/30">
        {book.status === "borrowed" && book.borrowDate ? (
          <div className="text-sm text-muted-foreground text-right w-full">
            تاريخ الإعارة: {format(new Date(book.borrowDate), "yyyy-MM-dd")}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground text-right w-full">
            أضيف بتاريخ: {new Date().toLocaleDateString("ar-EG")}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default BookCard;
