
import React from 'react';
import { 
  Book, 
  BookOpen, 
  BookText,
  BookCopy
} from "lucide-react";
import StatCard from './StatCard';

export type LibraryStatsProps = {
  totalLibraries: number;
  totalBooks: number;
  totalCategories: number;
  totalVolumes: number;
}

const LibraryStats = ({ totalLibraries, totalBooks, totalCategories, totalVolumes }: LibraryStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10" dir="rtl">
      <StatCard 
        title="إجمالي المكتبات" 
        value={totalLibraries} 
        icon={<BookOpen className="h-6 w-6 text-white" />} 
        color="bg-primary/90"
      />
      <StatCard 
        title="إجمالي الكتب" 
        value={totalBooks} 
        icon={<Book className="h-6 w-6 text-white" />} 
        color="bg-green-600"
      />
      <StatCard 
        title="التصنيفات" 
        value={totalCategories} 
        icon={<BookText className="h-6 w-6 text-white" />} 
        color="bg-amber-600"
      />
      <StatCard 
        title="إجمالي المجلدات" 
        value={totalVolumes} 
        icon={<BookCopy className="h-6 w-6 text-white" />} 
        color="bg-indigo-600"
      />
    </div>
  );
};

export default LibraryStats;
