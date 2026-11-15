// src/components/TrendsModuleView.tsx
// Modules C & H: 60-Day Mission Baseline Freeze & Synchronized Dual-Metric Comparator
// 100% Apple VisionOS Dark Frosted Glass with 16-Step Journey Bar & Scaled Y-Axis

import React, { useState, useMemo } from 'react';
import { 
  BarChart2, 
  Lock, 
  Activity,
  Moon,
  Thermometer,
  Droplet
} from 'lucide-react';
import type { DayRecord, PersonalBaselineBand } from '../types/mission';
import { VEGA_16_MILESTONES } from '../data/vegaDataset';

interface Props {
  records: DayRecord[];
  currentDay: number;
  bands?: Record<string, PersonalBaselineBand>;
  onSelectDay: (day: number) => void;
}

export const TrendsModuleView: React.FC<Props> = ({
  records,
  currentDay,
  bands,
  onSelectDay
}) => {
  const [metric1, setMetric1] = useState<string>('restingHR');
  const [metric2, setMetric2] = useState<string>('sleepHours');

  const metricOptions = [
    { id: 'restingHR', label: 'Resting HR (bpm)', unit: 'bpm', icon: Activity, yDomain: [50, 85] as [number, number] },
    { id: 'sleepHours', label: 'Sleep Duration (hrs)', unit: 'h', icon: Moon, yDomain: [4, 9] as [number, number] },
    { id: 'bpSystolic', label: 'Systolic BP (mmHg)', unit: 'mmHg', icon: BarChart2, yDomain: [100, 140] as [number, number] },
    { id: 'glucose', label: 'Blood Glucose (mg/dL)', unit: 'mg/dL', icon: Droplet, yDomain: [70, 150] as [number, number] },
    { id: 'bodyTemp', label: 'Core Temp (°C)', unit: '°C', icon: Thermometer, yDomain: [36.0, 37.6] as [number, number] }
  ];

  const m1Config = metricOptions.find(m => m.id === metric1) || metricOptions[0];
  const m2Config = metricOptions.find(m => m.id === metric2) || metricOptions[1];

  // All 16 Milestones of Commander Vega's User Journey
  const keyMilestones = useMemo(() => {
    return VEGA_16_MILESTONES.map(m => ({
      step: m.step,
      day: m.day,
      label: `S${m.step} · D${m.day} ${m.title}`,
      badge: m.statusBadge
    }));
  }, []);

  // Metric 1 chart points (Resting HR properly scaled to [50, 85], off-scale confounders pinned cleanly at ceiling)
  const chartGeometry = useMemo(() => {
    const width = 940;
    const stepX = width / 59;

    const baseline1 = bands?.[metric1]?.median ?? 58;
    const bandUpper1 = bands?.[metric1]?.upperBound ?? 61;
    const bandLower1 = bands?.[metric1]?.lowerBound ?? 55;

    const baseline2 = bands?.[metric2]?.median ?? 7.0;

    // Map Y for metric 1 (Height: 90px, y: 20 to 110)
    const [y1Min, y1Max] = m1Config.yDomain;
    const mapY1 = (val: number) => {
      // Clamped if off-scale confounder (e.g. Day 19 142 bpm pinned at ceiling y=22)
      const clamped = Math.max(y1Min, Math.min(y1Max, val));
      const norm = (clamped - y1Min) / (y1Max - y1Min);
      return 110 - norm * 85;
    };

    // Map Y for metric 2 (Height: 90px, y: 135 to 220)
    const [y2Min, y2Max] = m2Config.yDomain;
    const mapY2 = (val: number) => {
      const clamped = Math.max(y2Min, Math.min(y2Max, val));
      const norm = (clamped - y2Min) / (y2Max - y2Min);
      return 220 - norm * 85;
    };

    const pts1 = records.map((r, i) => {
      const raw = (r as any)[metric1] ?? 58;
      const isOffScale = raw > y1Max;
      return {
        x: 60 + i * stepX,
        y: mapY1(raw),
        raw,
        day: r.day,
        isOffScale,
        exclusionReason: r.exclusionReason
      };
    });

    const pts2 = records.map((r, i) => {
      const raw = (r as any)[metric2] ?? 7.0;
      return {
        x: 60 + i * stepX,
        y: mapY2(raw),
        raw,
        day: r.day
      };
    });

    // Spline path 1
    let path1 = `M ${pts1[0].x.toFixed(1)} ${pts1[0].y.toFixed(1)}`;
    for (let i = 0; i < pts1.length - 1; i++) {
      const p0 = pts1[i === 0 ? 0 : i - 1];
      const p1 = pts1[i];
      const p2 = pts1[i + 1];
      const p3 = pts1[i + 2 < pts1.length ? i + 2 : i + 1];
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      path1 += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }

    // Spline path 2
    let path2 = `M ${pts2[0].x.toFixed(1)} ${pts2[0].y.toFixed(1)}`;
    for (let i = 0; i < pts2.length - 1; i++) {
      const p0 = pts2[i === 0 ? 0 : i - 1];
      const p1 = pts2[i];
      const p2 = pts2[i + 1];
      const p3 = pts2[i + 2 < pts2.length ? i + 2 : i + 1];
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      path2 += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }

    return {
      pts1,
      pts2,
      path1,
      path2,
      baseline1Y: mapY1(baseline1),
      bandUpper1Y: mapY1(bandUpper1),
      bandLower1Y: mapY1(bandLower1),
      baseline2Y: mapY2(baseline2),
      stepX
    };
  }, [records, metric1, metric2, m1Config, m2Config, bands]);

  return (
    <div className="h-full flex flex-col justify-between space-y-3.5 select-none">
      
      {/* 1. VIEW HEADER */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-sky-400" />
            <span>60-Day Mission Trends & Baseline Freeze Comparator (Modules C & H)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Stage 3: Day 26 Baseline Freeze · Personalized M ± 2*MAD Bands · Confounder Filtering Verification
          </p>
        </div>

        {/* Dual Metric Selectors */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white/[0.04] p-1 rounded-2xl border border-white/10">
            <span className="text-[11px] text-slate-400 pl-2">Top:</span>
            <select
              value={metric1}
              onChange={(e) => setMetric1(e.target.value)}
              className="bg-slate-900 text-xs font-semibold text-sky-300 py-1 px-2 rounded-xl border border-white/10 cursor-pointer focus:outline-none"
            >
              {metricOptions.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-white/[0.04] p-1 rounded-2xl border border-white/10">
            <span className="text-[11px] text-slate-400 pl-2">Bottom:</span>
            <select
              value={metric2}
              onChange={(e) => setMetric2(e.target.value)}
              className="bg-slate-900 text-xs font-semibold text-indigo-300 py-1 px-2 rounded-xl border border-white/10 cursor-pointer focus:outline-none"
            >
              {metricOptions.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. INTERACTIVE 16-STEP COMMANDER VEGA JOURNEY BAR */}
      <div className="p-2.5 rounded-2xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-lg flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase shrink-0 pl-1">
          Milestones:
        </span>
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {keyMilestones.map((m) => {
            const isCurrent = currentDay === m.day;
            return (
              <button
                key={m.day}
                onClick={() => onSelectDay(m.day)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(56,189,248,0.5)] scale-105'
                    : 'bg-white/[0.04] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/5'
                }`}
              >
                <span>{m.label}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full ${
                  m.badge === 'Alert' ? 'bg-rose-500/30 text-rose-200' :
                  m.badge === 'Frozen' ? 'bg-amber-500/30 text-amber-200' :
                  m.badge === 'Filtered' ? 'bg-sky-500/30 text-sky-200' :
                  'bg-white/10 text-slate-300'
                }`}>
                  {m.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SYNCHRONIZED DUAL-METRIC 60-DAY CHART */}
      <div className="flex-1 min-h-[300px] rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-4 shadow-xl flex flex-col justify-between relative overflow-hidden">
        
        {/* Chart Legend Row */}
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] text-xs">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-sky-300 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
              {m1Config.label} (Days 1–60)
            </span>
            <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block" />
              {m2Config.label} (Days 1–60)
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-3 h-2 rounded bg-sky-500/20 border border-sky-400/40 inline-block" />
              <span>Personal Operating Band (M ± 2*MAD)</span>
            </span>
            <span className="flex items-center gap-1 text-amber-300">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Day 26 Baseline Freeze</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-amber-400 text-sm font-bold">◇</span>
              <span>Excluded Confounder</span>
            </span>
          </div>
        </div>

        {/* Dual Chart SVG Canvas */}
        <div className="w-full flex-1 relative mt-1">
          <svg viewBox="0 0 1020 250" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id="band1-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.06" />
              </linearGradient>

              <filter id="trends-sky-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#38BDF8" floodOpacity="0.6" />
              </filter>
            </defs>

            {/* UPPER CHART: Metric 1 Operating Band */}
            <rect
              x="60"
              y={Math.min(chartGeometry.bandUpper1Y, chartGeometry.bandLower1Y)}
              width="940"
              height={Math.abs(chartGeometry.bandLower1Y - chartGeometry.bandUpper1Y)}
              fill="url(#band1-gradient)"
              stroke="#38BDF8"
              strokeWidth="0.5"
              strokeDasharray="3 3"
              strokeOpacity="0.4"
            />

            {/* Metric 1 Baseline Dashed Line */}
            <line 
              x1="60" 
              y1={chartGeometry.baseline1Y} 
              x2="1000" 
              y2={chartGeometry.baseline1Y} 
              stroke="#38BDF8" 
              strokeOpacity="0.5" 
              strokeWidth="1.5" 
              strokeDasharray="4 4" 
            />

            {/* Separation horizontal grid line */}
            <line x1="60" y1="125" x2="1000" y2="125" stroke="#1E293B" strokeWidth="1" strokeDasharray="2 2" />

            {/* Metric 2 Baseline Line */}
            <line 
              x1="60" 
              y1={chartGeometry.baseline2Y} 
              x2="1000" 
              y2={chartGeometry.baseline2Y} 
              stroke="#818CF8" 
              strokeOpacity="0.4" 
              strokeWidth="1.5" 
              strokeDasharray="4 4" 
            />

            {/* Vertical Baseline Frozen @ Day 26 Lock Line */}
            <g>
              <line 
                x1={60 + (25 / 59) * 940} 
                y1="10" 
                x2={60 + (25 / 59) * 940} 
                y2="230" 
                stroke="#F59E0B" 
                strokeWidth="1.5" 
                strokeDasharray="3 3" 
                strokeOpacity="0.8" 
              />
              <text 
                x={60 + (25 / 59) * 940} 
                y="8" 
                fill="#FCD34D" 
                fontSize="10" 
                fontWeight="700" 
                fontFamily="system-ui, sans-serif" 
                textAnchor="middle"
              >
                Baseline Frozen @ D26
              </text>
            </g>

            {/* Active Day Vertical Cursor */}
            <g>
              <line 
                x1={60 + ((currentDay - 1) / 59) * 940} 
                y1="15" 
                x2={60 + ((currentDay - 1) / 59) * 940} 
                y2="230" 
                stroke="#FFFFFF" 
                strokeWidth="1.5" 
                strokeOpacity="0.75" 
              />
              <circle 
                cx={60 + ((currentDay - 1) / 59) * 940} 
                cy={chartGeometry.pts1[currentDay - 1]?.y || 60} 
                r="4.5" 
                fill="#38BDF8" 
                stroke="#FFFFFF" 
                strokeWidth="2" 
              />
            </g>

            {/* Metric 1 Spline Stroke */}
            <path 
              d={chartGeometry.path1} 
              fill="none" 
              stroke="#38BDF8" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              filter="url(#trends-sky-glow)" 
            />

            {/* Metric 2 Spline Stroke */}
            <path 
              d={chartGeometry.path2} 
              fill="none" 
              stroke="#818CF8" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />

            {/* Hollow Amber Diamonds on Confounder Days with off-scale callout */}
            {chartGeometry.pts1.map((p) => {
              if (p.exclusionReason) {
                return (
                  <g key={p.day} onClick={() => onSelectDay(p.day)} className="cursor-pointer">
                    <polygon 
                      points={`${p.x},${p.y - 7} ${p.x + 6},${p.y} ${p.x},${p.y + 7} ${p.x - 6},${p.y}`} 
                      fill="#0F172A" 
                      stroke="#F59E0B" 
                      strokeWidth="2" 
                    />
                    {p.isOffScale && (
                      <text 
                        x={p.x} 
                        y={p.y - 10} 
                        textAnchor="middle" 
                        fill="#FCD34D" 
                        fontSize="9" 
                        fontWeight="700"
                      >
                        {p.raw}
                      </text>
                    )}
                  </g>
                );
              }
              return null;
            })}

            {/* X-Axis Day Labels (Crisp non-overlapping ticks: D1, D6, D12...) */}
            {[1, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60].map((d) => {
              const x = 60 + ((d - 1) / 59) * 940;
              return (
                <text
                  key={d}
                  x={x}
                  y="245"
                  fill={d === currentDay ? "#38BDF8" : "#94A3B8"}
                  fontSize="11"
                  fontWeight={d === currentDay ? "700" : "500"}
                  fontFamily="system-ui, sans-serif"
                  textAnchor="middle"
                >
                  D{d}
                </text>
              );
            })}
          </svg>
        </div>

      </div>

    </div>
  );
};
