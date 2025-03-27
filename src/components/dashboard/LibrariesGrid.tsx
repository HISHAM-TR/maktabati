
import LibraryCard from "@/components/ui/LibraryCard";

export interface Library {
  id: string;
  name: string;
  description: string;
  bookCount: number;
  volumeCount?: number;
}

interface LibrariesGridProps {
  libraries: Library[];
  onDeleteLibrary: (id: string) => void;
  onEditLibrary: (id: string) => void;
}

const LibrariesGrid = ({ libraries, onDeleteLibrary, onEditLibrary }: LibrariesGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {libraries.map((library) => (
        <LibraryCard
          key={library.id}
          id={library.id}
          name={library.name}
          description={library.description}
          bookCount={library.bookCount}
          volumeCount={library.volumeCount}
          onDelete={onDeleteLibrary}
          onEdit={onEditLibrary}
        />
      ))}
    </div>
  );
};

export default LibrariesGrid;
