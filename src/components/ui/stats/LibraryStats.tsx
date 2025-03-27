
import React from 'react';
import { 
  Book, 
  BookOpen, 
  BookText,
  BookCopy,
  CheckCircle,
  AlertTriangle,
  XCircle
} from "lucide-react";
import StatCard from './StatCard';

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
    <div className="mb-8" dir="rtl">
      <h3 className="text-lg font-bold mb-3 font-cairo">إحصائيات المكتبة</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard 
          title="إجمالي المكتبات" 
          value={totalLibraries} 
          icon={<BookOpen className="h-5 w-5 text-white" />} 
          color="bg-primary/90"
        />
        <StatCard 
          title="إجمالي الكتب" 
          value={totalBooks} 
          icon={<Book className="h-5 w-5 text-white" />} 
          color="bg-green-600"
        />
        <StatCard 
          title="التصنيفات" 
          value={totalCategories} 
          icon={<BookText className="h-5 w-5 text-white" />} 
          color="bg-amber-600"
        />
        <StatCard 
          title="إجمالي المجلدات" 
          value={totalVolumes} 
          icon={<BookCopy className="h-5 w-5 text-white" />} 
          color="bg-indigo-600"
        />
        
        {statusCounts && (
          <>
            <StatCard 
              title="متاح" 
              value={statusCounts.available} 
              icon={<CheckCircle className="h-5 w-5 text-white" />} 
              color="bg-green-500"
            />
            <StatCard 
              title="مستعار" 
              value={statusCounts.borrowed} 
              icon={<BookOpen className="h-5 w-5 text-white" />} 
              color="bg-blue-500"
            />
            <StatCard 
              title="مفقود" 
              value={statusCounts.lost} 
              icon={<XCircle className="h-5 w-5 text-white" />} 
              color="bg-red-500"
            />
            <StatCard 
              title="تالف" 
              value={statusCounts.damaged} 
              icon={<AlertTriangle className="h-5 w-5 text-white" />} 
              color="bg-yellow-500"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default LibraryStats;
