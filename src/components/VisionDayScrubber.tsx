// src/components/VisionDayScrubber.tsx
// Header Dynamic Status Badge & Interactive Day Scrubber Controller (◀, Select Day 1..60, ▶, Play/Pause)
// Restored directly onto the Live / Health Overview header row

import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause
} from 'lucide-react';
import type { DayRecord } from '../types/mission';

interface Props {
  currentDay: number;
  onSelectDay: (day: number) => void;
  record: DayRecord;
}

export const VisionDayScrubber: React.FC<Props> = ({
  currentDay,
  onSelectDay,
  record
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-advance timeline ticker when play is pressed
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        onSelectDay(currentDay >= 60 ? 1 : currentDay + 1);
      }, 1400);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentDay, onSelectDay]);

  // Determine dynamic nominal / confounder / drift / resolved / radiation status
  const getStatusBadge = () => {
    if (currentDay === 50 || (record?.radiationDose ?? 0) >= 2.0) {
      return {
        label: '☢ SPE Radiation Advisory',
        style: 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-[0_0_16px_rgba(245,158,11,0.35)]'
      };
    }
    if (currentDay >= 27 && currentDay <= 30) {
      return {
        label: '⚠ Persistent Drift • Elevated HR',
        style: 'bg-rose-500/20 text-rose-300 border-rose-400/50 shadow-[0_0_16px_rgba(244,63,94,0.35)] animate-pulse'
      };
    }
    if (currentDay === 16 || currentDay === 19 || currentDay === 44 || record?.exclusionReason) {
      return {
        label: '◆ Confounder Filtered',
        style: 'bg-sky-500/20 text-sky-300 border-sky-400/50 shadow-[0_0_14px_rgba(56,189,248,0.3)]'
      };
    }
    if (currentDay >= 31 && currentDay <= 34) {
      return {
        label: '✓ Verification Resolved',
        style: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-[0_0_14px_rgba(16,185,129,0.3)]'
      };
    }
    return {
      label: '✓ Nominal',
      style: 'bg-emerald-500/15 border-emerald-400/35 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
    };
  };

  const status = getStatusBadge();

  // 60-day scenario labels for dropdown
  const getScenarioLabel = (day: number) => {
    if (day === 1) return 'Day 1 (Launch & Sync)';
    if (day === 7) return 'Day 7 (Fluid Shift)';
    if (day === 14) return 'Day 14 (Baseline Calibrated)';
    if (day === 16) return 'Day 16 (Post-Meal Confounder)';
    if (day === 19) return 'Day 19 (Workout Confounder)';
    if (day === 22) return 'Day 22 (Nominal Cruise)';
    if (day === 26) return 'Day 26 (Baseline Freeze)';
    if (day === 27) return 'Day 27 (Drift Day 1)';
    if (day === 28) return 'Day 28 (Drift Day 2)';
    if (day === 29) return 'Day 29 (Drift Day 3)';
    if (day === 30) return 'Day 30 (3-of-4 Drift Alert)';
    if (day === 31) return 'Day 31 (Verification In Progress)';
    if (day === 34) return 'Day 34 (Verification Resolved)';
    if (day === 44) return 'Day 44 (Loose Sensor Fault)';
    if (day === 50) return 'Day 50 (SPE Radiation Storm)';
    if (day === 60) return 'Day 60 (Mission Complete)';
    return `Day ${day} (Nominal Telemetry)`;
  };

  return (
    <div className="flex items-center gap-2.5 xl:gap-3 select-none">
      
      {/* 1. Dynamic Status Badge (⚠ Persistent Drift • Elevated HR / ✓ Nominal) */}
      <div
        className={`px-3 py-1 rounded-full border backdrop-blur-xl flex items-center gap-1.5 text-xs font-semibold shadow-sm transition-all duration-300 whitespace-nowrap ${status.style}`}
        data-testid="live-status-badge"
      >
        <span>{status.label}</span>
      </div>

      {/* 2. Interactive Day Scrubber: ◀ | <select> Day 1 .. Day 60 </select> | ▶ | Play/Pause */}
      <div 
        className="flex items-center gap-1.5 bg-white/[0.05] hover:bg-white/[0.08] backdrop-blur-2xl border border-white/15 p-1 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.35)] transition-all"
        data-testid="interactive-day-scrubber"
      >
        {/* Previous Day Button (◀) */}
        <button
          onClick={() => onSelectDay(Math.max(1, currentDay - 1))}
          disabled={currentDay <= 1}
          className="w-7 h-7 rounded-xl bg-white/[0.08] hover:bg-white/[0.2] disabled:opacity-25 disabled:pointer-events-none flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer active:scale-95"
          title="Previous Mission Day (◀)"
          aria-label="Previous Day"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* <select> Day 1 .. Day 60 </select> */}
        <div className="relative flex items-center">
          <select
            value={currentDay}
            onChange={(e) => onSelectDay(Number(e.target.value))}
            className="bg-[#0A1020]/90 hover:bg-[#0E172A] text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-sky-400 cursor-pointer py-1 px-2.5 rounded-xl border border-white/20 transition-all text-center appearance-none pr-6"
            aria-label="Mission Day Selector"
          >
            {Array.from({ length: 60 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d} className="bg-slate-900 text-white font-medium py-1">
                {getScenarioLabel(d)}
              </option>
            ))}
          </select>
          {/* Subtle dropdown chevron */}
          <div className="pointer-events-none absolute right-2 text-slate-400">
            <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>

        {/* Next Day Button (▶) */}
        <button
          onClick={() => onSelectDay(Math.min(60, currentDay + 1))}
          disabled={currentDay >= 60}
          className="w-7 h-7 rounded-xl bg-white/[0.08] hover:bg-white/[0.2] disabled:opacity-25 disabled:pointer-events-none flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer active:scale-95"
          title="Next Mission Day (▶)"
          aria-label="Next Day"
        >
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Divider */}
        <div className="w-[1px] h-4 bg-white/20 mx-0.5" />

        {/* Play / Pause Auto-Ticker Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
            isPlaying 
              ? 'bg-amber-500 text-slate-950 font-bold shadow-[0_0_12px_#f59e0b]' 
              : 'bg-white/[0.1] hover:bg-white/[0.2] text-sky-300 hover:text-white'
          }`}
          title={isPlaying ? 'Pause Auto-Play' : 'Auto-Play Mission Telemetry (1.4s / Day)'}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          )}
        </button>

      </div>

    </div>
  );
};
