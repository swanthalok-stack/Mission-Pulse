// src/components/VitalsAndSensorsView.tsx
// Module B: Simulated Wearable & Sensor Integration in 100% Apple VisionOS Dark Frosted Glass
// 3 Hardware Stream Cards + Working Manual Crew Entry Form + CSV Sync

import React, { useState } from 'react';
import { 
  Radio, 
  Watch, 
  Activity, 
  FileSpreadsheet, 
  Check, 
  PlusCircle,
  Database
} from 'lucide-react';
import type { DayRecord, PersonalBaselineBand } from '../types/mission';

interface Props {
  currentDay: number;
  record: DayRecord;
  records: DayRecord[];
  onUpdateRecord: (updatedRecord: DayRecord) => void;
  onOpenCsvModal: () => void;
  bands?: Record<string, PersonalBaselineBand>;
  onOpenProtocol?: (protocolId: string) => void;
}

const ManualCrewEntrySection: React.FC<{
  currentDay: number;
  record: DayRecord;
  onUpdateRecord: (updated: DayRecord) => void;
}> = ({ currentDay, record, onUpdateRecord }) => {
  const [formHR, setFormHR] = useState(record.restingHR.toString());
  const [formSys, setFormSys] = useState(record.bpSystolic.toString());
  const [formDia, setFormDia] = useState(record.bpDiastolic.toString());
  const [formGlu, setFormGlu] = useState(record.glucose.toString());
  const [formGluTag, setFormGluTag] = useState<'Fasting' | 'After Meal'>(record.glucoseTag);
  const [formTemp, setFormTemp] = useState(record.bodyTemp.toString());
  const [formSleep, setFormSleep] = useState(record.sleepHours.toString());
  const [formMood, setFormMood] = useState<1 | 2 | 3 | 4 | 5>(record.mood);
  const [formExercise, setFormExercise] = useState(record.exercise);
  const [logSuccess, setLogSuccess] = useState(false);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: DayRecord = {
      ...record,
      restingHR: Number(formHR) || record.restingHR,
      bpSystolic: Number(formSys) || record.bpSystolic,
      bpDiastolic: Number(formDia) || record.bpDiastolic,
      glucose: Number(formGlu) || record.glucose,
      glucoseTag: formGluTag,
      bodyTemp: Number(formTemp) || record.bodyTemp,
      sleepHours: Number(formSleep) || record.sleepHours,
      mood: formMood,
      exercise: formExercise,
      provenanceTag: '[MANUAL CREW ENTRY]',
      exclusionReason: null
    };

    onUpdateRecord(updated);
    setLogSuccess(true);
    setTimeout(() => setLogSuccess(false), 3000);
  };

  return (
    <div className="xl:col-span-6 flex flex-col justify-between p-5 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-lg">
      <div>
        <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">Manual Crew Telemetry Log</h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
            PROVENANCE: [MANUAL CREW ENTRY]
          </span>
        </div>

        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          When hardware telemetry is delayed or sensor loose artifacts occur, crew can manually log clinical observations directly into the local SQLite/memory enclave. Baseline bands immediately recalculate.
        </p>

        <form onSubmit={handleManualSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-300 font-medium block mb-1">Resting HR (bpm)</label>
              <input
                type="number"
                value={formHR}
                onChange={(e) => setFormHR(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-sky-400"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-300 font-medium block mb-1">BP (Systolic / Diastolic)</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  value={formSys}
                  onChange={(e) => setFormSys(e.target.value)}
                  className="w-1/2 px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-sky-400"
                />
                <span className="text-slate-400">/</span>
                <input
                  type="number"
                  value={formDia}
                  onChange={(e) => setFormDia(e.target.value)}
                  className="w-1/2 px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-300 font-medium block mb-1">Glucose (mg/dL)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={formGlu}
                  onChange={(e) => setFormGlu(e.target.value)}
                  className="w-1/2 px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-sky-400"
                />
                <select
                  value={formGluTag}
                  onChange={(e) => setFormGluTag(e.target.value as any)}
                  className="w-1/2 px-2 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:border-sky-400 cursor-pointer"
                >
                  <option value="Fasting">Fasting</option>
                  <option value="After Meal">After Meal</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-300 font-medium block mb-1">Tympanic Temp (°C)</label>
              <input
                type="number"
                step="0.1"
                value={formTemp}
                onChange={(e) => setFormTemp(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-sky-400"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-300 font-medium block mb-1">Sleep Duration (hrs)</label>
              <input
                type="number"
                step="0.1"
                value={formSleep}
                onChange={(e) => setFormSleep(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-sky-400"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-300 font-medium block mb-1">Mood Valence (1-5)</label>
              <select
                value={formMood}
                onChange={(e) => setFormMood(Number(e.target.value) as any)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs focus:outline-none focus:border-sky-400 cursor-pointer"
              >
                <option value={5}>5 · Optimal Resilience</option>
                <option value={4}>4 · Good Functional Tone</option>
                <option value={3}>3 · Mild Fatigue Accumulation</option>
                <option value={2}>2 · Moderate Exhaustion</option>
                <option value={1}>1 · Critical Stress / Fatigue</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-300 font-medium block mb-1">Exercise Countermeasure</label>
            <input
              type="text"
              value={formExercise}
              onChange={(e) => setFormExercise(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:outline-none focus:border-sky-400"
              placeholder="e.g. ARED Squat/Deadlift 90 min"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">
              Target: Day {currentDay} telemetry record
            </span>

            <button
              type="submit"
              className="px-5 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 text-slate-950 font-bold text-xs shadow-[0_0_16px_rgba(16,185,129,0.4)] flex items-center gap-1.5 transition-all active:scale-95"
            >
              {logSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Telemetry Updated Live!</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Log Crew Measurement</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <Database className="w-3.5 h-3.5 text-sky-400" />
          <span>Current Provenance: <strong className="text-white">{record.provenanceTag}</strong></span>
        </span>
        <span>MET Day {currentDay}</span>
      </div>
    </div>
  );
};

type SensorStatusType = 'CONNECTED' | 'DELAYED' | 'FAULT' | 'OFFLINE';

export const VitalsAndSensorsView: React.FC<Props> = ({
  currentDay,
  record,
  records: _records,
  onUpdateRecord,
  onOpenCsvModal,
  bands: _bands,
  onOpenProtocol
}) => {
  // Sensor hardware states
  const [artemisStatus, setArtemisStatus] = useState<SensorStatusType>('CONNECTED');
  const [cuffStatus, setCuffStatus] = useState<SensorStatusType>('CONNECTED');
  const [cansStatus, setCansStatus] = useState<SensorStatusType>('CONNECTED');

  // Status button click handler
  const handleSensorStatusChange = (sensor: 'artemis' | 'cuff' | 'cans', status: SensorStatusType) => {
    if (sensor === 'artemis') {
      setArtemisStatus(status);
      if (status === 'FAULT') {
        // Inject motion artifact into current record
        onUpdateRecord({
          ...record,
          rawSignalQuality: 22,
          restingHR: 205,
          exclusionReason: 'EXCLUDED_LOW_SIGNAL_QUALITY',
          provenanceTag: '[SIMULATED SENSOR STREAM]'
        });
      } else if (status === 'CONNECTED') {
        onUpdateRecord({
          ...record,
          rawSignalQuality: 98,
          restingHR: record.restingHR === 205 ? 58 : record.restingHR,
          exclusionReason: undefined
        });
      }
    } else if (sensor === 'cuff') {
      setCuffStatus(status);
      if (status === 'FAULT') {
        onUpdateRecord({
          ...record,
          bpSystolic: 175,
          bpDiastolic: 110,
          provenanceTag: '[SIMULATED SENSOR STREAM]'
        });
      } else if (status === 'CONNECTED') {
        onUpdateRecord({
          ...record,
          bpSystolic: 116,
          bpDiastolic: 75
        });
      }
    } else {
      setCansStatus(status);
      if (status === 'FAULT') {
        onUpdateRecord({
          ...record,
          radiationDose: 3.45,
          provenanceTag: '[SIMULATED SENSOR STREAM]'
        });
      } else if (status === 'CONNECTED') {
        onUpdateRecord({
          ...record,
          radiationDose: 0.42
        });
      }
    }
  };

  const hardwareStreams = [
    {
      id: 'artemis' as const,
      name: 'Artemis II Optical & Actigraphy Band',
      subtitle: 'Wrist-worn Multispectral PPG & 3-Axis Accelerometer',
      status: artemisStatus,
      battery: '94%',
      signalQuality: artemisStatus === 'FAULT' ? '22% (Motion Degraded)' : artemisStatus === 'DELAYED' ? '74% (Delayed Sync)' : artemisStatus === 'OFFLINE' ? '0% (Offline)' : '98% (Crisp Waveform)',
      lastSync: artemisStatus === 'DELAYED' ? '4h 12m ago' : artemisStatus === 'OFFLINE' ? 'Disconnected' : '14s ago'
    },
    {
      id: 'cuff' as const,
      name: 'Brachial Hemodynamic Cuff',
      subtitle: 'CSA Arterial Stiffness & Oscillometric Waveform Ingest',
      status: cuffStatus,
      battery: '88%',
      signalQuality: cuffStatus === 'FAULT' ? '18% (Oscillometric Leak / Artifact)' : cuffStatus === 'DELAYED' ? '82% (Delayed Sync)' : cuffStatus === 'OFFLINE' ? '0% (Offline)' : '99% (Calibrated)',
      lastSync: cuffStatus === 'DELAYED' ? '6h 04m ago' : cuffStatus === 'OFFLINE' ? 'Disconnected' : '18m ago'
    },
    {
      id: 'cans' as const,
      name: 'CSA CANS & Radi-N2 Neutron Spectrometer',
      subtitle: 'Microdosimeter Ingest & Storm Particle Ionization Stream',
      status: cansStatus,
      battery: '100% (Bus Power)',
      signalQuality: cansStatus === 'FAULT' ? '14% (Chamber Saturation / Spike)' : cansStatus === 'DELAYED' ? '78% (Delayed Stream)' : cansStatus === 'OFFLINE' ? '0% (Offline)' : '100% (Telemetry Nominal)',
      lastSync: cansStatus === 'DELAYED' ? '2h 30m ago' : cansStatus === 'OFFLINE' ? 'Disconnected' : 'Real-time'
    }
  ];

  return (
    <div className="h-full flex flex-col justify-between space-y-4 select-none">
      
      {/* Top Header Row */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Radio className="w-5 h-5 text-sky-400" />
            <span>Vitals & Biosensor Hardware Streams (Module B)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Artemis II Actigraphy · CSA CANS Radiation Ingest · Manual Crew Logging & CSV Synchronization
          </p>
        </div>

        <button
          onClick={onOpenCsvModal}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-xs font-semibold text-white transition-all shadow-md active:scale-95"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-sky-300" />
          <span>CSV Import / Export Hub</span>
        </button>
      </div>

      {/* Main Content Grid: 3 Hardware Cards (Left 6 cols) + Manual Crew Entry (Right 6 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 flex-1 min-h-0 overflow-y-auto pr-1">
        
        {/* LEFT 6 COLS: 3 APPLE GLASS HARDWARE STREAM CARDS */}
        <div className="xl:col-span-6 flex flex-col gap-3.5">
          <span className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
            Active Biosensor Telemetry Channels
          </span>

          {hardwareStreams.map((hw) => {
            return (
              <div
                key={hw.id}
                className="p-4 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 hover:border-white/20 transition-all shadow-lg flex flex-col justify-between gap-3"
              >
                {/* Header & Status Indicator */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/12 flex items-center justify-center text-sky-400 shrink-0">
                      {hw.id === 'artemis' ? <Watch className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-tight">{hw.name}</h3>
                      <p className="text-[11px] text-slate-400">{hw.subtitle}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                    hw.status === 'CONNECTED'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                      : hw.status === 'FAULT'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-400/40 animate-pulse'
                      : hw.status === 'DELAYED'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                      : 'bg-slate-500/20 text-slate-300 border-slate-400/40'
                  }`}>
                    {hw.status}
                  </span>
                </div>

                {/* Telemetry Metadata Pills */}
                <div className="grid grid-cols-3 gap-2 py-1 px-3 rounded-2xl bg-black/40 border border-white/5 text-[11px]">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Battery</span>
                    <span className="font-semibold text-white">{hw.battery}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Signal Fidelity</span>
                    <span className="font-semibold text-sky-300 truncate block">{hw.signalQuality}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Last Sync</span>
                    <span className="font-semibold text-slate-300">{hw.lastSync}</span>
                  </div>
                </div>

                {/* Working Status Buttons with Color-Independent Geometric Cues */}
                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    onClick={() => handleSensorStatusChange(hw.id, 'CONNECTED')}
                    className={`flex-1 py-1 px-1.5 rounded-xl text-[10px] font-semibold transition-all whitespace-nowrap ${
                      hw.status === 'CONNECTED'
                        ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/50 shadow-sm'
                        : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/5'
                    }`}
                    title="● Connected (Fresh <1m telemetry stream)"
                  >
                    ● Connected
                  </button>

                  <button
                    onClick={() => handleSensorStatusChange(hw.id, 'DELAYED')}
                    className={`flex-1 py-1 px-1.5 rounded-xl text-[10px] font-semibold transition-all whitespace-nowrap ${
                      hw.status === 'DELAYED'
                        ? 'bg-amber-500/30 text-amber-200 border border-amber-400/50 shadow-sm'
                        : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/5'
                    }`}
                    title="▲ Delayed (>4h stale telemetry)"
                  >
                    ▲ Delayed
                  </button>

                  <button
                    onClick={() => handleSensorStatusChange(hw.id, 'FAULT')}
                    className={`flex-1 py-1 px-1.5 rounded-xl text-[10px] font-semibold transition-all whitespace-nowrap ${
                      hw.status === 'FAULT'
                        ? 'bg-rose-500/30 text-rose-200 border border-rose-400/50 shadow-sm'
                        : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/5'
                    }`}
                    title="◆ Inject Motion Artifact / Loose Sensor Fault"
                  >
                    ◆ Inject Fault
                  </button>

                  <button
                    onClick={() => handleSensorStatusChange(hw.id, 'OFFLINE')}
                    className={`flex-1 py-1 px-1.5 rounded-xl text-[10px] font-semibold transition-all whitespace-nowrap ${
                      hw.status === 'OFFLINE'
                        ? 'bg-slate-500/40 text-slate-100 border border-slate-300/50 shadow-sm'
                        : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/5'
                    }`}
                    title="■ Offline (Manual Entry Required)"
                  >
                    ■ Offline
                  </button>
                </div>

                {/* 1-Click Fallback to Module D when Channel is OFFLINE */}
                {hw.status === 'OFFLINE' && (
                  <div className="mt-2 p-2.5 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-between text-xs text-amber-200 animate-in fade-in duration-200">
                    <span className="text-[11px] font-medium">Stale Telemetry · Channel Offline</span>
                    <button
                      onClick={() => onOpenProtocol?.(hw.id === 'cuff' ? 'protocol-blood-pressure' : 'protocol-resting-hr')}
                      className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-[10px] shadow-sm transition-all"
                    >
                      ▶ Module D Guided Check-In
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* RIGHT 6 COLS: WORKING MANUAL CREW ENTRY FORM */}
        <ManualCrewEntrySection 
          key={record.day} 
          currentDay={currentDay} 
          record={record} 
          onUpdateRecord={onUpdateRecord} 
        />

      </div>

    </div>
  );
};
