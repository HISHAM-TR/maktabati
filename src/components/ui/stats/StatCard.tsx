
import React, { useState, useEffect } from 'react';

export type StatCardProps = {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => {
  const [count, setCount] = useState(0);
  const finalValue = typeof value === 'number' ? value : parseInt(value.toString()) || 0;
  
  useEffect(() => {
    if (typeof value !== 'number') return;
    
    const duration = 1000; // Animation duration in milliseconds
    const steps = 20; // Number of steps in animation
    const stepValue = Math.ceil(finalValue / steps);
    let current = 0;
    
    const timer = setInterval(() => {
      current += stepValue;
      if (current > finalValue) {
        current = finalValue;
        clearInterval(timer);
      }
      setCount(current);
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [finalValue]);

  return (
    <div className={`p-4 rounded-lg shadow-sm border border-border flex items-center ${color} font-cairo`}>
      <div className="p-2 rounded-full bg-white/20 ml-3">
        {icon}
      </div>
      <div className="flex flex-col items-center flex-1">
        <h3 className="text-sm font-medium text-white">{title}</h3>
        <p className="text-xl font-bold text-white">
          {typeof value === 'number' ? count : value}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
