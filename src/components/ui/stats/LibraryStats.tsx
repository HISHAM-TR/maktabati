
import React from 'react';
import { 
  Book, 
  BookOpen, 
  BookText,
  BookCopy
} from "lucide-react";
import StatCard from './StatCard';
import StatusStats from './StatusStats';

export type LibraryStatsProps = {
  totalLibraries: number;
  totalBooks: number;
  totalCategories: number;
  totalVolumes: number;
  statusCounts?: {
    available: number;
    borrowed: number;
    lost: number;
    damaged: number;
  };
}

const LibraryStats = ({ 
  totalLibraries, 
  totalBooks, 
  totalCategories, 
  totalVolumes,
  statusCounts 
}: LibraryStatsProps) => {
  return (
    <div className="mb-10" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
      
      {statusCounts && <StatusStats statusCounts={statusCounts} />}
    </div>
  );
};

export default LibraryStats;
