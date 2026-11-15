// src/App.tsx
// MISSION PULSE — Apple VisionOS Glassmorphism Aerospace Telemetry Console
// Master 96-Agent Architecture & Single-Source-of-Truth React Context Integration

import React from 'react';
import { 
  MissionProvider, 
  useMissionContext, 
  type ActiveView 
} from './context/MissionContext';

// VisionOS Pixel-Clone Core Components
import { VisionHeader } from './components/VisionHeader';
import { VisionSidebar, type SidebarSection } from './components/VisionSidebar';
import { VisionVitalCards } from './components/VisionVitalCards';
import { VisionSplineChart } from './components/VisionSplineChart';
import { VisionActionCards } from './components/VisionActionCards';
import { VisionBodyPanel } from './components/VisionBodyPanel';
import { VisionDayScrubber } from './components/VisionDayScrubber';

// NASA & CSA 16-Module Dedicated Views
import { VitalsAndSensorsView } from './components/VitalsAndSensorsView';
import { TrendsModuleView } from './components/TrendsModuleView';
import { ExplainableRuleTrace } from './components/ExplainableRuleTrace';
import { ActivitySleepView } from './components/ActivitySleepView';
import { CognitiveStateView } from './components/CognitiveStateView';
import { EnvironmentView } from './components/EnvironmentView';
import { MissionContextView } from './components/MissionContextView';
import { FlightSurgeonView } from './components/FlightSurgeonView';

// Modals & Slide-Over Drawers
import { MissionLogDrawer } from './components/MissionLogDrawer';
import { OfficialCitationsModal } from './components/OfficialCitationsModal';
import { CsvImportExportModal } from './components/CsvImportExportModal';
import { SelfAssessmentModal } from './components/SelfAssessmentModal';
import { PulseAiAssistant } from './components/PulseAiAssistant';

function MainConsole() {
  const {
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
    commProfile,
    setCommProfile,
    userRole,
    setUserRole,
    bands,
    ruleTrace,
    currentRecord,
    isDrifting,
    isBaselineFrozenManual,
    setIsBaselineFrozenManual,
    queuedPackages,
    queueGroundPackage,
    acknowledgePackageBySurgeon,
    acknowledgeAndBeginVerification,
    completeVerificationAndResolve,
    morningRoutineDone,
    exerciseRoutineDone,
    eveningRoutineDone,
    toggleMorningRoutine,
    toggleExerciseRoutine,
    toggleEveningRoutine,
    isMissionLogOpen,
    setIsMissionLogOpen,
    isCsvModalOpen,
    setIsCsvModalOpen,
    isCitationsModalOpen,
    setIsCitationsModalOpen,
    selectedCitationId,
    isProtocolModalOpen,
    setIsProtocolModalOpen,
    activeProtocolId,
    setActiveProtocolId,
    isAiAssistantOpen,
    setIsAiAssistantOpen,
    openProtocolModal,
    openCitationsModal
  } = useMissionContext();

  // Sidebar mapping
  const activeSidebarSection: SidebarSection | undefined = React.useMemo(() => {
    switch (activeView) {
      case 'overview': return 'overview';
      case 'sensors': return 'sensors';
      case 'activity': return 'activity';
      case 'cognitive': return 'cognitive';
      case 'environment': return 'environment';
      case 'alerts': return 'alerts';
      case 'context': return 'context';
      default: return undefined;
    }
  }, [activeView]);

  const handleSelectSidebarSection = (section: SidebarSection) => {
    switch (section) {
      case 'overview': setActiveView('overview'); break;
      case 'sensors': setActiveView('sensors'); break;
      case 'activity': setActiveView('activity'); break;
      case 'cognitive': setActiveView('cognitive'); break;
      case 'environment': setActiveView('environment'); break;
      case 'alerts': setActiveView('alerts'); break;
      case 'context': setActiveView('context'); break;
    }
  };

  const handleVitalMetricSelect = (metric: string) => {
    setSelectedMetric(metric);
    if (metric === 'restingHR' || metric === 'bloodPressure') {
      setActivePin('heart');
    } else if (metric === 'glucose') {
      setActivePin('liver');
    } else if (metric === 'bodyTemp') {
      setActivePin('immune');
    } else if (metric === 'sleep' || metric === 'sleepHours') {
      setActivePin('circadian');
    } else if (metric === 'radiation') {
      setActivePin('immune');
    } else if (metric === 'spo2') {
      setActivePin('lungs');
    } else if (metric === 'activity') {
      setActivePin('femur');
    }
  };

  const hasAlert = currentDay === 30 || ruleTrace.lifecycleState === 'PERSISTENT_TREND_DETECTED';

  return (
    <div className="w-screen h-dvh max-h-dvh overflow-hidden bg-[#060A12] text-white flex flex-col font-sans select-none relative">
      
      {/* 0. EARTH HORIZON BACKDROP IN BOTTOM-LEFT CORNER */}
      <div 
        className="absolute bottom-0 left-0 w-[480px] h-[340px] pointer-events-none z-0"
        style={{
          backgroundImage: 'url(/earth-corner.png)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom left',
          backgroundSize: 'contain',
          opacity: 0.85
        }}
      />

      {/* Atmospheric blue curvature glow behind sidebar */}
      <div 
        className="absolute bottom-[-100px] left-[-80px] w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.16) 0%, rgba(37, 99, 235, 0.10) 40%, transparent 75%)',
          filter: 'blur(30px)'
        }}
      />

      {/* Deep space background ambient lighting */}
      <div 
        className="absolute top-0 right-1/4 w-[800px] h-[400px] rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(30, 58, 138, 0.12) 0%, transparent 70%)',
          filter: 'blur(60px)'
        }}
      />

      {/* 1. TOP HEADER BAR (h-14 shrink-0 px-6) */}
      <VisionHeader
        currentDay={currentDay}
        commProfile={commProfile}
        onChangeCommProfile={setCommProfile}
        userRole={userRole}
        onChangeRole={setUserRole}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenMissionLog={() => setIsMissionLogOpen(true)}
        onOpenCitations={() => openCitationsModal()}
        onOpenCsvModal={() => setIsCsvModalOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(!isAiAssistantOpen)}
      />

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 min-h-0 w-full px-4 pb-3 pt-1 flex gap-3.5 overflow-hidden relative z-10">
        
        {/* Left Glass Sidebar (w-56 shrink-0 h-full rounded-3xl) */}
        <VisionSidebar
          currentDay={currentDay}
          activeSection={activeSidebarSection}
          onSelectSection={handleSelectSidebarSection}
          onOpenMissionLog={() => setIsMissionLogOpen(true)}
          isDrifting={isDrifting}
        />

        {/* Center Glass Workspace */}
        <main className="flex-1 min-w-0 h-full min-h-0 rounded-3xl bg-[#0A0F1D]/85 backdrop-blur-2xl border border-white/12 p-3.5 shadow-[0_16px_48px_rgba(0,0,0,0.6)] overflow-hidden relative flex flex-col justify-between">
          
          {/* VIEW A: MAIN PIXEL-FOR-PIXEL DASHBOARD (Live / Health Overview) */}
          {activeView === 'overview' && (
            <div className="w-full h-full min-h-0 grid grid-cols-12 gap-3.5 overflow-hidden">
              
              {/* Left/Center Column (col-span-9 min-w-0 h-full min-h-0 flex flex-col gap-2.5 overflow-hidden) */}
              <div className="col-span-9 min-w-0 h-full min-h-0 flex flex-col gap-2.5 overflow-hidden">
                
                {/* 1. Header Row (shrink-0 h-9 flex items-center justify-between) */}
                <div className="shrink-0 h-9 flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold text-white tracking-tight leading-tight">
                      Crew A-03
                    </h1>
                    <p className="text-[11px] text-slate-300 font-normal leading-tight">
                      Real-time Health & Performance
                    </p>
                  </div>

                  {/* Dynamic Status Pill & Interactive Day Controller */}
                  <VisionDayScrubber
                    currentDay={currentDay}
                    onSelectDay={setCurrentDay}
                    record={currentRecord}
                  />
                </div>

                {/* 2. 6 Tinted Glass Vital Cards (shrink-0 h-[104px] grid grid-cols-6 gap-2.5) */}
                <VisionVitalCards
                  record={currentRecord}
                  records={records}
                  bands={bands}
                  currentDay={currentDay}
                  onSelectMetric={handleVitalMetricSelect}
                  onSelectPin={setActivePin}
                  onOpenSelfExam={openProtocolModal}
                />

                {/* 3. Main Glass Spline Area Chart (flex-1 min-h-0 w-full) */}
                <VisionSplineChart
                  records={records}
                  currentDay={currentDay}
                  bands={bands}
                  onSelectDay={setCurrentDay}
                  selectedMetric={selectedMetric}
                  onSelectMetric={handleVitalMetricSelect}
                  onOpenRuleTrace={() => setActiveView('alerts')}
                />

                {/* 4. Bottom 3 Glass Action Cards (shrink-0 h-[68px] grid grid-cols-3 gap-2.5) */}
                <VisionActionCards
                  currentDay={currentDay}
                  record={currentRecord}
                  onOpenRuleTrace={() => setActiveView('alerts')}
                  onOpenMissionContext={() => setActiveView('context')}
                  onLaunchSelfExam={() => openProtocolModal('protocol-resting-hr')}
                  isDrifting={isDrifting}
                />

              </div>

              {/* Right Column: Translucent X-ray Human Body on Glowing Pedestal (col-span-3 min-w-0 h-full min-h-0 flex flex-col justify-end relative overflow-hidden) */}
              <div className="col-span-3 min-w-0 h-full min-h-0 flex flex-col justify-end relative overflow-hidden">
                <VisionBodyPanel
                  currentDay={currentDay}
                  record={currentRecord}
                  bands={bands}
                  activePin={activePin}
                  onSelectPin={setActivePin}
                  onSelectMetric={handleVitalMetricSelect}
                  onOpenProtocol={openProtocolModal}
                  onOpenCitations={openCitationsModal}
                  isDrifting={isDrifting}
                />
              </div>

            </div>
          )}

          {/* VIEW B: VITALS & SENSORS (Sidebar: sensors) — Module B */}
          {activeView === 'sensors' && (
            <div className="h-full min-h-0 overflow-hidden">
              <VitalsAndSensorsView
                currentDay={currentDay}
                record={currentRecord}
                records={records}
                onUpdateRecord={updateRecord}
                onOpenCsvModal={() => setIsCsvModalOpen(true)}
                bands={bands}
                onOpenProtocol={openProtocolModal}
              />
            </div>
          )}

          {/* VIEW C: 60-DAY MISSION TRENDS (Top Tab: trends) — Modules C & H */}
          {activeView === 'trends' && (
            <div className="h-full min-h-0 overflow-hidden">
              <TrendsModuleView
                records={records}
                currentDay={currentDay}
                bands={bands}
                onSelectDay={setCurrentDay}
              />
            </div>
          )}

          {/* VIEW D: EVENTS & ALERTS (Top Tab: events / Sidebar: alerts) — Module I */}
          {activeView === 'alerts' && (
            <div className="h-full min-h-0 overflow-hidden">
              <ExplainableRuleTrace
                ruleTrace={ruleTrace}
                bands={bands}
                currentDay={currentDay}
                onOpenProtocol={openProtocolModal}
                onQueueGroundPackage={() => queueGroundPackage()}
                onAcknowledgeAlert={acknowledgeAndBeginVerification}
              />
            </div>
          )}

          {/* VIEW E: ACTIVITY & SLEEP (Sidebar: activity) — Module J */}
          {activeView === 'activity' && (
            <div className="h-full min-h-0 overflow-hidden">
              <ActivitySleepView
                currentDay={currentDay}
                record={currentRecord}
                onOpenCitations={() => openCitationsModal('nasa-artemis-actigraphy')}
                morningDone={morningRoutineDone}
                exerciseDone={exerciseRoutineDone}
                eveningDone={eveningRoutineDone}
                onToggleMorning={toggleMorningRoutine}
                onToggleExercise={toggleExerciseRoutine}
                onToggleEvening={toggleEveningRoutine}
              />
            </div>
          )}

          {/* VIEW F: COGNITIVE STATE & ANALYSIS (Top Tab: analysis / Sidebar: cognitive) — Modules D, L, P */}
          {activeView === 'cognitive' && (
            <div className="h-full min-h-0 overflow-hidden">
              <CognitiveStateView
                currentDay={currentDay}
                record={currentRecord}
                onUpdateRecord={updateRecord}
                onResolveAlert={(val, proto) => completeVerificationAndResolve(val, proto)}
                onOpenProtocol={openProtocolModal}
                onOpenCitations={openCitationsModal}
              />
            </div>
          )}

          {/* VIEW G: ENVIRONMENT (Sidebar: environment) — Module M */}
          {activeView === 'environment' && (
            <div className="h-full min-h-0 overflow-hidden">
              <EnvironmentView
                currentDay={currentDay}
                record={currentRecord}
                records={records}
                onTriggerSpeStorm={() => setCurrentDay(50)}
              />
            </div>
          )}

          {/* VIEW H: MISSION CONTEXT (Sidebar: context) — Modules F & O */}
          {activeView === 'context' && (
            <div className="h-full min-h-0 overflow-hidden">
              <MissionContextView
                currentDay={currentDay}
                onOpenCitations={openCitationsModal}
                onHighlightOrgan={(pin) => {
                  setActivePin(pin);
                  setActiveView('overview');
                }}
              />
            </div>
          )}

          {/* VIEW I: REPORTS & FLIGHT SURGEON GROUND LOOP (Top Tab: reports) — Modules K, N, P */}
          {activeView === 'reports' && (
            <div className="h-full min-h-0 overflow-hidden">
              <FlightSurgeonView
                currentDay={currentDay}
                commProfile={commProfile}
                currentRecord={currentRecord}
                ruleTrace={ruleTrace}
                onDeployProtocol={openProtocolModal}
                queuedPackages={queuedPackages}
                isBaselineFrozenManual={isBaselineFrozenManual}
                onToggleBaselineFreeze={() => setIsBaselineFrozenManual(!isBaselineFrozenManual)}
                onAcknowledgeGuidance={(note) => {
                  if (queuedPackages.length > 0) {
                    acknowledgePackageBySurgeon(queuedPackages[0].id, note);
                  }
                }}
              />
            </div>
          )}

        </main>

      </div>

      {/* 3. MODAL DIALOGS & DRAWERS */}
      
      {/* 16-Step Commander Vega Mission Log Drawer */}
      <MissionLogDrawer
        isOpen={isMissionLogOpen}
        onClose={() => setIsMissionLogOpen(false)}
        currentDay={currentDay}
        onSelectDay={setCurrentDay}
      />

      {/* CSV Import / Export Modal */}
      <CsvImportExportModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        currentRecords={records}
        onImportRecords={(newRecords) => {
          importRecords(newRecords);
          setIsCsvModalOpen(false);
        }}
        onResetDefault={resetDefaultDataset}
      />

      {/* Official NASA & CSA Research Citations Modal */}
      <OfficialCitationsModal
        isOpen={isCitationsModalOpen}
        onClose={() => setIsCitationsModalOpen(false)}
        selectedResourceId={selectedCitationId}
      />

      {/* Guided Self-Assessment Protocol Execution Modal */}
      <SelfAssessmentModal
        isOpen={isProtocolModalOpen}
        onClose={() => setIsProtocolModalOpen(false)}
        initialProtocolId={activeProtocolId}
        currentDay={currentDay}
        onResolveAlert={(verifiedValue, protoName) => completeVerificationAndResolve(verifiedValue, protoName)}
      />

      {/* Autonomous Clinical AI Advisory Voice Agent (PulseAiAssistant Side Panel) */}
      <PulseAiAssistant
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        onOpenCitations={openCitationsModal}
        currentDay={currentDay}
        onSelectDay={setCurrentDay}
        onSelectMetric={setSelectedMetric}
        onNavigate={(view) => setActiveView(view as ActiveView)}
        onOpenProtocol={openProtocolModal}
      />

    </div>
  );
}

export default function App() {
  return (
    <MissionProvider>
      <MainConsole />
    </MissionProvider>
  );
}
