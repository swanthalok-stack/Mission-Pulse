// src/components/EnvironmentView.tsx
// Module M: CSA CANS Dosimetry, Spacecraft Habitability & SPE Storm Shelter Drill
// 100% Apple VisionOS Dark Frosted Glass with Interactive SPE Drill & NASA-STD-3001

import React, { useState } from 'react';
import { 
  Leaf, 
  Radiation, 
  ShieldAlert, 
  Wind, 
  Gauge, 
  CheckCircle2
} from 'lucide-react';
import type { DayRecord } from '../types/mission';

interface Props {
  currentDay: number;
  record: DayRecord;
  records: DayRecord[];
  onTriggerSpeStorm?: () => void;
}

export const EnvironmentView: React.FC<Props> = ({
  currentDay,
  record,
  records,
  onTriggerSpeStorm
}) => {
  const [shelterChecklist, setShelterChecklist] = useState<Record<string, boolean>>({
    waterWall: false,
    dosimeterCheck: false,
    radiationShield: false,
    foodBarriers: false
  });

  // Calculate cumulative mission radiation dose
  const cumulativeDose = records
    .filter(r => r.day <= currentDay)
    .reduce((acc, r) => acc + r.radiationDose, 0);

  const isSpeActive = currentDay === 50 || record.radiationDose >= 2.0;

  React.useEffect(() => {
    if (isSpeActive) {
      setShelterChecklist({
        waterWall: true,
        dosimeterCheck: true,
        radiationShield: true,
        foodBarriers: true
      });
    }
  }, [isSpeActive]);

  const handleTriggerSpeStorm = () => {
    setShelterChecklist({
      waterWall: true,
      dosimeterCheck: true,
      radiationShield: true,
      foodBarriers: true
    });
    onTriggerSpeStorm?.();
  };

  const toggleCheck = (id: string) => {
    setShelterChecklist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="h-full flex flex-col justify-between space-y-4 select-none pr-1 overflow-y-auto">
      
      {/* 1. VIEW HEADER */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-400" />
            <span>Spacecraft Radiation Dosimetry & Habitability (Module M)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Canadian Space Agency (CSA) CANS & Radi-N2 Spectrometers · NASA-STD-3001 Cabin Atmosphere
          </p>
        </div>

        {/* Interactive Trigger SPE Drill Button */}
        <button
          onClick={handleTriggerSpeStorm}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shadow-lg active:scale-95 ${
            isSpeActive
              ? 'bg-amber-500 text-slate-950 shadow-[0_0_20px_#f59e0b]'
              : 'bg-gradient-to-r from-amber-500/30 to-rose-500/30 hover:from-amber-500/50 hover:to-rose-500/50 border border-amber-400/50 text-amber-200'
          }`}
          title="Simulate Solar Particle Event (SPE) Alert on Day 50 (2.8 mGy/day)"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>{isSpeActive ? 'SPE Storm Drill ACTIVE (2.8 mGy/d)' : 'Trigger SPE Storm Shelter Drill (2.8 mGy/d)'}</span>
        </button>
      </div>

      {/* 2. CSA CANS DOSIMETRY HUB: 3 KPI GAUGES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Daily Absorbed Dose */}
        <div className="p-4 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Daily Absorbed Dose (CANS)</span>
            <div className="text-2xl font-bold text-white tracking-tight mt-1">
              {record.radiationDose.toFixed(2)} <span className="text-xs text-slate-400 font-normal">mGy/day</span>
            </div>
            <span className={`text-[10px] font-semibold mt-1 inline-block px-2 py-0.5 rounded-full ${
              isSpeActive ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
            }`}>
              {isSpeActive ? '⚠ Elevated SPE Flux' : 'Nominal GCR Background'}
            </span>
          </div>

          <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${
            isSpeActive 
              ? 'bg-amber-500/20 border-amber-400/40 text-amber-300 shadow-[0_0_12px_#f59e0b]' 
              : 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
          }`}>
            <Radiation className="w-6 h-6 stroke-[2]" />
          </div>
        </div>

        {/* Cumulative Mission Exposure */}
        <div className="p-4 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Cumulative Mission Exposure</span>
            <div className="text-2xl font-bold text-sky-400 tracking-tight mt-1">
              {cumulativeDose.toFixed(1)} <span className="text-xs text-slate-400 font-normal">mSv</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">
              Career Career Limit: 600 mSv (NASA LEO/BEO)
            </span>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 shrink-0">
            <Gauge className="w-6 h-6 stroke-[2]" />
          </div>
        </div>

        {/* Storm Shelter Ingress Status */}
        <div className="p-4 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Storm Shelter Readiness</span>
            <div className={`text-2xl font-bold tracking-tight mt-1 ${isSpeActive ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`}>
              {isSpeActive ? 'INGRESS ACTIVE' : 'STANDBY NOMINAL'}
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">
              Polyethylene water wall shielding ready
            </span>
          </div>

          <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${
            isSpeActive 
              ? 'bg-rose-500/20 border-rose-400/40 text-rose-300 shadow-[0_0_12px_#f43f5e]' 
              : 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
          }`}>
            <ShieldAlert className="w-6 h-6 stroke-[2]" />
          </div>
        </div>

      </div>

      {/* 3. LOWER GRID: SPE STORM DRILL CHECKLIST (6 COLS) + NASA-STD-3001 CABIN CARDS (6 COLS) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 flex-1 min-h-0">
        
        {/* Left: Storm Shelter Shielding Checklist (6 cols) */}
        <div className="xl:col-span-6 p-5 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-lg flex flex-col justify-between space-y-3">
          <div className="border-b border-white/10 pb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Solar Storm Defense Protocol & Shelter Checklist</span>
            </h3>
            <p className="text-[11px] text-slate-400">Artemis II & CSA Deep-Space Habitability Procedures</p>
          </div>

          <div className="space-y-2">
            {[
              { id: 'waterWall', title: '1. Reconfigure Polyethylene Water Walls', desc: 'Reposition potable water bladders into central habitat core for hydrogenous neutron shielding.' },
              { id: 'dosimeterCheck', title: '2. Radi-N2 & CANS Sensor Relocation', desc: 'Place bubble spectrometers inside shelter perimeter to verify dose rate attenuation >60%.' },
              { id: 'radiationShield', title: '3. AstroRad Ergonomic Radiation Vest', desc: 'Don personal selective shielding garments over bone marrow and blood-forming organs.' },
              { id: 'foodBarriers', title: '4. Food Ration Brick Stacking', desc: 'Position dense caloric storage packs along outer orbital compartment bulkheads.' }
            ].map((item) => {
              const isChecked = !!shelterChecklist[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isChecked
                      ? 'bg-emerald-500/15 border-emerald-400/30 text-white'
                      : 'bg-white/[0.02] border-white/5 text-slate-300'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block">{item.title}</span>
                    <span className="text-[11px] text-slate-400 leading-snug">{item.desc}</span>
                  </div>
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 ${
                    isChecked ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-white/10 text-slate-500'
                  }`}>
                    {isChecked ? '✓' : ''}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-400">
            Water and hydrogen-rich materials provide maximum stopping power against solar proton cascades.
          </p>
        </div>

        {/* Right: NASA-STD-3001 Spacecraft Atmosphere & Life Support (6 cols) */}
        <div className="xl:col-span-6 p-5 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-lg flex flex-col justify-between space-y-3">
          <div className="border-b border-white/10 pb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Wind className="w-4 h-4 text-sky-400" />
              <span>NASA-STD-3001 Cabin Atmosphere & Environmental Health</span>
            </h3>
            <p className="text-[11px] text-slate-400">Carbon Dioxide Removal Assembly (CDRA) & Thermal Loop</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
              <span className="text-[11px] text-slate-400 block">Cabin CO2 Partial Pressure</span>
              <span className="text-xl font-bold text-sky-400 mt-1 block">2.8 mmHg</span>
              <span className="text-[10px] text-emerald-400">CDRA Nominal (&lt;3.0 mmHg standard)</span>
            </div>

            <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
              <span className="text-[11px] text-slate-400 block">Atmospheric Oxygen (ppO2)</span>
              <span className="text-xl font-bold text-emerald-400 mt-1 block">155 mmHg</span>
              <span className="text-[10px] text-slate-400">20.9% Sea-Level Equivalence</span>
            </div>

            <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
              <span className="text-[11px] text-slate-400 block">Total Cabin Pressure</span>
              <span className="text-xl font-bold text-white mt-1 block">14.7 psi</span>
              <span className="text-[10px] text-slate-400">101.3 kPa (Standard Atmosphere)</span>
            </div>

            <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
              <span className="text-[11px] text-slate-400 block">Cabin Temperature & Humidity</span>
              <span className="text-xl font-bold text-amber-300 mt-1 block">21.5°C · 48%</span>
              <span className="text-[10px] text-slate-400">Thermal Comfort Zone Verified</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-400/20 text-xs text-slate-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Cabin Volatile Organic Compounds (VOCs) and particulate count well within NASA-STD-3001 margins.</span>
          </div>
        </div>

      </div>

    </div>
  );
};
