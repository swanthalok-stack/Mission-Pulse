// src/components/VisionSidebar.tsx
// Pixel-for-Pixel Apple VisionOS Left Glass Sidebar Navigation

import React from 'react';
import { 
  Activity, 
  Radio, 
  Bed, 
  Brain, 
  Leaf, 
  AlertTriangle, 
  Rocket,
  ShieldCheck
} from 'lucide-react';

export type SidebarSection = 
  | 'overview' 
  | 'sensors' 
  | 'activity' 
  | 'cognitive' 
  | 'environment' 
  | 'alerts' 
  | 'context';

interface Props {
  currentDay: number;
  activeSection?: SidebarSection;
  onSelectSection: (section: SidebarSection) => void;
  onOpenMissionLog: () => void;
  isDrifting?: boolean;
}

export const VisionSidebar: React.FC<Props> = ({
  currentDay: _currentDay,
  activeSection,
  onSelectSection,
  onOpenMissionLog,
  isDrifting: _isDrifting = false
}) => {
  const navItems: { id: SidebarSection; label: string; icon: React.FC<any>; description: string }[] = [
    {
      id: 'overview',
      label: 'Health Overview',
      icon: Activity,
      description: 'VisionOS holographic telemetry canvas'
    },
    {
      id: 'sensors',
      label: 'Vitals & Sensors',
      icon: Radio,
      description: 'Module B: Wearable streams, manual log & CSV sync'
    },
    {
      id: 'activity',
      label: 'Activity & Sleep',
      icon: Bed,
      description: 'Module J: Routine rings, exercise log & mastery badges'
    },
    {
      id: 'cognitive',
      label: 'Cognitive State',
      icon: Brain,
      description: 'Modules D, L, P: SANS Amsler grid, exam wizard & privacy mask'
    },
    {
      id: 'environment',
      label: 'Environment',
      icon: Leaf,
      description: 'Module M: CSA CANS dosimetry, storm shelter drill & cabin CO2'
    },
    {
      id: 'alerts',
      label: 'Events & Alerts',
      icon: AlertTriangle,
      description: 'Module I: 4-stage persistence trace & counterfactual filters'
    },
    {
      id: 'context',
      label: 'Mission Context',
      icon: Rocket,
      description: 'Modules F, O: NASA 5 Hazards matrix & research evidence'
    }
  ];

  return (
    <aside className="w-56 shrink-0 h-full rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 p-3.5 flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-10 select-none">
      
      {/* Top Half: Profile Card & 7 Navigation Items */}
      <div className="flex flex-col gap-2.5">
        
        {/* Top Profile Card: Crew A-03 */}
        <div 
          onClick={onOpenMissionLog}
          className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 flex items-center gap-3 cursor-pointer transition-all duration-200 group"
          title="Click to view Commander Vega 16-Step Mission Log"
        >
          <div className="w-10 h-10 rounded-full ring-2 ring-white/20 overflow-hidden shrink-0 shadow-md group-hover:ring-blue-400 transition-all bg-slate-900">
            <img 
              src="/astronaut-avatar.png" 
              alt="Crew A-03" 
              className="w-full h-full object-cover" 
            />
          </div>
          
          <div className="flex flex-col">
            <span className="font-bold text-white text-sm tracking-tight leading-tight group-hover:text-blue-200 transition-colors">
              Crew A-03
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
              <span className="text-[11px] text-slate-400 font-normal leading-tight">
                Onboard • ISS
              </span>
            </div>
          </div>
        </div>

        {/* 7 Navigation Items */}
        <nav className="flex flex-col gap-1 mt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`w-full text-left py-2.5 px-3.5 rounded-2xl transition-all duration-200 flex items-center justify-between text-xs group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500/25 to-cyan-500/15 border border-cyan-400/35 text-white shadow-[0_0_18px_rgba(56,189,248,0.25)] font-semibold'
                    : 'text-slate-400 border border-transparent hover:text-white hover:bg-white/[0.05]'
                }`}
                title={item.description}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-sky-300' : 'text-slate-400 group-hover:text-slate-200'
                  }`} />
                  <span className="tracking-tight truncate">{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>

      </div>

      {/* Subtle Transparent Bottom Section allowing Earth curvature glow */}
      <div className="h-6" />

    </aside>
  );
};
