
import React from 'react';
import { 
  CheckCircle, 
  BookOpen, 
  AlertTriangle,
  XCircle 
} from "lucide-react";
import StatCard from './StatCard';

type StatusStatsProps = {
  statusCounts: {
    available: number;
    borrowed: number;
    lost: number;
    damaged: number;
  };
}

const StatusStats = ({ statusCounts }: StatusStatsProps) => {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">إحصائيات حالة الكتب</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
    </div>
  );
};

export default StatusStats;
