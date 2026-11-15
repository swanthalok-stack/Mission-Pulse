// src/data/vegaDataset.ts
// Pre-loaded 60-Day Commander Vega Dataset and CSV Import/Export Engine

import type { DayRecord, VegaMilestone } from '../types/mission';

export const VEGA_16_MILESTONES: VegaMilestone[] = [
  {
    step: 1,
    day: 1,
    title: 'Mission Launch & Sync',
    subtitle: 'Artemis II Orbital Insertion',
    statusBadge: 'CALIBRATING',
    description: 'Commander Vega reaches orbit. Biosensors online. Baseline calibration begins.',
    category: 'nominal'
  },
  {
    step: 2,
    day: 7,
    title: 'Cephalic Fluid Shift Adaptation',
    subtitle: 'Day 7 Microgravity Transition',
    statusBadge: 'CALIBRATING',
    description: 'Normal initial fluid redistribution. Wearable actigraphy and optical pulse tracking steadily.',
    category: 'nominal'
  },
  {
    step: 3,
    day: 14,
    title: '14-Day Calibration Complete',
    subtitle: 'Personal Baseline Bands Established',
    statusBadge: 'NOMINAL',
    description: 'Median (M) and Median Absolute Deviation (MAD) calculated across Days 1–14. Reference bands locked.',
    category: 'nominal'
  },
  {
    step: 4,
    day: 16,
    title: 'Post-Meal Glucose Context',
    subtitle: 'Fake Alarm #1 Suppressed',
    statusBadge: 'FILTERED',
    description: 'Glucose rises to 138 mg/dL 30m after lunch. Filter tags POST_PRANDIAL_CONTEXT. Zero false alarm.',
    category: 'filter'
  },
  {
    step: 5,
    day: 19,
    title: 'Post-Exercise HR Spike',
    subtitle: 'Fake Alarm #2 Suppressed',
    statusBadge: 'FILTERED',
    description: 'Post-ARED active HR reaches 142 bpm. Flagged EXCLUDED_POST_EXERCISE_CONFOUNDER. Morning resting HR is nominal 59 bpm.',
    category: 'filter'
  },
  {
    step: 6,
    day: 22,
    title: 'Routine Orbital Telemetry',
    subtitle: 'Nominal Operations',
    statusBadge: 'NOMINAL',
    description: 'All 6 core vitals well within personalized M ± 2*MAD bands. SANS Amsler grid normal.',
    category: 'nominal'
  },
  {
    step: 7,
    day: 26,
    title: 'Pre-Drift Baseline Lock',
    subtitle: 'Baseline Frozen at Day 26',
    statusBadge: 'FROZEN',
    description: 'System freezes the healthy personal baseline window to prevent pathological drift contamination.',
    category: 'drift'
  },
  {
    step: 8,
    day: 27,
    title: 'Subclinical Drift — Day 1',
    subtitle: 'Fatigue Accumulation Starts',
    statusBadge: 'MONITORING',
    description: 'Resting HR ticks up to 63 bpm, sleep drops to 6.3h. Single-day deviation logged without panic.',
    category: 'drift'
  },
  {
    step: 9,
    day: 28,
    title: 'Subclinical Drift — Day 2',
    subtitle: 'Sleep Compression Deepens',
    statusBadge: 'MONITORING',
    description: 'Resting HR reaches 65 bpm, sleep drops to 6.0h. Mood softens to 3. Second day of drift recorded.',
    category: 'drift'
  },
  {
    step: 10,
    day: 29,
    title: 'Subclinical Drift — Day 3',
    subtitle: 'Mild Low-Grade Immune Elevation',
    statusBadge: 'EVALUATING',
    description: 'Resting HR 67 bpm, sleep 5.7h, temp rises to 37.0°C. 3 of last 4 days now breach upper bounds.',
    category: 'drift'
  },
  {
    step: 11,
    day: 30,
    title: '3-of-4 Persistence Alert',
    subtitle: 'PERSISTENT_TREND_DETECTED',
    statusBadge: 'ALERT',
    description: 'HR reaches 69 bpm, sleep 5.5h, temp 37.2°C. Authoritative 3-of-4 day rule fires. Transparent XAI audit triggered.',
    category: 'drift'
  },
  {
    step: 12,
    day: 31,
    title: 'Countermeasure Deployment',
    subtitle: 'Protected 8h Sleep & Hydration Reset',
    statusBadge: 'INTERVENTION',
    description: 'Crew activates Protected Circadian Recovery and targeted electrolyte restoration protocols.',
    category: 'recovery'
  },
  {
    step: 13,
    day: 34,
    title: 'Clinical Recovery Verified',
    subtitle: 'Event Transitions to RESOLVED',
    statusBadge: 'RESOLVED',
    description: 'Resting HR steps down to 59 bpm, sleep rebounds to 7.6h, mood returns to 4. System marks event RESOLVED.',
    category: 'recovery'
  },
  {
    step: 14,
    day: 44,
    title: 'Hardware Sensor Artifact',
    subtitle: 'Loose Wristband Signal Fault',
    statusBadge: 'FILTERED',
    description: 'Optical sensor slips during sleep, outputting raw 205 bpm. Filtered as EXCLUDED_LOW_SIGNAL_QUALITY. No false alert.',
    category: 'sensor'
  },
  {
    step: 15,
    day: 50,
    title: 'CSA Solar Particle Event Drill',
    subtitle: 'Radiation Flare 2.8 mGy/day',
    statusBadge: 'STORM SHELTER',
    description: 'SPE triggers CSA CANS alarm. Crew ingresses water-shielded habitat core and activates Radi-N2 dosimeters.',
    category: 'radiation'
  },
  {
    step: 16,
    day: 60,
    title: 'Mission Complete & Medical Handover',
    subtitle: '60-Day Telemetry Package Ready',
    statusBadge: 'NOMINAL',
    description: 'Full 60-day mission dataset verified. Complete clinical audit trail ready for terrestrial flight surgeon handover.',
    category: 'nominal'
  }
];

export function generateCommanderVegaDataset(): DayRecord[] {
  const records: DayRecord[] = [];

  for (let day = 1; day <= 60; day++) {
    let restingHR = 58;
    let activeHR: number | undefined = undefined;
    let bpSystolic = 115;
    let bpDiastolic = 75;
    let glucose = 91;
    let glucoseTag: 'Fasting' | 'After Meal' = 'Fasting';
    let bodyTemp = 36.6;
    let sleepHours = 7.5;
    let mood: 1 | 2 | 3 | 4 | 5 = 4;
    let exercise = 'ARED Resistive 45m + Cycle Ergometer 30m';
    let radiationDose = 0.42;
    let notes = 'Nominal mission status.';
    let exclusionReason: DayRecord['exclusionReason'] = null;
    let provenanceTag: DayRecord['provenanceTag'] = '[SIMULATED SENSOR STREAM]';
    let rawSignalQuality = 98;

    // --- PHASE 1: DAYS 1 - 14 (CALIBRATION) ---
    if (day <= 14) {
      provenanceTag = '[SYNTHETIC MISSION SCENARIO]';
      const dayJitter = ((day * 7) % 5) - 2; // -2 to +2
      restingHR = 58 + ((day % 3) === 0 ? 1 : (day % 3 === 1 ? -1 : 0)) + Math.round(dayJitter * 0.5);
      restingHR = Math.max(57, Math.min(61, restingHR));
      bpSystolic = 114 + (day % 4);
      bpDiastolic = 74 + (day % 3);
      glucose = 90 + ((day * 3) % 7) - 3; // 87 - 94
      bodyTemp = 36.6 + ((day % 3) - 1) * 0.1;
      sleepHours = 7.4 + ((day % 4) - 1.5) * 0.2;
      mood = (day % 4 === 0 ? 5 : 4) as 4 | 5;
      radiationDose = Number((0.40 + ((day % 5) * 0.025)).toFixed(2));
      notes = day === 1 
        ? 'Artemis II Launch. Initial zero-g sensor calibration.' 
        : day === 14 
        ? 'Day 14 Calibration complete. Personal median & MAD bands calculated.' 
        : `Nominal baseline calibration day ${day}.`;
    }

    // --- PHASE 2: DAYS 15 - 26 (NOMINAL + FAKE ALARM CHECKS) ---
    else if (day >= 15 && day <= 26) {
      restingHR = 59 + ((day % 3) - 1);
      bpSystolic = 116 + (day % 3);
      bpDiastolic = 75 + (day % 2);
      glucose = 91 + (day % 5);
      bodyTemp = 36.6;
      sleepHours = 7.4;
      mood = 4;
      radiationDose = Number((0.42 + (day % 3) * 0.02).toFixed(2));
      notes = 'Nominal orbital operations.';

      // Day 16: Fake Alarm #1 - Post-Meal Glucose
      if (day === 16) {
        glucose = 138;
        glucoseTag = 'After Meal';
        notes = '30 min after lunch. Post-prandial glucose spike.';
        exclusionReason = 'POST_PRANDIAL_CONTEXT';
        provenanceTag = '[MANUAL CREW ENTRY]';
      }

      // Day 19: Fake Alarm #2 - Post-Exercise Active HR Spike
      if (day === 19) {
        restingHR = 59; // Morning resting HR is nominal
        activeHR = 142; // Peak HR logged 15m after intense ARED
        exercise = 'ARED + Treadmill 90 min (High Intensity)';
        notes = '15 min post-workout active HR 142 bpm. Morning resting HR was 59 bpm.';
        exclusionReason = 'EXCLUDED_POST_EXERCISE_CONFOUNDER';
        provenanceTag = '[SIMULATED SENSOR STREAM]';
      }

      // Day 26: Pre-drift anchor day
      if (day === 26) {
        restingHR = 59;
        sleepHours = 7.3;
        notes = 'Pre-drift baseline anchor day. Personal baseline frozen at Day 26.';
      }
    }

    // --- PHASE 3: DAYS 27 - 30 (PERSISTENT DRIFT ONSET) ---
    else if (day >= 27 && day <= 30) {
      provenanceTag = '[SIMULATED SENSOR STREAM]';
      if (day === 27) {
        restingHR = 63;
        sleepHours = 6.3;
        mood = 3;
        bodyTemp = 37.0;
        bpSystolic = 124;
        bpDiastolic = 81;
        glucose = 97;
        notes = 'Persistent drift day 1: Elevated resting HR, mild sleep disturbance.';
      } else if (day === 28) {
        restingHR = 65;
        sleepHours = 6.0;
        mood = 3;
        bodyTemp = 37.1;
        bpSystolic = 126;
        bpDiastolic = 83;
        glucose = 99;
        notes = 'Persistent drift day 2: Fatigue noted, resting HR continuing upward trend.';
      } else if (day === 29) {
        restingHR = 67;
        sleepHours = 5.7;
        mood = 2;
        bodyTemp = 37.2;
        bpSystolic = 128;
        bpDiastolic = 84;
        glucose = 103;
        notes = 'Persistent drift day 3: Cumulative sleep debt, mild subfebrile state.';
      } else if (day === 30) {
        restingHR = 69;
        sleepHours = 5.5;
        mood = 2;
        bodyTemp = 37.2;
        bpSystolic = 130;
        bpDiastolic = 86;
        glucose = 105;
        notes = 'Persistent drift day 4: 3-of-4 rule fired (PERSISTENT_TREND_DETECTED). Autonomous recovery protocol indicated.';
      }
    }

    // --- PHASE 4: DAYS 31 - 34 (COUNTERMEASURES & RECOVERY) ---
    else if (day >= 31 && day <= 34) {
      provenanceTag = '[SIMULATED SENSOR STREAM]';
      if (day === 31) {
        restingHR = 66;
        sleepHours = 7.8;
        mood = 3;
        bodyTemp = 37.0;
        bpSystolic = 124;
        bpDiastolic = 80;
        glucose = 96;
        notes = 'Recovery Day 1: Protected 8h Sleep Reset and electrolyte hydration initiated.';
      } else if (day === 32) {
        restingHR = 63;
        sleepHours = 8.0;
        mood = 3;
        bodyTemp = 36.8;
        bpSystolic = 120;
        bpDiastolic = 78;
        glucose = 93;
        notes = 'Recovery Day 2: Core temp returning to baseline, autonomic tone calming.';
      } else if (day === 33) {
        restingHR = 60;
        sleepHours = 7.6;
        mood = 4;
        bodyTemp = 36.7;
        bpSystolic = 117;
        bpDiastolic = 76;
        glucose = 91;
        notes = 'Recovery Day 3: Resting HR near baseline. Cognitive sharpness restored.';
      } else if (day === 34) {
        restingHR = 59;
        sleepHours = 7.7;
        mood = 4;
        bodyTemp = 36.6;
        bpSystolic = 115;
        bpDiastolic = 75;
        glucose = 90;
        notes = 'Recovery Day 4: Full verification complete. Event transitioned to RESOLVED.';
      }
    }

    // --- PHASE 5: DAYS 35 - 43 (NOMINAL POST-RECOVERY) ---
    else if (day >= 35 && day <= 43) {
      restingHR = 58 + (day % 3);
      bpSystolic = 115 + (day % 2);
      bpDiastolic = 75;
      glucose = 91 + (day % 4);
      bodyTemp = 36.6;
      sleepHours = 7.4 + ((day % 3) * 0.1);
      mood = 4;
      radiationDose = Number((0.44 + (day % 2) * 0.03).toFixed(2));
      notes = 'Steady nominal operations post-recovery.';
    }

    // --- PHASE 6: DAY 44 (HARDWARE SENSOR FAULT) ---
    else if (day === 44) {
      restingHR = 205; // Sensor artifact
      activeHR = 205;
      rawSignalQuality = 18; // Very poor contact
      notes = 'Loose wrist sensor — bad data. Signal quality degraded to 18%.';
      exclusionReason = 'EXCLUDED_LOW_SIGNAL_QUALITY';
      provenanceTag = '[SIMULATED SENSOR STREAM]';
    }

    // --- PHASE 7: DAYS 45 - 49 (NOMINAL CONTINUATION) ---
    else if (day >= 45 && day <= 49) {
      restingHR = 58 + (day % 2);
      bpSystolic = 115;
      bpDiastolic = 75;
      glucose = 90;
      bodyTemp = 36.6;
      sleepHours = 7.5;
      mood = 4;
      radiationDose = 0.45;
      notes = day === 45 
        ? 'Wrist sensor repositioned and re-strapped. Signal quality 99%.' 
        : 'Nominal deep-space transit operations.';
    }

    // --- PHASE 8: DAY 50 (CSA SOLAR PARTICLE EVENT DRILL) ---
    else if (day === 50) {
      restingHR = 62; // Slight adrenaline/stress response
      bpSystolic = 120;
      bpDiastolic = 78;
      glucose = 94;
      bodyTemp = 36.6;
      sleepHours = 7.2;
      mood = 4;
      radiationDose = 2.80; // High radiation spike
      notes = 'Solar Particle Event (SPE) — Storm Shelter Advisory. Radi-N2 bubble detectors deployed.';
      provenanceTag = '[SIMULATED SENSOR STREAM]';
    }

    // --- PHASE 9: DAYS 51 - 60 (RETURN TO NORMAL & MISSION COMPLETION) ---
    else {
      restingHR = 58 + ((day * 3) % 2);
      bpSystolic = 114 + (day % 3);
      bpDiastolic = 74 + (day % 2);
      glucose = 90 + (day % 3);
      bodyTemp = 36.6;
      sleepHours = 7.5;
      mood = 5;
      radiationDose = Number((0.43 + (day % 3) * 0.02).toFixed(2));
      notes = day === 60 
        ? 'Mission Day 60 complete. Full clinical handover package compiled for Terrestrial Flight Surgeon.' 
        : `Nominal end-of-mission cruise day ${day}.`;
    }

    records.push({
      day,
      restingHR,
      activeHR,
      bpSystolic,
      bpDiastolic,
      glucose,
      glucoseTag,
      bodyTemp,
      sleepHours,
      mood,
      exercise,
      radiationDose,
      notes,
      exclusionReason,
      provenanceTag,
      rawSignalQuality
    });
  }

  return records;
}

// Convert dataset to CSV string matching Member 1's Google Sheet format
export function exportDatasetToCSV(records: DayRecord[]): string {
  const headers = [
    'day',
    'restingHR',
    'activeHR',
    'bpSystolic',
    'bpDiastolic',
    'glucose',
    'glucoseTag',
    'bodyTemp',
    'sleepHours',
    'mood',
    'exercise',
    'radiationDose',
    'notes',
    'exclusionReason',
    'provenanceTag'
  ];

  const rows = records.map(r => [
    r.day,
    r.restingHR,
    r.activeHR ?? '',
    r.bpSystolic,
    r.bpDiastolic,
    r.glucose,
    r.glucoseTag,
    r.bodyTemp,
    r.sleepHours,
    r.mood,
    `"${r.exercise.replace(/"/g, '""')}"`,
    r.radiationDose,
    `"${r.notes.replace(/"/g, '""')}"`,
    r.exclusionReason ?? '',
    r.provenanceTag
  ].join(','));

  return [headers.join(','), ...rows].join('\n');
}

// Robust CSV Parser to import Member 1's Google Sheet CSV
export function parseCSVToDataset(csvText: string): DayRecord[] {
  const lines = csvText.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) {
    throw new Error('CSV must contain a header and at least one data row.');
  }

  // Parse header
  const headerCols = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/[^a-z0-9]/g, ''));

  const parsedRecords: DayRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    // Regex to handle quoted strings with commas
    const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
    const matches: string[] = [];
    let match: RegExpExecArray | null;
    while ((match = regex.exec(lines[i])) !== null) {
      let val = match[1];
      if (val === undefined) continue;
      val = val.trim();
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1).replace(/""/g, '"');
      }
      matches.push(val);
      if (regex.lastIndex === lines[i].length) break;
    }

    if (matches.length < 5) continue;

    const rowObj: Record<string, string> = {};
    headerCols.forEach((col, idx) => {
      rowObj[col] = matches[idx] ?? '';
    });

    const day = parseInt(rowObj['day'] || `${i}`, 10);
    const restingHR = parseFloat(rowObj['restinghr'] || rowObj['hr'] || '58');
    const activeHRVal = rowObj['activehr'];
    const activeHR = activeHRVal && activeHRVal !== '' ? parseFloat(activeHRVal) : undefined;
    const bpSystolic = parseFloat(rowObj['bpsystolic'] || rowObj['systolic'] || '115');
    const bpDiastolic = parseFloat(rowObj['bpdiastolic'] || rowObj['diastolic'] || '75');
    const glucose = parseFloat(rowObj['glucose'] || '90');
    const glucoseTag = (rowObj['glucosetag']?.toLowerCase().includes('meal') ? 'After Meal' : 'Fasting') as 'Fasting' | 'After Meal';
    const bodyTemp = parseFloat(rowObj['bodytemp'] || rowObj['temp'] || '36.6');
    const sleepHours = parseFloat(rowObj['sleephours'] || rowObj['sleep'] || '7.5');
    const moodVal = parseInt(rowObj['mood'] || '4', 10);
    const mood = Math.max(1, Math.min(5, isNaN(moodVal) ? 4 : moodVal)) as 1 | 2 | 3 | 4 | 5;
    const exercise = rowObj['exercise'] || 'Nominal 45m ARED';
    const radiationDose = parseFloat(rowObj['radiationdose'] || rowObj['radiation'] || '0.42');
    const notes = rowObj['notes'] || '';
    
    let exclusionReason: DayRecord['exclusionReason'] = null;
    const rawExclusion = (rowObj['exclusionreason'] || '').toUpperCase();
    if (rawExclusion.includes('EXERCISE')) exclusionReason = 'EXCLUDED_POST_EXERCISE_CONFOUNDER';
    else if (rawExclusion.includes('MEAL') || rawExclusion.includes('PRANDIAL')) exclusionReason = 'POST_PRANDIAL_CONTEXT';
    else if (rawExclusion.includes('SIGNAL') || rawExclusion.includes('SENSOR') || rawExclusion.includes('QUALITY')) exclusionReason = 'EXCLUDED_LOW_SIGNAL_QUALITY';

    let provenanceTag: DayRecord['provenanceTag'] = '[SIMULATED SENSOR STREAM]';
    const rawProv = (rowObj['provenancetag'] || '').toUpperCase();
    if (rawProv.includes('MANUAL')) provenanceTag = '[MANUAL CREW ENTRY]';
    else if (rawProv.includes('SYNTHETIC')) provenanceTag = '[SYNTHETIC MISSION SCENARIO]';
    else if (rawProv.includes('RESEARCH') || rawProv.includes('PUBLIC')) provenanceTag = '[PUBLIC RESEARCH REFERENCE]';

    parsedRecords.push({
      day,
      restingHR,
      activeHR,
      bpSystolic,
      bpDiastolic,
      glucose,
      glucoseTag,
      bodyTemp,
      sleepHours,
      mood,
      exercise,
      radiationDose,
      notes,
      exclusionReason,
      provenanceTag,
      rawSignalQuality: exclusionReason === 'EXCLUDED_LOW_SIGNAL_QUALITY' ? 18 : 98
    });
  }

  // Ensure day order
  parsedRecords.sort((a, b) => a.day - b.day);
  return parsedRecords;
}
