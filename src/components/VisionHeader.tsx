// src/components/VisionHeader.tsx
// Pixel-for-Pixel Apple VisionOS Top Capsule Navigation & Mission Telemetry Header

import React from 'react';
import { 
  Activity, 
  BarChart2, 
  Bell, 
  Layers, 
  FileText,
  Mic,
  Shield,
  UserCheck
} from 'lucide-react';
import type { CommProfileType, UserRole } from '../types/mission';

interface Props {
  currentDay: number;
  commProfile: CommProfileType;
  onChangeCommProfile: (profile: CommProfileType) => void;
  userRole?: UserRole;
  onChangeRole?: (role: UserRole) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenMissionLog: () => void;
  onOpenCitations: () => void;
  onOpenCsvModal: () => void;
  onOpenAiAssistant?: () => void;
}

export const VisionHeader: React.FC<Props> = ({
  currentDay,
  commProfile,
  onChangeCommProfile,
  userRole = 'crew',
  onChangeRole,
  activeTab,
  onSelectTab,
  onOpenMissionLog,
  onOpenCitations,
  onOpenAiAssistant
}) => {
  // Cycle comm profile when clicking the comm badge
  const toggleCommProfile = () => {
    if (commProfile === 'leo') {
      onChangeCommProfile('lunar');
    } else if (commProfile === 'lunar') {
      onChangeCommProfile('mars');
    } else {
      onChangeCommProfile('leo');
    }
  };

  const getCommDisplay = () => {
    if (commProfile === 'lunar') {
      return { label: 'Lunar Far-Side · 1.3s OWLT', color: 'bg-amber-400', shadow: 'shadow-[0_0_8px_#f59e0b]' };
    }
    if (commProfile === 'mars') {
      return { label: 'Mars Transit · 12m Delay', color: 'bg-rose-400', shadow: 'shadow-[0_0_8px_#f43f5e]' };
    }
    return { label: 'ISS · Orion-4 (2s)', color: 'bg-emerald-400', shadow: 'shadow-[0_0_8px_#34d399]' };
  };

  const commStatus = getCommDisplay();

  const handleToggleRole = () => {
    const nextRole: UserRole = userRole === 'crew' ? 'flight_surgeon' : 'crew';
    onChangeRole?.(nextRole);
    if (nextRole === 'flight_surgeon') {
      onSelectTab('reports');
    }
  };

  return (
    <header className="h-14 px-4 xl:px-6 w-full flex items-center justify-between z-20 shrink-0 select-none gap-3">
      
      {/* 1. LEFT: Frosted-Glass Mission Pulse Orbital-ECG Vector Emblem & Branding */}
      <div 
        onClick={onOpenCitations}
        className="flex items-center gap-3 cursor-pointer group transition-opacity hover:opacity-95"
        title="View Official NASA & CSA Human Research Evidence Citations"
      >
        {/* Custom Frosted-Glass Mission Pulse Orbital-ECG Vector SVG Emblem */}
        <div 
          data-testid="mission-pulse-emblem"
          className="w-10 h-10 rounded-2xl p-[1px] bg-gradient-to-br from-white/30 via-sky-400/25 to-indigo-500/35 backdrop-blur-xl shadow-[0_0_18px_rgba(56,189,248,0.4)] group-hover:scale-105 group-hover:shadow-[0_0_24px_rgba(56,189,248,0.6)] transition-all duration-200 shrink-0 flex items-center justify-center overflow-hidden"
          title="Mission Pulse Orbital-ECG Telemetry Console"
        >
          <div className="w-full h-full rounded-[15px] bg-[#070D1B]/85 flex items-center justify-center relative border border-white/15 overflow-hidden">
            <svg 
              viewBox="0 0 40 40" 
              className="mission-pulse-emblem w-full h-full p-1" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Mission Pulse Orbital-ECG Vector Emblem"
            >
              <defs>
                <radialGradient id="mp-emblem-core-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#0284C7" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="mp-emblem-orbit" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#818CF8" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#0284C7" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="mp-emblem-ecg" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.6" />
                  <stop offset="35%" stopColor="#38BDF8" />
                  <stop offset="50%" stopColor="#FFFFFF" />
                  <stop offset="65%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.6" />
                </linearGradient>
                <filter id="mp-emblem-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#38BDF8" floodOpacity="0.8" />
                </filter>
              </defs>

              {/* Central ambient glow */}
              <circle cx="20" cy="20" r="14" fill="url(#mp-emblem-core-glow)" />

              {/* Outer aerospace orbital track */}
              <ellipse 
                cx="20" 
                cy="20" 
                rx="15" 
                ry="6.5" 
                transform="rotate(-28 20 20)" 
                stroke="url(#mp-emblem-orbit)" 
                strokeWidth="1.25" 
                strokeDasharray="28 4 6 3" 
                strokeLinecap="round" 
                opacity="0.9"
              />

              {/* Orbital beacon node */}
              <circle cx="31.5" cy="14" r="1.3" fill="#FFFFFF" filter="url(#mp-emblem-glow)" />

              {/* Mission Pulse ECG Vector Line (Traversing Across Orbit) */}
              <path 
                d="M 5 20.5 L 12 20.5 L 14 18.5 L 16 23 L 18.5 11 L 21.5 29 L 24 17.5 L 26 21.5 L 28 20.5 L 35 20.5" 
                stroke="url(#mp-emblem-ecg)" 
                strokeWidth="1.8" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                filter="url(#mp-emblem-glow)"
              />

              {/* Central peak cardiac beacon */}
              <circle cx="18.5" cy="11" r="1.4" fill="#FFFFFF" />
            </svg>
          </div>
        </div>
        
        <div className="flex flex-col">
          <span className="text-lg font-semibold tracking-tight text-white leading-tight">
            Mission Pulse
          </span>
          <span className="text-[11px] text-slate-400 font-normal mt-0.5 leading-tight">
            Crew Health Monitoring System
          </span>
        </div>
      </div>

      {/* 2. CENTER: Glass Capsule 5-Tab Navigation */}
      <nav className="rounded-full bg-white/[0.06] backdrop-blur-2xl border border-white/15 p-1 flex items-center gap-1 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        
        {/* Tab 1: Live */}
        <button
          onClick={() => onSelectTab('live')}
          className={`flex items-center gap-2 px-5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
            activeTab === 'live' || activeTab === 'telemetry'
              ? 'bg-gradient-to-b from-white via-blue-50 to-blue-200 text-slate-900 shadow-[0_0_20px_rgba(147,197,253,0.5)]'
              : 'text-slate-300 hover:text-white hover:bg-white/[0.08]'
          }`}
        >
          <Activity className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Live</span>
        </button>

        {/* Tab 2: Trends */}
        <button
          onClick={() => onSelectTab('trends')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
            activeTab === 'trends'
              ? 'bg-gradient-to-b from-white via-blue-50 to-blue-200 text-slate-900 shadow-[0_0_20px_rgba(147,197,253,0.5)] font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-white/[0.08]'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Trends</span>
        </button>

        {/* Tab 3: Events */}
        <button
          onClick={() => onSelectTab('events')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
            activeTab === 'events'
              ? 'bg-gradient-to-b from-white via-blue-50 to-blue-200 text-slate-900 shadow-[0_0_20px_rgba(147,197,253,0.5)] font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-white/[0.08]'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Events</span>
        </button>

        {/* Tab 4: Analysis */}
        <button
          onClick={() => onSelectTab('analysis')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
            activeTab === 'analysis'
              ? 'bg-gradient-to-b from-white via-blue-50 to-blue-200 text-slate-900 shadow-[0_0_20px_rgba(147,197,253,0.5)] font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-white/[0.08]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Analysis</span>
        </button>

        {/* Tab 5: Reports */}
        <button
          onClick={() => onSelectTab('reports')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
            activeTab === 'reports'
              ? 'bg-gradient-to-b from-white via-blue-50 to-blue-200 text-slate-900 shadow-[0_0_20px_rgba(147,197,253,0.5)] font-semibold'
              : 'text-slate-300 hover:text-white hover:bg-white/[0.08]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Reports</span>
        </button>

      </nav>

      {/* 3. RIGHT: Comm Status, Date/Time & Astronaut Avatar (Pixel-Perfect Match) */}
      <div className="flex items-center gap-2.5 xl:gap-3 shrink-0 whitespace-nowrap">
        
        {/* Comm Status Indicator */}
        <button
          onClick={toggleCommProfile}
          className="flex items-center gap-2 text-xs text-slate-300 hover:text-white transition-colors whitespace-nowrap shrink-0"
          title="Click to toggle Comm Delay Profile: ISS · Lunar Far-Side · Mars Transit"
        >
          <span className={`w-2 h-2 rounded-full ${commStatus.color} ${commStatus.shadow} animate-pulse shrink-0`} />
          <span className="font-normal text-slate-200 whitespace-nowrap">{commStatus.label}</span>
        </button>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-white/15 shrink-0" />

        {/* Mission Date & Time */}
        <div className="flex flex-col text-right whitespace-nowrap shrink-0">
          <span className="text-xs font-semibold text-slate-200 leading-tight whitespace-nowrap">
            Nov 14, 2026
          </span>
          <span className="text-[11px] text-slate-400 font-normal leading-tight whitespace-nowrap">
            14:32 UTC
          </span>
        </div>

        {/* Pulse AI & Voice Quick Trigger (Labeled Glass Capsule Button) */}
        {onOpenAiAssistant && (
          <button
            onClick={onOpenAiAssistant}
            className="h-7 px-3 rounded-full bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/35 hover:border-sky-300 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-sm text-xs font-semibold text-sky-200 hover:text-white cursor-pointer whitespace-nowrap shrink-0"
            title="Open Pulse AI & Clinical Voice Companion (Module G)"
          >
            <span>💬</span>
            <span className="whitespace-nowrap">Pulse AI</span>
            {currentDay === 30 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-rose-500/25 border border-rose-400/60 text-rose-300 text-[10px] font-bold animate-pulse whitespace-nowrap">
                1 Alert Explainable
              </span>
            )}
          </button>
        )}

        {/* Role Switcher */}
        {onChangeRole && (
          <button
            onClick={handleToggleRole}
            className={`h-7 px-2.5 rounded-full border flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-sm text-xs font-medium whitespace-nowrap shrink-0 ${
              userRole === 'flight_surgeon'
                ? 'bg-amber-500/20 border-amber-400/40 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                : 'bg-white/[0.06] hover:bg-white/[0.14] border-white/12 text-slate-300 hover:text-white'
            }`}
            title={`Toggle Perspective: Currently ${userRole === 'flight_surgeon' ? 'Flight Surgeon' : 'Crew View'}`}
          >
            {userRole === 'flight_surgeon' ? (
              <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            ) : (
              <UserCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            )}
            <span className="whitespace-nowrap">{userRole === 'flight_surgeon' ? 'Flight Surgeon' : 'Crew View'}</span>
          </button>
        )}

        {/* Astronaut Avatar Helmet */}
        <button
          onClick={onOpenMissionLog}
          className="w-9 h-9 rounded-full ring-2 ring-white/20 hover:ring-blue-400 overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-all shrink-0 bg-slate-900"
          title="Open Commander Vega 16-Step Mission Log Drawer"
        >
          <img 
            src="/astronaut-avatar.png" 
            alt="Commander Vega" 
            className="w-full h-full object-cover" 
          />
        </button>

      </div>

    </header>
  );
};
