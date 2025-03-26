
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search..." 
}: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="relative w-full max-w-md mx-auto"
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-12 py-2 w-full bg-white"
        />
        <button
          type="submit"
          className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary text-white px-3 py-1 rounded-md text-sm font-medium h-[34px]"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
