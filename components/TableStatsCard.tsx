import React from 'react';
import { TableStats } from '../types';
import { User } from 'lucide-react';

interface Props {
  stats: TableStats;
  compact?: boolean;
  onClick?: () => void;
  selected?: boolean;
}

export const TableStatsCard: React.FC<Props> = ({ stats, compact = false, onClick, selected }) => {
  const isFull = stats.count >= stats.capacity;
  
  const maleWidth = stats.count > 0 ? (stats.maleCount / stats.count) * 100 : 0;
  const femaleWidth = stats.count > 0 ? (stats.femaleCount / stats.count) * 100 : 0;

  return (
    <div 
      onClick={onClick}
      className={`
        relative border rounded-2xl overflow-hidden transition-all cursor-pointer
        ${selected 
            ? 'ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50/50' 
            : 'bg-white hover:border-gray-300 hover:shadow-md border-gray-200'}
        ${compact ? 'p-4' : 'p-6'}
      `}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
            <h3 className={`font-bold text-slate-800 ${compact ? 'text-base' : 'text-lg'}`}>
            {stats.name}
            </h3>
            <span className="text-xs text-gray-400 font-medium">
                Capacity {stats.count}/{stats.capacity}
            </span>
        </div>
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
          ${isFull ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}
        `}>
          {Math.round(stats.percentageFull)}%
        </div>
      </div>

      {/* Capacity Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${isFull ? 'bg-red-500' : 'bg-emerald-500'}`} 
            style={{ width: `${stats.percentageFull}%` }}
          />
        </div>
      </div>

      {/* H/F Ratio */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
            <div className="flex justify-between text-[10px] uppercase font-bold text-gray-400 mb-1">
                <span className="text-blue-500">Men</span>
                <span className="text-pink-500">Women</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 flex overflow-hidden">
                <div 
                    className="h-full bg-blue-500 transition-all duration-500" 
                    style={{ width: `${maleWidth}%` }}
                />
                <div 
                    className="h-full bg-pink-500 transition-all duration-500" 
                    style={{ width: `${femaleWidth}%` }}
                />
            </div>
        </div>
        {!compact && (
            <div className="flex gap-2 text-xs font-medium text-gray-600">
                 <div className="flex items-center gap-1"><User size={12} className="text-blue-500"/> {stats.maleCount}</div>
                 <div className="flex items-center gap-1"><User size={12} className="text-pink-500"/> {stats.femaleCount}</div>
            </div>
        )}
      </div>
    </div>
  );
};