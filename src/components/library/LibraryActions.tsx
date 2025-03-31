
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/ui/SearchBar";
import { BookType } from "@/components/ui/BookCard";

interface LibraryActionsProps {
  onSearch: (query: string) => void;
  onAddBookClick: () => void;
}

const LibraryActions = ({ onSearch, onAddBookClick }: LibraryActionsProps) => {
  const handleSearch = (query: string) => {
    onSearch(query);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div className="mb-4 md:mb-0 md:w-1/2">
        <SearchBar
          onSearch={handleSearch}
          placeholder="ابحث عن الكتب حسب العنوان أو المؤلف أو التصنيف..."
          label="البحث في المكتبة:"
        />
      </div>
      <Button
        onClick={onAddBookClick}
        className="text-lg py-6 px-8"
      >
        <Plus className="h-5 w-5 ml-2" />
        إضافة كتاب
      </Button>
    </div>
  );
};

export default LibraryActions;
