// src/context/MissionContext.tsx
// Master Global React Context for MISSION PULSE (NASA Space Apps 2026)
// Synchronizes reactive state across all 16 Functional Modules (A through P)

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import type { 
  DayRecord, 
  CommProfileType, 
  UserRole, 
  PersonalBaselineBand, 
  RuleTraceEvent, 
  SANSCheckRecord 
} from '../types/mission';
import { generateCommanderVegaDataset } from '../data/vegaDataset';
import { computePersonalBaselineBands, evaluateRuleTrace } from '../engine/baselineEngine';

export type ActiveView = 
  | 'overview' 
  | 'sensors' 
  | 'trends' 
  | 'alerts' 
  | 'activity' 
  | 'cognitive' 
  | 'environment' 
  | 'context' 
  | 'reports';

export type PinId = 
  | 'brain' 
  | 'eyes' 
  | 'circadian' 
  | 'heart' 
  | 'lungs' 
  | 'liver' 
  | 'immune' 
  | 'femur';

export interface GroundPackage {
  id: string;
  day: number;
  title: string;
  createdAt: string;
  commProfile: CommProfileType;
  remainingSec: number;
  status: 'PACKAGED_LOCALLY' | 'QUEUED_FOR_UPLINK' | 'TRANSMITTING' | 'ACKNOWLEDGED_BY_GROUND';
  ruleTraceSnapshot?: any;
  guidanceFromSurgeon?: string;
}

interface MissionContextType {
  // Master Dataset State (Module B, C, H)
  records: DayRecord[];
  currentDay: number;
  setCurrentDay: (day: number) => void;
  updateRecord: (updated: DayRecord) => void;
  resetDefaultDataset: () => void;
  importRecords: (newRecords: DayRecord[]) => void;

  // Active Navigation & View (Module A - P)
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Active Health Metric & 3D Organ Selection (Module A, E, H)
  selectedMetric: string;
  setSelectedMetric: (metric: string) => void;
  activePin: PinId;
  setActivePin: (pin: PinId) => void;
  isHudOpen: boolean;
  setIsHudOpen: (open: boolean) => void;

  // Connectivity, Roles & Ground Telemetry (Module K, N)
  commProfile: CommProfileType;
  setCommProfile: (profile: CommProfileType) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isLosBlackout: boolean;
  setIsLosBlackout: (los: boolean) => void;
  queuedPackages: GroundPackage[];
  queueGroundPackage: (title?: string) => void;
  acknowledgePackageBySurgeon: (pkgId: string, guidanceNote: string) => void;

  // Baseline Engine & Explainable Trace (Module C, I)
  bands: Record<string, PersonalBaselineBand>;
  ruleTrace: RuleTraceEvent;
  currentRecord: DayRecord;
  isDrifting: boolean;
  isBaselineFrozenManual: boolean;
  setIsBaselineFrozenManual: (frozen: boolean) => void;
  activeAlertAcknowledged: boolean;
  acknowledgeAndBeginVerification: () => void;
  completeVerificationAndResolve: (verifiedValue?: number, protocolName?: string) => void;

  // SANS & Neuro-Ocular Exam Data (Module L)
  sansExamRecord: SANSCheckRecord | null;
  saveSANSExam: (record: SANSCheckRecord) => void;

  // Ethical Gamification & Routine Rings (Module J)
  morningRoutineDone: boolean;
  exerciseRoutineDone: boolean;
  eveningRoutineDone: boolean;
  toggleMorningRoutine: () => void;
  toggleExerciseRoutine: () => void;
  toggleEveningRoutine: () => void;

  // Role-Based Privacy & Offline Mode (Module P, G, K)
  privacyMaskConsent: boolean;
  setPrivacyMaskConsent: (consent: boolean) => void;
  offlineDeepSpaceMode: boolean;
  setOfflineDeepSpaceMode: (offline: boolean) => void;

  // Modals & Slide-Over Drawers (Global)
  isMissionLogOpen: boolean;
  setIsMissionLogOpen: (open: boolean) => void;
  isCsvModalOpen: boolean;
  setIsCsvModalOpen: (open: boolean) => void;
  isCitationsModalOpen: boolean;
  setIsCitationsModalOpen: (open: boolean) => void;
  selectedCitationId?: string;
  setSelectedCitationId: (id?: string) => void;
  isProtocolModalOpen: boolean;
  setIsProtocolModalOpen: (open: boolean) => void;
  activeProtocolId: string;
  setActiveProtocolId: (id: string) => void;
  isAiAssistantOpen: boolean;
  setIsAiAssistantOpen: (open: boolean) => void;
  openProtocolModal: (protocolId: string) => void;
  openCitationsModal: (citationId?: string) => void;
}

const MissionContext = createContext<MissionContextType | undefined>(undefined);

export const MissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Master 60-Day Scenario Dataset (Persisted to localStorage for Module K offline-first architecture)
  const [records, setRecords] = useState<DayRecord[]>(() => {
    try {
      const saved = localStorage.getItem('MISSION_PULSE_DATASET_V1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback to default
    }
    return generateCommanderVegaDataset();
  });

  // Current Mission Day (default to Day 30 to showcase active persistent drift)
  const [currentDay, setCurrentDay] = useState<number>(30);

  // Unified Single View Routing
  const [activeView, setActiveView] = useState<ActiveView>('overview');
  const [selectedMetric, setSelectedMetric] = useState<string>('restingHR');
  const [activePin, setActivePin] = useState<PinId>('heart');
  const [isHudOpen, setIsHudOpen] = useState<boolean>(true);

  // Hardware Channels, Ground Comm & Role
  const [commProfile, setCommProfile] = useState<CommProfileType>('leo');
  const [userRole, setUserRole] = useState<UserRole>('crew');
  const [isLosBlackout, setIsLosBlackout] = useState<boolean>(false);

  // Baseline freeze manual override
  const [isBaselineFrozenManual, setIsBaselineFrozenManual] = useState<boolean>(false);

  // Alert acknowledgement & lifecycle tracking
  const [activeAlertAcknowledged, setActiveAlertAcknowledged] = useState<boolean>(false);

  // Ground packages store-and-forward queue
  const [queuedPackages, setQueuedPackages] = useState<GroundPackage[]>([
    {
      id: 'pkg-initial-sync',
      day: 30,
      title: 'Day 30 Persistent Trend Audit Package (3-of-4 Rule Triggered)',
      createdAt: 'MET 030/12:45 UTC',
      commProfile: 'leo',
      remainingSec: 0,
      status: 'ACKNOWLEDGED_BY_GROUND',
      guidanceFromSurgeon: 'Mission Control Flight Surgeon: Confirmed 4-day sleep compression & +11 bpm autonomic drift. Maintain 8h protected sleep window & repeat morning brachial BP check on Day 31.'
    }
  ]);

  // SANS Exam Record
  const [sansExamRecord, setSansExamRecord] = useState<SANSCheckRecord | null>(null);

  // Daily Routine Rings (Module J)
  const [morningRoutineDone, setMorningRoutineDone] = useState<boolean>(true);
  const [exerciseRoutineDone, setExerciseRoutineDone] = useState<boolean>(false);
  const [eveningRoutineDone, setEveningRoutineDone] = useState<boolean>(false);

  // Psychological Privacy Mask (Module P)
  const [privacyMaskConsent, setPrivacyMaskConsent] = useState<boolean>(false);

  // Offline Deep Space Cache (Module G, K)
  const [offlineDeepSpaceMode, setOfflineDeepSpaceMode] = useState<boolean>(true);

  // Modals & Drawers
  const [isMissionLogOpen, setIsMissionLogOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isCitationsModalOpen, setIsCitationsModalOpen] = useState(false);
  const [selectedCitationId, setSelectedCitationId] = useState<string | undefined>(undefined);
  const [isProtocolModalOpen, setIsProtocolModalOpen] = useState(false);
  const [activeProtocolId, setActiveProtocolId] = useState<string>('protocol-resting-hr');
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

  // Persist records to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('MISSION_PULSE_DATASET_V1', JSON.stringify(records));
    } catch {
      // Storage quota or private browsing fallback
    }
  }, [records]);

  // Active top navigation tab derived from activeView
  const activeTab = useMemo<string>(() => {
    switch (activeView) {
      case 'overview':
      case 'sensors':
      case 'environment':
        return 'live';
      case 'trends':
        return 'trends';
      case 'alerts':
        return 'events';
      case 'cognitive':
      case 'activity':
        return 'analysis';
      case 'reports':
      case 'context':
        return 'reports';
      default:
        return 'live';
    }
  }, [activeView]);

  const setActiveTab = (tab: string) => {
    if (tab === 'live') setActiveView('overview');
    else if (tab === 'trends') setActiveView('trends');
    else if (tab === 'events') setActiveView('alerts');
    else if (tab === 'analysis') setActiveView('cognitive');
    else if (tab === 'reports') setActiveView('reports');
  };

  // Stage 2 & 3: Compute Personal Baseline Bands with Day 26 Freeze or Manual Override
  const bands = useMemo(() => {
    return computePersonalBaselineBands(records, currentDay, isBaselineFrozenManual);
  }, [records, currentDay, isBaselineFrozenManual]);

  // Stage 4: Authoritative 3-of-4 Persistence Rule Engine
  const baseRuleTrace = useMemo(() => {
    return evaluateRuleTrace(records, currentDay, bands);
  }, [records, currentDay, bands]);

  // Modify rule trace if user clicked "Acknowledge & Begin Verification Monitoring"
  const ruleTrace = useMemo(() => {
    if (activeAlertAcknowledged && currentDay >= 27 && currentDay <= 30) {
      return {
        ...baseRuleTrace,
        lifecycleState: 'VERIFICATION_REQUIRED' as const,
        summaryRationale: 'Crew acknowledged 3-of-4 day persistence trend. Autonomous verification protocol active. Telemetry monitoring window initialized.'
      };
    }
    return baseRuleTrace;
  }, [baseRuleTrace, activeAlertAcknowledged, currentDay]);

  // Current day telemetry record
  const currentRecord = useMemo(() => {
    return records.find(r => r.day === currentDay) || records[0];
  }, [records, currentDay]);

  const isDrifting = currentDay >= 27 && currentDay <= 30;

  // Actions
  const updateRecord = (updated: DayRecord) => {
    setRecords(prev => prev.map(r => r.day === updated.day ? updated : r));
  };

  const resetDefaultDataset = () => {
    const fresh = generateCommanderVegaDataset();
    setRecords(fresh);
    setCurrentDay(30);
    setActiveAlertAcknowledged(false);
    try {
      localStorage.setItem('MISSION_PULSE_DATASET_V1', JSON.stringify(fresh));
    } catch {}
  };

  const importRecords = (newRecords: DayRecord[]) => {
    setRecords(newRecords);
    try {
      localStorage.setItem('MISSION_PULSE_DATASET_V1', JSON.stringify(newRecords));
    } catch {}
  };

  const acknowledgeAndBeginVerification = () => {
    setActiveAlertAcknowledged(true);
  };

  const queueGroundPackage = (title?: string) => {
    const delays: Record<CommProfileType, number> = {
      leo: 2,
      lunar: 4,
      mars: 12
    };
    const delaySec = isLosBlackout ? 30 : delays[commProfile];
    const newPkg: GroundPackage = {
      id: `pkg-${Date.now()}`,
      day: currentDay,
      title: title || `Day ${currentDay} Rule Trace & Baseline Snapshot`,
      createdAt: `MET 0${currentDay}/14:20 UTC`,
      commProfile,
      remainingSec: delaySec,
      status: isLosBlackout ? 'QUEUED_FOR_UPLINK' : 'TRANSMITTING',
      ruleTraceSnapshot: ruleTrace
    };

    setQueuedPackages(prev => [newPkg, ...prev]);

    // Live countdown timer
    const interval = setInterval(() => {
      setQueuedPackages(prev => {
        const target = prev.find(p => p.id === newPkg.id);
        if (!target) {
          clearInterval(interval);
          return prev;
        }
        if (target.remainingSec <= 1) {
          clearInterval(interval);
          return prev.map(p => p.id === newPkg.id ? { ...p, remainingSec: 0, status: 'ACKNOWLEDGED_BY_GROUND' } : p);
        }
        return prev.map(p => p.id === newPkg.id ? { ...p, remainingSec: p.remainingSec - 1 } : p);
      });
    }, 1000);
  };

  const completeVerificationAndResolve = (verifiedValue?: number, protocolName?: string) => {
    // Determine which physiological metric was verified
    if (verifiedValue !== undefined) {
      const rec = records.find(r => r.day === currentDay);
      if (rec) {
        const protoLower = (protocolName || '').toLowerCase();
        let updated = { ...rec, provenanceTag: '[MANUAL CREW ENTRY]' as const };

        if (protoLower.includes('blood pressure') || protoLower.includes('bp')) {
          updated.bpSystolic = verifiedValue;
          updated.bpDiastolic = Math.round(verifiedValue * 0.65);
        } else if (protoLower.includes('glucose')) {
          updated.glucose = verifiedValue;
        } else if (protoLower.includes('temp')) {
          updated.bodyTemp = verifiedValue;
        } else if (protoLower.includes('sleep') || protoLower.includes('mood')) {
          updated.sleepHours = verifiedValue;
        } else {
          updated.restingHR = verifiedValue;
        }

        updated.notes = `${rec.notes} [Guided Self-Exam: ${protocolName || 'Resting Protocol'} verified at ${verifiedValue}].`;
        updateRecord(updated);
      }
    }

    // Advance daily stewardship rings to 100%
    setMorningRoutineDone(true);
    setExerciseRoutineDone(true);
    setEveningRoutineDone(true);
    setActiveAlertAcknowledged(false);

    // Queue Store-and-Forward Ground Support Package in Module K
    queueGroundPackage(`Day ${currentDay} Guided Verification Hand-Off (${protocolName || 'Physiological Protocol'})`);

    // Transition lifecycle to RESOLVED (Day 34) if verifying during drift
    if (currentDay >= 27 && currentDay <= 30) {
      setCurrentDay(34);
    }
    setIsProtocolModalOpen(false);
  };

  const acknowledgePackageBySurgeon = (pkgId: string, guidanceNote: string) => {
    setQueuedPackages(prev => prev.map(p => {
      if (p.id === pkgId) {
        return {
          ...p,
          status: 'ACKNOWLEDGED_BY_GROUND',
          remainingSec: 0,
          guidanceFromSurgeon: guidanceNote
        };
      }
      return p;
    }));
  };

  const saveSANSExam = (record: SANSCheckRecord) => {
    setSansExamRecord(record);
  };

  const toggleMorningRoutine = () => setMorningRoutineDone(!morningRoutineDone);
  const toggleExerciseRoutine = () => setExerciseRoutineDone(!exerciseRoutineDone);
  const toggleEveningRoutine = () => setEveningRoutineDone(!eveningRoutineDone);

  const openProtocolModal = (protocolId: string) => {
    setActiveProtocolId(protocolId);
    setIsProtocolModalOpen(true);
  };

  const openCitationsModal = (citationId?: string) => {
    setSelectedCitationId(citationId);
    setIsCitationsModalOpen(true);
  };

  return (
    <MissionContext.Provider
      value={{
        records,
        currentDay,
        setCurrentDay,
        updateRecord,
        resetDefaultDataset,
        importRecords,
        activeView,
        setActiveView,
        activeTab,
        setActiveTab,
        selectedMetric,
        setSelectedMetric,
        activePin,
        setActivePin,
        isHudOpen,
        setIsHudOpen,
        commProfile,
        setCommProfile,
        userRole,
        setUserRole,
        isLosBlackout,
        setIsLosBlackout,
        queuedPackages,
        queueGroundPackage,
        acknowledgePackageBySurgeon,
        bands,
        ruleTrace,
        currentRecord,
        isDrifting,
        isBaselineFrozenManual,
        setIsBaselineFrozenManual,
        activeAlertAcknowledged,
        acknowledgeAndBeginVerification,
        completeVerificationAndResolve,
        sansExamRecord,
        saveSANSExam,
        morningRoutineDone,
        exerciseRoutineDone,
        eveningRoutineDone,
        toggleMorningRoutine,
        toggleExerciseRoutine,
        toggleEveningRoutine,
        privacyMaskConsent,
        setPrivacyMaskConsent,
        offlineDeepSpaceMode,
        setOfflineDeepSpaceMode,
        isMissionLogOpen,
        setIsMissionLogOpen,
        isCsvModalOpen,
        setIsCsvModalOpen,
        isCitationsModalOpen,
        setIsCitationsModalOpen,
        selectedCitationId,
        setSelectedCitationId,
        isProtocolModalOpen,
        setIsProtocolModalOpen,
        activeProtocolId,
        setActiveProtocolId,
        isAiAssistantOpen,
        setIsAiAssistantOpen,
        openProtocolModal,
        openCitationsModal
      }}
    >
      {children}
    </MissionContext.Provider>
  );
};

export const useMissionContext = (): MissionContextType => {
  const context = useContext(MissionContext);
  if (!context) {
    throw new Error('useMissionContext must be used within a MissionProvider');
  }
  return context;
};
