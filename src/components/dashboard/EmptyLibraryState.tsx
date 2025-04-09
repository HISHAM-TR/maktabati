
import { Plus, Library } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyLibraryStateProps {
  hasLibraries: boolean;
  onCreateClick: () => void;
}

const EmptyLibraryState = ({ hasLibraries, onCreateClick }: EmptyLibraryStateProps) => {
  return (
    <div className="text-center py-16">
      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <Library className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">لم يتم العثور على تصنيفات</h3>
      <p className="text-muted-foreground mb-6 text-lg">
        {hasLibraries
          ? "جرب مصطلح بحث مختلف."
          : "قم بإنشاء تصنيفك الأول للبدء."}
      </p>
      <Button
        onClick={onCreateClick}
        className="text-base py-5 px-6"
      >
        <Plus className="h-5 w-5 ml-2" />
        إنشاء تصنيف
      </Button>
    </div>
  );
};

export default EmptyLibraryState;
