// src/components/SelfAssessmentModal.tsx
// Module D & L: In-Flight Self-Assessment & Examination Guide (5 Blueprint Protocols)
// 100% Apple VisionOS Dark Frosted Glass with Voice Read-Aloud & Verification Lifecycle Hand-Off

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  RotateCcw,
  Activity,
  Heart,
  Droplet,
  Thermometer,
  Moon,
  Eye,
  SlidersHorizontal,
  Send
} from 'lucide-react';
import type { SANSCheckRecord } from '../types/mission';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialProtocolId?: string;
  currentDay: number;
  onSaveSANSExam?: (record: SANSCheckRecord) => void;
  onResolveAlert?: (verifiedValue?: number, protocolName?: string) => void;
}

interface ProtocolDef {
  id: string;
  title: string;
  shortTitle: string;
  icon: React.FC<any>;
  equipment: string[];
  durationMinutes: number;
  invalidReadingRule: string;
  escalationRule: string;
  measurementUnit: string;
  defaultVerifiedValue: string;
  steps: {
    stepNumber: number;
    title: string;
    instruction: string;
    expectedNormal: string;
  }[];
}

export const BLUEPRINT_5_PROTOCOLS: ProtocolDef[] = [
  {
    id: 'protocol-resting-hr',
    title: 'Resting Heart Rate Verification Check',
    shortTitle: 'Resting HR Check',
    icon: Heart,
    equipment: ['Optical PPG Wristband / Chest Strap', 'Digital Mission Timer', 'Restraint Tether'],
    durationMinutes: 2,
    invalidReadingRule: 'Motion artifact > 30% or reading within 60 min of vigorous exercise invalidates test.',
    escalationRule: 'If verified resting HR > 65 bpm across 3 consecutive readings, log autonomic fatigue event and alert Flight Surgeon.',
    measurementUnit: 'bpm',
    defaultVerifiedValue: '58',
    steps: [
      {
        stepNumber: 1,
        title: 'Wait & Microgravity Posture',
        instruction: 'Ensure 60m post-exercise/caffeine wait. Assume 5m neutral microgravity posture with limbs loosely free-floating in Crew Berth.',
        expectedNormal: 'Absence of muscular bracing or post-prandial tachycardia.'
      },
      {
        stepNumber: 2,
        title: 'Sensor Waveform Alignment',
        instruction: 'Position optical wrist sensor 2 finger-widths proximal to ulnar styloid. Confirm PPG pulsatile amplitude is crisp and green/infrared ratio is >95%.',
        expectedNormal: 'Clean continuous plethysmographic signal with zero motion dropouts.'
      },
      {
        stepNumber: 3,
        title: '60-Second Timed Capture',
        instruction: 'Initiate 60s radial pulse and sensor cross-check. Remain silent and breathe at regular tidal frequency (12–14 breaths/min).',
        expectedNormal: 'Resting heart rate settles within personal calibrated operating band (55–61 bpm, Median 58).'
      }
    ]
  },
  {
    id: 'protocol-blood-pressure',
    title: 'Brachial Blood Pressure Cuff Protocol',
    shortTitle: 'Brachial BP Cuff',
    icon: Activity,
    equipment: ['Automated Sphygmomanometer Cuff', 'Upper-Arm Restraint Strap', 'Bluetooth Link'],
    durationMinutes: 3,
    invalidReadingRule: 'Cuff slippage or isometric arm flexion causes oscillometric error code E-2.',
    escalationRule: 'Systolic > 140 mmHg or Diastolic > 90 mmHg requires 15-minute quiet rest repeat before ground downlink.',
    measurementUnit: 'mmHg (Systolic)',
    defaultVerifiedValue: '116',
    steps: [
      {
        stepNumber: 1,
        title: '5-Minute Quiet Rest',
        instruction: 'Tether torso loosely in sleep berth. Rest silently for 5 minutes without speaking or typing to normalize sympathetic tone.',
        expectedNormal: 'Calm breathing, no adrenergic excitement.'
      },
      {
        stepNumber: 2,
        title: 'Cuff Placement at Heart Level',
        instruction: 'Wrap automated cuff snugly over bare left upper arm, 2 cm above antecubital fossa. Rest arm across chest at right-atrium heart level.',
        expectedNormal: 'Cuff index marker falls within normal arm circumference range.'
      },
      {
        stepNumber: 3,
        title: 'Silent Measurement & Repeat',
        instruction: 'Press START on automated monitor. Remain still and silent until deflation complete. Wait 2 minutes and repeat for secondary verification.',
        expectedNormal: 'Systolic: 110–125 mmHg, Diastolic: 70–82 mmHg (Personal Median 116/76 mmHg).'
      }
    ]
  },
  {
    id: 'protocol-capillary-glucose',
    title: 'Capillary Blood Glucose Check',
    shortTitle: 'Blood Glucose',
    icon: Droplet,
    equipment: ['POC Glucometer', 'Capillary Test Strip', 'Microgravity Lancet', 'Alcohol Wipe', 'Sharps Container'],
    durationMinutes: 4,
    invalidReadingRule: 'Sweat dilution or insufficient capillary blood drop (<0.6 µL) triggers strip error.',
    escalationRule: 'Fasting glucose > 126 mg/dL on 2 consecutive days triggers metabolic review with Flight Surgeon.',
    measurementUnit: 'mg/dL',
    defaultVerifiedValue: '92',
    steps: [
      {
        stepNumber: 1,
        title: 'Confirm Fasting Status',
        instruction: 'Confirm whether sample is Fasting (>8h since last meal) or Post-Meal. Tag measurement accordingly in Mission Pulse.',
        expectedNormal: 'Fasting baseline expectation: 86–98 mg/dL; post-prandial excursion < 140 mg/dL.'
      },
      {
        stepNumber: 2,
        title: 'Aseptic Preparation & Puncture',
        instruction: 'Clean lateral fingertip with 70% isopropanol wipe and allow to dry completely. Prime microgravity safety lancet.',
        expectedNormal: 'Clean dry skin barrier to prevent blood drop dispersal into cabin atmosphere.'
      },
      {
        stepNumber: 3,
        title: 'Sample Application & Sharps Containment',
        instruction: 'Apply small capillary blood drop to test strip channel. Immediately insert spent lancet into sealed microgravity sharps container.',
        expectedNormal: '5-second meter countdown displaying clean numeric blood glucose reading.'
      }
    ]
  },
  {
    id: 'protocol-body-temp',
    title: 'Body Temperature Verification',
    shortTitle: 'Tympanic Temp',
    icon: Thermometer,
    equipment: ['Digital Tympanic Thermometer', 'Single-Use Probe Cover', 'Antiseptic Wipe'],
    durationMinutes: 2,
    invalidReadingRule: 'Ear canal moisture or probe misalignment with tympanic membrane gives falsely low reading.',
    escalationRule: 'Core body temperature > 37.8 °C indicates active systemic inflammation or cabin heat storage overload.',
    measurementUnit: '°C',
    defaultVerifiedValue: '36.8',
    steps: [
      {
        stepNumber: 1,
        title: 'Fluid & Thermal Wait Period',
        instruction: 'Avoid drinking hot or cold fluids or wearing tight headgear for 20 minutes prior to measurement.',
        expectedNormal: 'Stable thermal equilibrium between oral cavity, ear canal, and core vascular bed.'
      },
      {
        stepNumber: 2,
        title: 'Aseptic Probe Attachment',
        instruction: 'Snap fresh disposable probe cover onto tympanic thermometer. Verify optical lens detector is clean and scratch-free.',
        expectedNormal: 'Audible click confirming cover is locked in place.'
      },
      {
        stepNumber: 3,
        title: 'Tympanic Canal Seal & Capture',
        instruction: 'Gently pull pinna posteriorly and seat probe tip securely into external auditory canal aiming toward opposite eye. Press ACTIVATION button until tone.',
        expectedNormal: 'Reading within personal baseline band (36.6–37.0 °C, Median 36.8 °C).'
      }
    ]
  },
  {
    id: 'protocol-sleep-mood',
    title: 'Structured Sleep & Mood Check-In',
    shortTitle: 'Sleep & Mood',
    icon: Moon,
    equipment: ['MISSION PULSE Private Tablet Enclave', 'Actigraphy Wristband Sync'],
    durationMinutes: 3,
    invalidReadingRule: 'Logging > 2 hours post-awakening introduces memory decay in subjective sleep continuity scoring.',
    escalationRule: 'Sleep < 5.5 hours for ≥ 3 consecutive cycles or Mood Resilience ≤ 2 triggers protected sleep window protocol.',
    measurementUnit: 'hrs (Sleep Duration)',
    defaultVerifiedValue: '7.8',
    steps: [
      {
        stepNumber: 1,
        title: 'Wakeup Window Ingest',
        instruction: 'Complete check-in within 30 minutes of final waking before operational task list begins.',
        expectedNormal: 'Accurate recall of nocturnal awakenings, dreams, and sleep inertia duration.'
      },
      {
        stepNumber: 2,
        title: 'Cabin Disruption Audit',
        instruction: 'Rate sleep continuity, berth ventilation acoustic hum, and unexpected light flashes from cosmic radiation GCR Cherenkov effect.',
        expectedNormal: 'Sleep continuity rated good or optimal; environmental disruptions documented.'
      },
      {
        stepNumber: 3,
        title: 'Honest Mood & Resilience Scale',
        instruction: 'Complete 5-point non-punitive visual mood, workload stress, and physical fatigue scales. Raw responses encrypted in crew private enclave.',
        expectedNormal: 'Honest reporting without fear of flight status grounding (protected by Module P charter).'
      }
    ]
  },
  {
    id: 'protocol-sans-amsler',
    title: 'Neuro-Ocular (SANS) Visual Check-In Protocol',
    shortTitle: 'SANS Eye Check',
    icon: Eye,
    equipment: ['Digital 10x10 Amsler Grid', 'Near-Vision Reading Card', 'Pupillometer'],
    durationMinutes: 3,
    invalidReadingRule: 'Visual fatigue or bright cabin glare within 15 min invalidates test.',
    escalationRule: 'Metamorphopsia in >2 grid cells or hyperopic shift >0.75 D requires urgent OCT imaging and Flight Surgeon review.',
    measurementUnit: 'Visual Acuity',
    defaultVerifiedValue: '20/20 (Zero Distortion)',
    steps: [
      {
        stepNumber: 1,
        title: 'Monocular Occlusion & Fixation',
        instruction: 'Occlude left eye (OS) loosely without direct globe compression. Hold tablet at 50 cm distance and fixate gaze strictly on central black dot.',
        expectedNormal: 'All grid lines appear perfectly straight and parallel with zero wavy metamorphopsia.'
      },
      {
        stepNumber: 2,
        title: 'Amsler Distortion & Scotoma Scan',
        instruction: 'Scan the 10x10 grid perimeter for any missing grid intersections (scotomas), wavy lines, or gray patches. Switch to left eye and repeat.',
        expectedNormal: 'Clean 10x10 grid integrity in both eyes with zero visual field dropouts.'
      },
      {
        stepNumber: 3,
        title: 'Near-Vision Acuity Card & Headache Check',
        instruction: 'Read standard near-vision test line (20/20 to 20/40) under uniform berth illumination. Log any new reliance on plus-power reading glasses or morning headaches.',
        expectedNormal: 'Stable 20/20 near acuity; absence of hyperopic shift or retro-orbital globe fullness.'
      }
    ]
  }
];

export const SelfAssessmentModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialProtocolId = 'protocol-resting-hr',
  currentDay,
  onResolveAlert
}) => {
  const [selectedProtocolId, setSelectedProtocolId] = useState<string>(initialProtocolId);
  const [stepChecklist, setStepChecklist] = useState<Record<number, boolean>>({ 1: true, 2: false, 3: false });
  const [verifiedValue, setVerifiedValue] = useState<string>('58');
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Sync initial protocol
  useEffect(() => {
    if (initialProtocolId) {
      const match = BLUEPRINT_5_PROTOCOLS.find(p => p.id === initialProtocolId);
      if (match) {
        setSelectedProtocolId(match.id);
        setVerifiedValue(match.defaultVerifiedValue);
      }
    }
  }, [initialProtocolId]);

  if (!isOpen) return null;

  const currentProtocol = BLUEPRINT_5_PROTOCOLS.find(p => p.id === selectedProtocolId) || BLUEPRINT_5_PROTOCOLS[0];
  const ProtocolIcon = currentProtocol.icon;

  const handleSelectProtocol = (proto: ProtocolDef) => {
    setSelectedProtocolId(proto.id);
    setVerifiedValue(proto.defaultVerifiedValue);
    setStepChecklist({ 1: true, 2: false, 3: false });
    window.speechSynthesis?.cancel();
    setIsVoiceSpeaking(false);
  };

  const toggleStep = (stepNumber: number) => {
    setStepChecklist(prev => ({
      ...prev,
      [stepNumber]: !prev[stepNumber]
    }));
  };

  // Text-to-speech voice read-aloud
  const handleReadAloud = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isVoiceSpeaking) {
      window.speechSynthesis.cancel();
      setIsVoiceSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const script = `${currentProtocol.title}. Duration: ${currentProtocol.durationMinutes} minutes. ` +
      currentProtocol.steps.map(s => `Step ${s.stepNumber}: ${s.title}. ${s.instruction}`).join(' ');

    const utterance = new SpeechSynthesisUtterance(script);
    utterance.rate = 1.0;
    utterance.onend = () => setIsVoiceSpeaking(false);
    utterance.onerror = () => setIsVoiceSpeaking(false);

    setIsVoiceSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleCompleteVerification = () => {
    setIsCompleted(true);
    const numVal = parseFloat(verifiedValue);
    onResolveAlert?.(isNaN(numVal) ? undefined : numVal, currentProtocol.title);
    setTimeout(() => {
      setIsCompleted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-[#0A0F1D]/95 backdrop-blur-3xl border border-white/20 shadow-[0_24px_64px_rgba(0,0,0,0.85)] overflow-hidden text-slate-100">
        
        {/* 1. MODAL TOP HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500/30 to-sky-500/30 border border-sky-400/40 flex items-center justify-center text-sky-300 shadow-md">
              <ProtocolIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Guided In-Flight Self-Assessment & Examination Wizard
                </h2>
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  Module D · NASA Blueprint
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                5 Standardized Aerospace Physiological Protocols with Voice Guidance & Verification Hand-Off
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              window.speechSynthesis?.cancel();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. 5-PROTOCOL HORIZONTAL SELECTOR PILLS */}
        <div className="px-6 py-2.5 bg-black/40 border-b border-white/5 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {BLUEPRINT_5_PROTOCOLS.map((proto) => {
            const isSelected = selectedProtocolId === proto.id;
            const Icon = proto.icon;
            return (
              <button
                key={proto.id}
                onClick={() => handleSelectProtocol(proto)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-500/30 to-sky-500/30 border border-sky-400 text-white shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-sky-300' : 'text-slate-400'}`} />
                <span>{proto.shortTitle}</span>
              </button>
            );
          })}
        </div>

        {/* 3. PROTOCOL CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* Protocol Info Banner */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">{currentProtocol.title}</h3>
                <span className="text-[10px] font-semibold text-sky-300 px-2 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/30">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {currentProtocol.durationMinutes} min
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {currentProtocol.equipment.map((eq, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-lg bg-black/40 border border-white/10 text-[10px] text-slate-300">
                    🛠 {eq}
                  </span>
                ))}
              </div>
            </div>

            {/* Read Instructions Aloud Button */}
            <button
              onClick={handleReadAloud}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all shrink-0 ${
                isVoiceSpeaking
                  ? 'bg-rose-500/20 text-rose-300 border-rose-400/50 animate-pulse'
                  : 'bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 border-sky-400/40 shadow-sm'
              }`}
            >
              {isVoiceSpeaking ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-sky-300" />}
              <span>{isVoiceSpeaking ? 'Pause Audio' : '🔊 Read Instructions Aloud'}</span>
            </button>
          </div>

          {/* Invalid Reading & Escalation Rules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block mb-1">
                ⚠ Invalid Reading / Technical Filter Rule:
              </span>
              <p className="text-slate-300 text-[11px] leading-snug">
                {currentProtocol.invalidReadingRule}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
              <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider block mb-1">
                🚨 Clinical Escalation Threshold:
              </span>
              <p className="text-slate-300 text-[11px] leading-snug">
                {currentProtocol.escalationRule}
              </p>
            </div>
          </div>

          {/* Step-by-Step Interactive Checkboxes */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Step-by-Step Execution Checklist:
            </span>

            {currentProtocol.steps.map((st) => {
              const isChecked = !!stepChecklist[st.stepNumber];
              return (
                <div
                  key={st.stepNumber}
                  onClick={() => toggleStep(st.stepNumber)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                    isChecked
                      ? 'bg-emerald-500/10 border-emerald-400/40'
                      : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isChecked ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold' : 'border-white/20 bg-white/5'
                  }`}>
                    {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">
                        Step {st.stepNumber}: {st.title}
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        Expected Normal
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {st.instruction}
                    </p>
                    <div className="mt-1.5 text-[11px] text-sky-300 font-medium bg-black/30 px-2.5 py-1 rounded-xl border border-white/5">
                      ✓ Normal Criteria: {st.expectedNormal}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Verification Measurement Input Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-sky-950/40 to-slate-900/60 border border-sky-400/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-sky-400" />
                <span>Verified Measurement Result Entry</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold">
                Writes to MissionContext with [MANUAL CREW ENTRY]
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-[11px] text-slate-400 block mb-1">
                  Enter Observed Telemetry Value ({currentProtocol.measurementUnit}):
                </label>
                <input
                  type="text"
                  value={verifiedValue}
                  onChange={(e) => setVerifiedValue(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/20 text-white text-sm font-bold focus:outline-none focus:border-sky-400"
                  placeholder="e.g. 58"
                />
              </div>

              <div className="self-end pb-0.5">
                <button
                  onClick={handleCompleteVerification}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap"
                >
                  {isCompleted ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Verification Logged Live!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 fill-slate-950" />
                      <span>Complete Verification & Resolve Alert</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Explicit Non-Diagnostic Safety Boundaries Disclaimer */}
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-2.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
            <span>
              <strong>NASA HRP & Blueprint Protocol Notice:</strong> MISSION PULSE is an operational state-awareness prototype. Guided examination wizards establish physiological verification telemetry for ground flight surgeon telemetry review and do not constitute independent medical diagnoses.
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
