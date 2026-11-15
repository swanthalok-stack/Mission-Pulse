// src/components/MissionLogDrawer.tsx
// 16-Step Commander Vega User Journey Slide-Over Drawer
// 100% Apple VisionOS Dark Frosted Glass with Zero Monospace

import React from 'react';
import { VEGA_16_MILESTONES } from '../data/vegaDataset';
import { X, Compass } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentDay: number;
  onSelectDay: (day: number) => void;
}

export const MissionLogDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  currentDay,
  onSelectDay
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-md select-none animate-in fade-in duration-150">
      <div className="w-full max-w-md h-full bg-[#0A0F1D]/95 backdrop-blur-3xl border-l border-white/15 flex flex-col text-slate-100 shadow-[0_0_60px_rgba(0,0,0,0.8)] animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                16-Step Commander Vega Mission Log
              </h2>
              <p className="text-[11px] text-slate-400">
                Artemis II 60-Day Telemetry Timeline Journey
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Milestone Steps List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {VEGA_16_MILESTONES.map(m => {
            const isSelected = m.day === currentDay;
            const isPast = m.day < currentDay;

            return (
              <div
                key={m.step}
                onClick={() => {
                  onSelectDay(m.day);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-gradient-to-r from-blue-500/25 to-sky-500/25 border-sky-400 shadow-[0_0_16px_rgba(56,189,248,0.35)] scale-102' 
                    : isPast
                    ? 'bg-white/[0.04] border-white/10 hover:border-white/20'
                    : 'bg-white/[0.02] border-white/5 text-slate-500 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[11px] font-bold ${isSelected ? 'text-sky-300' : 'text-slate-400'}`}>
                    Step {m.step < 10 ? `0${m.step}` : m.step} · Day {m.day}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    m.category === 'drift' ? 'bg-rose-500/20 text-rose-300 border-rose-400/40' :
                    m.category === 'filter' ? 'bg-sky-500/20 text-sky-300 border-sky-400/40' :
                    m.category === 'radiation' ? 'bg-amber-500/20 text-amber-300 border-amber-400/40' :
                    'bg-white/10 text-slate-300 border-white/10'
                  }`}>
                    {m.statusBadge}
                  </span>
                </div>

                <div className="font-bold text-white text-xs">
                  {m.title}
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  {m.subtitle}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  {m.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Drawer Footer */}
        <div className="p-3.5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-xs text-slate-400">
          <span>Click any step to jump to mission day</span>
          <span className="text-white font-semibold">60-Day Mission</span>
        </div>

      </div>
    </div>
  );
};
