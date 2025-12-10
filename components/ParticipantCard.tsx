import React from 'react';
import { Participant } from '../types';
import { Smartphone, Monitor, Flame } from 'lucide-react';

interface Props {
  participant: Participant;
  onShortlist: () => void;
}

export const ParticipantCard: React.FC<Props> = ({ participant, onShortlist }) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 flex h-40 relative">
      {/* Left Side: Image (Square, full height) */}
      <div className="relative w-40 h-full flex-shrink-0 bg-gray-100">
        <img
          src={participant.photoUrl}
          alt={participant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        {/* Source Badge */}
        <div className={`
          absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm backdrop-blur-md border border-white/20
          ${participant.source === 'app' ? 'bg-purple-600/90 text-white' : 'bg-orange-500/90 text-white'}
        `}>
          {participant.source === 'app' ? <Smartphone size={8} /> : <Monitor size={8} />}
          {participant.source === 'app' ? 'APP' : 'WEB'}
        </div>
      </div>

      {/* Right Side: Content */}
      <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex justify-between items-start mb-1 gap-2">
            <h3 className="text-base font-bold text-slate-800 leading-tight truncate">
              {participant.name}, {participant.age}
            </h3>
             <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-100 flex-shrink-0">
               <Flame size={10} className="text-amber-500" fill="currentColor" />
               <span className="text-[10px] font-bold text-amber-700">{participant.popularityScore}</span>
             </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
             <span className={`
                flex items-center justify-center h-5 px-1.5 rounded text-[10px] font-bold flex-shrink-0 uppercase tracking-wide
                ${participant.gender === 'M' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}
              `}>
                {participant.gender === 'M' ? 'Male' : 'Female'}
            </span>
            <p className="text-[11px] text-gray-500 line-clamp-1 truncate">
              {participant.description}
            </p>
          </div>

          {/* Interests - Showing up to 3 now */}
          <div className="flex flex-wrap gap-1.5">
            {participant.interests.slice(0, 3).map((interest, i) => (
              <span key={i} className="px-2 py-0.5 bg-slate-50 text-slate-600 text-[10px] font-medium rounded border border-slate-100">
                {interest}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={onShortlist}
          className="w-full py-2 mt-auto bg-white border border-gray-200 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 rounded-lg text-xs font-semibold transition-all shadow-sm"
        >
          Shortlist
        </button>
      </div>
    </div>
  );
};