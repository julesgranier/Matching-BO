import React, { useState } from 'react';
import { Participant, TableStats } from '../types';
import { Smartphone, Monitor, MessageSquare, RefreshCcw, UserMinus, CheckCircle2, ArrowLeft, Flame, X, Send } from 'lucide-react';
import { TableStatsCard } from './TableStatsCard';
import { generateAutoMessage } from '../services/geminiService';

interface Props {
  participant: Participant;
  tables: TableStats[];
  onAssign: (participantId: string, tableId: string) => void;
  onRefund: (participantId: string) => void;
  onClose: () => void;
}

export const ParticipantProfile: React.FC<Props> = ({ participant, tables, onAssign, onRefund, onClose }) => {
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [messageType, setMessageType] = useState<'welcome' | 'refund'>('welcome');

  const handleGenerateMessage = async (type: 'welcome' | 'refund') => {
    setMessageType(type);
    setIsGenerating(true);
    setGeneratedMessage('');
    setMessageModalOpen(true);
    
    const msg = await generateAutoMessage(participant, type);
    setGeneratedMessage(msg);
    setIsGenerating(false);
  };

  // REFUND LOGIC: Trigger message generation immediately
  const handleRefundClick = () => {
      handleGenerateMessage('refund');
  };

  const handleConfirmAction = () => {
      if (messageType === 'refund') {
          onRefund(participant.id);
      } else {
          // Just a welcome message sent
          alert(`Welcome message sent to ${participant.name}`);
      }
      setMessageModalOpen(false);
      onClose(); // Close the profile view after action
  };

  const handleAssignClick = (tableId: string) => {
    onAssign(participant.id, tableId);
    onClose();
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
      {/* Header / Back Button */}
      <div className="absolute top-6 left-6 z-10">
        <button 
          onClick={onClose}
          className="bg-white/90 backdrop-blur p-2 rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors text-slate-700"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="flex flex-col md:flex-row h-full">
          {/* Left Column: Profile Info */}
          <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100 p-8 flex flex-col bg-white">
             <div className="mt-12 flex flex-col items-center text-center">
                 <div className="relative">
                    <img 
                        src={participant.photoUrl} 
                        alt={participant.name} 
                        className="w-32 h-32 rounded-full object-cover shadow-xl border-4 border-white ring-1 ring-gray-100"
                    />
                    <div className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md border border-gray-100">
                        {participant.source === 'app' ? 
                            <Smartphone size={16} className="text-purple-600"/> : 
                            <Monitor size={16} className="text-orange-500"/>
                        }
                    </div>
                 </div>

                 <div className="mt-4">
                     <h2 className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
                         {participant.name}
                         <div className="flex items-center gap-1 bg-blue-50 px-1.5 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                         </div>
                     </h2>
                     <p className="text-slate-500 font-medium">{participant.age} years old</p>
                 </div>

                 <div className="flex items-center gap-4 mt-6 w-full justify-center">
                      <div className="flex flex-col items-center p-3 bg-gray-50 rounded-2xl min-w-[80px]">
                          <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Score</span>
                          <div className="flex items-center gap-1 text-amber-600 font-bold text-lg">
                              <Flame size={18} fill="currentColor"/> {participant.popularityScore}
                          </div>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-gray-50 rounded-2xl min-w-[80px]">
                          <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Gender</span>
                          <div className={`flex items-center gap-1 font-bold text-lg ${participant.gender === 'M' ? 'text-blue-600' : 'text-pink-600'}`}>
                             {participant.gender === 'M' ? 'Male' : 'Female'}
                          </div>
                      </div>
                 </div>

                 <div className="mt-8 w-full text-left">
                     <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">About</h3>
                     <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                         "{participant.description}"
                     </p>
                 </div>

                 <div className="mt-6 w-full text-left">
                     <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Interests</h3>
                     <div className="flex flex-wrap gap-2">
                        {participant.interests.map((interest, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-white border border-gray-200 text-slate-700 rounded-lg text-xs font-medium shadow-sm">
                            {interest}
                        </span>
                        ))}
                     </div>
                 </div>

                 <div className="mt-auto pt-8 w-full flex gap-3">
                     <button 
                        onClick={handleRefundClick}
                        className="flex-1 py-2.5 rounded-xl border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-200 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                     >
                         <RefreshCcw size={16}/> Refund
                     </button>
                     <button 
                        onClick={() => handleGenerateMessage('welcome')}
                        className="flex-1 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                     >
                         <MessageSquare size={16}/> Message
                     </button>
                 </div>
             </div>
          </div>

          {/* Right Column: Shortlist */}
          <div className="flex-1 bg-[#F9FAFB] p-8 overflow-y-auto">
             <div className="max-w-4xl mx-auto">
                <h3 className="text-lg font-bold text-slate-800 mb-1">Table Assignment</h3>
                <p className="text-slate-500 text-sm mb-6">Select a table to assign {participant.name}.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tables.map(table => (
                    <TableStatsCard 
                    key={table.id} 
                    stats={table} 
                    onClick={() => handleAssignClick(table.id)}
                    compact={true}
                    />
                ))}
                </div>
             </div>
          </div>
      </div>

      {/* Message Modal */}
      {messageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 transition-all">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-0 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    {messageType === 'refund' ? <RefreshCcw size={18} className="text-red-500"/> : <MessageSquare size={18} className="text-indigo-500"/>}
                    {messageType === 'refund' ? 'Refund & Notify' : 'Send Welcome Message'}
                </h3>
                <button onClick={() => setMessageModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={20} />
                </button>
            </div>
            
            <div className="p-6">
                <p className="text-sm text-gray-500 mb-3 font-medium">
                    {isGenerating 
                        ? "Gemini AI is drafting a personalized message..." 
                        : "Review the auto-generated message before sending:"}
                </p>

                <div className="bg-gray-50 p-4 rounded-xl min-h-[120px] mb-6 text-sm text-slate-700 leading-relaxed border border-gray-200 shadow-inner relative">
                {isGenerating ? (
                    <div className="absolute inset-0 flex items-center justify-center gap-3 text-indigo-500">
                        <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-medium animate-pulse">Thinking...</span>
                    </div>
                ) : (
                    <textarea 
                        className="w-full h-full bg-transparent border-none focus:ring-0 p-0 resize-none text-slate-700"
                        value={generatedMessage}
                        onChange={(e) => setGeneratedMessage(e.target.value)}
                    />
                )}
                </div>

                <div className="flex justify-end gap-3">
                    <button 
                        onClick={() => setMessageModalOpen(false)}
                        className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        disabled={isGenerating}
                        onClick={handleConfirmAction}
                        className={`px-5 py-2.5 text-sm font-medium text-white rounded-xl shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none flex items-center gap-2 transition-all
                            ${messageType === 'refund' 
                                ? 'bg-red-600 hover:bg-red-700 shadow-red-200' 
                                : 'bg-slate-900 hover:bg-indigo-600'}
                        `}
                    >
                        {messageType === 'refund' ? 'Confirm Refund' : 'Send Message'} <Send size={16} />
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};