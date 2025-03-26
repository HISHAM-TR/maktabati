
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface LibraryHeaderProps {
  id: string;
  name: string;
  description: string;
  onAddBookClick: () => void;
}

const LibraryHeader = ({ id, name, description, onAddBookClick }: LibraryHeaderProps) => {
  return (
    <>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <div className="flex items-center mb-2">
            <Link to="/dashboard" className="text-muted-foreground hover:text-primary ms-4">
              <ChevronRight className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold">{name}</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl text-lg">
            {description}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="mb-4 md:mb-0 md:w-1/2">
          {/* SearchBar будет передаваться через пропсы из родительского компонента */}
        </div>
        <Button
          onClick={onAddBookClick}
          className="text-lg py-6 px-8"
        >
          <Plus className="h-5 w-5 ms-2" />
          إضافة كتاب
        </Button>
      </div>
    </>
  );
};

export default LibraryHeader;
