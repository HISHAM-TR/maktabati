
import React from 'react';

export type StatCardProps = {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => {
  return (
    <div className={`p-6 rounded-lg shadow-sm border border-border flex items-center ${color}`}>
      <div className="p-3 rounded-full bg-white/20 mr-4">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
