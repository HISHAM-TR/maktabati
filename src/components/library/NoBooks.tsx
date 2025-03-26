
import { BookIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface NoBooksProps {
  hasBooks: boolean;
  onAddBookClick: () => void;
}

const NoBooks = ({ hasBooks, onAddBookClick }: NoBooksProps) => {
  return (
    <div className="text-center py-16">
      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <BookIcon className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">لم يتم العثور على كتب</h3>
      <p className="text-muted-foreground mb-6 text-lg">
        {hasBooks
          ? "جرب مصطلح بحث مختلفًا."
          : "أضف أول كتاب إلى هذه المكتبة."}
      </p>
      <Button
        onClick={onAddBookClick}
        className="text-lg py-6 px-8"
      >
        <Plus className="h-5 w-5 ms-2" />
        إضافة كتاب
      </Button>
    </div>
  );
};

export default NoBooks;
