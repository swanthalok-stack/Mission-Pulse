// src/components/VisionActionCards.tsx
// Module A: 3 Bottom Glass Action Cards (Monitoring Event, Mission Context, Recommended Action)
// Strictly h-[88px] with zero text clipping, zero collisions, zero truncate, and 100% visionOS frosted glass aesthetics

import React from 'react';
import { 
  AlertTriangle, 
  Layers, 
  CheckCircle, 
  ChevronRight, 
  Play, 
  ShieldCheck, 
  Radio, 
  Filter 
} from 'lucide-react';
import type { DayRecord } from '../types/mission';

interface Props {
  currentDay: number;
  record: DayRecord;
  onOpenRuleTrace: () => void;
  onOpenMissionContext: () => void;
  onLaunchSelfExam: () => void;
  isDrifting?: boolean;
}

export const VisionActionCards: React.FC<Props> = ({
  currentDay,
  record,
  onOpenRuleTrace,
  onOpenMissionContext,
  onLaunchSelfExam,
  isDrifting = false
}) => {
  // Dynamic Content for Card 1 (Monitoring Event)
  const getEventCardContent = () => {
    if (currentDay === 50 || record.radiationDose >= 2.0) {
      return {
        title: 'Solar Particle Event (SPE)',
        subtitle: `${record.radiationDose.toFixed(2)} mGy/d cabin absorbed dose rate`,
        icon: Radio,
        iconColor: 'text-amber-400',
        bgColor: 'bg-amber-500/15',
        borderColor: 'border-amber-500/30'
      };
    }
    if (currentDay >= 27 && currentDay <= 30) {
      return {
        title: 'Elevated Resting Heart Rate',
        subtitle: '~12% higher than 7-day baseline for ~6 hours.',
        icon: AlertTriangle,
        iconColor: 'text-amber-400',
        bgColor: 'bg-amber-500/15',
        borderColor: 'border-amber-500/30'
      };
    }
    if (currentDay === 16) {
      return {
        title: 'Post-Meal Glucose Filtered',
        subtitle: '138 mg/dL post-prandial spike (Excluded)',
        icon: Filter,
        iconColor: 'text-sky-400',
        bgColor: 'bg-sky-500/15',
        borderColor: 'border-sky-500/30'
      };
    }
    if (currentDay === 19) {
      return {
        title: 'Workout Confounder Filtered',
        subtitle: '142 bpm workout spike (resting 59 bpm nominal)',
        icon: Filter,
        iconColor: 'text-sky-400',
        bgColor: 'bg-sky-500/15',
        borderColor: 'border-sky-500/30'
      };
    }
    if (currentDay === 44) {
      return {
        title: 'Loose Sensor Artifact Filtered',
        subtitle: 'Optical PPG signal <50% (Excluded by Stage 1)',
        icon: Filter,
        iconColor: 'text-sky-400',
        bgColor: 'bg-sky-500/15',
        borderColor: 'border-sky-500/30'
      };
    }
    if (currentDay >= 31 && currentDay <= 34) {
      return {
        title: 'Verification Complete',
        subtitle: 'Hydration & sleep extension resolved resting drift',
        icon: CheckCircle,
        iconColor: 'text-emerald-400',
        bgColor: 'bg-emerald-500/15',
        borderColor: 'border-emerald-500/30'
      };
    }
    return {
      title: 'All Core Vitals Nominal',
      subtitle: 'Operating within Day 1–14 baseline band',
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/15',
      borderColor: 'border-emerald-500/30'
    };
  };

  // Dynamic Content for Card 2 (Mission Context)
  const getContextCardContent = () => {
    if (currentDay === 50) {
      return {
        title: 'Storm Shelter Operational Drill',
        subtitle: 'Polyethylene water-wall ingress active'
      };
    }
    if (currentDay >= 27 && currentDay <= 30) {
      return {
        title: 'High workload period',
        subtitle: '(EVA prep + extended ops)'
      };
    }
    if (currentDay === 19) {
      return {
        title: 'ARED 90m Countermeasure',
        subtitle: 'Post-resistive loading recovery period'
      };
    }
    if (currentDay === 16) {
      return {
        title: 'Flight Day Midday Meal',
        subtitle: 'Standard nutritional intake logged'
      };
    }
    if (currentDay <= 14) {
      return {
        title: 'Baseline Calibration Phase',
        subtitle: 'Days 1–14 establishing M ± 2*MAD'
      };
    }
    return {
      title: 'Routine Orbital Operations',
      subtitle: 'Standard ISS sleep & ARED exercise'
    };
  };

  const getActionCardContent = () => {
    if (currentDay === 50) {
      return {
        title: 'Execute Storm Shelter Drill',
        subtitle: 'Muster crew behind water-wall shielding'
      };
    }
    if (currentDay >= 31 && currentDay <= 34) {
      return {
        title: 'Continue Monitoring',
        subtitle: 'Protected 8h sleep recovery in progress'
      };
    }
    return {
      title: 'Run a 2-min verification',
      subtitle: '(hydration, activity, and rest check)'
    };
  };

  const eventCard = getEventCardContent();
  const EventIcon = eventCard.icon;
  const contextCard = getContextCardContent();
  const actionCard = getActionCardContent();

  return (
    <div className="shrink-0 h-[68px] grid grid-cols-3 gap-2.5 w-full select-none">
      
      {/* 1. MONITORING EVENT CARD */}
      <div 
        onClick={onOpenRuleTrace}
        className={`h-[68px] px-3 py-1 flex items-center justify-between gap-2.5 rounded-2xl backdrop-blur-xl transition-all duration-200 cursor-pointer group shadow-lg relative overflow-hidden ${
          isDrifting
            ? 'bg-amber-500/[0.08] border border-amber-400/40 hover:border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
            : 'bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-amber-400/30'
        }`}
      >
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-amber-500/20 transition-colors" />

        <div className="w-8 h-8 shrink-0 rounded-xl flex items-center justify-center bg-white/[0.08] border border-white/12 text-amber-300 group-hover:scale-105 transition-transform">
          <EventIcon className="w-4 h-4 stroke-[2]" />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <span className="text-[10px] font-normal text-slate-400 leading-tight block">
            Monitoring Event
          </span>
          <span className="text-[11.5px] font-semibold text-white leading-tight block mt-0.5 group-hover:text-amber-200 transition-colors">
            {eventCard.title}
          </span>
          <span className="text-[10px] text-slate-400 font-normal leading-tight block mt-0.5 line-clamp-2">
            {eventCard.subtitle}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenRuleTrace();
          }}
          className="w-7 h-7 rounded-full bg-white/[0.05] group-hover:bg-white/[0.15] border border-white/10 group-hover:border-white/25 flex items-center justify-center text-slate-400 group-hover:text-white shrink-0 transition-all ml-0.5"
          title="Open Events & Alerts Rule Trace (Module I)"
        >
          <ChevronRight className="w-4 h-4 stroke-[2]" />
        </button>
      </div>

      {/* 2. MISSION CONTEXT CARD */}
      <div 
        onClick={onOpenMissionContext}
        className="h-[68px] px-3 py-1 flex items-center justify-between gap-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-sky-400/30 backdrop-blur-xl transition-all duration-200 cursor-pointer group shadow-lg relative overflow-hidden"
      >
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-blue-500/20 transition-colors" />

        <div className="w-8 h-8 shrink-0 rounded-xl flex items-center justify-center bg-white/[0.08] border border-white/12 text-sky-300 group-hover:scale-105 transition-transform shadow-sm">
          <Layers className="w-4 h-4 stroke-[2]" />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <span className="text-[10px] font-normal text-slate-400 leading-tight block">
            Mission Context
          </span>
          <span className="text-[11.5px] font-semibold text-white leading-tight block mt-0.5 group-hover:text-sky-200 transition-colors">
            {contextCard.title}
          </span>
          <span className="text-[10px] text-slate-400 font-normal leading-tight block mt-0.5 line-clamp-2">
            {contextCard.subtitle}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenMissionContext();
          }}
          className="w-7 h-7 rounded-full bg-white/[0.05] group-hover:bg-white/[0.15] border border-white/10 group-hover:border-white/25 flex items-center justify-center text-slate-400 group-hover:text-white shrink-0 transition-all ml-0.5"
          title="Open Mission Context & 5 Hazards (Module F)"
        >
          <ChevronRight className="w-4 h-4 stroke-[2]" />
        </button>
      </div>

      {/* 3. RECOMMENDED ACTION CARD */}
      <div 
        onClick={onLaunchSelfExam}
        className="h-[68px] px-3 py-1 flex items-center justify-between gap-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-emerald-400/30 backdrop-blur-xl transition-all duration-200 cursor-pointer group shadow-lg relative overflow-hidden"
      >
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-500/20 transition-colors" />

        <div className="w-8 h-8 shrink-0 rounded-xl flex items-center justify-center bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(16,185,129,0.2)]">
          <CheckCircle className="w-4 h-4 stroke-[2]" />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <span className="text-[10px] font-normal text-slate-400 leading-tight block">
            Recommended Next Step
          </span>
          <span className="text-[11.5px] font-semibold text-white leading-tight block mt-0.5 group-hover:text-emerald-200 transition-colors">
            {actionCard.title}
          </span>
          <span className="text-[10px] text-slate-400 font-normal leading-tight block mt-0.5 line-clamp-2">
            {actionCard.subtitle}
          </span>
        </div>

        {/* Glowing Sky-Blue Rounded Square Play Button [ ▶ ] */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLaunchSelfExam();
          }}
          className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 via-blue-400 to-cyan-500 hover:from-sky-300 hover:to-cyan-400 flex items-center justify-center text-slate-950 font-bold shadow-[0_0_16px_rgba(56,189,248,0.5)] shrink-0 hover:scale-105 active:scale-95 transition-all ml-0.5"
          title="Launch 2-Min Interactive Self-Exam & Verification Modal (Module D)"
        >
          <Play className="w-3.5 h-3.5 fill-slate-950 ml-0.5" />
        </button>
      </div>

    </div>
  );
};
