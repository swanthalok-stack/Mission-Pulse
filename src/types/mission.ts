// src/types/mission.ts
// MISSION PULSE — 2026 NASA Space Apps Challenge Architecture Types

export const MISSION_PULSE_SCHEMA_VERSION = '2026.1.0';

export type GlucoseTag = 'Fasting' | 'After Meal';

export type ExclusionReason = 
  | 'EXCLUDED_POST_EXERCISE_CONFOUNDER' 
  | 'POST_PRANDIAL_CONTEXT' 
  | 'EXCLUDED_LOW_SIGNAL_QUALITY' 
  | null;

export type ProvenanceTag = 
  | '[PUBLIC RESEARCH REFERENCE]' 
  | '[SYNTHETIC MISSION SCENARIO]' 
  | '[SIMULATED SENSOR STREAM]' 
  | '[MANUAL CREW ENTRY]';

export interface DayRecord {
  day: number; // 1 - 60
  restingHR: number; // bpm
  activeHR?: number; // bpm (optional peak/active)
  bpSystolic: number; // mmHg
  bpDiastolic: number; // mmHg
  glucose: number; // mg/dL
  glucoseTag: GlucoseTag;
  bodyTemp: number; // °C
  sleepHours: number; // hours
  mood: 1 | 2 | 3 | 4 | 5; // 1: Severe Stress, 5: Optimal Resilience
  exercise: string; // e.g., 'ARED + Treadmill 90 min'
  radiationDose: number; // mGy/day
  notes: string;
  exclusionReason?: ExclusionReason;
  provenanceTag: ProvenanceTag;
  rawSignalQuality?: number; // 0 - 100%
}

export interface PersonalBaselineBand {
  metric: string;
  unit: string;
  median: number;
  mad: number; // Median Absolute Deviation
  lowerBound: number;
  upperBound: number;
  vFloor: number;
  isFrozen: boolean;
  frozenAtDay?: number;
  status?: string;
  isCalibrating?: boolean;
}

export type LifecycleState = 
  | 'CALIBRATING' 
  | 'NOMINAL' 
  | 'PERSISTENT_TREND_DETECTED' 
  | 'VERIFICATION_REQUIRED' 
  | 'RESOLVED';

export interface CounterfactualExplanation {
  day: number;
  metric: string;
  value: number;
  threshold: number;
  reason: string;
  whyNotFired: string;
}

export interface RuleTraceEvent {
  currentDay: number;
  lifecycleState: LifecycleState;
  conditionsPassed: {
    ruleId: string;
    description: string;
    passed: boolean;
    details: string;
  }[];
  includedRecords: DayRecord[];
  excludedRecords: DayRecord[];
  counterfactualWhyNotFired: CounterfactualExplanation[];
  recommendedProtocolId?: string;
  summaryRationale: string;
  timestamp: string;
}

export type SystemId = 
  | 'cardiovascular'
  | 'neuro_ocular'
  | 'musculoskeletal'
  | 'immune_hematology'
  | 'endocrine_metabolic'
  | 'respiratory'
  | 'renal_fluid'
  | 'psychological_circadian';

export interface PhysiologicalSystem {
  id: SystemId;
  name: string;
  organTarget: string;
  status: 'nominal' | 'monitoring' | 'warning' | 'alert';
  hotspotCoords: { x: number; y: number }; // Percentage coords on SVG figure
  summary: string;
  spaceflightRisks: string[];
  keyVitals: string[];
  protocols: string[];
  nasaReferenceId: string;
}

export type HazardId = 'R' | 'I' | 'D' | 'G' | 'E';

export interface SpaceflightHazard {
  id: HazardId;
  letter: string;
  title: string;
  fullName: string;
  aerospaceImpact: string;
  primaryCountermeasures: string[];
  associatedSystems: SystemId[];
  csaNasaUrl: string;
}

export interface SelfAssessmentProtocol {
  id: string;
  title: string;
  category: string;
  targetHazard: string;
  durationMinutes: number;
  steps: {
    stepNumber: number;
    title: string;
    instruction: string;
    expectedNormal: string;
  }[];
  warningThresholds: string;
  remedialActions: string[];
}

export type CommProfileType = 'leo' | 'lunar' | 'mars';

export interface CommProfile {
  id: CommProfileType;
  label: string;
  latencySeconds: number;
  lossOfSignalChance: number; // 0 - 1
  description: string;
}

export interface SensorStatus {
  id: string;
  name: string;
  source: string;
  status: 'ONLINE' | 'NOISY' | 'DISCONNECTED' | 'CALIBRATING';
  batteryPct: number;
  signalConfidence: number; // 0 - 100%
  lastSyncDay: number;
}

export interface SANSCheckRecord {
  day: number;
  amslerGridNormal: boolean;
  distortionNoted: boolean;
  nearAcuityOD: string; // Right eye e.g. "20/20"
  nearAcuityOS: string; // Left eye
  scotomaDetected: boolean;
  notes: string;
}

export type UserRole = 'crew' | 'flight_surgeon';

export interface VegaMilestone {
  step: number;
  day: number;
  title: string;
  subtitle: string;
  statusBadge: string;
  description: string;
  category: 'nominal' | 'filter' | 'drift' | 'recovery' | 'sensor' | 'radiation';
}
