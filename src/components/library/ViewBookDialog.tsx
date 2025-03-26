
import { 
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, BookIcon, Calendar } from "lucide-react";
import { BookType } from "@/components/ui/BookCard";

interface ViewBookDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEditClick: () => void;
  activeBook: (BookType & { volumes?: number }) | null;
}

const ViewBookDialog = ({ 
  isOpen, 
  onOpenChange, 
  onEditClick, 
  activeBook 
}: ViewBookDialogProps) => {
  if (!activeBook) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="font-cairo sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-right">{activeBook.title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center">
            <User className="h-5 w-5 text-muted-foreground ml-2" />
            <span className="font-medium text-lg ml-2">المؤلف:</span>
            <span className="text-lg">{activeBook.author}</span>
          </div>
          <div className="flex items-center">
            <BookIcon className="h-5 w-5 text-muted-foreground ml-2" />
            <span className="font-medium text-lg ml-2">التصنيف:</span>
            <span className="text-lg">{activeBook.category}</span>
          </div>
          <div className="flex items-center">
            <BookIcon className="h-5 w-5 text-muted-foreground ml-2" />
            <span className="font-medium text-lg ml-2">عدد المجلدات:</span>
            <span className="text-lg">{activeBook.volumes || 1}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-muted-foreground ml-2" />
            <span className="font-medium text-lg ml-2">تمت الإضافة في:</span>
            <span className="text-lg">{new Date().toLocaleDateString('ar-EG')}</span>
          </div>
          <div className="mt-4">
            <h4 className="text-lg font-medium mb-2 text-right">الوصف:</h4>
            <p className="text-muted-foreground text-lg text-right">
              {activeBook.description || "لا يوجد وصف متاح."}
            </p>
          </div>
        </div>
        <DialogFooter className="flex-row sm:justify-end">
          <Button onClick={onEditClick} className="text-lg py-6 px-8">
            تعديل الكتاب
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="text-lg py-6 px-8 mr-2">
            إغلاق
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewBookDialog;
