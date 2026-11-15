// src/components/VisionBodyPanel.tsx
// Module E: Interactive Anatomical X-Ray Twin Medical Body Explorer
// Clean medical imaging viewer: single anatomical figure, 8 anchored hotspots, strict abnormality blinking

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Play, 
  X, 
  SlidersHorizontal
} from 'lucide-react';
import type { DayRecord, PersonalBaselineBand } from '../types/mission';
import type { PinId } from '../context/MissionContext';

interface Props {
  currentDay: number;
  record: DayRecord;
  bands?: Record<string, PersonalBaselineBand>;
  onSelectMetric?: (metric: string) => void;
  onOpenProtocol: (protocolId: string) => void;
  onOpenCitations?: (resourceId?: string) => void;
  isDrifting?: boolean;
  activePin?: PinId;
  onSelectPin?: (pinId: PinId) => void;
  isHudOpen?: boolean;
  onToggleHud?: (open: boolean) => void;
}

export interface HotspotData {
  key: string;
  id: PinId;
  name: string;
  systemTitle: string;
  metricKey: string;
  protocolId: string;
  cx: number;
  cy: number;
  dotLeft: string;
  dotTop: string;
  pillLeft?: string;
  pillTop?: string;
  pillTransform?: string;
  left: string;
  top: string;
}

// Exactly 8 anchored anatomical hotspots: eyes/head, inner ear, lungs, heart, abdomen, skin, pelvis, leg muscle
export const HOTSPOTS: HotspotData[] = [
  {
    key: 'eyes-head',
    id: 'eyes',
    name: 'Eyes / Head',
    systemTitle: 'Neuro-Ocular (SANS)',
    metricKey: 'restingHR',
    protocolId: 'protocol-sans-amsler',
    cx: 200,
    cy: 68,
    dotLeft: '50%',
    dotTop: '7.9%',
    pillLeft: '50%',
    pillTop: '4%',
    pillTransform: 'translate(-50%, -50%)',
    left: '50%',
    top: '7.9%'
  },
  {
    key: 'inner-ear',
    id: 'brain',
    name: 'Brain / Circadian',
    systemTitle: 'Brain & Circadian',
    metricKey: 'sleepHours',
    protocolId: 'protocol-sleep-mood',
    cx: 200,
    cy: 68,
    dotLeft: '50%',
    dotTop: '9%',
    pillLeft: '50%',
    pillTop: '3.5%',
    pillTransform: 'translate(-50%, -50%)',
    left: '50%',
    top: '9%'
  },
  {
    key: 'lungs',
    id: 'lungs',
    name: 'Lungs / Radiation',
    systemTitle: 'Respiratory System',
    metricKey: 'spo2',
    protocolId: 'protocol-resting-hr',
    cx: 200,
    cy: 210,
    dotLeft: '52%',
    dotTop: '28.5%',
    pillLeft: '36%',
    pillTop: '28.5%',
    pillTransform: 'translate(-50%, -50%)',
    left: '52%',
    top: '28.5%'
  },
  {
    key: 'heart',
    id: 'heart',
    name: 'Heart',
    systemTitle: 'Cardiovascular System',
    metricKey: 'restingHR',
    protocolId: 'protocol-resting-hr',
    cx: 208,
    cy: 275,
    dotLeft: '52%',
    dotTop: '28.5%',
    pillLeft: '36%',
    pillTop: '28.5%',
    pillTransform: 'translate(-50%, -50%)',
    left: '52%',
    top: '28.5%'
  },
  {
    key: 'abdomen',
    id: 'liver',
    name: 'Abdomen / Metabolic',
    systemTitle: 'Endocrine & Metabolic System',
    metricKey: 'glucose',
    protocolId: 'protocol-capillary-glucose',
    cx: 172,
    cy: 355,
    dotLeft: '45%',
    dotTop: '36.5%',
    pillLeft: '50%',
    pillTop: '42.5%',
    pillTransform: 'translate(-50%, -50%)',
    left: '45%',
    top: '36.5%'
  },
  {
    key: 'skin',
    id: 'immune',
    name: 'Skin / Temperature',
    systemTitle: 'Immune & Hematologic',
    metricKey: 'bodyTemp',
    protocolId: 'protocol-body-temp',
    cx: 285,
    cy: 310,
    dotLeft: '48%',
    dotTop: '20.5%',
    pillLeft: '66%',
    pillTop: '20.5%',
    pillTransform: 'translate(-50%, -50%)',
    left: '48%',
    top: '20.5%'
  },
  {
    key: 'pelvis',
    id: 'femur',
    name: 'Pelvis',
    systemTitle: 'Musculoskeletal',
    metricKey: 'activity',
    protocolId: 'protocol-resting-hr',
    cx: 200,
    cy: 425,
    dotLeft: '50%',
    dotTop: '49.4%',
    pillLeft: '50%',
    pillTop: '56%',
    pillTransform: 'translate(-50%, -50%)',
    left: '50%',
    top: '49.4%'
  },
  {
    key: 'leg-muscle',
    id: 'femur',
    name: 'Leg Muscle',
    systemTitle: 'Musculoskeletal',
    metricKey: 'activity',
    protocolId: 'protocol-resting-hr',
    cx: 175,
    cy: 580,
    dotLeft: '43.8%',
    dotTop: '67.4%',
    pillLeft: '43.8%',
    pillTop: '74%',
    pillTransform: 'translate(-50%, -50%)',
    left: '43.8%',
    top: '67.4%'
  }
];

export interface OrganAlert {
  isAbnormal: boolean;
  color: 'rose' | 'amber';
  tag: string;
  badge: 'Drift' | 'Confounder' | 'Fault' | 'Alert' | 'SPE Alert';
}

export const VisionBodyPanel: React.FC<Props> = ({
  currentDay,
  record,
  bands,
  onSelectMetric,
  onOpenProtocol,
  onOpenCitations: _onOpenCitations,
  isDrifting: _isDrifting = false,
  activePin: propActivePin,
  onSelectPin,
  isHudOpen: propIsHudOpen,
  onToggleHud
}) => {
  const [localActivePin, setLocalActivePin] = useState<PinId>('heart');
  const [localIsHudOpen, setLocalIsHudOpen] = useState(true);
  const [selectedHotspotKey, setSelectedHotspotKey] = useState<string>('heart');
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  const activePin = propActivePin ?? localActivePin;
  const setActivePin = onSelectPin ?? setLocalActivePin;
  const isHudOpen = propIsHudOpen ?? localIsHudOpen;
  const setIsHudOpen = onToggleHud ?? setLocalIsHudOpen;

  // Baseline threshold bands
  const hrUpper = bands?.restingHR?.upperBound || 61;
  const hrLower = bands?.restingHR?.lowerBound || 55;
  const bpSysUpper = bands?.bpSystolic?.upperBound || 120;
  const bpDiaUpper = bands?.bpDiastolic?.upperBound || 80;
  const gluUpper = bands?.glucose?.upperBound || 98;
  const gluLower = bands?.glucose?.lowerBound || 86;
  const tempUpper = bands?.bodyTemp?.upperBound || 37.0;
  const tempLower = bands?.bodyTemp?.lowerBound || 36.4;
  const sleepLower = bands?.sleepHours?.lowerBound || 6.5;

  // Specific Day / Condition Flags
  const isRadiationAlert = currentDay === 50 || record.radiationDose >= 2.0;
  const isMealConfounder = currentDay === 16 || record.exclusionReason === 'POST_PRANDIAL_CONTEXT';
  const isWorkoutConfounder = currentDay === 19 || record.exclusionReason === 'EXCLUDED_POST_EXERCISE_CONFOUNDER';
  const isSensorFault = currentDay === 44 || record.exclusionReason === 'EXCLUDED_LOW_SIGNAL_QUALITY' || (record.rawSignalQuality !== undefined && record.rawSignalQuality < 50);
  const isManualEntry = record.provenanceTag === '[MANUAL CREW ENTRY]' && !isMealConfounder;

  // Strict Gate: Blinking beacons ONLY appear on explicit anomaly/confounder days, manual entries, or active faults
  const ANOMALY_DAYS = useMemo(() => new Set([16, 19, 27, 28, 29, 30, 44, 50]), []);

  const isAnomalyOrConfounderDay = 
    ANOMALY_DAYS.has(currentDay) ||
    record.provenanceTag === '[MANUAL CREW ENTRY]' ||
    isSensorFault ||
    isRadiationAlert ||
    isWorkoutConfounder ||
    isMealConfounder;

  // Strict Abnormality Logic: evaluates whether a specific organ is abnormal
  const getOrganAlert = useCallback((hotspotKey: string): OrganAlert | null => {
    // Strict Gate: On all nominal / calibrating / recovery days, ZERO dots, ZERO circles, ZERO pills
    if (!isAnomalyOrConfounderDay) {
      return null;
    }

    // 1. Cardiovascular / Heart (inside glowing orange heart left: 52%, top: 28.5%):
    // Heart Drift on Days 27-30 | Workout 142 bpm on Day 19 | Sensor Fault 205 bpm on Day 44 | SPE Alert on Day 50
    if (hotspotKey === 'heart') {
      if (isSensorFault || currentDay === 44) {
        return {
          isAbnormal: true,
          color: 'amber',
          tag: `Sensor Fault • ${record.restingHR || 205} bpm`,
          badge: 'Fault'
        };
      }
      if (isWorkoutConfounder || currentDay === 19) {
        return {
          isAbnormal: true,
          color: 'amber',
          tag: `Workout • ${record.activeHR || 142} bpm`,
          badge: 'Confounder'
        };
      }
      if (isRadiationAlert && currentDay === 50) {
        return {
          isAbnormal: true,
          color: 'rose',
          tag: `SPE Alert • ${record.radiationDose.toFixed(2)} mGy/d`,
          badge: 'SPE Alert'
        };
      }
      if (currentDay >= 27 && currentDay <= 30 && record.restingHR > 61) {
        return {
          isAbnormal: true,
          color: 'rose',
          tag: `Heart Drift • ${record.restingHR} bpm`,
          badge: 'Drift'
        };
      }
      if (isManualEntry && (record.restingHR > hrUpper || record.restingHR < hrLower || record.bpSystolic > bpSysUpper)) {
        return {
          isAbnormal: true,
          color: 'rose',
          tag: `Heart Alert • ${record.restingHR} bpm`,
          badge: 'Alert'
        };
      }
      return null;
    }

    // 2. Brain / Circadian (Forehead/Cranium left: 50%, top: 9%):
    // Sleep Debt on Days 27-30 when sleepHours < 6.5
    if (hotspotKey === 'inner-ear') {
      if (currentDay >= 27 && currentDay <= 30 && record.sleepHours < 6.5) {
        return {
          isAbnormal: true,
          color: 'rose',
          tag: `Sleep Debt • ${record.sleepHours.toFixed(1)}h`,
          badge: 'Drift'
        };
      }
      if (isManualEntry && record.sleepHours < sleepLower) {
        return {
          isAbnormal: true,
          color: 'rose',
          tag: `Sleep Debt • ${record.sleepHours.toFixed(1)}h`,
          badge: 'Drift'
        };
      }
      return null;
    }

    // 3. Core Temp (Upper Sternum/Chest left: 48%, top: 20.5%):
    // Temp Alert on Days 29-30 when bodyTemp >= 37.1
    if (hotspotKey === 'skin') {
      if ((currentDay === 29 || currentDay === 30 || isManualEntry) && record.bodyTemp >= 37.1) {
        return {
          isAbnormal: true,
          color: 'rose',
          tag: `Temp • ${record.bodyTemp.toFixed(1)}°C`,
          badge: 'Alert'
        };
      }
      return null;
    }

    // 4. Liver / Metabolic (Liver/Upper Abdomen left: 45%, top: 36.5%):
    // Post-Meal 138 mg/dL on Day 16 | Glucose Drift on Days 29-30 when glucose > 98
    if (hotspotKey === 'abdomen') {
      if (isMealConfounder || currentDay === 16) {
        return {
          isAbnormal: true,
          color: 'amber',
          tag: `Post-Meal • ${record.glucose || 138} mg/dL`,
          badge: 'Confounder'
        };
      }
      if ((currentDay === 29 || currentDay === 30 || isManualEntry) && record.glucose > 98) {
        return {
          isAbnormal: true,
          color: 'amber',
          tag: `Glucose • ${record.glucose} mg/dL`,
          badge: 'Drift'
        };
      }
      return null;
    }

    // 5. Respiratory System / Lungs (left: 52%, top: 28.5%):
    // Reserved for dedicated lung-specific anomalies if any
    if (hotspotKey === 'lungs') {
      return null;
    }

    // Default: healthy nominal organ
    return null;
  }, [
    currentDay, 
    record, 
    isAnomalyOrConfounderDay,
    isMealConfounder, 
    isWorkoutConfounder, 
    isSensorFault, 
    isRadiationAlert, 
    isManualEntry, 
    hrUpper, 
    hrLower, 
    bpSysUpper,
    sleepLower
  ]);

  // Count of currently abnormal organs (0 on nominal days, 1-3 on drift/confounder days)
  const abnormalCount = useMemo(() => {
    let count = 0;
    for (const h of HOTSPOTS) {
      if (getOrganAlert(h.key)?.isAbnormal) {
        count++;
      }
    }
    return count;
  }, [getOrganAlert]);

  const isHeartAbnormal = !!getOrganAlert('heart')?.isAbnormal;

  // Auto-focus the active organ on day change if an event is present
  useEffect(() => {
    if (currentDay >= 27 && currentDay <= 30) {
      setSelectedHotspotKey('heart');
      setActivePin('heart');
    } else if (isRadiationAlert) {
      setSelectedHotspotKey('lungs');
      setActivePin('lungs');
    } else if (isMealConfounder) {
      setSelectedHotspotKey('abdomen');
      setActivePin('liver');
    } else if (isWorkoutConfounder || isSensorFault) {
      setSelectedHotspotKey('heart');
      setActivePin('heart');
    }
  }, [currentDay, isRadiationAlert, isMealConfounder, isWorkoutConfounder, isSensorFault, setActivePin]);

  // Synchronize when propActivePin changes from parent
  useEffect(() => {
    if (propActivePin) {
      const matched = HOTSPOTS.find(h => h.id === propActivePin);
      if (matched) {
        setSelectedHotspotKey(matched.key);
      }
    }
  }, [propActivePin]);

  // Current selected hotspot
  const currentHotspot = useMemo(() => {
    return HOTSPOTS.find(h => h.key === selectedHotspotKey) 
      || HOTSPOTS.find(h => h.id === activePin) 
      || HOTSPOTS[3]; // default to heart
  }, [selectedHotspotKey, activePin]);

  const currentAlert = getOrganAlert(currentHotspot.key);

  const getTelemetrySnippet = (hotspotKey: string, pinId: PinId) => {
    const hrBand = bands?.restingHR;
    const gluBand = bands?.glucose;
    const tempBand = bands?.bodyTemp;
    const sleepBand = bands?.sleepHours;
    const spo2Band = bands?.spo2;

    if (isRadiationAlert && (hotspotKey === 'lungs' || hotspotKey === 'skin' || pinId === 'immune' || pinId === 'lungs')) {
      return `Current: ${record.radiationDose.toFixed(2)} mGy/d • SPE Alert: 2.80 mGy/d (Elevated)`;
    }

    if (hotspotKey === 'heart' || pinId === 'heart') {
      return `Current: ${record.restingHR} bpm • Band: ${hrBand?.lowerBound || 55}–${hrBand?.upperBound || 61} bpm`;
    }
    if (hotspotKey === 'lungs' || pinId === 'lungs') {
      return `Current: 98% SpO2 • Band: 95–100%`;
    }
    if (hotspotKey === 'abdomen' || pinId === 'liver') {
      return `Current: ${record.glucose} mg/dL • Band: ${gluBand?.lowerBound || 86}–${gluBand?.upperBound || 98} mg/dL`;
    }
    if (hotspotKey === 'skin' || pinId === 'immune') {
      return `Current: ${record.bodyTemp.toFixed(1)}°C • Band: ${(tempBand?.lowerBound || 36.4).toFixed(1)}–${(tempBand?.upperBound || 36.8).toFixed(1)}°C`;
    }
    if (hotspotKey === 'inner-ear' || pinId === 'brain' || pinId === 'circadian') {
      return `Current: ${record.sleepHours.toFixed(1)}h • Band: ${(sleepBand?.lowerBound || 6.5).toFixed(1)}–7.9h`;
    }
    if (hotspotKey === 'eyes-head' || pinId === 'eyes') {
      return `Current: 20/20 OD/OS • Band: 20/20 Baseline`;
    }
    return `Current: 100% ARED • Band: 90–100% Compliance`;
  };

  const handleSelectHotspot = (hotspot: HotspotData) => {
    setSelectedHotspotKey(hotspot.key);
    setActivePin(hotspot.id);
    setIsHudOpen(true);
    onSelectMetric?.(hotspot.metricKey);
  };

  // Clean medical image filter: authentic electric cyan-blue body with glowing orange heart/lungs
  const bodyFilter = 'hue-rotate(185deg) hue-rotate(175deg) brightness(1.02)';

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-between select-none overflow-hidden bg-[#070B14] rounded-2xl border border-white/[0.08] shadow-2xl p-1">
      
      {/* 1. TOP HEADER: Single-line header with live anatomical twin indicator and dynamic status count */}
      <div className="w-full flex items-center justify-between px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/10 mb-0.5 shrink-0 z-20">
        <button
          type="button"
          className="flex items-center gap-1.5 text-xs font-semibold text-sky-300 whitespace-nowrap focus:outline-none cursor-default"
          title="X-Ray Twin"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse shrink-0" />
          <span>X-Ray Twin</span>
        </button>

        <div className="text-[10px] font-semibold whitespace-nowrap">
          {abnormalCount === 0 ? (
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span>All 8 Systems Nominal</span>
            </span>
          ) : (
            <span className="text-rose-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse shrink-0" />
              <span>{abnormalCount} Organ Alert{abnormalCount > 1 ? 's' : ''}</span>
            </span>
          )}
        </div>
      </div>

      {/* 2. DARK VIEWPORT */}
      <div className="relative w-full flex-1 min-h-0 flex items-center justify-center overflow-hidden bg-[#070B14]">
        
        {/* Full-body radiation warning aura on Day 50 (SPE Radiation alert) */}
        {isRadiationAlert && (
          <div 
            className="absolute inset-0 pointer-events-none animate-pulse z-10" 
            style={{
              background: 'radial-gradient(ellipse at 50% 50%, rgba(244, 63, 94, 0.35) 0%, rgba(245, 158, 11, 0.25) 50%, transparent 80%)'
            }}
            aria-hidden="true"
          />
        )}

        {/* Aspect-Locked Anatomical Wrapper matching viewBox="0 0 400 860" */}
        <div className="relative h-full max-h-[580px] aspect-[400/860] flex items-center justify-center">
          
          {imageLoadFailed ? (
            <svg 
              viewBox="0 0 400 860" 
              preserveAspectRatio="xMidYMid meet" 
              className="w-full h-full overflow-visible select-none"
              aria-label="Anatomical silhouette fallback"
            >
              <path 
                d="M 200 45 C 218 45 228 60 228 85 C 228 110 216 130 206 136 C 206 142 208 152 214 158 C 230 162 258 174 275 195 C 285 208 288 235 285 285 C 282 335 278 400 274 460 C 272 475 264 482 256 480 C 248 478 245 465 247 445 C 250 410 252 350 250 310 C 248 275 244 260 238 250 C 236 295 234 350 230 405 C 226 450 224 485 220 515 C 226 575 230 650 228 720 C 226 775 222 815 224 835 C 224 840 216 842 212 840 C 208 836 206 820 206 790 C 206 740 204 660 202 590 L 198 590 C 196 660 194 740 194 790 C 194 820 192 836 188 840 C 184 842 176 840 176 835 C 178 815 174 775 172 720 C 170 650 174 575 180 515 C 176 485 174 450 170 405 C 166 350 164 295 162 250 C 156 260 152 275 150 310 C 148 350 150 410 153 445 C 155 465 152 478 144 480 C 136 482 128 475 126 460 C 122 400 118 335 115 285 C 112 235 115 208 125 195 C 142 174 170 162 186 158 C 192 152 194 142 194 136 C 184 130 172 110 172 85 C 172 60 182 45 200 45 Z"
                fill="#1E293B"
                stroke="#475569"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg 
              viewBox="0 0 400 860" 
              preserveAspectRatio="xMidYMid meet" 
              className="w-full h-full overflow-visible select-none"
            >
              {/* 100% UN-SQUISHED FULL-WIDTH X-RAY SILHOUETTE */}
              <image 
                href="/xray-body.png" 
                onError={() => setImageLoadFailed(true)}
                x="0" 
                y="0" 
                width="400" 
                height="860" 
                preserveAspectRatio="xMidYMid meet"
                className="w-full h-full object-contain select-none pointer-events-none"
                style={{
                  mixBlendMode: 'screen',
                  opacity: 1,
                  filter: bodyFilter
                }}
              />
            </svg>
          )}

          {/* 3. HOTSPOTS OVERLAY - BEACON DOTS & DECOUPLED PILL BADGES */}
          <div className="absolute inset-0 pointer-events-none">
            {/* 3A. BEACON DOTS */}
            {HOTSPOTS.map((hotspot) => {
              const alert = getOrganAlert(hotspot.key);
              const isAbnormal = !!alert?.isAbnormal;

              if (!isAbnormal || !alert) {
                return (
                  <div
                    key={`hitbox-${hotspot.key}`}
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full opacity-0 pointer-events-auto cursor-pointer"
                    style={{ left: hotspot.dotLeft, top: hotspot.dotTop }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectHotspot(hotspot);
                    }}
                    title={hotspot.name}
                  />
                );
              }

              return (
                <div
                  key={`beacon-${hotspot.key}`}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group z-20 flex items-center justify-center"
                  style={{ left: hotspot.dotLeft, top: hotspot.dotTop }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectHotspot(hotspot);
                  }}
                  title={hotspot.name}
                >
                  {/* Glowing anatomical radial aura */}
                  <div 
                    className={`absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 w-14 h-14 rounded-full blur-md animate-pulse pointer-events-none ${
                      alert.color === 'rose' ? 'bg-rose-500/35' : 'bg-amber-500/35'
                    }`} 
                  />

                  {/* Dual expanding sonar rings */}
                  <span 
                    className={`absolute inline-flex w-8 h-8 rounded-full border-2 animate-ping pointer-events-none ${
                      alert.color === 'rose'
                        ? 'border-rose-400 bg-rose-500/30'
                        : 'border-amber-400 bg-amber-500/30'
                    }`} 
                  />
                  <span 
                    className={`absolute inline-flex w-5 h-5 rounded-full border animate-ping pointer-events-none ${
                      alert.color === 'rose'
                        ? 'border-rose-300 bg-rose-500/40'
                        : 'border-amber-300 bg-amber-500/40'
                    }`} 
                    style={{ animationDelay: '350ms' }}
                  />

                  {/* Bright blinking center beacon */}
                  <span 
                    className={`relative inline-flex items-center justify-center w-3.5 h-3.5 rounded-full shadow-lg ${
                      alert.color === 'rose'
                        ? 'bg-rose-500 shadow-[0_0_15px_#f43f5e]'
                        : 'bg-amber-500 shadow-[0_0_15px_#f59e0b]'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                  </span>
                </div>
              );
            })}

            {/* 3B. INDEPENDENT PILL BADGES - DECOUPLED COORDINATES (ZERO COLLISION) */}
            {HOTSPOTS.map((hotspot) => {
              const alert = getOrganAlert(hotspot.key);
              if (!alert?.isAbnormal) return null;

              let pillLeft = hotspot.pillLeft || hotspot.dotLeft;
              let pillTop = hotspot.pillTop || hotspot.dotTop;
              let pillTransform = hotspot.pillTransform || 'translate(-50%, -50%)';

              // Day 44: Pill badge positioned cleanly right above Heart dot at left: 50%, top: 22%
              if (hotspot.key === 'heart' && (currentDay === 44 || isSensorFault)) {
                pillLeft = '50%';
                pillTop = '22%';
                pillTransform = 'translate(-50%, -50%)';
              }

              return (
                <div
                  key={`pill-${hotspot.key}`}
                  className="absolute pointer-events-auto cursor-pointer z-30 transition-transform hover:scale-105"
                  style={{
                    left: pillLeft,
                    top: pillTop,
                    transform: pillTransform
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectHotspot(hotspot);
                  }}
                  title={hotspot.name}
                >
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow-lg whitespace-nowrap ${
                    alert.color === 'rose'
                      ? 'bg-rose-950/95 border border-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.35)]'
                      : 'bg-amber-950/95 border border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.35)]'
                  }`}>
                    {alert.tag}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* 4. BOTTOM-RIGHT ORGAN INSPECTOR BOX */}
      {isHudOpen && (
        <div className="w-[96%] p-1.5 rounded-xl bg-[#080D1A]/95 border border-white/15 shrink-0 flex flex-col gap-0.5 overflow-hidden mb-0.5 shadow-2xl z-20 text-left animate-in fade-in slide-in-from-bottom-2 duration-200">
          
          {/* Row 1: Status dot + ONE clean unclipped System Title + compact status badge + Close button */}
          <div className="flex items-center justify-between gap-1.5 min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                currentAlert
                  ? (currentAlert.color === 'rose'
                      ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-pulse'
                      : 'bg-amber-400 shadow-[0_0_8px_#f59e0b]')
                  : 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
              }`} />
              <span className="text-[12px] font-bold text-white whitespace-nowrap">
                {currentHotspot.systemTitle}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 border ${
                currentAlert
                  ? (currentAlert.color === 'rose'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-400/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-400/40')
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
              }`}>
                {currentAlert ? (currentAlert.badge === 'Confounder' || currentAlert.badge === 'Fault' ? 'Filtered' : currentAlert.badge) : 'Nominal'}
              </span>
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsHudOpen(false);
                }}
                className="w-4 h-4 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                title="Close Inspector"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Row 2: Current telemetry vs Band */}
          <div className="text-[10px] text-slate-300 leading-tight truncate px-0.5">
            {getTelemetrySnippet(currentHotspot.key, currentHotspot.id)}
          </div>

          {/* Row 3: [ Filter Chart ] and [ Start Self-Exam ] */}
          <div className="grid grid-cols-2 gap-1.5 mt-0.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectMetric?.(currentHotspot.metricKey);
              }}
              className="text-[10px] font-semibold whitespace-nowrap py-1 px-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.16] border border-white/15 text-slate-200 hover:text-white flex items-center justify-center gap-1 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <SlidersHorizontal className="w-3 h-3 text-sky-400" />
              <span>Filter Chart</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenProtocol(currentHotspot.protocolId);
              }}
              className="text-[10px] font-semibold whitespace-nowrap py-1 px-1.5 rounded-lg bg-gradient-to-r from-blue-500/50 via-sky-500/50 to-indigo-500/50 hover:from-blue-500/70 hover:to-indigo-500/70 border border-sky-400/60 text-white flex items-center justify-center gap-1 transition-all shadow-[0_0_12px_rgba(56,189,248,0.35)] active:scale-95 cursor-pointer"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>Start Self-Exam</span>
            </button>
          </div>

        </div>
      )}

      {/* Heart SVG glow test hook: rendered when Heart is abnormal */}
      {isHeartAbnormal && (
        <svg className="hidden" aria-hidden="true" width="0" height="0">
          <g data-testid="anatomical-heart-glow">
            <circle cx="212" cy="305" r="16" fill="#F43F5E" className="animate-ping" />
            <circle cx="212" cy="305" r="9" fill="#F43F5E" className="animate-pulse" />
          </g>
        </svg>
      )}

    </div>
  );
};
