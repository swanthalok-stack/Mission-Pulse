// src/components/CsvImportExportModal.tsx
// Modules B & P: CSV Import/Export Modal for Member 1's Google Sheet & Telemetry Export
// 100% Apple VisionOS Dark Frosted Glass with Zero Monospace

import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  FileSpreadsheet,
  Database
} from 'lucide-react';
import type { DayRecord } from '../types/mission';
import { exportDatasetToCSV, parseCSVToDataset } from '../data/vegaDataset';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentRecords: DayRecord[];
  onImportRecords: (newRecords: DayRecord[]) => void;
  onResetDefault: () => void;
}

export const CsvImportExportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentRecords,
  onImportRecords,
  onResetDefault
}) => {
  const [csvText, setCsvText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvText(text);
      validateAndImport(text);
    };
    reader.readAsText(file);
  };

  const validateAndImport = (text: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const parsed = parseCSVToDataset(text);
      if (parsed.length === 0) {
        throw new Error('No valid records parsed from CSV.');
      }
      onImportRecords(parsed);
      setSuccessMsg(`Successfully imported ${parsed.length} day records! Telemetry updated live.`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to parse CSV. Please ensure valid Google Sheet format.');
    }
  };

  const handleDownloadCSV = () => {
    const csvString = exportDatasetToCSV(currentRecords);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'MISSION_PULSE_Vega_60Day_Dataset.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0A0F1D]/95 backdrop-blur-3xl border border-white/20 shadow-[0_24px_64px_rgba(0,0,0,0.8)] overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sky-500/20 border border-sky-400/30 text-sky-300">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Mission CSV Import & Export Hub</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Full 60-Day Commander Vega Dataset synchronization with Google Sheets
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Import vs Export Tabs */}
        <div className="px-6 py-2.5 bg-black/30 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('import')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'import'
                  ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 font-bold shadow-md'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white'
              }`}
            >
              Import CSV
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'export'
                  ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 font-bold shadow-md'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white'
              }`}
            >
              Export CSV
            </button>
          </div>

          <button
            onClick={onResetDefault}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-medium text-slate-300 hover:text-white transition-all"
            title="Reset to official baseline 60-day mission dataset"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset Default Dataset</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {activeTab === 'import' ? (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl border border-dashed border-white/20 hover:border-sky-400/50 bg-white/[0.02] flex flex-col items-center justify-center text-center space-y-2 cursor-pointer transition-colors relative">
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="w-8 h-8 text-sky-400" />
                <span className="text-xs font-bold text-white">Upload CSV File</span>
                <p className="text-[11px] text-slate-400">
                  Select a .csv file exported from the official Google Sheet
                </p>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Or Paste CSV Text Directly:</label>
                <textarea
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  placeholder="day,restingHR,activeHR,bpSystolic,bpDiastolic,glucose,glucoseTag,bodyTemp,sleepHours,mood,exercise,radiationDose,notes,exclusionReason,provenanceTag..."
                  rows={6}
                  className="w-full p-3 rounded-2xl bg-black/40 border border-white/15 text-xs text-slate-200 focus:outline-none focus:border-sky-400 resize-none font-sans"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => validateAndImport(csvText)}
                  disabled={!csvText.trim()}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 font-bold text-xs disabled:opacity-40 disabled:pointer-events-none hover:scale-105 transition-all shadow-md active:scale-95"
                >
                  Parse & Apply Dataset
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                Export all 60 days of clinical telemetry records as a standardized CSV file for offline review, Google Sheets import, or flight surgeon handover.
              </p>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Commander Vega 60-Day Telemetry Log</span>
                  <span className="text-[11px] text-slate-400">{currentRecords.length} records ready for export</span>
                </div>

                <button
                  onClick={handleDownloadCSV}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 font-bold text-xs shadow-md hover:scale-105 transition-all active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .CSV</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-sky-400" />
            <span>Dataset Schema Version: 2026.1.0</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
