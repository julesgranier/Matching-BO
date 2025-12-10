import React, { useState, useMemo } from 'react';
import { Participant, Table, TableStats } from './types';
import { ParticipantProfile } from './components/ParticipantProfile';
import { TablesDashboard } from './components/TablesDashboard';
import { ParticipantCard } from './components/ParticipantCard';
import { Users, LayoutGrid, Bell, Settings, Filter, Search, ChevronDown } from 'lucide-react';

// --- MOCK DATA GENERATION ---
const MOCK_TABLES: Table[] = Array.from({ length: 8 }, (_, i) => ({
  id: `t${i + 1}`,
  name: `Mesa ${i + 1}`,
  capacity: 8,
}));

const NAMES = ["Alex", "Jordan", "Taylor", "Casey", "Morgan", "Riley", "Jamie", "Quinn", "Avery", "Sam", "Charlie", "Dakota", "Reese", "Skyler", "Phoenix"];
const INTERESTS = ["Techno", "Hiking", "Startups", "Wine", "Reading", "Travel", "Cooking", "Yoga", "Coding", "Surfing", "Photography", "Art"];

const generateMockParticipants = (count: number): Participant[] => {
  return Array.from({ length: count }, (_, i) => {
    // Determine gender first to match photo
    const gender: 'M' | 'F' = i % 3 === 0 ? 'F' : 'M';
    
    // Use randomuser.me for consistent human faces based on gender
    // We limit the ID to 99 to ensure valid images
    const photoId = i % 70; 
    const photoUrl = `https://randomuser.me/api/portraits/${gender === 'M' ? 'men' : 'women'}/${photoId}.jpg`;

    return {
      id: `u${i}`,
      name: NAMES[i % NAMES.length] + " " + String.fromCharCode(65 + i),
      age: 22 + (i % 15),
      gender: gender,
      photoUrl: photoUrl,
      description: "Looking for great conversations and maybe a co-founder for my new SaaS idea. Loves coffee and code.",
      interests: [INTERESTS[i % INTERESTS.length], INTERESTS[(i + 1) % INTERESTS.length], INTERESTS[(i + 2) % INTERESTS.length]],
      source: i % 2 === 0 ? 'website' : 'app',
      status: i < 5 ? 'assigned' : 'unassigned', // First 5 assigned, rest unassigned
      tableId: i < 5 ? (i % 2 === 0 ? 't1' : 't2') : null,
      purchaseTime: new Date().toISOString(),
      popularityScore: Math.floor(Math.random() * 20) + 80 // Random score between 80 and 99
    };
  });
};
// ----------------------------

const App: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>(() => generateMockParticipants(25));
  const [tables] = useState<Table[]>(MOCK_TABLES);
  const [activeTab, setActiveTab] = useState<'incoming' | 'tables'>('incoming');
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(null);

  // Computed Table Stats
  const tableStats: TableStats[] = useMemo(() => {
    return tables.map(table => {
      const assigned = participants.filter(p => p.tableId === table.id && p.status === 'assigned');
      const maleCount = assigned.filter(p => p.gender === 'M').length;
      const femaleCount = assigned.filter(p => p.gender === 'F').length;
      const count = assigned.length;
      
      return {
        id: table.id,
        name: table.name,
        capacity: table.capacity,
        count,
        maleCount,
        femaleCount,
        percentageFull: (count / table.capacity) * 100,
        maleRatio: count > 0 ? maleCount / count : 0,
      };
    });
  }, [participants, tables]);

  // Actions
  const handleAssign = (participantId: string, tableId: string) => {
    setParticipants(prev => prev.map(p => 
      p.id === participantId 
        ? { ...p, status: 'assigned', tableId } 
        : p
    ));
    setSelectedParticipantId(null);
  };

  const handleUnassign = (participantId: string) => {
    setParticipants(prev => prev.map(p => 
        p.id === participantId 
          ? { ...p, status: 'unassigned', tableId: null } 
          : p
      ));
  };

  const handleRefund = (participantId: string) => {
    setParticipants(prev => prev.map(p => 
      p.id === participantId 
        ? { ...p, status: 'refunded', tableId: null } 
        : p
    ));
    setSelectedParticipantId(null);
  };

  const handleShortlist = (id: string) => {
    setSelectedParticipantId(id);
  };

  // Filtered lists
  const unassignedParticipants = useMemo(() => 
    participants.filter(p => p.status === 'unassigned'), 
  [participants]);

  const selectedParticipant = useMemo(() => 
    participants.find(p => p.id === selectedParticipantId), 
  [participants, selectedParticipantId]);

  const unassignedCount = unassignedParticipants.length;

  return (
    <div className="flex h-screen bg-[#F9FAFB] overflow-hidden font-sans text-slate-800">
      {/* Sidebar Navigation - Updated to White Theme */}
      <nav className="w-64 bg-white border-r border-gray-100 flex flex-col py-6 z-20 hidden md:flex">
        <div className="px-6 mb-8 flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-indigo-200 shadow-lg">
                E
            </div>
            <span className="font-bold text-lg tracking-tight">EventMatch</span>
        </div>

        <div className="flex-1 px-4 space-y-1">
          <button 
            onClick={() => { setActiveTab('incoming'); setSelectedParticipantId(null); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
              ${activeTab === 'incoming' 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-slate-500 hover:bg-gray-50 hover:text-slate-900'}
            `}
          >
            <Users size={18} />
            <span className="flex-1 text-left">Incoming</span>
            {unassignedCount > 0 && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeTab === 'incoming' ? 'bg-indigo-100' : 'bg-gray-100 text-gray-600'}`}>
                {unassignedCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => { setActiveTab('tables'); setSelectedParticipantId(null); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
              ${activeTab === 'tables' 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-slate-500 hover:bg-gray-50 hover:text-slate-900'}
            `}
          >
            <LayoutGrid size={18} />
            <span className="flex-1 text-left">Tables</span>
          </button>
        </div>

        <div className="px-4 mt-auto space-y-1">
           <div className="text-xs font-semibold text-gray-400 px-3 mb-2 uppercase tracking-wider">Settings</div>
           <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-gray-50 hover:text-slate-900 transition-colors">
              <Bell size={18} />
              Notifications
           </button>
           <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-gray-50 hover:text-slate-900 transition-colors">
              <Settings size={18} />
              Preferences
           </button>
        </div>
        
        <div className="mt-6 px-6 pt-6 border-t border-gray-100 flex items-center gap-3">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Admin" className="w-8 h-8 rounded-full object-cover" />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">Admin User</p>
                <p className="text-xs text-gray-400 truncate">admin@eventmatch.com</p>
            </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-100 h-16 flex items-center px-8 justify-between shrink-0">
           <div className="flex items-center gap-4">
               {/* Mobile Menu Toggle could go here */}
               <h1 className="text-lg font-semibold text-slate-800">
                 {activeTab === 'incoming' ? (selectedParticipant ? 'Details' : 'Queue') : 'Dashboard'}
               </h1>
           </div>

           <div className="flex items-center gap-4">
             <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className="pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-64"
                />
             </div>
             <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 bg-white">
                <Filter size={14} /> Filter
             </button>
           </div>
        </header>

        <div className="flex-1 p-8 overflow-hidden">
          {activeTab === 'incoming' ? (
             selectedParticipant ? (
               <div className="h-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
                 <ParticipantProfile 
                   participant={selectedParticipant}
                   tables={tableStats}
                   onAssign={handleAssign}
                   onRefund={handleRefund}
                   onClose={() => setSelectedParticipantId(null)}
                 />
               </div>
             ) : (
               <div className="h-full overflow-y-auto pr-2">
                 <div className="flex justify-between items-end mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Incoming Participants</h2>
                        <p className="text-slate-500 text-sm mt-1">Review and assign guests to tables.</p>
                    </div>
                    <span className="text-sm text-gray-500 font-medium bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                        {unassignedCount} Pending Review
                    </span>
                 </div>

                 {unassignedCount > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 pb-20">
                        {unassignedParticipants.map(participant => (
                            <ParticipantCard 
                                key={participant.id} 
                                participant={participant} 
                                onShortlist={() => handleShortlist(participant.id)}
                            />
                        ))}
                    </div>
                 ) : (
                   <div className="h-[60vh] flex flex-col items-center justify-center text-gray-400">
                     <div className="w-16 h-16 bg-white border border-gray-100 shadow-sm rounded-full flex items-center justify-center mb-4 text-indigo-100">
                        <Users size={32} className="text-indigo-400"/>
                     </div>
                     <h2 className="text-lg font-semibold text-gray-900">All caught up!</h2>
                     <p className="max-w-xs text-center mt-1 text-gray-500">No unassigned participants remaining in the queue.</p>
                     <button 
                        onClick={() => setActiveTab('tables')}
                        className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium transition-all shadow-lg shadow-slate-200"
                     >
                        Go to Dashboard
                     </button>
                   </div>
                 )}
               </div>
             )
          ) : (
            <TablesDashboard 
              tables={tableStats} 
              participants={participants}
              onReassign={handleAssign}
              onUnassign={handleUnassign}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;