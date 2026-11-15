// src/components/FlightSurgeonView.tsx
// Modules K, N, P: Store-and-Forward Ground Support Loop, Flight Surgeon Console & Privacy Mask
// 100% Apple VisionOS Dark Frosted Glass with OWLT Delay Simulation & Ground Uplink

import React, { useState } from 'react';
import { 
  Stethoscope, 
  Radio, 
  Send, 
  CheckCircle2, 
  Layers, 
  Lock, 
  Clock,
  Shield,
  FileText,
  AlertTriangle
} from 'lucide-react';
import type { DayRecord, CommProfileType, RuleTraceEvent } from '../types/mission';
import { useMissionContext, type GroundPackage } from '../context/MissionContext';

interface Props {
  currentDay: number;
  commProfile: CommProfileType;
  currentRecord: DayRecord;
  ruleTrace: RuleTraceEvent;
  onDeployProtocol: (protocolId: string) => void;
  queuedPackages?: GroundPackage[];
  onAcknowledgeGuidance?: (note: string) => void;
  isBaselineFrozenManual?: boolean;
  onToggleBaselineFreeze?: () => void;
}

export const FlightSurgeonView: React.FC<Props> = ({
  currentDay,
  commProfile,
  currentRecord,
  ruleTrace,
  onDeployProtocol,
  queuedPackages = [],
  onAcknowledgeGuidance,
  isBaselineFrozenManual = false,
  onToggleBaselineFreeze
}) => {
  const { privacyMaskConsent, setPrivacyMaskConsent, setCommProfile, queueGroundPackage } = useMissionContext();
  const [selectedLatency, setSelectedLatency] = useState<CommProfileType>(commProfile);
  const [transmitQueue, setTransmitQueue] = useState<Array<{ id: string; title: string; remainingSec: number }>>([]);
  const [surgeonNote, setSurgeonNote] = useState<string>(
    'Confirmed 4-day sleep compression & +11 bpm autonomic drift. Maintain 8h protected sleep window & repeat morning brachial BP check on Day 31.'
  );
  const [guidanceReturned, setGuidanceReturned] = useState<boolean>(false);
  const activePrivacyMask = !privacyMaskConsent;

  // Keep selected latency in sync with global commProfile
  React.useEffect(() => {
    setSelectedLatency(commProfile);
  }, [commProfile]);

  // Comm Profile Details
  const getCommDelay = (profile: CommProfileType) => {
    switch (profile) {
      case 'leo': return { label: 'ISS · Low Earth Orbit (2s)', seconds: 2, note: 'Direct low-latency S-band telemetry link' };
      case 'lunar': return { label: 'Lunar Far-Side (1.3s OWLT + LOS)', seconds: 4, note: 'Deep Space Network (DSN) via Gateway relay with periodic loss-of-signal' };
      case 'mars': return { label: 'Mars Transit (12.4m Delay)', seconds: 12, note: 'Store-and-forward packet transmission over deep-space telemetry queue' };
    }
  };

  const currentDelay = getCommDelay(selectedLatency);

  // Transmit package to flight surgeon button handler with countdown
  const handleTransmitPackage = () => {
    const pkgId = `pkg-${Date.now()}`;
    const newPkg = {
      id: pkgId,
      title: `Day ${currentDay} Telemetry Package (${currentDelay.label})`,
      remainingSec: currentDelay.seconds
    };

    setTransmitQueue(prev => [...prev, newPkg]);
    queueGroundPackage?.(newPkg.title);

    const interval = setInterval(() => {
      setTransmitQueue(prev => {
        const next = prev.map(p => p.id === pkgId ? { ...p, remainingSec: Math.max(0, p.remainingSec - 1) } : p);
        if (next.find(p => p.id === pkgId)?.remainingSec === 0) {
          clearInterval(interval);
        }
        return next;
      });
    }, 1000);
  };

  // Return guidance to crew handler
  const handleAcknowledgeAndReturn = () => {
    setGuidanceReturned(true);
    onAcknowledgeGuidance?.(surgeonNote);
    setTimeout(() => setGuidanceReturned(false), 4000);
  };

  return (
    <div className="h-full flex flex-col justify-between space-y-4 select-none pr-1 overflow-y-auto">
      
      {/* 1. CONSOLE HEADER */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Mission Control Flight Surgeon Console (Modules K, N, P)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              NASA JSC Flight Surgeon Ground Enclave · Store-and-Forward Telemetry Queue · Role-Based Redaction
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Flight Surgeon Baseline Freeze Manual Override */}
          <button
            onClick={onToggleBaselineFreeze}
            className={`px-3 py-1.5 rounded-2xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              isBaselineFrozenManual || currentDay >= 26
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                : 'bg-white/[0.04] text-slate-400 hover:text-white border-white/10'
            }`}
            title="Stage 3 Anti-Contamination: Manual Freeze / Unfreeze Baseline Reference"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>{isBaselineFrozenManual || currentDay >= 26 ? 'Baseline Reference: FROZEN' : 'Baseline: AUTO'}</span>
          </button>

          {/* OWLT Latency Profile Selector */}
          <div className="flex items-center gap-2 bg-white/[0.04] p-1 rounded-2xl border border-white/10">
            {(['leo', 'lunar', 'mars'] as CommProfileType[]).map((p) => {
              const isSelected = selectedLatency === p;
              return (
                <button
                  key={p}
                  onClick={() => {
                    setSelectedLatency(p);
                    setCommProfile(p);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-amber-500/25 border border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {p === 'leo' ? 'ISS (2s)' : p === 'lunar' ? 'Lunar (1.3s OWLT + LOS)' : 'Mars (12m Delay)'}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. STORE-AND-FORWARD QUEUE & TRANSMIT TRIGGER (TOP ROW) */}
      <div className="p-4 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-lg flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Radio className="w-5 h-5 text-sky-400 animate-pulse shrink-0" />
          <div>
            <span className="text-xs font-bold text-white block">
              DSN Deep-Space Network Link: {currentDelay.label}
            </span>
            <span className="text-[11px] text-slate-400">
              {currentDelay.note}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {transmitQueue.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-black/40 border border-white/10 text-xs text-slate-300">
              <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>
                {transmitQueue[transmitQueue.length - 1].remainingSec > 0
                  ? `In Flight: ${transmitQueue[transmitQueue.length - 1].remainingSec}s remaining`
                  : '✓ Downlink Received at Houston MCC'}
              </span>
            </div>
          )}

          <button
            onClick={handleTransmitPackage}
            className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 hover:from-sky-300 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-[0_0_18px_rgba(56,189,248,0.5)] transition-all active:scale-95"
          >
            <Send className="w-4 h-4 fill-slate-950" />
            <span>Compile & Transmit Ground Package</span>
          </button>
        </div>
      </div>

      {/* 3. FLIGHT SURGEON REVIEW INBOX GRID (7 COLS LEFT + 5 COLS RIGHT) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 flex-1 min-h-0">
        
        {/* Left: Ingested Spacecraft Telemetry & Verified Rule Trace (7 cols) */}
        <div className="xl:col-span-7 p-5 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-lg flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Downlinked Spacecraft Package · MET Day {currentDay}
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> SHA-256 AUDIT LOGGED
              </span>
            </div>

            {/* 4 Ingested Core Vitals Cards */}
            <div className="grid grid-cols-4 gap-2 text-center mb-3">
              <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10">
                <span className="text-[10px] text-slate-400 block">Resting HR</span>
                <span className="text-base font-bold text-white tabular-nums">{currentRecord.restingHR} bpm</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10">
                <span className="text-[10px] text-slate-400 block">Blood Pressure</span>
                <span className="text-base font-bold text-white tabular-nums">{currentRecord.bpSystolic}/{currentRecord.bpDiastolic}</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10">
                <span className="text-[10px] text-slate-400 block">Core Temp</span>
                <span className="text-base font-bold text-white tabular-nums">{currentRecord.bodyTemp}°C</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10">
                <span className="text-[10px] text-slate-400 block">Sleep Duration</span>
                <span className="text-base font-bold text-white tabular-nums">{currentRecord.sleepHours} hrs</span>
              </div>
            </div>

            {/* Rule Trace Status & Provenance Details */}
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Deterministic Rule State:</span>
                <span className="font-bold text-white">{ruleTrace.lifecycleState}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Provenance Credential:</span>
                <span className="font-semibold text-sky-300">{currentRecord.provenanceTag}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Confounder Exclusion Trace:</span>
                <span className={currentRecord.exclusionReason ? 'text-amber-400 font-semibold' : 'text-emerald-400'}>
                  {currentRecord.exclusionReason || 'Nominal Record (Included in Persistence Window)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Baseline Window:</span>
                <span className="font-semibold text-white">Frozen @ Day 26 (M: 58 bpm, Band: 55–61 bpm)</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-black/50 border border-white/10 text-[11px] text-slate-300">
            <strong>Ground Inference Note:</strong> {ruleTrace.summaryRationale}
          </div>
        </div>

        {/* Right: Module P Redacted Privacy Mask & Surgeon Guidance Return (5 cols) */}
        <div className="xl:col-span-5 p-5 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-lg flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Module P: Psychological Privacy Enclave
                </h3>
              </div>

              <button
                onClick={() => setPrivacyMaskConsent(!privacyMaskConsent)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                  activePrivacyMask ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' : 'bg-rose-500/20 text-rose-300 border-rose-400/40'
                }`}
              >
                {activePrivacyMask ? 'ENCLAVE MASK: ACTIVE' : 'CREW CONSENT: GRANTED'}
              </button>
            </div>

            {/* Redacted Journal Box */}
            <div className="p-3 rounded-2xl bg-black/60 border border-emerald-500/30 text-xs mb-3">
              <span className="text-[10px] font-bold text-emerald-400 uppercase block mb-1">
                Protected Astronaut Psychological Journal:
              </span>
              <p className="text-emerald-300/80 leading-relaxed font-sans">
                {activePrivacyMask
                  ? '[REDACTED — CREW PRIVATE ENCLAVE (CONFINEMENT PRIVACY PROTECTION)]\nRaw subjective mental health notes and personal journals remain encrypted locally on spacecraft. Only aggregated readiness indices are transmitted to ground.'
                  : currentRecord.notes}
              </p>
            </div>

            {/* Flight Surgeon Assessment Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white block">Flight Surgeon Ground Assessment Log:</label>
              <textarea
                value={surgeonNote}
                onChange={(e) => setSurgeonNote(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-2xl bg-black/40 border border-white/15 text-xs text-white resize-none focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          {/* Action: Acknowledge & Return Guidance Package to Spacecraft */}
          <div className="pt-2">
            <button
              onClick={handleAcknowledgeAndReturn}
              className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{guidanceReturned ? 'Guidance Uplinked to Spacecraft!' : 'Acknowledge & Return Guidance to Crew'}</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
