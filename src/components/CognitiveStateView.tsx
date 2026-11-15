// src/components/CognitiveStateView.tsx
// Modules D, L, A, P: Interactive Step-by-Step Self-Exam Wizard, SANS 10x10 Amsler Lab & Behavioral Privacy Mask
// 100% Apple VisionOS Dark Frosted Glass with Complete Verification Hand-off

import React, { useState } from 'react';
import { 
  Brain, 
  Eye, 
  Volume2, 
  CheckCircle2, 
  RotateCcw, 
  Lock, 
  Unlock, 
  Upload, 
  Play, 
  Check,
  ShieldCheck,
  Layers
} from 'lucide-react';
import type { DayRecord } from '../types/mission';
import { useMissionContext } from '../context/MissionContext';
import { Anatomy3DExplorer } from './Anatomy3DExplorer';

interface Props {
  currentDay: number;
  record: DayRecord;
  onUpdateRecord: (updatedRecord: DayRecord) => void;
  onResolveAlert?: (val?: number, protoName?: string) => void;
  onOpenProtocol?: (protocolId: string) => void;
  onOpenCitations?: (resourceId?: string) => void;
}

export const CognitiveStateView: React.FC<Props> = ({
  currentDay,
  record,
  onUpdateRecord,
  onResolveAlert,
  onOpenProtocol,
  onOpenCitations
}) => {
  // Sub-tab selection: SANS Eye Lab vs Step-by-Step Exam vs Behavioral & Journal vs 3D Anatomy
  const [activeSubTab, setActiveSubTab] = useState<'sans' | 'selfExam' | 'behavioral' | '3dAnatomy'>('sans');

  // MODULE L: SANS 10x10 Amsler Grid State
  const [activeEye, setActiveEye] = useState<'OD' | 'OS'>('OD');
  const [distortedCells, setDistortedCells] = useState<Set<string>>(new Set());
  const [nearAcuity, setNearAcuity] = useState<string>('20/20');
  const [sansSaved, setSansSaved] = useState(false);
  const [octUploaded, setOctUploaded] = useState(false);

  // MODULE D: Step-by-Step Guided Self-Exam Wizard States
  const [selectedExamProtocol, setSelectedExamProtocol] = useState<'hr' | 'bp' | 'glucose' | 'temp' | 'sleep'>('hr');
  const [stepChecklist, setStepChecklist] = useState<Record<number, boolean>>({ 1: true, 2: false, 3: false });
  const [verificationInput, setVerificationInput] = useState('58');
  const [isResolved, setIsResolved] = useState(currentDay >= 31 && currentDay <= 34);

  // MODULE A & P: Behavioral Check-In & Private Crew Journal
  const [moodVal, setMoodVal] = useState<number>(record.mood);
  const [stressVal, setStressVal] = useState<number>(currentDay >= 27 && currentDay <= 30 ? 4 : 2);
  const [workloadVal, setWorkloadVal] = useState<number>(currentDay >= 27 && currentDay <= 30 ? 4 : 2);
  const { privacyMaskConsent, setPrivacyMaskConsent } = useMissionContext();
  const [crewJournal, setCrewJournal] = useState<string>(
    'Heavy physical workload during bilateral EVA preparations. High fatigue noted at bed hour. Mild cephalic fullness on wake up.'
  );
  const isPrivacyMaskActive = !privacyMaskConsent;
  const [journalSaved, setJournalSaved] = useState(false);

  // SANS Amsler Grid Cell Click
  const handleAmslerCellClick = (r: number, c: number) => {
    const key = `${activeEye}-${r}-${c}`;
    setDistortedCells(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleMarkNormalGrid = () => {
    setDistortedCells(new Set());
    setSansSaved(true);
    setTimeout(() => setSansSaved(false), 2500);
  };

  // Text-to-speech voice read-aloud for self-exam steps
  const speakExamSteps = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.0;
    window.speechSynthesis.speak(u);
  };

  const examProtocols = {
    hr: {
      title: 'Resting Heart Rate Calibration Protocol',
      steps: [
        'Sit completely upright or supine in Crew Quarters sleep station for 5 minutes of quiet rest.',
        'Ensure optical PPG actigraphy band is positioned 2 finger-widths proximal to ulnar styloid.',
        'Initiate 60-second resting optical capture window and verify stable baseline waveform.'
      ],
      defaultVal: '58 bpm'
    },
    bp: {
      title: 'Brachial Hemodynamic Oscillometric Protocol',
      steps: [
        'Secure brachial cuff over left upper arm at heart level without clothing constriction.',
        'Initiate automatic inflation cycle; maintain silence and avoid isometric arm flexion.',
        'Confirm systolic / diastolic detection and verify lack of arrhythmia flag.'
      ],
      defaultVal: '116/75 mmHg'
    },
    glucose: {
      title: 'Capillary / Sensor Interstitial Glucose Check',
      steps: [
        'Cleanse skin site with 70% isopropanol wipe and allow 30 seconds for complete drying.',
        'Deploy micro-lancet capillary sampler or inspect continuous glucose monitor sensor pod.',
        'Log reading and ensure fasting vs post-prandial tag is properly annotated.'
      ],
      defaultVal: '92 mg/dL'
    },
    temp: {
      title: 'Tympanic Core Temperature Protocol',
      steps: [
        'Attach fresh disposable sanitary probe tip to infrared tympanic thermometer.',
        'Gently retract pinna posterior-superiorly to straighten acoustic auditory canal.',
        'Press measurement trigger and record peak core temperature in degrees Celsius.'
      ],
      defaultVal: '36.6 °C'
    },
    sleep: {
      title: 'Sleep Architecture & Circadian Alignment Check',
      steps: [
        'Review wrist actigraphy polysomnography sleep efficiency and REM/NREM distribution.',
        'Evaluate sleep environment acoustic noise and cabin CDRA scrubber vibration levels.',
        'Log subjective sleep quality rating (1–5) and schedule circadian light reset if necessary.'
      ],
      defaultVal: '7.5 hours'
    }
  };

  const currentProto = examProtocols[selectedExamProtocol];

  const handleCompleteVerification = () => {
    setIsResolved(true);
    const num = parseFloat(verificationInput);
    onResolveAlert?.(isNaN(num) ? undefined : num, currentProto.title);
    onUpdateRecord({
      ...record,
      notes: `${record.notes} [Guided Verification Completed: ${currentProto.title} verified at ${verificationInput}].`,
      provenanceTag: '[MANUAL CREW ENTRY]'
    });
  };

  const handleSaveJournal = () => {
    onUpdateRecord({
      ...record,
      mood: moodVal as any,
      notes: isPrivacyMaskActive ? '[REDACTED — PROTECTED CREW ENCLAVE]' : crewJournal
    });
    setJournalSaved(true);
    setTimeout(() => setJournalSaved(false), 2500);
  };

  return (
    <div className="h-full flex flex-col justify-between space-y-3.5 select-none pr-1 overflow-y-auto">
      
      {/* 1. VIEW HEADER & SUB-TABS */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Brain className="w-5 h-5 text-sky-400" />
            <span>Cognitive State, SANS Visual Lab & Self-Exam (Modules D, L, P)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Spaceflight-Associated Neuro-ocular Syndrome (SANS) · Guided Self-Exam Wizard · Role-Based Behavioral Privacy
          </p>
        </div>

        {/* 3 Sub-View Selector Pills */}
        <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveSubTab('sans')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'sans'
                ? 'bg-gradient-to-r from-blue-500/30 to-sky-500/30 text-white border border-sky-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            SANS Eye Lab
          </button>
          <button
            onClick={() => setActiveSubTab('selfExam')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'selfExam'
                ? 'bg-gradient-to-r from-blue-500/30 to-sky-500/30 text-white border border-sky-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Self-Exam Wizard
          </button>
          <button
            onClick={() => setActiveSubTab('behavioral')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'behavioral'
                ? 'bg-gradient-to-r from-blue-500/30 to-sky-500/30 text-white border border-sky-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Behavioral Check-In
          </button>
          <button
            onClick={() => setActiveSubTab('3dAnatomy')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeSubTab === '3dAnatomy'
                ? 'bg-gradient-to-r from-blue-500/30 to-sky-500/30 text-white border border-sky-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>3D Anatomy & Hazards</span>
          </button>
        </div>
      </div>

      {/* 2. SUB-VIEW 1: MODULE L SANS DIGITAL AMSLER GRID LAB */}
      {activeSubTab === 'sans' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 flex-1 min-h-0">
          
          {/* Left: 10x10 Digital Amsler Grid (6 cols) */}
          <div className="xl:col-span-6 p-5 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-lg flex flex-col justify-between items-center space-y-3">
            <div className="w-full flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-sky-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Interactive 10x10 Digital Amsler Grid
                </h3>
              </div>

              {/* Eye Switcher */}
              <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-0.5 text-xs">
                <button
                  onClick={() => setActiveEye('OD')}
                  className={`px-2.5 py-0.5 rounded-lg transition-all ${
                    activeEye === 'OD' ? 'bg-sky-500/30 text-sky-200 font-bold border border-sky-400/30' : 'text-slate-400'
                  }`}
                >
                  Right (OD)
                </button>
                <button
                  onClick={() => setActiveEye('OS')}
                  className={`px-2.5 py-0.5 rounded-lg transition-all ${
                    activeEye === 'OS' ? 'bg-sky-500/30 text-sky-200 font-bold border border-sky-400/30' : 'text-slate-400'
                  }`}
                >
                  Left (OS)
                </button>
              </div>
            </div>

            {/* 10x10 Grid Canvas */}
            <div className="p-2 rounded-2xl bg-black border-2 border-white/40 shadow-2xl">
              <div className="grid grid-cols-10 grid-rows-10 gap-[1px] w-[260px] h-[260px] bg-white/20">
                {Array.from({ length: 100 }).map((_, i) => {
                  const r = Math.floor(i / 10);
                  const c = i % 10;
                  const key = `${activeEye}-${r}-${c}`;
                  const isDistorted = distortedCells.has(key);

                  return (
                    <div
                      key={i}
                      onClick={() => handleAmslerCellClick(r, c)}
                      className={`w-full h-full relative cursor-pointer transition-colors ${
                        isDistorted ? 'bg-rose-500/80 shadow-[0_0_6px_#f43f5e]' : 'bg-black hover:bg-slate-800'
                      }`}
                    >
                      {/* Fixation White Center Dot */}
                      {r === 4 && c === 4 && (
                        <div className="absolute right-[-4px] bottom-[-4px] w-2.5 h-2.5 rounded-full bg-white z-20 pointer-events-none shadow-[0_0_8px_#ffffff]" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Grid Action Controls */}
            <div className="w-full flex items-center justify-between text-xs">
              <button
                onClick={() => setDistortedCells(new Set())}
                className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Marks</span>
              </button>

              <button
                onClick={handleMarkNormalGrid}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/30 to-teal-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold shadow-sm transition-all active:scale-95"
              >
                {sansSaved ? 'Logged: Zero Metamorphopsia!' : 'Log Normal Grid (Zero Metamorphopsia)'}
              </button>
            </div>
          </div>

          {/* Right: Visual Acuity & OCT Tracker (6 cols) */}
          <div className="xl:col-span-6 p-5 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-lg flex flex-col justify-between space-y-4">
            <div>
              <div className="border-b border-white/10 pb-2 mb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Near Visual Acuity & Fundoscopy Ingest
                </h3>
                <p className="text-[11px] text-slate-400">Monitoring SANS Hyperopic Shifts in Microgravity</p>
              </div>

              {/* Acuity Selector */}
              <div className="space-y-2 mb-4">
                <label className="text-xs text-slate-300 font-medium block">Near-Vision Acuity (35cm Focal Distance)</label>
                <div className="grid grid-cols-4 gap-2">
                  {['20/20', '20/25', '20/30', '20/40'].map((ac) => (
                    <button
                      key={ac}
                      onClick={() => setNearAcuity(ac)}
                      className={`py-2 px-3 rounded-2xl text-xs font-bold transition-all ${
                        nearAcuity === ac
                          ? 'bg-sky-500/30 text-sky-200 border border-sky-400/50 shadow-md'
                          : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {ac}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulated OCT / Fundus Scanner Upload */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col items-center justify-center text-center space-y-2">
                <Upload className="w-6 h-6 text-sky-400" />
                <span className="text-xs font-bold text-white">Spectralis OCT / Fundoscopy Tracker</span>
                <p className="text-[11px] text-slate-400">
                  {octUploaded 
                    ? '✓ High-Resolution Optic Disc Volume Ingested · Zero Papilledema' 
                    : 'Click below to ingest simulated retinal cross-section'}
                </p>
                <button
                  onClick={() => setOctUploaded(true)}
                  className="px-4 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-xs font-semibold text-white transition-all"
                >
                  {octUploaded ? 'OCT Telemetry Synced' : 'Simulate OCT Retinal Scan Ingest'}
                </button>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 text-xs text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>SANS Protocol Verified: Central foveal thickness is nominal with zero choroidal folds.</span>
            </div>
          </div>

        </div>
      )}

      {/* 3. SUB-VIEW 2: MODULE D INTERACTIVE STEP-BY-STEP SELF-EXAM WIZARD */}
      {activeSubTab === 'selfExam' && (
        <div className="p-5 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-lg flex-1 min-h-0 flex flex-col justify-between space-y-4">
          
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <Play className="w-4 h-4 text-sky-400 fill-sky-400" />
                  <span>Module D: Interactive Step-by-Step Self-Exam Wizard</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Guided verification protocol for resolving subclinical drift and sensor faults
                </p>
              </div>

              {/* Voice Read-Aloud Button */}
              <button
                onClick={() => speakExamSteps(`Procedure: ${currentProto.title}. Step 1: ${currentProto.steps[0]}. Step 2: ${currentProto.steps[1]}. Step 3: ${currentProto.steps[2]}.`)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-xs font-semibold text-sky-200 transition-all shadow-sm active:scale-95"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Speak Steps (Voice)</span>
              </button>
            </div>

            {/* Protocol Tabs */}
            <div className="flex items-center gap-2 mb-4">
              {[
                { id: 'hr' as const, label: 'Resting HR Check' },
                { id: 'bp' as const, label: 'Brachial BP Cuff' },
                { id: 'glucose' as const, label: 'Capillary Glucose' },
                { id: 'temp' as const, label: 'Tympanic Temp' },
                { id: 'sleep' as const, label: 'Sleep & Circadian' },
              ].map((proto) => (
                <button
                  key={proto.id}
                  onClick={() => setSelectedExamProtocol(proto.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedExamProtocol === proto.id
                      ? 'bg-gradient-to-r from-blue-500/30 to-sky-500/30 border border-sky-400 text-white shadow-sm'
                      : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {proto.label}
                </button>
              ))}
            </div>

            {/* 3 Step Checkboxes */}
            <div className="space-y-3">
              {currentProto.steps.map((st, idx) => {
                const stepNum = idx + 1;
                const isChecked = !!stepChecklist[stepNum];

                return (
                  <div
                    key={idx}
                    onClick={() => setStepChecklist(prev => ({ ...prev, [stepNum]: !prev[stepNum] }))}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isChecked
                        ? 'bg-emerald-500/15 border-emerald-400/30 text-white'
                        : 'bg-white/[0.02] border-white/5 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isChecked ? 'bg-emerald-500 text-slate-950' : 'bg-white/10 text-slate-400'
                      }`}>
                        {isChecked ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : `0${stepNum}`}
                      </div>
                      <span className="text-xs leading-relaxed">{st}</span>
                    </div>

                    <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                      {isChecked ? 'Completed' : 'Click to Verify'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Verification Value Input & Complete Resolution Button */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div>
                <span className="text-[11px] text-slate-400 block leading-tight">Verification Measurement Result</span>
                <input
                  type="text"
                  value={verificationInput}
                  onChange={(e) => setVerificationInput(e.target.value)}
                  className="px-3 py-1 mt-1 rounded-xl bg-slate-900 border border-white/20 text-white text-xs font-bold w-36 focus:outline-none focus:border-sky-400"
                  placeholder="e.g. 58 bpm"
                />
              </div>
            </div>

            <button
              onClick={handleCompleteVerification}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center gap-2 transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isResolved ? 'Alert Verified & Resolved (Day 34)' : 'Complete Verification & Resolve Alert'}</span>
            </button>
          </div>

        </div>
      )}

      {/* 4. SUB-VIEW 3: MODULE A & P BEHAVIORAL CHECK-IN & PRIVATE CREW JOURNAL */}
      {activeSubTab === 'behavioral' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 flex-1 min-h-0">
          
          {/* Left: Mood, Stress & Workload Sliders (6 cols) */}
          <div className="xl:col-span-6 p-5 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-lg flex flex-col justify-between space-y-4">
            <div>
              <div className="border-b border-white/10 pb-2 mb-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Behavioral Health & Neurocognitive Readiness
                </h3>
                <p className="text-[11px] text-slate-400">NASA Behavioral Health & Performance (BHP) Protocol</p>
              </div>

              {/* Mood Slider */}
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Mood Valence</span>
                  <span className="font-bold text-sky-400">{moodVal} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={moodVal}
                  onChange={(e) => setMoodVal(Number(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
              </div>

              {/* Stress Slider */}
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Autonomic Stress Index</span>
                  <span className="font-bold text-amber-400">{stressVal} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={stressVal}
                  onChange={(e) => setStressVal(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Workload Slider */}
              <div className="space-y-1.5 mb-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Operational Workload Intensity</span>
                  <span className="font-bold text-indigo-400">{workloadVal} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={workloadVal}
                  onChange={(e) => setWorkloadVal(Number(e.target.value))}
                  className="w-full accent-indigo-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-[11px] text-slate-400">
              Correlated with MET Day {currentDay} actigraphy rest intervals.
            </div>
          </div>

          {/* Right: Private Crew Journal with Role-Based Privacy Mask (6 cols) */}
          <div className="xl:col-span-6 p-5 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-lg flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Module P: Protected Crew Psychological Enclave
                  </h3>
                  <span className="text-[10px] text-slate-400">Role-Based Confidentiality Guarantee</span>
                </div>

                {/* Privacy Mask Toggle Button */}
                <button
                  onClick={() => setPrivacyMaskConsent(!privacyMaskConsent)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    isPrivacyMaskActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-sm'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-400/40'
                  }`}
                  title="Toggle Role-Based Redaction Mask"
                >
                  {isPrivacyMaskActive ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>{isPrivacyMaskActive ? 'Privacy Mask: ACTIVE' : 'Privacy Mask: UNMASKED'}</span>
                </button>
              </div>

              {/* Journal Text Area */}
              <div className="relative">
                <textarea
                  value={isPrivacyMaskActive ? '[REDACTED — CREW PRIVATE ENCLAVE]\n\nClinical notes and psychological observations encrypted under Astronaut Private Key. Ground Surgeon receives only aggregated stress indices without personal text disclosure.' : crewJournal}
                  onChange={(e) => !isPrivacyMaskActive && setCrewJournal(e.target.value)}
                  readOnly={isPrivacyMaskActive}
                  rows={6}
                  className={`w-full p-3 rounded-2xl border text-xs leading-relaxed resize-none focus:outline-none transition-colors ${
                    isPrivacyMaskActive
                      ? 'bg-black/60 border-emerald-500/30 text-emerald-300/80 cursor-not-allowed'
                      : 'bg-black/40 border-white/20 text-white focus:border-sky-400'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-slate-400">
                Guaranteed Astronaut Trust Charter Compliance
              </span>

              <button
                onClick={handleSaveJournal}
                className="px-5 py-2 rounded-2xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-xs font-semibold text-white transition-all active:scale-95"
              >
                {journalSaved ? 'Journal Encrypted & Saved' : 'Save Behavioral Entry'}
              </button>
            </div>
          </div>

        </div>
      )}

      {/* 5. SUB-VIEW 4: MODULE E & F 3D HOLOGRAPHIC ANATOMY & HAZARDS EXPLORER */}
      {activeSubTab === '3dAnatomy' && (
        <div className="flex-1 min-h-[460px] flex flex-col overflow-hidden">
          <Anatomy3DExplorer
            currentDay={currentDay}
            onOpenProtocol={onOpenProtocol || (() => {})}
            onOpenCitations={onOpenCitations || (() => {})}
          />
        </div>
      )}

    </div>
  );
};
