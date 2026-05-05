import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  color?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendType = 'neutral',
  color = 'bg-white'
}) => {
  return (
    <div className="glass-card p-6 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-secondary">{value}</h3>
        {trend && (
          <p className={cn(
            "text-xs font-medium mt-2",
            trendType === 'positive' ? "text-accent" : 
            trendType === 'negative' ? "text-red-500" : "text-slate-400"
          )}>
            {trend} <span className="text-slate-400 font-normal">dari bulan lalu</span>
          </p>
        )}
      </div>
      <div className={cn("p-3 rounded-xl bg-slate-50", color)}>
        <Icon className="w-6 h-6 text-primary" />
      </div>
    </div>
  );
};
