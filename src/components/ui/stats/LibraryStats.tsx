
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
    <div className="mb-10" dir="rtl">
      <h3 className="text-xl font-bold mb-4">إحصائيات المكتبة</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
      
      {statusCounts && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="متاح" 
            value={statusCounts.available} 
            icon={<CheckCircle className="h-6 w-6 text-white" />} 
            color="bg-green-500"
          />
          <StatCard 
            title="مستعار" 
            value={statusCounts.borrowed} 
            icon={<BookOpen className="h-6 w-6 text-white" />} 
            color="bg-blue-500"
          />
          <StatCard 
            title="مفقود" 
            value={statusCounts.lost} 
            icon={<XCircle className="h-6 w-6 text-white" />} 
            color="bg-red-500"
          />
          <StatCard 
            title="تالف" 
            value={statusCounts.damaged} 
            icon={<AlertTriangle className="h-6 w-6 text-white" />} 
            color="bg-yellow-500"
          />
        </div>
      )}
    </div>
  );
};

export default LibraryStats;
