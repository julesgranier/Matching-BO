import React, { useState } from 'react';
import { TableStats, Participant } from '../types';
import { TableStatsCard } from './TableStatsCard';
import { ChevronRight, ArrowRightLeft, X } from 'lucide-react';

interface Props {
  tables: TableStats[];
  participants: Participant[];
  onReassign: (participantId: string, toTableId: string) => void;
  onUnassign: (participantId: string) => void;
}

export const TablesDashboard: React.FC<Props> = ({ tables, participants, onReassign, onUnassign }) => {
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  const selectedTable = tables.find(t => t.id === selectedTableId);
  const tableParticipants = participants.filter(p => p.tableId === selectedTableId);

  return (
    <div className="flex h-full gap-6">
      {/* Left: Grid of Tables */}
      <div className={`
        flex-1 overflow-y-auto pr-2 transition-all
        ${selectedTableId ? 'w-1/2' : 'w-full'}
      `}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tables.map(table => (
            <div key={table.id} className="relative group">
              <TableStatsCard 
                stats={table} 
                selected={table.id === selectedTableId}
                onClick={() => setSelectedTableId(table.id)}
              />
              <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="bg-white rounded-full p-2 shadow-md">
                    <ChevronRight size={20} className="text-gray-400" />
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Detail View (Sliding Panel) */}
      {selectedTable && (
        <div className="w-96 bg-white border-l border-gray-200 shadow-xl flex flex-col h-full animate-in slide-in-from-right duration-300">
           <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
             <div>
               <h3 className="font-bold text-lg">{selectedTable.name} Details</h3>
               <p className="text-xs text-gray-500">Managing assigned guests</p>
             </div>
             <button onClick={() => setSelectedTableId(null)} className="p-2 hover:bg-gray-200 rounded-full">
               <X size={18} />
             </button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-3">
             {tableParticipants.length === 0 ? (
               <div className="text-center py-10 text-gray-400 italic">
                 No participants assigned yet.
               </div>
             ) : (
               tableParticipants.map(p => (
                 <div key={p.id} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow group">
                   <img src={p.photoUrl} alt={p.name} className="w-10 h-10 rounded-full object-cover" />
                   <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm text-gray-900 truncate">{p.name}</h4>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${p.gender === 'M' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                          {p.gender}
                        </span>
                     </div>
                     <p className="text-xs text-gray-500 truncate">{p.interests[0]}</p>
                   </div>
                   
                   {/* Reassign Actions */}
                   <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                      <select 
                        className="text-xs border rounded bg-gray-50 p-1 w-20"
                        onChange={(e) => {
                          if (e.target.value === 'unassign') {
                            onUnassign(p.id);
                          } else {
                            onReassign(p.id, e.target.value);
                          }
                        }}
                        value={selectedTableId || ""}
                      >
                         <option value={selectedTableId || ""} disabled>Move...</option>
                         <option value="unassign">Unassign</option>
                         {tables.filter(t => t.id !== selectedTableId).map(t => (
                           <option key={t.id} value={t.id}>{t.name} ({t.count}/{t.capacity})</option>
                         ))}
                      </select>
                   </div>
                 </div>
               ))
             )}
           </div>
        </div>
      )}
    </div>
  );
};