// src/components/OfficialCitationsModal.tsx
// Modal displaying the 5 Official Challenge Resource Links with clickable citations
// 100% Apple VisionOS Dark Frosted Glass with Zero Monospace

import React from 'react';
import { ExternalLink, X, ShieldCheck, Award } from 'lucide-react';
import { OFFICIAL_NASA_CSA_RESOURCES } from '../data/nasaKnowledgeBase';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedResourceId?: string;
}

export const OfficialCitationsModal: React.FC<Props> = ({ isOpen, onClose, selectedResourceId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 sm:p-6 select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0A0F1D]/95 backdrop-blur-3xl border border-white/20 shadow-[0_24px_64px_rgba(0,0,0,0.8)] overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sky-500/20 border border-sky-400/30 text-sky-300">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">Official Ground Truth Research Citations</h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  2026 NASA Space Apps Challenge
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Ground truth scientific research published by NASA Human Research Program and the Canadian Space Agency
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-3.5">
          {OFFICIAL_NASA_CSA_RESOURCES.map((res, index) => {
            const isHighlighted = selectedResourceId === res.id;
            return (
              <div
                key={res.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isHighlighted 
                    ? 'bg-sky-500/15 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.3)]' 
                    : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                        res.agency === 'NASA' ? 'bg-blue-500/20 text-sky-300 border border-blue-400/30' : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                      }`}>
                        {res.agency}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] rounded-full bg-white/10 text-slate-300 font-semibold">
                        Ref #{index + 1}
                      </span>
                      <span className="text-xs text-sky-300 font-medium">
                        {res.category}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-white mt-1">
                      {res.name}
                    </h3>
                  </div>

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] border border-white/15 text-xs font-semibold text-slate-200 hover:text-white transition-all shrink-0 self-start"
                  >
                    <span>Read Ground Truth</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {res.summary}
                </p>

                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate max-w-[500px]">{res.url}</span>
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Peer-Reviewed Spaceflight Evidence
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-xs text-slate-400">
          <span>All 5 challenge resources are linked directly to official NASA & CSA domains.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
