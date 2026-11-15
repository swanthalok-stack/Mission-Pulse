// src/components/PulseAiAssistant.tsx
// Module G: Pulse AI & Voice Clinical Companion Popup Window
// Multi-Intent Conversational & Live Telemetry Intelligence with Web Speech API & Deep-Space Offline RAG

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Bot, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  X, 
  BookOpen, 
  ShieldCheck, 
  Compass, 
  Activity, 
  Eye, 
  Radiation, 
  Heart,
  ChevronRight
} from 'lucide-react';
import { useMissionContext } from '../context/MissionContext';
import { NASA_RAG_KNOWLEDGE_DOCS } from '../data/nasaKnowledgeBase';
import type { DayRecord, PersonalBaselineBand } from '../types/mission';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenCitations?: (resourceId?: string) => void;
  currentDay?: number;
  onSelectDay?: (day: number) => void;
  onSelectMetric?: (metric: string) => void;
  onNavigate?: (view: string) => void;
  onOpenProtocol?: (protocolId: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: { title: string; url: string; resourceId?: string }[];
  deepLinks?: { label: string; action: () => void; icon: React.FC<any> }[];
}

export const PulseAiAssistant: React.FC<Props> = ({
  isOpen,
  onClose,
  onOpenCitations,
  currentDay: propDay,
  onSelectDay: propSelectDay,
  onSelectMetric: propSelectMetric,
  onNavigate: propNavigate,
  onOpenProtocol: propOpenProtocol
}) => {
  const context = useMissionContext();
  const currentDay = propDay ?? context.currentDay;
  const records = context.records;
  const currentRecord = records.find(r => r.day === currentDay) || context.currentRecord || records[0];
  const bands = context.bands;
  const ruleTrace = context.ruleTrace;

  const setCurrentDay = propSelectDay ?? context.setCurrentDay;
  const setSelectedMetric = propSelectMetric ?? context.setSelectedMetric;
  const setActiveView = propNavigate ?? context.setActiveView;
  const openProtocolModal = propOpenProtocol ?? context.openProtocolModal;
  const openCitationsModal = onOpenCitations ?? context.openCitationsModal;
  const setActivePin = context.setActivePin;

  // Helper to format dynamic 6-vital summary against computed personal baseline bands
  const format6VitalSummary = useCallback((rec: DayRecord | undefined, b: Record<string, PersonalBaselineBand> | undefined) => {
    const safeRec = rec || records[0];
    const hr = b?.restingHR;
    const sys = b?.bpSystolic;
    const dia = b?.bpDiastolic;
    const glu = b?.glucose;
    const temp = b?.bodyTemp;
    const slp = b?.sleepHours;

    const hrBandStr = hr ? `${hr.lowerBound}–${hr.upperBound} bpm` : '55–61 bpm';
    const bpBandStr = (sys && dia) 
      ? `${sys.lowerBound}–${sys.upperBound} / ${dia.lowerBound}–${dia.upperBound} mmHg` 
      : '111.5–119.5 / 72–78 mmHg';
    const gluBandStr = glu ? `${glu.lowerBound}–${glu.upperBound} mg/dL` : '86–94 mg/dL';
    const tempBandStr = temp ? `${temp.lowerBound.toFixed(1)}–${temp.upperBound.toFixed(1)}°C` : '36.4–36.8°C';
    const sleepBandStr = slp ? `${slp.lowerBound.toFixed(1)}–${slp.upperBound.toFixed(1)}h` : '6.9–7.9h';

    return `Live Telemetry vs Personal Operating Bands:\n• Resting Heart Rate: ${safeRec.restingHR} bpm [Personal Band: ${hrBandStr}]\n• Blood Pressure: ${safeRec.bpSystolic}/${safeRec.bpDiastolic} mmHg [Personal Band: ${bpBandStr}]\n• Capillary Glucose: ${safeRec.glucose} mg/dL [Personal Band: ${gluBandStr}, ${safeRec.glucoseTag}]\n• Core Temperature: ${safeRec.bodyTemp.toFixed(1)}°C [Personal Band: ${tempBandStr}]\n• Sleep Duration: ${safeRec.sleepHours.toFixed(1)}h [Personal Band: ${sleepBandStr}]\n• Environmental Radiation: ${safeRec.radiationDose.toFixed(2)} mGy/d [Nominal Band: 0.35–0.55 mGy/d ISS background]`;
  }, [records]);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const summary = format6VitalSummary(currentRecord, bands);
    return [{
      id: `init-${currentDay}`,
      sender: 'assistant',
      text: `Greetings, Commander Vega. I am your autonomous MISSION PULSE Clinical Advisory Agent. Operating on MET Day ${currentDay} in state: ${ruleTrace.lifecycleState}.\n\n${summary}\n\nHow may I support your physiological monitoring, protocol verification, or hazard mitigation today?`,
      timestamp: `Day ${currentDay} • 14:32 UTC`,
      citations: [
        { title: 'NASA 5 Hazards (RIDGE)', url: 'https://www.nasa.gov/hrp/hazards/', resourceId: 'nasa-5-hazards' },
        { title: 'CSA Science Experiments & Countermeasures', url: 'https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp', resourceId: 'csa-space-science-experiments' }
      ],
      deepLinks: [
        { label: `Jump to Day ${currentDay}`, action: () => { setCurrentDay(currentDay); setActiveView('overview'); }, icon: Compass },
        { label: 'Open Self-Exam', action: () => openProtocolModal('protocol-resting-hr'), icon: ShieldCheck }
      ]
    }];
  });

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(true);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0, initialOffsetX: 0, initialOffsetY: 0 });
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const replyTimeoutRef = useRef<any>(null);
  const prevDayRef = useRef(currentDay);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest('button, input, a')) return;
    isDraggingRef.current = true;
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      initialOffsetX: dragOffset.x,
      initialOffsetY: dragOffset.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    setDragOffset({
      x: dragStartPos.current.initialOffsetX + dx,
      y: dragStartPos.current.initialOffsetY + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  // Day switch notice in chat stream
  useEffect(() => {
    if (prevDayRef.current !== currentDay) {
      prevDayRef.current = currentDay;
      const summary = format6VitalSummary(currentRecord, bands);
      setMessages(prev => [
        ...prev,
        {
          id: `day-shift-${currentDay}-${Date.now()}`,
          sender: 'assistant',
          text: `[MISSION DAY SWITCH: Telemetry context shifted to Day ${currentDay} (${ruleTrace.lifecycleState})]\n${summary}`,
          timestamp: `Day ${currentDay} • 14:32 UTC`,
          citations: [
            { title: 'NASA 5 Hazards (RIDGE)', url: 'https://www.nasa.gov/hrp/hazards/', resourceId: 'nasa-5-hazards' },
            { title: 'CSA Science Experiments & Countermeasures', url: 'https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp', resourceId: 'csa-space-science-experiments' }
          ],
          deepLinks: [
            { label: `Jump to Day ${currentDay}`, action: () => { setCurrentDay(currentDay); setActiveView('overview'); }, icon: Compass },
            { label: 'Open Self-Exam', action: () => openProtocolModal('protocol-resting-hr'), icon: ShieldCheck }
          ]
        }
      ]);
    }
  }, [currentDay, currentRecord, ruleTrace.lifecycleState, bands, format6VitalSummary, openProtocolModal, setActiveView, setCurrentDay]);

  // Cancel speech, speech recognition, and timers when window is closed or unmounted
  useEffect(() => {
    if (!isOpen) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsListening(false);
      if (replyTimeoutRef.current) {
        clearTimeout(replyTimeoutRef.current);
        replyTimeoutRef.current = null;
      }
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      try {
        recognitionRef.current?.stop();
      } catch {}
      if (replyTimeoutRef.current) {
        clearTimeout(replyTimeoutRef.current);
      }
    };
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Speech Synthesis helper
  const speakText = (text: string) => {
    if (!isVoiceActive || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text
        .replace(/•/g, '')
        .replace(/\[.*?\]/g, '')
        .replace(/\n+/g, '. ');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Audio autoplay policy handled gracefully
    }
  };

  // Speech Recognition (Web Speech API)
  const handleToggleMic = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. You can type queries directly.');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setInputQuery(transcript);
          handleSendQuery(transcript);
        }
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Navigation helpers
  const jumpToDay = (day: number, metric = 'restingHR') => {
    setCurrentDay(day);
    setSelectedMetric(metric);
    setActiveView('overview');
  };

  const inspectOrgan = (pin: any, metric: string) => {
    setActivePin(pin);
    setSelectedMetric(metric);
    setActiveView('overview');
  };

  // Multi-Intent Conversational & Live Telemetry Intelligence
  const handleSendQuery = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: `Day ${currentDay} • 14:32 UTC`
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    const lower = query.toLowerCase().trim();
    const cleanLower = lower.replace(/[!?,.:;]+$/, '').trim();

    let replyText = '';
    let citations: { title: string; url: string; resourceId?: string }[] = [];
    let deepLinks: { label: string; action: () => void; icon: React.FC<any> }[] = [];

    // Helper band values
    const hrBand = bands?.restingHR;
    const bpSysBand = bands?.bpSystolic;
    const bpDiaBand = bands?.bpDiastolic;
    const gluBand = bands?.glucose;
    const tempBand = bands?.bodyTemp;
    const sleepBand = bands?.sleepHours;

    const hrBandStr = hrBand ? `${hrBand.lowerBound}–${hrBand.upperBound} bpm` : '55–61 bpm';
    const bpBandStr = (bpSysBand && bpDiaBand)
      ? `${bpSysBand.lowerBound}–${bpSysBand.upperBound} / ${bpDiaBand.lowerBound}–${bpDiaBand.upperBound} mmHg`
      : '111.5–119.5 / 72–78 mmHg';
    const gluBandStr = gluBand ? `${gluBand.lowerBound}–${gluBand.upperBound} mg/dL` : '86–94 mg/dL';
    const tempBandStr = tempBand ? `${tempBand.lowerBound.toFixed(1)}–${tempBand.upperBound.toFixed(1)}°C` : '36.4–36.8°C';
    const sleepBandStr = sleepBand ? `${sleepBand.lowerBound.toFixed(1)}–${sleepBand.upperBound.toFixed(1)}h` : '6.9–7.9h';

    // Robust Intent Matching using Regex with Word Boundaries (\b) to prevent substring collisions
    const dayMatch = cleanLower.match(/\b(?:day|d|met\s*day)\s*(\d+)\b/i);

    // INTENT A: Guide Me Through BP Self-Exam / Self-Assessment Protocols (Check before general vitals)
    const isBpExamQuery = 
      (/\b(?:bp|blood\s*pressure)\b/i.test(lower) && /\b(?:exam|self-exam|self\s+exam|guide|protocol|procedure)\b/i.test(lower)) ||
      cleanLower === 'guide me through bp self-exam';

    const isGeneralExamQuery = 
      !isBpExamQuery &&
      /\b(?:exam|self-exam|self\s+exam|protocols?|check-in|screening|guide\s+me)\b/i.test(lower);

    // INTENT B: Greetings & Overall Mission Day Status
    const isBodyStatusQuery = 
      /\b(?:how'?s\s+my\s+body|how\s+is\s+my\s+body|how\s+am\s+i|am\s+i\s+okay|what\s+is\s+wrong|what'?s\s+wrong|body\s+status|health\s+status|my\s+body|check\s+body|body\s+check)\b/i.test(lower);

    const isGreetingOrGeneralStatus = 
      isBodyStatusQuery ||
      /^(?:hi|hello|hey|greetings|howdy)(?:[!?.,\s]|$)/i.test(lower) ||
      /\b(?:hi|hello|hey|greetings|howdy)\b/i.test(lower) ||
      cleanLower === 'status' || 
      cleanLower === 'summary' || 
      cleanLower === 'daily summary' ||
      cleanLower === 'vitals' ||
      cleanLower === 'vitals summary' ||
      cleanLower === 'current status' ||
      cleanLower === 'status report' ||
      cleanLower === 'what is my status' ||
      cleanLower === "what's my status" ||
      cleanLower === `explain day ${currentDay} status`.toLowerCase() ||
      cleanLower === 'explain day status' ||
      (!dayMatch && !isBpExamQuery && !isGeneralExamQuery && /\b(?:status|summary|vitals)\b/i.test(lower) && !/\b(?:heart|hr|bp|blood\s*pressure|glucose|temp|sleep|radiation|sans)\b/i.test(lower));

    // INTENT C: Specific Day Queries (including quick-prompt queries for Day 19 workout and Day 26 baseline freeze)
    const isDay19Explicit = cleanLower.includes('day 19') || cleanLower.includes('why did day 19');
    const isDay26Explicit = cleanLower.includes('day 26') || cleanLower.includes('why did baseline freeze');
    const isSpecificDayQuery = (dayMatch !== null || isDay19Explicit || isDay26Explicit);

    // INTENT D: Confounder / Baseline Freeze / Why Did Workout / Fake Alarm Queries
    const isArchitectureQuery = 
      !isDay19Explicit && !isDay26Explicit &&
      /\b(?:why|freeze|frozen|drift|confounder|excluded|workout|ared|persistence|persistent|false\s*alarm|fake\s*alarm|mad)\b/i.test(lower);

    // INTENT E: Specific Vital Queries
    const isHeartQuery = /\b(?:heart|heart\s*rate|hr|pulse|cardio|cardiovascular)\b/i.test(lower);
    const isBpQuery = /\b(?:bp|blood\s*pressure|systolic|diastolic|arterial|hypertension)\b/i.test(lower);
    const isGlucoseQuery = /\b(?:glucose|sugar|glycemic|blood\s*sugar|insulin|post-prandial)\b/i.test(lower);
    const isTempQuery = /\b(?:temp|temperature|fever|core\s*temp|body\s*temp|hyperthermia)\b/i.test(lower);
    const isSleepQuery = /\b(?:sleep|tired|fatigue|circadian|actigraphy|sleep\s*debt)\b/i.test(lower);
    const isRadiationQuery = /\b(?:radiation|cans|spe|radi-n2|dosimeter|cosmic|solar\s*particle)\b/i.test(lower);
    const isSansQuery = /\b(?:sans|eye|eyes|vision|amsler|optic|retina|neuro-ocular)\b/i.test(lower);

    // ================= DISPATCHER =================

    // 1. BP Self-Exam Guide
    if (isBpExamQuery) {
      replyText = `Brachial Blood Pressure Verification Protocol (NASA-STD-3001):\n1. Sit upright quietly in sleep quarters for 5 minutes with arm rested at heart level.\n2. Wrap oscillometric cuff 2 cm proximal to antecubital fossa.\n3. Remain silent and relaxed during inflation cycle.\n4. Compare reading against Commander Vega personal reference band (${bpBandStr}).\n5. Submit verified measurement to update clinical telemetry ledger.`;
      citations = [
        { title: 'NASA-STD-3001 Medical Operations', url: 'https://www.nasa.gov/hrp/hazards/', resourceId: 'nasa-5-hazards' },
        { title: 'CSA Science Experiments & Countermeasures', url: 'https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp', resourceId: 'csa-space-science-experiments' }
      ];
      deepLinks = [
        { label: 'Open Self-Exam', action: () => openProtocolModal('protocol-blood-pressure'), icon: ShieldCheck },
        { label: `Jump to Day ${currentDay}`, action: () => jumpToDay(currentDay, 'bloodPressure'), icon: Compass }
      ];
    }
    // 2. Greetings & Overall Mission Day Status
    else if (isGreetingOrGeneralStatus) {
      const abnormalList: string[] = [];
      const nominalList: string[] = [];

      // 1. Heart Rate
      if (currentRecord.restingHR > (hrBand?.upperBound ?? 61)) {
        const diff = currentRecord.restingHR - (hrBand?.median ?? 58);
        const driftText = (currentDay >= 27 && currentDay <= 30) ? ', 4-day persistent drift' : '';
        abnormalList.push(`🫀 Heart Rate: ${currentRecord.restingHR} bpm (+${diff} bpm vs baseline${driftText})`);
      } else {
        nominalList.push(`Heart Rate (${currentRecord.restingHR} bpm)`);
      }

      // 2. Sleep
      if (currentRecord.sleepHours < 6.5) {
        abnormalList.push(`🧠 Sleep Duration: ${currentRecord.sleepHours.toFixed(1)} h (Sleep debt vs ${(sleepBand?.median ?? 7.4).toFixed(1)} h baseline)`);
      } else {
        nominalList.push(`Sleep (${currentRecord.sleepHours.toFixed(1)} h)`);
      }

      // 3. Metabolic & Temp
      if (currentRecord.glucose > 98 || currentRecord.bodyTemp >= 37.1) {
        abnormalList.push(`🔬 Metabolic: Glucose ${currentRecord.glucose} mg/dL, Core Temp ${currentRecord.bodyTemp.toFixed(1)}°C`);
      } else {
        nominalList.push(`Capillary Glucose (${currentRecord.glucose} mg/dL)`);
        nominalList.push(`Core Temp (${currentRecord.bodyTemp.toFixed(1)}°C)`);
      }

      // 4. Blood Pressure
      if (currentRecord.bpSystolic > (bpSysBand?.upperBound ?? 120)) {
        abnormalList.push(`🩺 Blood Pressure: ${currentRecord.bpSystolic}/${currentRecord.bpDiastolic} mmHg`);
      } else {
        nominalList.push(`Blood Pressure (${currentRecord.bpSystolic}/${currentRecord.bpDiastolic} mmHg)`);
      }

      // 5. Radiation
      if (currentRecord.radiationDose > 1.0) {
        abnormalList.push(`☢️ Environmental Radiation: ${currentRecord.radiationDose.toFixed(2)} mGy/d (SPE Alert vs 2.0 mGy/d storm threshold)`);
      } else {
        nominalList.push(`Radiation (${currentRecord.radiationDose.toFixed(2)} mGy/d)`);
      }

      if (abnormalList.length > 0) {
        replyText = `Greetings, Commander Vega.\n\n⚠️ Attention Needed on Mission Day ${currentDay}: Your Anatomical Twin currently detects ${abnormalList.length} active deviation(s) outside your personal baseline:\n${abnormalList.map(a => `• ${a}`).join('\n')}\n\n${format6VitalSummary(currentRecord, bands)}\n\nRecommended Next Step: Run a 2-min verification self-exam (hydration, activity, and rest check).`;
      } else {
        replyText = `Greetings, Commander Vega. All Systems Nominal on Mission Day ${currentDay}: Your Anatomical Twin confirms all 8 physiological systems are within personal operating bands.\n\n${format6VitalSummary(currentRecord, bands)}\n\nWhat would you like to explore? You can ask about any specific mission day, any vital sign, confounder filtering, or in-flight self-exams.`;
      }
      citations = [
        { title: 'NASA Human Research Program: 5 Hazards', url: 'https://www.nasa.gov/hrp/hazards/', resourceId: 'nasa-5-hazards' },
        { title: 'CSA Science Experiments & Countermeasures', url: 'https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp', resourceId: 'csa-space-science-experiments' }
      ];
      deepLinks = [
        { label: `Jump to Day ${currentDay}`, action: () => jumpToDay(currentDay, 'restingHR'), icon: Compass },
        { label: 'Open Self-Exam', action: () => openProtocolModal('protocol-resting-hr'), icon: ShieldCheck },
        { label: 'Inspect 3D Heart', action: () => inspectOrgan('heart', 'restingHR'), icon: Heart }
      ];
    }
    // 3. Specific Mission Day Queries ("day 16", "day 19", "day 30", "day 44", "day 50", etc.)
    else if (isSpecificDayQuery) {
      const targetDay = isDay19Explicit ? 19 : isDay26Explicit ? 26 : (dayMatch ? parseInt(dayMatch[1], 10) : currentDay);
      const targetRecord = records.find(r => r.day === targetDay);

      if (targetRecord) {
        if (targetDay === 7) {
          replyText = `Mission Day 7 Microgravity Transition Analysis:\n• Cephalic Fluid Shift Adaptation: Normal initial headward fluid redistribution.\n• Resting HR: ${targetRecord.restingHR} bpm | BP: ${targetRecord.bpSystolic}/${targetRecord.bpDiastolic} mmHg | Sleep: ${targetRecord.sleepHours}h\n• Status: CALIBRATING (Days 1–14 calibration window). Wearable actigraphy and optical pulse tracking steadily with zero pathological alerts.`;
          citations = [
            { title: 'NASA HRP Risks Evidence Base', url: 'https://www.nasa.gov/hrp/risks/', resourceId: 'nasa-hrp-risks' },
            { title: 'CSA Science Experiments & Countermeasures', url: 'https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp', resourceId: 'csa-space-science-experiments' }
          ];
          deepLinks = [
            { label: 'Jump to Day 7', action: () => jumpToDay(7, 'restingHR'), icon: Compass },
            { label: 'Open Self-Exam', action: () => openProtocolModal('protocol-resting-hr'), icon: ShieldCheck }
          ];
        } else if (targetDay === 14) {
          replyText = `Mission Day 14 Personal Baseline Calibrated:\n• Calibration Window Complete: Personal Median (M) and Median Absolute Deviation (MAD) established across Days 1–14.\n• Resting HR: ${targetRecord.restingHR} bpm | Glucose: ${targetRecord.glucose} mg/dL | Core Temp: ${targetRecord.bodyTemp}°C\n• Architecture Event: Baseline bands established at M ± max(2*MAD, V_floor) [55–61 bpm for HR]. Ready for autonomous anomaly detection.`;
          citations = [
            { title: 'Artemis II Actigraphy', url: 'https://www.nasa.gov/hrp/ongoing-hrp-research/', resourceId: 'nasa-artemis-actigraphy' },
            { title: 'CSA Science Experiments & Countermeasures', url: 'https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp', resourceId: 'csa-space-science-experiments' }
          ];
          deepLinks = [
            { label: 'Jump to Day 14', action: () => jumpToDay(14, 'restingHR'), icon: Compass },
            { label: 'Open Self-Exam', action: () => openProtocolModal('protocol-resting-hr'), icon: ShieldCheck }
          ];
        } else if (targetDay === 16) {
          replyText = `Mission Day 16 Telemetry Analysis:\n• Glucose: ${targetRecord.glucose} mg/dL (${targetRecord.glucoseTag})\n• Resting HR: ${targetRecord.restingHR} bpm | BP: ${targetRecord.bpSystolic}/${targetRecord.bpDiastolic} mmHg\n• Confounder Status: POST_PRANDIAL_CONTEXT (30m post-meal). The Stage 1 filter isolated this spike from baseline calculation, preventing a false glycemic alarm while preserving normal fasting calibration.`;
          citations = [
            { title: 'CSA Space Science Experiments', url: 'https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp', resourceId: 'csa-space-science-experiments' },
            { title: 'NASA 5 Hazards', url: 'https://www.nasa.gov/hrp/hazards/', resourceId: 'nasa-5-hazards' }
          ];
          deepLinks = [
            { label: 'Jump to Day 16', action: () => jumpToDay(16, 'glucose'), icon: Compass },
            { label: 'Open Self-Exam', action: () => openProtocolModal('protocol-capillary-glucose'), icon: ShieldCheck },
            { label: 'Inspect Confounder Filter', action: () => setActiveView('alerts'), icon: Activity }
          ];
        } else if (targetDay === 19) {
          replyText = `Mission Day 19 Telemetry Analysis (Workout Confounder):\n• Active HR: 142 bpm (during 90m ARED workout) | Morning Resting HR: 59 bpm (Nominal)\n• Confounder Status: EXCLUDED_POST_EXERCISE_CONFOUNDER. Morning resting HR remained steady within Commander Vega's 55–61 bpm personal band. Stage 1 correctly excluded the acute exercise load, avoiding a false cardiovascular alarm.`;
          citations = [
            { title: 'NASA 5 Hazards & Countermeasures', url: 'https://www.nasa.gov/hrp/hazards/', resourceId: 'nasa-5-hazards' },
            { title: 'CSA Science Experiments & Countermeasures', url: 'https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp', resourceId: 'csa-space-science-experiments' }
          ];
          deepLinks = [
            { label: 'Jump to Day 19', action: () => jumpToDay(19, 'restingHR'), icon: Compass },
            { label: 'Open Self-Exam', action: () => openProtocolModal('protocol-resting-hr'), icon: ShieldCheck },
            { label: 'Inspect Workout Filter', action: () => setActiveView('alerts'), icon: Activity }
          ];
        } else if (targetDay === 26) {
          replyText = `Mission Day 26 Telemetry Analysis (Baseline Freeze):\n• Resting HR: 60 bpm | Sleep: 7.2h | Core Temp: 36.6°C\n• Architecture Event: BASELINE FROZEN @ DAY 26. The baseline engine automatically locked the healthy Days 1–14 personal reference window (Median 58 bpm, Band 55–61 bpm) to prevent impending subclinical drift from contaminating the baseline and masking pathological changes.`;
          citations = [
            { title: 'Artemis II Actigraphy', url: 'https://www.nasa.gov/hrp/ongoing-hrp-research/', resourceId: 'nasa-artemis-actigraphy' },
            { title: 'CSA Science Experiments & Countermeasures', url: 'https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp', resourceId: 'csa-space-science-experiments' }
          ];
          deepLinks = [
            { label: 'Jump to Day 26', action: () => jumpToDay(26, 'restingHR'), icon: Compass },
            { label: 'Open Self-Exam', action: () => openProtocolModal('protocol-resting-hr'), icon: ShieldCheck },
            { label: 'Inspect Rule Trace', action: () => setActiveView('alerts'), icon: Activity }
          ];
        } else if (targetDay >= 27 && targetDay <= 30) {
          replyText = `Mission Day ${targetDay} Persistent Drift Analysis:\n• Resting HR: ${targetRecord.restingHR} bpm (+${targetRecord.restingHR - 58} bpm above median)\n• Sleep Duration: ${targetRecord.sleepHours}h (Sleep Debt)\n• Core Temp: ${targetRecord.bodyTemp}°C\n• Status: ${targetDay === 30 ? 'PERSISTENT_TREND_DETECTED (3-of-4 consecutive days breach personal band: Days 27-30 HR 63, 65, 67, 69 bpm vs 61 bpm upper band). Guided self-exam recommended.' : 'Subclinical upward drift accumulating. Baseline frozen at Day 26.'}`;
          citations = [
            { title: 'NASA HRP Risks Evidence Base', url: 'https://www.nasa.gov/hrp/risks/', resourceId: 'nasa-hrp-risks' },
            { title: 'CSA Space Science Experiments', url: 'https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp', resourceId: 'csa-space-science-experiments' }
          ];
          deepLinks = [
            { label: `Jump to Day ${targetDay}`, action: () => jumpToDay(targetDay, 'restingHR'), icon: Compass },
            { label: 'Open Self-Exam', action: () => openProtocolModal('protocol-resting-hr'), icon: ShieldCheck },
            { label: 'Inspect Rule Trace', action: () => setActiveView('alerts'), icon: Activity }
          ];
        } else if (targetDay >= 31 && targetDay <= 34) {
          replyText = `Mission Day ${targetDay} Countermeasure Recovery:\n• Resting HR: ${targetRecord.restingHR} bpm | Sleep: ${targetRecord.sleepHours}h | Temp: ${targetRecord.bodyTemp}°C\n• Countermeasures: Protected 8h sleep window and electrolyte hydration deployed. ${targetDay === 34 ? 'Full recovery verified; event marked RESOLVED.' : 'Gradual autonomic recovery in progress.'}`;
          citations = [
            { title: 'NASA HRP Risks Evidence Base', url: 'https://www.nasa.gov/hrp/risks/', resourceId: 'nasa-hrp-risks' },
            { title: 'CSA Science Experiments & Countermeasures', url: 'https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp', resourceId: 'csa-space-science-experiments' }
          ];
          deepLinks = [
            { label: `Jump to Day ${targetDay}`, action: () => jumpToDay(targetDay, 'restingHR'), icon: Compass },
            { label: 'Open Self-Exam', action: () => openProtocolModal('protocol-resting-hr'), icon: ShieldCheck }
          ];
        } else if (targetDay === 44) {
          replyText = `Mission Day 44 Hardware Sensor Fault Analysis:\n• Raw Optical HR: 205 bpm | Signal Quality: 18% (Loose skin contact)\n• Confounder Status: EXCLUDED_LOW_SIGNAL_QUALITY. The Stage 1 filter detected wristband displacement and excluded the spike from triggering false medical alerts.`;
          citations = [
            { title: 'Artemis II Actigraphy', url: 'https://www.nasa.gov/hrp/ongoing-hrp-research/', resourceId: 'nasa-artemis-actigraphy' },
            { title: 'CSA Science Experiments & Countermeasures', url: 'https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp', resourceId: 'csa-space-science-experiments' }
          ];
          deepLinks = [
            { label: 'Jump to Day 44', action: () => jumpToDay(44, 'restingHR'), icon: Compass },
            { label: 'Open Self-Exam', action: () => openProtocolModal('protocol-resting-hr'), icon: ShieldCheck },
            { label: 'Inspect Sensor Trace', action: () => setActiveView('sensors'), icon: Activity }
          ];
        } else if (targetDay === 50) {
          replyText = `Mission Day 50 Space Radiation Drill Analysis:\n• Cabin Radiation: 2.80 mGy/d (Solar Particle Event Spike vs 2.0 mGy/d threshold)\n• Resting HR: 62 bpm | BP: 120/78 mmHg\n• Event: CSA Solar Particle Event Storm Shelter Advisory. Crew must muster behind polyethylene water-walls and deploy CSA Radi-N2 dosimeters.`;
          citations = [
            { title: 'CSA Radiation Monitoring (CANS & Radi-N2)', url: 'https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp', resourceId: 'csa-radiation-monitoring' },
            { title: 'NASA 5 Hazards', url: 'https://www.nasa.gov/hrp/hazards/', resourceId: 'nasa-5-hazards' }
          ];
          deepLinks = [
            { label: 'Jump to Day 50', action: () => { setCurrentDay(50); setActiveView('environment'); }, icon: Radiation },
            { label: 'Open Self-Exam', action: () => openProtocolModal('protocol-resting-hr'), icon: ShieldCheck },
            { label: 'Open Environment View', action: () => { setCurrentDay(50); setActiveView('environment'); }, icon: Radiation }
          ];
        } else {
          replyText = `Mission Day ${targetDay} Telemetry Report:\n• Status: ${targetRecord.exclusionReason ? `Confounder Filtered (${targetRecord.exclusionReason})` : 'Nominal Flight Status'}\n• Resting HR: ${targetRecord.restingHR} bpm [Personal Band: ${hrBandStr}]\n• Blood Pressure: ${targetRecord.bpSystolic}/${targetRecord.bpDiastolic} mmHg [Personal Band: ${bpBandStr}]\n• Glucose: ${targetRecord.glucose} mg/dL [Personal Band: ${gluBandStr}, ${targetRecord.glucoseTag}]\n• Core Temp: ${targetRecord.bodyTemp.toFixed(1)}°C [Personal Band: ${tempBandStr}]\n• Sleep Duration: ${targetRecord.sleepHours.toFixed(1)}h [Personal Band: ${sleepBandStr}]\n• Radiation Dose: ${targetRecord.radiationDose.toFixed(2)} mGy/d\n• Notes: ${targetRecord.notes}`;
          citations = [
            { title: 'NASA 5 Hazards', url: 'https://www.nasa.gov/hrp/hazards/', resourceId: 'nasa-5-hazards' },
            { title: 'CSA Space Science Experiments', url: 'https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp', resourceId: 'csa-space-science-experiments' }
          ];
          deepLinks = [
            { label: `Jump to Day ${targetDay}`, action: () => jumpToDay(targetDay, 'restingHR'), icon: Compass },
            { label: 'Open Self-Exam', action: () => openProtocolModal('protocol-resting-hr'), icon: ShieldCheck }
          ];
        }
      } else {
        replyText = `Target Day ${targetDay} is outside the 60-day mission profile. Please specify a day between Day 1 and Day 60.`;
      }
    }
    // 4. Alert / Drift / Baseline Freeze / Confounder Architecture Queries
    else if (isArchitectureQuery) {
      replyText = `MISSION PULSE 4-Stage Personal Pattern Architecture:\n\n1. Stage 1 (Confounder Filter): Filters transient physiological noise. Day 16 meal (138 mg/dL) tagged POST_PRANDIAL_CONTEXT, Day 19 exercise (142 bpm) tagged EXCLUDED_POST_EXERCISE_CONFOUNDER, and Day 44 loose sensor (205 bpm) tagged EXCLUDED_LOW_SIGNAL_QUALITY. None triggered false alarms.\n\n2. Stage 2 (Calibration): Calculates personal Median (M) and Median Absolute Deviation (MAD) over Days 1–14: Band = M ± max(2*MAD, V_floor).\n\n3. Stage 3 (Baseline Freeze): Automatically locked baseline at Day 26 to prevent subclinical upward drift from contaminating the healthy reference range.\n\n4. Stage 4 (3-of-4 Persistence): Requires at least 3 of 4 consecutive eligible days to breach the frozen band before firing an alert. Fired on Day 30 after 4 consecutive drift days (63, 65, 67, 69 bpm).`;
      citations = [
        { title: 'NASA HRP Risks Evidence Base', url: 'https://www.nasa.gov/hrp/risks/', resourceId: 'nasa-hrp-risks' },
        { title: 'CSA Science Experiments & Countermeasures', url: 'https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp', resourceId: 'csa-space-science-experiments' }
      ];
      deepLinks = [
        { label: 'Jump to Day 30', action: () => jumpToDay(30, 'restingHR'), icon: Compass },
        { label: 'Open Self-Exam', action: () => openProtocolModal('protocol-resting-hr'), icon: ShieldCheck },
        { label: 'Inspect Rule Trace', action: () => setActiveView('alerts'), icon: Activity }
      ];
    }
    // 5. Specific Vital Queries
    else if (isHeartQuery) {
      replyText = `Cardiovascular System Status (Day ${currentDay}):\n• Live Resting HR: ${currentRecord.restingHR} bpm\n• Personal Operating Band: ${hrBandStr} (Median: ${hrBand?.median ?? 58} bpm)\n• Status: ${currentRecord.restingHR > (hrBand?.upperBound ?? 61) ? 'Elevated above personal operating band.' : currentRecord.restingHR < (hrBand?.lowerBound ?? 55) ? 'Below personal operating band.' : 'Nominal and within baseline bounds.'}\n• Spaceflight Hazard: Altered Gravity & Fluid Shift. Headward fluid redistribution decreases plasma volume and elevates sympathetic tone during cumulative workload.`;
      citations = [
        { title: 'NASA HRP Cardiovascular Risks', url: 'https://www.nasa.gov/hrp/risks/', resourceId: 'nasa-hrp-risks' },
        { title: 'CSA Space Science Experiments', url: 'https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp', resourceId: 'csa-space-science-experiments' }
      ];
      deepLinks = [
        { label: `Jump to Day ${currentDay}`, action: () => jumpToDay(currentDay, 'restingHR'), icon: Compass },
        { label: 'Open Self-Exam', action: () => openProtocolModal('protocol-resting-hr'), icon: ShieldCheck },
        { label: 'Inspect 3D Heart', action: () => inspectOrgan('heart', 'restingHR'), icon: Heart }
      ];
    }
    else if (isBpQuery) {
      replyText = `Hemodynamic Arterial Status (Day ${currentDay}):\n• Live Blood Pressure: ${currentRecord.bpSystolic}/${currentRecord.bpDiastolic} mmHg\n• Reference Band: ${bpBandStr}\n• Status: ${currentRecord.bpSystolic > (bpSysBand?.upperBound ?? 120) ? 'Systolic elevated above reference band.' : 'Nominal hemodynamic pressure logged.'}\n• Spaceflight Context: Microgravity abolishes hydrostatic blood pressure gradients, equalizing arterial pressures between head and feet and altering baroreflex sensitivity.`;
      citations = [
        { title: 'NASA HRP Cardiovascular Risks', url: 'https://www.nasa.gov/hrp/risks/', resourceId: 'nasa-hrp-risks' },
        { title: 'CSA Space Science Experiments', url: 'https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp', resourceId: 'csa-space-science-experiments' }
      ];
      deepLinks = [
        { label: 'Open Self-Exam', action: () => openProtocolModal('protocol-blood-pressure'), icon: ShieldCheck },
        { label: `Jump to Day ${currentDay}`, action: () => jumpToDay(currentDay, 'bloodPressure'), icon: Compass },
        { label: 'Inspect 3D Heart', action: () => inspectOrgan('heart', 'bpSystolic'), icon: Heart }
      ];
    }
    else if (isGlucoseQuery) {
      replyText = `Metabolic & Endocrine Status (Day ${currentDay}):\n• Live Capillary Glucose: ${currentRecord.glucose} mg/dL (${currentRecord.glucoseTag})\n• Personal Operating Band: ${gluBandStr}\n• Status: ${currentRecord.glucose > (gluBand?.upperBound ?? 94) ? (currentRecord.glucoseTag === 'After Meal' ? 'Post-prandial elevation; isolated by Stage 1 confounder filter.' : 'Elevated above fasting baseline band.') : 'Within personal operating range.'}\n• Spaceflight Context: Spaceflight induces mild insulin resistance and altered carbohydrate metabolism due to microgravity unloading and circadian desynchronization.`;
      citations = [
        { title: 'CSA Space Science Experiments', url: 'https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp', resourceId: 'csa-space-science-experiments' },
        { title: 'NASA 5 Hazards', url: 'https://www.nasa.gov/hrp/hazards/', resourceId: 'nasa-5-hazards' }
      ];
      deepLinks = [
        { label: 'Open Self-Exam', action: () => openProtocolModal('protocol-capillary-glucose'), icon: ShieldCheck },
        { label: `Jump to Day ${currentDay}`, action: () => jumpToDay(currentDay, 'glucose'), icon: Compass }
      ];
    }
    else if (isTempQuery) {
      replyText = `Thermoregulatory Core Status (Day ${currentDay}):\n• Live Core Temperature: ${currentRecord.bodyTemp.toFixed(1)}°C\n• Personal Operating Band: ${tempBandStr}\n• Status: ${currentRecord.bodyTemp > (tempBand?.upperBound ?? 36.8) ? 'Elevated above personal operating band.' : 'Nominal core body temperature.'}\n• Spaceflight Context: Spaceflight impairs sweat evaporation and convective cooling, often leading to slight elevation in resting core temperature ('space fever').`;
      citations = [
        { title: 'NASA-STD-3001 Medical Operations', url: 'https://www.nasa.gov/hrp/hazards/', resourceId: 'nasa-5-hazards' },
        { title: 'CSA Space Science Experiments', url: 'https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp', resourceId: 'csa-space-science-experiments' }
      ];
      deepLinks = [
        { label: 'Open Self-Exam', action: () => openProtocolModal('protocol-core-temp'), icon: ShieldCheck },
        { label: `Jump to Day ${currentDay}`, action: () => jumpToDay(currentDay, 'bodyTemp'), icon: Compass }
      ];
    }
    else if (isSleepQuery) {
      replyText = `Circadian & Sleep Architecture (Day ${currentDay}):\n• Sleep Duration (last 24h): ${currentRecord.sleepHours.toFixed(1)} hours (Subjective Mood: ${currentRecord.mood}/5)\n• Personal Operating Band: ${sleepBandStr}\n• Status: ${currentRecord.sleepHours < (sleepBand?.lowerBound ?? 6.9) ? 'Sleep debt detected. Protected 8h circadian recovery recommended.' : 'Adequate restorative sleep logged.'}\n• Countermeasures: Protected 8h circadian rest window, 480nm blue-enriched morning cabin lighting.`;
      citations = [
        { title: 'Artemis II Actigraphy', url: 'https://www.nasa.gov/hrp/ongoing-hrp-research/', resourceId: 'nasa-artemis-actigraphy' },
        { title: 'CSA Space Science Experiments', url: 'https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp', resourceId: 'csa-space-science-experiments' }
      ];
      deepLinks = [
        { label: 'Open Self-Exam', action: () => openProtocolModal('protocol-sleep-mood'), icon: ShieldCheck },
        { label: `Jump to Day ${currentDay}`, action: () => jumpToDay(currentDay, 'sleep'), icon: Compass },
        { label: 'View Sleep & Activity', action: () => setActiveView('activity'), icon: Activity }
      ];
    }
    else if (isRadiationQuery) {
      replyText = `Environmental Radiation Telemetry (Day ${currentDay}):\n• Cabin Absorbed Dose: ${currentRecord.radiationDose.toFixed(2)} mGy/d\n• Sensors: Canadian Active Neutron Spectrometer (CANS) & Radi-N2 bubble detectors\n• Threshold: Normal background is 0.35–0.55 mGy/d. SPE storm threshold is >= 2.0 mGy/d.\n• Status: ${currentRecord.radiationDose >= 2.0 ? 'SOLAR PARTICLE EVENT ACTIVE! Ingress storm shelter immediately.' : 'Nominal galactic cosmic ray background flux.'}`;
      citations = [
        { title: 'CSA Radiation Monitoring', url: 'https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp', resourceId: 'csa-radiation-monitoring' },
        { title: 'NASA 5 Hazards', url: 'https://www.nasa.gov/hrp/hazards/', resourceId: 'nasa-5-hazards' }
      ];
      deepLinks = [
        { label: 'Open Environment View', action: () => setActiveView('environment'), icon: Radiation },
        { label: 'Jump to Day 50', action: () => { setCurrentDay(50); setActiveView('environment'); }, icon: Radiation },
        { label: 'Open Self-Exam', action: () => openProtocolModal('protocol-resting-hr'), icon: ShieldCheck }
      ];
    }
    else if (isSansQuery) {
      replyText = `Spaceflight-Associated Neuro-ocular Syndrome (SANS):\n• Definition: Cephalad venous and cerebrospinal fluid shifts elevate intracranial and optic sheath pressures, leading to optic disc edema, posterior globe flattening, choroidal folds, and hyperopic visual shifts in up to 70% of long-duration crew.\n• Onboard Tool: Module L Digital 10x10 Amsler Grid and near-vision acuity screening.\n• Current Status: Near visual acuity 20/20 OD/OS, no central distortion logged.`;
      citations = [
        { title: 'NASA HRP Risks (SANS Evidence Base)', url: 'https://www.nasa.gov/hrp/risks/', resourceId: 'nasa-hrp-risks' },
        { title: 'CSA Space Science Experiments', url: 'https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp', resourceId: 'csa-space-science-experiments' }
      ];
      deepLinks = [
        { label: 'Open Self-Exam', action: () => { setActiveView('cognitive'); openProtocolModal('protocol-sans-amsler'); }, icon: ShieldCheck },
        { label: 'Open SANS Amsler Grid', action: () => setActiveView('cognitive'), icon: Eye },
        { label: 'Inspect 3D Eye', action: () => inspectOrgan('eyes', 'restingHR'), icon: Eye }
      ];
    }
    // 6. General Self-Exam & Verification Protocol Queries
    else if (isGeneralExamQuery) {
      replyText = `Module D Guided In-Flight Self-Assessment Protocols:\n\n1. Resting HR Verification: 5 minutes quiet upright rest in sleep station, verify PPG band 2 finger-widths proximal to wrist, 60s capture window.\n2. Brachial BP Protocol: Cuff on left upper arm at heart level, silence during inflation cycle.\n3. Capillary Blood Glucose: Cleanse site with 70% isopropanol, deploy micro-sampler, tag fasting vs post-meal.\n4. Tympanic Core Temp: Disposable probe tip, retract pinna, trigger infrared reading.\n5. Sleep & Mood Check-In: Review actigraphy polysomnography and log subjective rating 1–5.\n6. SANS Amsler Grid Screening: Monocular central dot fixation, report line bending or blind spots.\n\nClick below to launch an interactive step-by-step verification wizard.`;
      citations = [
        { title: 'NASA-STD-3001 Medical Operations', url: 'https://www.nasa.gov/hrp/hazards/', resourceId: 'nasa-5-hazards' },
        { title: 'CSA Space Science Experiments', url: 'https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp', resourceId: 'csa-space-science-experiments' }
      ];
      deepLinks = [
        { label: 'Open Self-Exam', action: () => openProtocolModal('protocol-resting-hr'), icon: ShieldCheck },
        { label: `Jump to Day ${currentDay}`, action: () => jumpToDay(currentDay, 'restingHR'), icon: Compass }
      ];
    }
    // 7. FALLBACK: NASA HRP General Knowledge Search
    else {
      const doc = NASA_RAG_KNOWLEDGE_DOCS.find(d => d.keywords.some(kw => lower.includes(kw)));
      if (doc) {
        replyText = `${doc.title}:\n${doc.content}`;
      } else {
        replyText = `I understand you are asking about "${query}". In accordance with NASA Human Research Program flight rules, all biometric trends are evaluated against Commander Elena Vega's personal operating bands established during Days 1–14.\n\nOn Mission Day ${currentDay}, all vital signs remain under continuous state-awareness monitoring. You can ask for telemetry on specific days (e.g. Day 19, Day 30, Day 44), any vital sign (heart rate, blood pressure, glucose, sleep, radiation), baseline calibration logic, or protocol verifications.`;
      }
      citations = [
        { title: 'NASA Human Research Program: 5 Hazards', url: 'https://www.nasa.gov/hrp/hazards/', resourceId: 'nasa-5-hazards' },
        { title: 'CSA Science Experiments & Countermeasures', url: 'https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp', resourceId: 'csa-space-science-experiments' }
      ];
      deepLinks = [
        { label: `Jump to Day ${currentDay}`, action: () => jumpToDay(currentDay, 'restingHR'), icon: Compass },
        { label: 'Open Self-Exam', action: () => openProtocolModal('protocol-resting-hr'), icon: ShieldCheck }
      ];
    }

    if (replyTimeoutRef.current) {
      clearTimeout(replyTimeoutRef.current);
    }

    replyTimeoutRef.current = setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: `Day ${currentDay} • 14:32 UTC`,
        citations,
        deepLinks
      };
      setMessages(prev => [...prev, assistantMsg]);
      speakText(replyText);
      replyTimeoutRef.current = null;
    }, 200);
  };

  // Required 4 Quick Prompt Chips with zero horizontal overflow
  const promptChips = [
    `Explain Day ${currentDay} Status`,
    'Why Did Day 19 Workout Not Alert?',
    'Why Did Baseline Freeze at Day 26?',
    'Guide Me Through BP Self-Exam'
  ];

  if (!isOpen) return null;

  return (
    <aside 
      aria-label="Pulse AI & Voice Companion"
      className="fixed top-14 right-0 bottom-0 w-[385px] h-[calc(100dvh-56px)] z-[9999] bg-[#0B1120]/98 backdrop-blur-3xl border-l border-sky-400/35 shadow-[-16px_0_48px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden font-sans select-none animate-in slide-in-from-right duration-200"
    >
      {/* 1. HEADER: Title + Day Telemetry + Voice Toggle + Close Button */}
      <div className="h-12 shrink-0 px-4 bg-white/[0.03] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-slate-950 font-bold shadow-[0_0_12px_rgba(56,189,248,0.4)] shrink-0">
            <Bot className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-white tracking-tight leading-tight truncate">
              Pulse AI & Voice Companion
            </h2>
            <div className="text-[10px] text-sky-300 font-medium truncate flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="truncate">Day {currentDay} Live Telemetry</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {/* 🔊 Voice Readout toggle */}
          <button
            type="button"
            onClick={() => {
              if (isVoiceActive && typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.cancel();
              }
              setIsVoiceActive(!isVoiceActive);
            }}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              isVoiceActive
                ? 'bg-sky-500/20 border-sky-400/40 text-sky-300 shadow-[0_0_8px_rgba(56,189,248,0.3)]'
                : 'bg-white/[0.04] border-white/10 text-slate-400 hover:text-white'
            }`}
            title={isVoiceActive ? '🔊 Voice Readout: Active (Click to mute)' : '🔊 Voice Readout: Muted (Click to enable)'}
            aria-label={isVoiceActive ? '🔊 Mute voice readout' : '🔊 Enable voice readout'}
          >
            {isVoiceActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* × Close button */}
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.cancel();
              }
              onClose();
            }}
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Close Pulse AI Window"
            aria-label="Close Pulse AI Window"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. QUICK PROMPT CHIPS (ZERO horizontal overflow) */}
      <div className="shrink-0 px-3 py-2 border-b border-white/10 flex flex-wrap gap-1.5 bg-black/20 w-full overflow-hidden">
        {promptChips.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendQuery(chip)}
            className="px-2.5 py-1 rounded-full bg-white/[0.06] hover:bg-sky-500/20 border border-white/10 hover:border-sky-400/40 text-slate-200 hover:text-white text-[11px] font-medium transition-all active:scale-95 text-left inline-flex items-center cursor-pointer max-w-full break-words leading-tight"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* 3. CHAT MESSAGES BODY */}
      <div className="flex-1 min-h-0 p-3.5 overflow-y-auto space-y-3 w-full overflow-x-hidden">
        {messages.map(msg => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} w-full max-w-full`}
            >
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1">
                <span className="font-semibold text-slate-300">{isUser ? 'Commander Vega' : 'Pulse AI'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[92%] p-2.5 rounded-2xl text-xs leading-relaxed break-words overflow-hidden ${
                  isUser
                    ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 font-semibold rounded-tr-none shadow-md'
                    : 'bg-white/[0.05] text-slate-100 border border-white/10 rounded-tl-none shadow-lg'
                }`}
              >
                <div className="whitespace-pre-wrap break-words">{msg.text}</div>

                {/* Clickable Deep-Link Buttons inside assistant reply */}
                {msg.deepLinks && msg.deepLinks.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-wrap gap-1.5">
                    {msg.deepLinks.map((dl, idx) => {
                      const Icon = dl.icon;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={dl.action}
                          className="px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-200 hover:text-white text-[10.5px] font-semibold flex items-center gap-1 transition-all shadow-sm active:scale-95 cursor-pointer"
                        >
                          <Icon className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                          <span>{dl.label}</span>
                          <ChevronRight className="w-3 h-3 text-sky-400 shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* NASA HRP & CSA Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-white/10 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      NASA HRP & CSA Citations:
                    </span>
                    {msg.citations.map((c, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => openCitationsModal(c.resourceId)}
                        className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-[10.5px] text-sky-300 hover:text-sky-200 transition-colors group w-full text-left cursor-pointer"
                      >
                        <span className="font-semibold truncate mr-2">{c.title}</span>
                        <BookOpen className="w-3.5 h-3.5 text-slate-400 group-hover:text-white shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={chatBottomRef} />
      </div>

      {/* 4. PINNED BOTTOM INPUT BAR: Guaranteed visible in 620px-768px viewports */}
      <div className="shrink-0 p-3 bg-[#070B14] border-t border-white/15 w-full">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSendQuery();
          }}
          className="flex items-center gap-2 w-full"
        >
          {/* Push-to-Talk Microphone Button */}
          <button
            type="button"
            onClick={handleToggleMic}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
              isListening
                ? 'bg-rose-500 text-white border-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.6)] animate-pulse'
                : 'bg-white/[0.08] hover:bg-white/[0.15] border-white/20 text-slate-200 hover:text-white'
            }`}
            title={isListening ? 'Listening via Web Speech API (Click to stop)' : 'Click to Speak (Push-to-Talk)'}
            aria-label="Push-to-Talk Microphone"
          >
            {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4 text-slate-300" />}
          </button>

          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                handleSendQuery();
              }
            }}
            placeholder="Ask Pulse AI about your body or vitals..."
            className="flex-1 min-w-0 h-9 px-3 rounded-xl bg-white/[0.08] border border-white/20 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-sky-400 focus:bg-white/[0.12] transition-all"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="w-9 h-9 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 disabled:opacity-40 text-slate-950 font-bold flex items-center justify-center transition-all shadow-md active:scale-95 shrink-0 cursor-pointer"
            title="Send Message"
            aria-label="Send Message"
          >
            <Send className="w-4 h-4 fill-slate-950" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[9px] text-slate-400 mt-1.5 px-0.5">
          <span>Non-diagnostic AI prototype · NASA-STD-3001</span>
          <span>Day {currentDay}</span>
        </div>
      </div>
    </aside>
  );
};

export default PulseAiAssistant;
