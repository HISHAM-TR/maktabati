
import { useState } from "react";
import SearchBar from "@/components/ui/SearchBar";
import LibrariesGrid from "@/components/dashboard/LibrariesGrid";
import EmptyLibraryState from "@/components/dashboard/EmptyLibraryState";
import { Library } from "@/components/dashboard/LibrariesGrid";

interface LibrariesSectionProps {
  libraries: Library[];
  onSearch: (query: string) => void;
  onDeleteLibrary: (id: string) => void;
  onEditLibrary: (id: string) => void;
  onCreateLibraryClick: () => void;
}

const LibrariesSection = ({
  libraries,
  onSearch,
  onDeleteLibrary,
  onEditLibrary,
  onCreateLibraryClick,
}: LibrariesSectionProps) => {
  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">مكتباتي</h2>
          <p className="text-muted-foreground">
            إجمالي المكتبات: {libraries.length}
          </p>
        </div>
        <SearchBar
          onSearch={onSearch}
          placeholder="ابحث عن المكتبات حسب الاسم أو الوصف..."
        />
      </div>

      {libraries.length > 0 ? (
        <LibrariesGrid
          libraries={libraries}
          onDeleteLibrary={onDeleteLibrary}
          onEditLibrary={onEditLibrary}
        />
      ) : (
        <EmptyLibraryState
          hasLibraries={libraries.length > 0}
          onCreateClick={onCreateLibraryClick}
        />
      )}
    </>
  );
};

export default LibrariesSection;
