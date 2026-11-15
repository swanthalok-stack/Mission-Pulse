// src/components/VisionVitalCards.tsx
// Pixel-for-Pixel 6 Tinted Glass Vital Cards with Exact Radial Glow & Live 7-Day SVG Mini-Sparklines

import React from 'react';
import { 
  Heart, 
  Stethoscope, 
  Droplet, 
  Thermometer, 
  Moon, 
  Radiation
} from 'lucide-react';
import type { DayRecord, PersonalBaselineBand } from '../types/mission';
import type { PinId } from '../context/MissionContext';

interface Props {
  record: DayRecord;
  records?: DayRecord[];
  bands?: Record<string, PersonalBaselineBand>;
  currentDay: number;
  onSelectMetric?: (metric: string) => void;
  onOpenSelfExam?: (protocolId: string) => void;
  onSelectPin?: (pinId: PinId) => void;
}

export const VisionVitalCards: React.FC<Props> = ({
  record,
  records = [],
  bands: _bands,
  currentDay,
  onSelectMetric,
  onOpenSelfExam: _onOpenSelfExam,
  onSelectPin
}) => {
  // Helper to compute a smooth cubic bezier sparkline path from the last 7 days of records
  const computeSparkline = (metricExtractor: (r: DayRecord) => number) => {
    // Collect up to 7 records ending at currentDay
    const windowRecords: DayRecord[] = [];
    const startDay = Math.max(1, currentDay - 6);
    
    for (let d = startDay; d <= currentDay; d++) {
      const match = records.find(r => r.day === d);
      if (match) {
        windowRecords.push(match);
      }
    }

    if (windowRecords.length === 0) {
      windowRecords.push(record);
    }

    const values = windowRecords.map(metricExtractor);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = (max - min) === 0 ? 1 : max - min;

    // ViewBox: 0 0 145 22. Usable Y: 4 to 18 (height 14)
    const points = values.map((val, idx) => {
      const x = windowRecords.length === 1 ? 72 : (idx / (windowRecords.length - 1)) * 145;
      const y = 18 - ((val - min) / range) * 14;
      return { x, y };
    });

    if (points.length === 1) {
      return {
        path: `M 0 ${points[0].y} L 145 ${points[0].y}`,
        area: `M 0 ${points[0].y} L 145 ${points[0].y} L 145 22 L 0 22 Z`
      };
    }

    // Monotone cubic spline path generator
    let path = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cp1x = (curr.x + (next.x - curr.x) / 3).toFixed(1);
      const cp1y = curr.y.toFixed(1);
      const cp2x = (curr.x + (next.x - curr.x) * (2 / 3)).toFixed(1);
      const cp2y = next.y.toFixed(1);
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x.toFixed(1)} ${next.y.toFixed(1)}`;
    }

    const area = `${path} L ${points[points.length - 1].x.toFixed(1)} 22 L ${points[0].x.toFixed(1)} 22 Z`;

    return { path, area };
  };

  const hrSparkline = computeSparkline(r => r.restingHR);
  const bpSparkline = computeSparkline(r => r.bpSystolic);
  const gluSparkline = computeSparkline(r => r.glucose);
  const tempSparkline = computeSparkline(r => r.bodyTemp);
  const sleepSparkline = computeSparkline(r => r.sleepHours);
  const radSparkline = computeSparkline(r => r.radiationDose);

  return (
    <div className="shrink-0 h-[104px] grid grid-cols-6 gap-2.5 w-full select-none">
      
      {/* 1. HEART RATE CARD */}
      <div 
        onClick={() => {
          onSelectMetric?.('restingHR');
          onSelectPin?.('heart');
        }}
        className="rounded-2xl px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between transition-all duration-200 cursor-pointer group shadow-lg h-full"
      >
        <div className="absolute -top-10 -left-10 w-28 h-28 bg-rose-500/20 rounded-full blur-2xl pointer-events-none group-hover:bg-rose-500/30 transition-colors" />

        {/* Top: Coral-red Heart Icon */}
        <div className="flex items-center justify-between z-10">
          <div className="w-7 h-7 rounded-xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
            <Heart className="w-3.5 h-3.5 fill-rose-500/30 stroke-[2]" />
          </div>
        </div>

        {/* Middle: Label & Value (Text clipping protected) */}
        <div className="z-10">
          <span className="text-[11px] text-slate-300 font-normal block leading-tight truncate">
            Heart Rate
          </span>
          <div className="flex items-baseline mt-0.5">
            <span className="text-[22px] font-bold tracking-tight text-white whitespace-nowrap leading-none">
              {record.restingHR}
            </span>
            <span className="text-[11px] font-normal text-slate-300 ml-1 whitespace-nowrap">
              bpm
            </span>
          </div>
        </div>

        {/* Bottom: Live 7-Day Mini-Sparkline */}
        <div className="w-full h-5 relative z-10">
          <svg viewBox="0 0 145 22" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id="green-spark-fade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d={hrSparkline.area} fill="url(#green-spark-fade)" />
            <path d={hrSparkline.path} fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* 2. BLOOD PRESSURE CARD */}
      <div 
        onClick={() => {
          onSelectMetric?.('bloodPressure');
          onSelectPin?.('heart');
        }}
        className="rounded-2xl px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between transition-all duration-200 cursor-pointer group shadow-lg h-full"
      >
        <div className="absolute -top-10 -left-10 w-28 h-28 bg-blue-500/20 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/30 transition-colors" />

        {/* Top: Blue Stethoscope Icon */}
        <div className="flex items-center justify-between z-10">
          <div className="w-7 h-7 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
            <Stethoscope className="w-3.5 h-3.5 stroke-[2]" />
          </div>
        </div>

        {/* Middle: Label & Value (Text clipping protected) */}
        <div className="z-10">
          <span className="text-[11px] text-slate-300 font-normal block leading-tight truncate">
            Blood Pressure
          </span>
          <div className="flex items-baseline mt-0.5">
            <span className="text-[21px] font-bold tracking-tighter text-white whitespace-nowrap leading-none">
              {record.bpSystolic}/{record.bpDiastolic}
            </span>
            <span className="text-[11px] font-normal text-slate-300 ml-1 whitespace-nowrap">
              mmHg
            </span>
          </div>
        </div>

        {/* Bottom: Live 7-Day Mini-Sparkline */}
        <div className="w-full h-5 relative z-10">
          <svg viewBox="0 0 145 22" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id="blue-spark-fade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d={bpSparkline.area} fill="url(#blue-spark-fade)" />
            <path d={bpSparkline.path} fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* 3. GLUCOSE CARD */}
      <div 
        onClick={() => {
          onSelectMetric?.('glucose');
          onSelectPin?.('liver');
        }}
        className="rounded-2xl px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between transition-all duration-200 cursor-pointer group shadow-lg h-full"
      >
        <div className="absolute -top-10 -left-10 w-28 h-28 bg-amber-500/20 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/30 transition-colors" />

        {/* Top: Gold Droplet Icon */}
        <div className="flex items-center justify-between z-10">
          <div className="w-7 h-7 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
            <Droplet className="w-3.5 h-3.5 stroke-[2]" />
          </div>
        </div>

        {/* Middle: Label & Value (Text clipping protected) */}
        <div className="z-10">
          <span className="text-[11px] text-slate-300 font-normal block leading-tight truncate">
            Glucose
          </span>
          <div className="flex items-baseline mt-0.5">
            <span className="text-[21px] font-bold tracking-tight text-white whitespace-nowrap leading-none">
              {record.glucose}
            </span>
            <span className="text-[11px] font-normal text-slate-300 ml-1 whitespace-nowrap">
              mg/dL
            </span>
          </div>
        </div>

        {/* Bottom: Live 7-Day Mini-Sparkline */}
        <div className="w-full h-5 relative z-10">
          <svg viewBox="0 0 145 22" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gold-spark-fade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d={gluSparkline.area} fill="url(#gold-spark-fade)" />
            <path d={gluSparkline.path} fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* 4. CORE BODY TEMPERATURE CARD */}
      <div 
        onClick={() => {
          onSelectMetric?.('bodyTemp');
          onSelectPin?.('immune');
        }}
        className="rounded-2xl px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between transition-all duration-200 cursor-pointer group shadow-lg h-full"
      >
        <div className="absolute -top-10 -left-10 w-28 h-28 bg-purple-500/20 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/30 transition-colors" />

        {/* Top: Violet Thermometer Icon */}
        <div className="flex items-center justify-between z-10">
          <div className="w-7 h-7 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
            <Thermometer className="w-3.5 h-3.5 stroke-[2]" />
          </div>
        </div>

        {/* Middle: Label & Value (Text clipping protected) */}
        <div className="z-10">
          <span className="text-[11px] text-slate-300 font-normal block leading-tight truncate">
            Core Temp
          </span>
          <div className="flex items-baseline mt-0.5">
            <span className="text-[21px] font-bold tracking-tight text-white whitespace-nowrap leading-none">
              {record.bodyTemp.toFixed(1)}
            </span>
            <span className="text-[11px] font-normal text-slate-300 ml-1 whitespace-nowrap">
              °C
            </span>
          </div>
        </div>
        {/* Bottom: Live 7-Day Mini-Sparkline */}
        <div className="w-full h-5 relative z-10">
          <svg viewBox="0 0 145 22" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id="purple-spark-fade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A855F7" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#A855F7" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d={tempSparkline.area} fill="url(#purple-spark-fade)" />
            <path d={tempSparkline.path} fill="none" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* 5. SLEEP DURATION CARD */}
      <div 
        onClick={() => {
          onSelectMetric?.('sleepHours');
          onSelectPin?.('circadian');
        }}
        className="rounded-2xl px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between transition-all duration-200 cursor-pointer group shadow-lg h-full"
      >
        <div className="absolute -top-10 -left-10 w-28 h-28 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/30 transition-colors" />

        {/* Top: Indigo Moon Icon */}
        <div className="flex items-center justify-between z-10">
          <div className="w-7 h-7 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
            <Moon className="w-3.5 h-3.5 stroke-[2]" />
          </div>
        </div>

        {/* Middle: Label & Value (Text clipping protected) */}
        <div className="z-10">
          <span className="text-[11px] text-slate-300 font-normal block leading-tight truncate">
            Sleep (last 24h)
          </span>
          <div className="flex items-baseline mt-0.5">
            <span className="text-[21px] font-bold tracking-tight text-white whitespace-nowrap leading-none">
              {record.sleepHours.toFixed(1)}
            </span>
            <span className="text-[11px] font-normal text-slate-300 ml-1 whitespace-nowrap">
              h
            </span>
          </div>
        </div>
        {/* Bottom: Live 7-Day Mini-Sparkline */}
        <div className="w-full h-5 relative z-10">
          <svg viewBox="0 0 145 22" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id="indigo-spark-fade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818CF8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#818CF8" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d={sleepSparkline.area} fill="url(#indigo-spark-fade)" />
            <path d={sleepSparkline.path} fill="none" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* 6. RADIATION CARD */}
      <div 
        onClick={() => {
          onSelectMetric?.('radiation');
          onSelectPin?.('immune');
        }}
        className="rounded-2xl px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between transition-all duration-200 cursor-pointer group shadow-lg h-full"
      >
        <div className="absolute -top-10 -left-10 w-28 h-28 bg-amber-500/20 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/30 transition-colors" />

        {/* Top: Amber Radiation Trefoil Icon */}
        <div className="flex items-center justify-between z-10">
          <div className="w-7 h-7 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
            <Radiation className="w-3.5 h-3.5 stroke-[2]" />
          </div>
        </div>

        {/* Middle: Label & Value (Text clipping protected for 0.42 mGy/d) */}
        <div className="z-10">
          <span className="text-[11px] text-slate-300 font-normal block leading-tight truncate">
            Radiation
          </span>
          <div className="flex items-baseline mt-0.5">
            <span className="text-[21px] font-bold tracking-tight text-white whitespace-nowrap leading-none">
              {record.radiationDose.toFixed(2)}
            </span>
            <span className="text-[11px] font-normal text-slate-300 ml-1 whitespace-nowrap">
              mGy/d
            </span>
          </div>
        </div>

        {/* Bottom: Live 7-Day Mini-Sparkline */}
        <div className="w-full h-5 relative z-10">
          <svg viewBox="0 0 145 22" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id="rad-spark-fade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d={radSparkline.area} fill="url(#rad-spark-fade)" />
            <path d={radSparkline.path} fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

    </div>
  );
};
