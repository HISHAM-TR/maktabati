
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface LibraryHeadingProps {
  name: string;
  description: string;
}

const LibraryHeading = ({ name, description }: LibraryHeadingProps) => {
  return (
    <div className="mb-8 flex justify-between items-center">
      <div>
        <div className="flex items-center mb-2">
          <Link to="/dashboard" className="text-muted-foreground hover:text-primary ml-4">
            <ChevronRight className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold">{name}</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl text-lg">
          {description}
        </p>
      </div>
    </div>
  );
};

export default LibraryHeading;
