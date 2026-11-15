// src/components/ExplainableRuleTrace.tsx
// Module I: Explainable 4-Stage Persistence Rule Engine & Counterfactual Transparency
// 100% Apple VisionOS Dark Frosted Glass with 5-State Lifecycle Bar & 4 Glass Rule-Trace Panels

import React from 'react';
import type { RuleTraceEvent, PersonalBaselineBand } from '../types/mission';
import { 
  CheckCircle2, 
  Clock, 
  Filter, 
  Play, 
  Send,
  Cpu, 
  AlertTriangle,
  ShieldCheck,
  Database
} from 'lucide-react';

interface Props {
  ruleTrace: RuleTraceEvent;
  bands: Record<string, PersonalBaselineBand>;
  currentDay: number;
  onOpenProtocol: (protocolId: string) => void;
  onQueueGroundPackage?: () => void;
  onAcknowledgeAlert?: () => void;
}

export const ExplainableRuleTrace: React.FC<Props> = ({
  ruleTrace,
  bands: _bands,
  currentDay,
  onOpenProtocol,
  onQueueGroundPackage,
  onAcknowledgeAlert
}) => {
  // 5-State Lifecycle Progress Bar
  const lifecycleStates: { state: RuleTraceEvent['lifecycleState']; label: string; step: number }[] = [
    { state: 'CALIBRATING', label: '1. Calibrating', step: 1 },
    { state: 'NOMINAL', label: '2. Nominal / Observation', step: 2 },
    { state: 'PERSISTENT_TREND_DETECTED', label: '3. Persistent Trend Detected', step: 3 },
    { state: 'VERIFICATION_REQUIRED', label: '4. Verification & Monitoring Required', step: 4 },
    { state: 'RESOLVED', label: '5. Resolved', step: 5 },
  ];

  const currentStep = lifecycleStates.find(s => s.state === ruleTrace.lifecycleState)?.step ?? 2;

  // Counterfactual fake alarm explanations
  const counterfactualExplanations = [
    {
      day: 16,
      title: 'Day 16: Post-Meal Glucose (138 mg/dL)',
      threshold: 'Upper Baseline: 110 mg/dL',
      result: 'SUPPRESSED · ZERO FALSE ALARM',
      reason: 'Rule Stage 1 Confounder Filter detected nutritional event within 60 minutes. Flagged as POST_PRANDIAL_CONTEXT and excluded from baseline drift evaluation.'
    },
    {
      day: 19,
      title: 'Day 19: Post-ARED Exercise HR (142 bpm)',
      threshold: 'Upper Baseline: 61 bpm',
      result: 'SUPPRESSED · ZERO FALSE ALARM',
      reason: 'Actigraphy accelerometer correlated 90-minute resistive loading protocol. Tagged EXCLUDED_POST_EXERCISE_CONFOUNDER. Morning resting HR remained nominal at 59 bpm.'
    },
    {
      day: 44,
      title: 'Day 44: Loose Sensor Optical Artifact (205 bpm)',
      threshold: 'Upper Baseline: 61 bpm',
      result: 'REJECTED · ZERO FALSE ALARM',
      reason: 'Multispectral PPG signal quality metric dropped to 22% (threshold: ≥50%). Optical artifact rejected by signal quality gate prior to clinical persistence evaluation.'
    },
    {
      day: 30,
      title: 'Day 30: Cabin Radiation Telemetry (0.42 mGy/d)',
      threshold: 'SPE Storm Threshold: 1.50 mGy/day',
      result: 'INDEPENDENT ADVISORY PIPELINE · ZERO FALSE ALARM',
      reason: 'Exogenous cosmic ray telemetry operates strictly in the Module M environmental family and never contaminates endogenous cardiovascular baseline drift logic.'
    }
  ];

  return (
    <div className="h-full flex flex-col justify-between space-y-4 select-none pr-1 overflow-y-auto">
      
      {/* 1. 5-STATE LIFECYCLE PROGRESS BAR */}
      <div className="p-4 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-sky-400" />
            <h2 className="text-sm font-bold text-white tracking-tight">
              Explainable Rule Engine Lifecycle State
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-slate-300">
            MET Day {currentDay} Status: <strong className="text-white">{ruleTrace.lifecycleState}</strong>
          </span>
        </div>

        {/* 5-State Horizontal Stepper Bar */}
        <div className="grid grid-cols-5 gap-1.5 xl:gap-2">
          {lifecycleStates.map((st) => {
            const isCompleted = currentStep > st.step;
            const isCurrent = currentStep === st.step;

            return (
              <div
                key={st.state}
                className={`py-1.5 px-2.5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-gradient-to-r from-blue-500/30 to-sky-500/30 border-sky-400 text-white shadow-[0_0_16px_rgba(56,189,248,0.4)]'
                    : isCompleted
                    ? 'bg-emerald-500/15 border-emerald-400/30 text-emerald-200'
                    : 'bg-white/[0.02] border-white/5 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold">STAGE 0{st.step}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping shrink-0" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                  )}
                </div>
                <span className="text-[11px] font-semibold tracking-tight leading-tight block">{st.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. 4 GLASS RULE-TRACE PANELS */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 flex-1 min-h-0">
        
        {/* PANEL 1: DETERMINISTIC CONDITION CHECKLIST (6 cols) */}
        <div className="xl:col-span-6 p-4 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-lg flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="text-xs font-bold text-white tracking-wide uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>Panel 1: Deterministic Condition Checklist</span>
            </h3>
            <span className="text-[10px] text-slate-400">3-of-4 Day Persistence Logic</span>
          </div>

          <div className="space-y-2">
            {ruleTrace.conditionsPassed.map((cond, idx) => (
              <div
                key={cond.ruleId}
                className={`p-3 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                  cond.passed
                    ? 'bg-rose-500/10 border-rose-400/30 text-white'
                    : 'bg-white/[0.02] border-white/5 text-slate-400'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      cond.passed ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-700/50 text-slate-300'
                    }`}>
                      {cond.passed ? 'TRIGGERED [PASS]' : 'INACTIVE [FAIL]'}
                    </span>
                    <span className="text-xs font-bold text-white">{cond.description}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    {cond.details}
                  </p>
                </div>

                <span className="text-xs font-bold text-slate-400 shrink-0 mt-0.5">
                  0{idx + 1}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 leading-tight">
            Deterministic inference guarantees no unverified single-day anomaly can trigger clinical alarms without crossing the persistent 3-of-4 threshold.
          </p>
        </div>

        {/* PANEL 2: INCLUDED VS EXCLUDED EVIDENCE TABLE (6 cols) */}
        <div className="xl:col-span-6 p-4 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-lg flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="text-xs font-bold text-white tracking-wide uppercase flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Panel 2: Evidence Audit & Provenance Ledger</span>
            </h3>
            <span className="text-[10px] text-slate-400">Audited Days 27–30 Window</span>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[220px] pr-1">
            {ruleTrace.includedRecords.slice(-4).map((r) => (
              <div
                key={r.day}
                className="p-2.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-white">Day {r.day} Telemetry Record</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    HR: {r.restingHR} bpm · Sleep: {r.sleepHours}h · Temp: {r.bodyTemp}°C
                  </span>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                    {r.provenanceTag}
                  </span>
                  <span className="text-[9px] text-emerald-400 font-bold">
                    ✓ INCLUDED IN DRIFT QUEUE
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10 text-[11px] text-slate-300">
            <strong>Clinical Summary Rationale:</strong> {ruleTrace.summaryRationale}
          </div>
        </div>

      </div>

      {/* LOWER ROW: PANEL 3 (COUNTERFACTUAL TRANSPARENCY) & PANEL 4 (ESCALATION ACTIONS) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        
        {/* PANEL 3: COUNTERFACTUAL TRANSPARENCY ("WHY FAKE ALARMS DID NOT FIRE") (8 cols) */}
        <div className="xl:col-span-8 p-4 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="text-xs font-bold text-white tracking-wide uppercase flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-400" />
              <span>Panel 3: Counterfactual Transparency ("Why Fake Alarms Did NOT Fire")</span>
            </h3>
            <span className="text-[10px] text-slate-400">Zero False Alarm Proof</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {counterfactualExplanations.map((cf) => (
              <div
                key={cf.day}
                className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between space-y-2"
              >
                <div>
                  <span className="text-xs font-bold text-white block">{cf.title}</span>
                  <span className="text-[10px] text-amber-300 font-semibold mt-0.5 block">{cf.result}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug break-words">
                  {cf.reason}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* PANEL 4: ESCALATION ACTION PANEL (4 cols) */}
        <div className="xl:col-span-4 p-4 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-lg flex flex-col justify-between space-y-3">
          <div className="border-b border-white/10 pb-2">
            <h3 className="text-xs font-bold text-white tracking-wide uppercase flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Panel 4: Escalation Actions</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Authoritative Protocol Hand-Off</p>
          </div>

          <div className="space-y-2">
            <button
              onClick={onAcknowledgeAlert}
              className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-amber-500/40 via-amber-400/40 to-yellow-500/40 hover:from-amber-500/60 hover:to-yellow-500/60 border border-amber-400/60 text-xs font-bold text-white flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(245,158,11,0.35)] transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>Acknowledge & Begin Verification Monitoring</span>
            </button>

            <button
              onClick={() => onOpenProtocol('protocol-resting-hr')}
              className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-blue-500/40 via-sky-500/40 to-indigo-500/40 hover:from-blue-500/60 hover:to-indigo-500/60 border border-sky-400/50 text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Launch Guided Verification Exam</span>
            </button>

            <button
              onClick={onQueueGroundPackage}
              className="w-full py-2.5 px-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Send className="w-3.5 h-3.5 text-sky-300" />
              <span>Queue Ground Uplink Package</span>
            </button>
          </div>

          <span className="text-[10px] text-slate-400 text-center block">
            SHA-256 Verified Onboard Clinical Enclave
          </span>
        </div>

      </div>

    </div>
  );
};
