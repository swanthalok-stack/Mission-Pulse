// src/data/nasaKnowledgeBase.ts
// NASA & CSA Official Ground Truth Knowledge Base for MISSION PULSE

import type { PhysiologicalSystem, SpaceflightHazard, SelfAssessmentProtocol } from '../types/mission';

export interface OfficialResource {
  id: string;
  name: string;
  badge: string;
  url: string;
  agency: 'NASA' | 'CSA';
  category: string;
  summary: string;
}

export const OFFICIAL_NASA_CSA_RESOURCES: OfficialResource[] = [
  {
    id: 'nasa-5-hazards',
    name: 'NASA Human Research Program: 5 Hazards of Human Spaceflight (RIDGE)',
    badge: 'NASA HRP Hazards',
    url: 'https://www.nasa.gov/hrp/hazards/',
    agency: 'NASA',
    category: 'Spaceflight Physiology',
    summary: 'Radiation, Isolation & Confinement, Distance from Earth, Gravity Fields, and Hostile/Closed Environments define the foundational risks to astronaut physiology during deep-space transit.'
  },
  {
    id: 'nasa-hrp-risks',
    name: 'NASA HRP Risks: SANS, Immune Dysregulation, and Circadian Disruption',
    badge: 'NASA HRP Risks',
    url: 'https://www.nasa.gov/hrp/risks/',
    agency: 'NASA',
    category: 'Medical Evidence Base',
    summary: 'Spaceflight-Associated Neuro-ocular Syndrome (SANS), bone mineral loss, muscle atrophy, latent herpesvirus reactivation, and sleep desynchronization documented across Gemini, Apollo, Skylab, ISS, and Artemis.'
  },
  {
    id: 'nasa-artemis-actigraphy',
    name: 'NASA Ongoing HRP Research: Artemis II Crew Actigraphy & Circadian Tracking',
    badge: 'Artemis II Actigraphy',
    url: 'https://www.nasa.gov/hrp/ongoing-hrp-research/',
    agency: 'NASA',
    category: 'Wearable Technology',
    summary: 'Next-generation continuous multispectral optical heart rate sensors, wrist actigraphy, and core temperature phase estimation tested for lunar flyby and lunar surface habitat missions.'
  },
  {
    id: 'csa-radiation-monitoring',
    name: 'CSA Radiation Monitoring: CANS & Radi-N2 Bubble Detectors',
    badge: 'CSA Radi-N2 / CANS',
    url: 'https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp',
    agency: 'CSA',
    category: 'Dosimetry & Space Weather',
    summary: 'Canadian Space Agency neutron bubble detectors and active silicon pixel spectrometers monitoring Galactic Cosmic Rays (GCR) and Solar Particle Events (SPE) inside spacecraft habitats.'
  },
  {
    id: 'csa-space-science-experiments',
    name: 'CSA Science Experiments in Space: Cardiovascular, Osteoporosis & Diabetes Research',
    badge: 'CSA ISS Experiments',
    url: 'https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp',
    agency: 'CSA',
    category: 'Countermeasures & Earth Benefits',
    summary: 'Vascular Aging, BP Reg, and insulin resistance studies in microgravity revealing direct cellular mechanisms that inform treatments for sedentary aging and metabolic disorders on Earth.'
  }
];

export const SPACEFLIGHT_HAZARDS: SpaceflightHazard[] = [
  {
    id: 'R',
    letter: 'R',
    title: 'Space Radiation',
    fullName: 'Galactic Cosmic Rays (GCR) & Solar Particle Events (SPE)',
    aerospaceImpact: 'Deep-space ionizing radiation damages DNA, accelerates endothelial aging, elevates lifetime cancer risk, and creates acute radiation sickness during solar storms.',
    primaryCountermeasures: ['Storm shelter poly-water wall sheltering', 'Radi-N2 neutron dosimeters', 'Antioxidant and radioprotective nutrition'],
    associatedSystems: ['immune_hematology', 'cardiovascular'],
    csaNasaUrl: 'https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp'
  },
  {
    id: 'I',
    letter: 'I',
    title: 'Isolation & Confinement',
    fullName: 'Psychological Isolation, Sensory Deprivation & Small Crew Dynamics',
    aerospaceImpact: 'Altered interpersonal dynamics, circadian phase shifts, elevated autonomic tone, sleep fragmentation, and neurocognitive fatigue over long-duration missions.',
    primaryCountermeasures: ['Circadian lighting schedule (480nm blue-enriched morning)', 'Protected sleep hygiene', 'Mission Pulse transparent stewardship dashboard'],
    associatedSystems: ['psychological_circadian', 'neuro_ocular'],
    csaNasaUrl: 'https://www.nasa.gov/hrp/hazards/'
  },
  {
    id: 'D',
    letter: 'D',
    title: 'Distance from Earth',
    fullName: 'One-Way Comm Latency & Complete Autonomy Requirement',
    aerospaceImpact: 'Up to 22-minute light-time delay on Mars missions eliminates real-time ground surgical guidance. Crew must possess self-contained, explainable clinical decision support.',
    primaryCountermeasures: ['Autonomous onboard inference (Mission Pulse)', 'Local store-and-forward telemetry queue', 'Pre-authorized countermeasure protocol triggers'],
    associatedSystems: ['psychological_circadian', 'cardiovascular'],
    csaNasaUrl: 'https://www.nasa.gov/hrp/hazards/'
  },
  {
    id: 'G',
    letter: 'G',
    title: 'Gravity Fields',
    fullName: 'Microgravity (0g) to Martian (0.38g) and Lunar (0.16g) Transitions',
    aerospaceImpact: 'Cephalad fluid shift causes venous jugular engorgement, intracranial hypertension, Spaceflight-Associated Neuro-ocular Syndrome (SANS), orthostatic intolerance, bone demineralization, and muscular atrophy.',
    primaryCountermeasures: ['ARED resistive exercise (2h/day)', 'T2 treadmill with bungee harness', 'Lower Body Negative Pressure (LBNP)', 'Saline loading before re-entry'],
    associatedSystems: ['cardiovascular', 'neuro_ocular', 'musculoskeletal', 'renal_fluid'],
    csaNasaUrl: 'https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp'
  },
  {
    id: 'E',
    letter: 'E',
    title: 'Hostile / Closed Environments',
    fullName: 'Spacecraft Habitat Ecology: CO2, Microbial Flora, Acoustics & Toxicology',
    aerospaceImpact: 'Elevated ambient CO2 (>3.0 mmHg) triggers hypercapnic headaches, immune suppression from closed biome recycling, and upper airway mucosal irritation.',
    primaryCountermeasures: ['Continuous CDRA (CO2 Removal Assembly) scrubbing', 'HEPA and trace contaminant filters', 'Microbial air sampling'],
    associatedSystems: ['respiratory', 'immune_hematology'],
    csaNasaUrl: 'https://www.nasa.gov/hrp/hazards/'
  }
];

export const PHYSIOLOGICAL_SYSTEMS: PhysiologicalSystem[] = [
  {
    id: 'cardiovascular',
    name: 'Cardiovascular & Hemodynamics',
    organTarget: 'Heart & Central Arteries',
    status: 'nominal',
    hotspotCoords: { x: 50, y: 35 },
    summary: 'Monitors resting heart rate, pulse pressure, stroke volume adaptation, and microgravity cephalic fluid redistributions.',
    spaceflightRisks: [
      'Cephalad fluid shift causing central hypovolemia upon orthostasis',
      'Cardiac left ventricular mass reduction (1% per month in 0g without countermeasures)',
      'Orthostatic intolerance upon landing',
      'Arterial stiffening mimicking accelerated vascular aging'
    ],
    keyVitals: ['Resting Heart Rate (bpm)', 'Blood Pressure (Systolic/Diastolic mmHg)', 'Active HR Spike Filter'],
    protocols: ['Orthostatic Tolerance Standing Test', 'Cardiovascular Fluid Reset & Saline Infusion'],
    nasaReferenceId: 'csa-space-science-experiments'
  },
  {
    id: 'neuro_ocular',
    name: 'Neuro-Ocular & SANS Monitoring',
    organTarget: 'Brain, Optic Nerve & Retina',
    status: 'monitoring',
    hotspotCoords: { x: 50, y: 14 },
    summary: 'Tracks Spaceflight-Associated Neuro-ocular Syndrome (SANS), intracranial pressure proxies, optic disc edema, and visual acuity shifts.',
    spaceflightRisks: [
      'Optic disc edema (Frisén Scale grade 1-3)',
      'Globe flattening and choroidal folds',
      'Hyperopic refractive shifts (loss of near vision)',
      'Persistent post-flight visual changes in 70% of long-duration flyers'
    ],
    keyVitals: ['Amsler Grid Metamorphopsia', 'Near Acuity Jaeger Score', 'Pupillary Light Reflex'],
    protocols: ['Neuro-Ocular SANS Amsler Self-Exam', 'Near-Vision Jaeger Chart Evaluation'],
    nasaReferenceId: 'nasa-hrp-risks'
  },
  {
    id: 'musculoskeletal',
    name: 'Musculoskeletal & Biomechanics',
    organTarget: 'Axial Skeleton & Postural Musculature',
    status: 'nominal',
    hotspotCoords: { x: 50, y: 62 },
    summary: 'Monitors bone mineral density preservation, skeletal muscle volume, and resistive loading compliance via ARED & T2.',
    spaceflightRisks: [
      'Trabecular bone loss of 1.0–1.5% per month in weight-bearing bones (calcaneus, proximal femur)',
      'Soleus and gastrocnemius muscle mass loss',
      'Intervertebral disc unloading causing lumbar elongation and spaceflight back pain'
    ],
    keyVitals: ['Daily Resistive Load (kg-force)', 'Treadmill Distance & Ground Reaction Force'],
    protocols: ['ARED Progressive Loading Verification', 'Spinal Elongation & Lumbar Stability Drill'],
    nasaReferenceId: 'csa-space-science-experiments'
  },
  {
    id: 'immune_hematology',
    name: 'Immune & Hematologic Defense',
    organTarget: 'Thymus, Spleen & Lymph Nodes',
    status: 'nominal',
    hotspotCoords: { x: 44, y: 38 },
    summary: 'Evaluates cell-mediated immunity suppression, T-cell cytokine distribution shifts, and subclinical viral reactivation.',
    spaceflightRisks: [
      'Downregulation of T-cell activation and delayed-type hypersensitivity',
      'Asymptomatic shedding of Epstein-Barr Virus (EBV), CMV, and VZV',
      'Spaceflight neocytolysis causing initial 10-15% reduction in red blood cell mass'
    ],
    keyVitals: ['Core Body Temp (°C)', 'Resting Heart Rate Drift', 'Daily Radiation (mGy)'],
    protocols: ['Immune Activation & Low-Grade Infection Assessment', 'Latent Viral Symptom Log'],
    nasaReferenceId: 'nasa-hrp-risks'
  },
  {
    id: 'endocrine_metabolic',
    name: 'Endocrine & Metabolic Homeostasis',
    organTarget: 'Pancreas, Thyroid & Liver',
    status: 'nominal',
    hotspotCoords: { x: 52, y: 44 },
    summary: 'Monitors insulin sensitivity, post-prandial glycemic excursions, calcium homeostasis, and metabolic turnover.',
    spaceflightRisks: [
      'Peripheral insulin resistance caused by microgravity physical deconditioning',
      'Elevated urinary calcium excretion from bone turnover (kidney stone risk)',
      'Subtle blunting of thyroid hormones T3 and T4'
    ],
    keyVitals: ['Fasting Blood Glucose (mg/dL)', 'Post-Prandial Glycemic Window', 'Daily Caloric Ingestion'],
    protocols: ['Glycemic Homeostasis & Post-Prandial Confounder Audit', 'Calcium Excretion Dietary Countermeasure'],
    nasaReferenceId: 'csa-space-science-experiments'
  },
  {
    id: 'respiratory',
    name: 'Respiratory & Cabin Environmental Exchange',
    organTarget: 'Lungs & Upper Airways',
    status: 'nominal',
    hotspotCoords: { x: 50, y: 28 },
    summary: 'Tracks ventilation-perfusion matching in microgravity, exhaled nitric oxide, and habitat CO2 exposure levels.',
    spaceflightRisks: [
      'Altered ventilation-perfusion uniformity in zero-g without gravitational gradients',
      'Cabin hypercapnia (CO2 > 3 mmHg) induced headaches and lethargy',
      'Airway mucosal drying and airborne lunar dust inhalation toxicity'
    ],
    keyVitals: ['Respiratory Rate (brpm)', 'Cabin ppCO2 (mmHg)', 'Peripheral SpO2 (%)'],
    protocols: ['Hypercapnia Recovery & Air Scrubber Verification'],
    nasaReferenceId: 'nasa-5-hazards'
  },
  {
    id: 'renal_fluid',
    name: 'Renal & Fluid Balance',
    organTarget: 'Kidneys & Vascular Volume',
    status: 'nominal',
    hotspotCoords: { x: 54, y: 48 },
    summary: 'Oversees total body water, intravascular volume depletion, and renal nephrolithiasis risk management.',
    spaceflightRisks: [
      'Gauer-Henry reflex triggered diuresis and 15-20% plasma volume contraction',
      'Hypercalciuria and urine stagnation in renal pelvis promoting calcium oxalate calculi',
      'Reduced thirst perception leading to chronic subclinical hypovolemia'
    ],
    keyVitals: ['Hydration Intake (L/day)', 'Electrolyte Salt Replacement (g)', 'Body Mass Trend (kg)'],
    protocols: ['Oral Rehydration & Electrolyte Restoration Protocol', 'Renal Calculus Prevention Drink Tracker'],
    nasaReferenceId: 'csa-space-science-experiments'
  },
  {
    id: 'psychological_circadian',
    name: 'Psychological & Circadian Rhythmicity',
    organTarget: 'Suprachiasmatic Nucleus & Frontal Cortex',
    status: 'nominal',
    hotspotCoords: { x: 50, y: 8 },
    summary: 'Analyzes actigraphy sleep architecture, circadian phase stability, cognitive resilience, and subjective mood state.',
    spaceflightRisks: [
      'Circadian desynchronization from 16 ISS sunrises/sunsets per 24 hours',
      'REM and slow-wave sleep compression (mean 6.0 hours vs 8.0 hours on Earth)',
      'Cumulative cognitive fatigue impacting emergency mission operations'
    ],
    keyVitals: ['Actigraphy Sleep Duration (hours)', 'Psychological Mood Valence (1-5)', 'Circadian Phase Shift'],
    protocols: ['Protected 8-Hour Sleep Reset & Melatonergic Routine', 'Dynamic Circadian Lighting Optimization'],
    nasaReferenceId: 'nasa-artemis-actigraphy'
  }
];

export const SELF_ASSESSMENT_PROTOCOLS: SelfAssessmentProtocol[] = [
  {
    id: 'protocol-sans-amsler',
    title: 'Neuro-Ocular SANS Amsler Grid & Near-Vision Protocol',
    category: 'Ophthalmology / SANS',
    targetHazard: 'Gravity Fields (Cephalad Fluid Shift)',
    durationMinutes: 6,
    steps: [
      {
        stepNumber: 1,
        title: 'Calibrate Distance & Illumination',
        instruction: 'Mount tablet display at exactly 33 cm (14 inches) using the cabin eye-bracket. Ensure cabin lighting is uniform with no screen glare.',
        expectedNormal: 'Both eyes comfortably focus on center white fixation dot.'
      },
      {
        stepNumber: 2,
        title: 'Monocular Amsler Grid Fixation (Right Eye OD)',
        instruction: 'Occlude left eye. Fixate right eye steadily on center white dot. While holding fixation, inspect all 4 corners of the 10x10 grid.',
        expectedNormal: 'All lines appear perfectly straight and continuous; no wavy lines (metamorphopsia) or missing patches (scotoma).'
      },
      {
        stepNumber: 3,
        title: 'Monocular Amsler Grid Fixation (Left Eye OS)',
        instruction: 'Occlude right eye. Repeat procedure with left eye. Report any localized distortion, blurring, or grey halos around the grid vertices.',
        expectedNormal: 'Uniform grid perception with symmetric radial square boundaries.'
      },
      {
        stepNumber: 4,
        title: 'Near-Acuity Jaeger Card Inspection',
        instruction: 'Hold the standard NASA Jaeger reading card at 35 cm. Read the smallest text line legible without squinting.',
        expectedNormal: 'Acuity equal to baseline calibration J1 / J2 (equivalent to 20/20 or 20/25).'
      }
    ],
    warningThresholds: 'Any wavy lines on grid, central or paracentral blind spots, or degradation of >2 Jaeger lines from mission baseline.',
    remedialActions: [
      'Document grid sketch and submit to Ground Flight Surgeon via store-and-forward queue',
      'Deploy Spaceflight Adjustable Glasses (Superfocus or Space-Optics lenses)',
      'Schedule Lower Body Negative Pressure (LBNP) 25 mmHg session to induce caudad fluid shift'
    ]
  },
  {
    id: 'protocol-sleep-reset',
    title: 'Protected 8-Hour Circadian & Sleep Deficit Reset',
    category: 'Circadian / Neurological',
    targetHazard: 'Isolation, Confinement & Closed Environments',
    durationMinutes: 10,
    steps: [
      {
        stepNumber: 1,
        title: 'Cabin Environmental Lockout',
        instruction: 'Shift crew quarters lighting to 0% illumination (dim red standby only). Seal crew berth ventilation baffle for 0.15 m/s acoustic comfort.',
        expectedNormal: 'Ambient sound < 45 dBA, complete darkness in personal bunk.'
      },
      {
        stepNumber: 2,
        title: 'Active Blue Light Elimination',
        instruction: 'Disable all non-operational tablets and laptop screens 60 minutes prior to scheduled sleep opportunity (T-60m).',
        expectedNormal: 'Absence of 460-490nm wavelength photon stimulation to melanopsin retinal ganglion cells.'
      },
      {
        stepNumber: 3,
        title: 'Core Cooling & Temperature Regulation',
        instruction: 'Set crew berth thermal air loop to 19.5°C to promote physiological drop in core body temperature required for slow-wave sleep entry.',
        expectedNormal: 'Subjective thermal neutrality with lightweight sleeping bag restraint.'
      },
      {
        stepNumber: 4,
        title: 'Autonomous Sleep Schedule Protection',
        instruction: 'Designate day as "Protected Circadian Recovery". Flight Director locks out non-critical comms and task list alarms for 8.5 uninterrupted hours.',
        expectedNormal: 'Continuous actigraphy sleep duration >= 7.5 hours.'
      }
    ],
    warningThresholds: 'Sleep duration < 5.5 hours for >= 3 consecutive cycles, or Subjective Mood score <= 2.',
    remedialActions: [
      'Execute Mission Pulse Day 31-34 Recovery Protocol',
      'Exogenous melatonin 0.5mg administration 30 min before sleep opportunity under CMO guidance',
      'Morning 30-minute 480nm blue light exposure upon awakening'
    ]
  },
  {
    id: 'protocol-hydration-reset',
    title: 'Microgravity Fluid & Electrolyte Restoration',
    category: 'Renal / Cardiovascular',
    targetHazard: 'Gravity Fields (Hypovolemia)',
    durationMinutes: 5,
    steps: [
      {
        stepNumber: 1,
        title: 'Baseline Intake Audit',
        instruction: 'Confirm total water pouch consumption over preceding 24h exceeds 2.5 Liters.',
        expectedNormal: 'Intake between 2.5L and 3.2L depending on ARED exercise sweat loss.'
      },
      {
        stepNumber: 2,
        title: 'Targeted Electrolyte Supplementation',
        instruction: 'Ingest 2 effervescent electrolyte tablets (containing 800mg Sodium, 200mg Potassium, 50mg Magnesium) dissolved in 500 mL water.',
        expectedNormal: 'Prompt gastrointestinal absorption without gastric distension.'
      },
      {
        stepNumber: 3,
        title: 'Post-Load Orthostatic Vital Check',
        instruction: 'Perform seated and upright brachial cuff blood pressure and resting HR check 45 minutes following rehydration.',
        expectedNormal: 'Resting HR within +/- 4 bpm of personal baseline; systolic BP >= 110 mmHg.'
      }
    ],
    warningThresholds: 'Resting HR > 15 bpm above baseline with systolic BP < 95 mmHg.',
    remedialActions: [
      'Second-tier saline rehydration pack (1.0 L over 2 hours)',
      'Apply lower-extremity compression garments prior to high-acceleration activities'
    ]
  },
  {
    id: 'protocol-spe-shelter',
    title: 'Solar Particle Event (SPE) Storm Shelter Protocol',
    category: 'Radiation / Emergency',
    targetHazard: 'Space Radiation (SPE)',
    durationMinutes: 15,
    steps: [
      {
        stepNumber: 1,
        title: 'Verify Radiation Flare Alert',
        instruction: 'Check CSA CANS active dosimeter telemetry. Confirm whether ambient cabin dose rate exceeds 1.5 mGy/day or active proton flux > 10 MeV.',
        expectedNormal: 'Quiet sun ambient rate is 0.35–0.55 mGy/day.'
      },
      {
        stepNumber: 2,
        title: 'Ingress Habitat Heavy Shielded Core',
        instruction: 'All crew members muster into the storm shelter module surrounded by water storage bladders and dense contingency food rations.',
        expectedNormal: 'Shielding equivalent to >= 20 g/cm² polyethylene/water.'
      },
      {
        stepNumber: 3,
        title: 'Deploy Radi-N2 Personal Bubble Dosimeters',
        instruction: 'Uncap personal CSA Radi-N2 neutron dosimeters and place in chest pockets. Count bubble formation every 2 hours.',
        expectedNormal: 'Bubble growth rate attenuation of >= 60% compared to unshielded airlock sensor.'
      },
      {
        stepNumber: 4,
        title: 'Ground Station Handshake & All-Clear',
        instruction: 'Maintain comm link with Mission Control / Space Radiation Analysis Group (SRAG). Await SPE proton decay curve clearance.',
        expectedNormal: 'Ambient flux returning below 0.6 mGy/day threshold.'
      }
    ],
    warningThresholds: 'Ambient dose rate > 2.0 mGy/day or acute cumulative SPE exposure > 25 mGy in 48 hours.',
    remedialActions: [
      'Remain inside storm shelter until SRAG official Stand-Down command',
      'Administer prophylactic antiemetic if prodromal nausea occurs',
      'Prioritize water storage fluid shielding layout restructuring'
    ]
  },
  {
    id: 'protocol-orthostatic-tilt',
    title: 'Microgravity Orthostatic Tolerance & Tilt Protocol',
    category: 'Cardiovascular',
    targetHazard: 'Gravity Fields (Deconditioning)',
    durationMinutes: 8,
    steps: [
      {
        stepNumber: 1,
        title: 'Supine / Tethered Rest Period',
        instruction: 'Rest comfortably for 5 minutes with limbs relaxed and zero muscular bracing. Record resting HR and BP.',
        expectedNormal: 'HR 55-65 bpm, BP 110-125 / 70-80 mmHg.'
      },
      {
        stepNumber: 2,
        title: 'Active Foot-Plate Loading (Simulated Stand)',
        instruction: 'Engage bungee harness to simulate 1.0g axial loading against footplate. Remain stationary for 3 minutes without knee flexion.',
        expectedNormal: 'HR rise < 25 bpm, pulse pressure maintained > 30 mmHg.'
      },
      {
        stepNumber: 3,
        title: 'Lightheadedness & Presyncope Screen',
        instruction: 'Rate subjective dizziness on 0-10 visual analog scale. Note any grey-out or tunnel vision.',
        expectedNormal: 'Zero presyncopal symptoms (Score = 0).'
      }
    ],
    warningThresholds: 'Heart rate surge > 35 bpm over supine baseline or systolic BP drop > 25 mmHg.',
    remedialActions: [
      'Immediate release of harness and resumption of microgravity free-float',
      'Hydration loading: 1.0L water with 8g salt tabs 2h prior to re-entry or g-load transitions'
    ]
  }
];

export const NASA_RAG_KNOWLEDGE_DOCS = [
  {
    topic: 'SANS',
    keywords: ['sans', 'eye', 'vision', 'optic', 'amsler', 'blurry', 'hyperopia', 'retina'],
    title: 'Spaceflight-Associated Neuro-ocular Syndrome (SANS)',
    content: 'SANS affects up to 70% of astronauts on long-duration ISS and deep-space missions. In microgravity, the normal 2-liter cephalad fluid shift eliminates gravitational hydrostatic pooling in the legs, elevating venous and intracranial pressure. This produces optic disc edema, posterior globe flattening, choroidal folds, and hyperopic visual acuity shifts. Mission Pulse incorporates regular Amsler Grid screening and near-vision tests to detect metamorphopsia and paracentral scotomas early.'
  },
  {
    topic: 'Baseline Engine & MAD',
    keywords: ['baseline', 'mad', 'median', 'freeze', 'personal', 'pipeline', 'algorithm', 'deviation'],
    title: 'Personal Pattern Pipeline (Median & MAD Baseline)',
    content: 'Standard population reference ranges (e.g., 60-100 bpm) fail in aerospace medicine because high-performance astronauts have idiosyncratic baselines (e.g. Commander Vega resting HR is 58 bpm). Mission Pulse utilizes Days 1-14 calibration to compute personal Median (M) and Median Absolute Deviation (MAD), forming personal baseline bands M ± max(2*MAD, V_floor). At Day 26, when persistent deviation begins, the baseline is deliberately FROZEN so that pathological drift does not contaminate the healthy reference band.'
  },
  {
    topic: 'Confounder Filtering',
    keywords: ['confounder', 'fake alarm', 'exercise', 'meal', 'glucose', 'sensor', 'loose', 'day 19', 'day 16', 'day 44'],
    title: 'Autonomous Context-Aware Confounder Filtering',
    content: 'Clinical alarms often fail due to false positives from normal physiological activities. Mission Pulse filters: (1) Post-prandial context (Day 16 glucose 138 mg/dL 30 min post-lunch flagged as POST_PRANDIAL_CONTEXT); (2) Post-exercise HR (Day 19 HR 142 bpm 15m after 90m ARED workout flagged as EXCLUDED_POST_EXERCISE_CONFOUNDER while morning resting HR was 59 bpm); (3) Hardware artifacts (Day 44 HR 205 bpm flagged as EXCLUDED_LOW_SIGNAL_QUALITY due to loose wrist sensor). None of these trigger false alarms.'
  },
  {
    topic: 'Persistence Detection',
    keywords: ['persistence', 'k-of-n', '3 of 4', 'rule', 'trend', 'day 30', 'drift', 'why fired'],
    title: 'Authoritative 3-of-4 Day Persistence Detector',
    content: 'Isolated single-day outliers never trigger alarms in Mission Pulse. The system requires k-of-n persistence (at least 3 of the last 4 eligible days exceeding personal upper/lower bounds). On Day 30, Commander Vega recorded 4 consecutive days of elevated resting HR (63, 65, 67, 69 bpm), shortened sleep (6.3, 6.0, 5.7, 5.5h), and elevated temperature (37.0 to 37.2°C). This passed the 3-of-4 condition and fired PERSISTENT_TREND_DETECTED with a full explainable audit trace.'
  },
  {
    topic: 'Countermeasure Recovery',
    keywords: ['recovery', 'protocol', 'day 31', 'day 34', 'resolved', 'sleep reset', 'hydration'],
    title: 'Countermeasure Deployment and Clinical Resolution',
    content: 'Following Day 30 persistent drift detection, Commander Vega deployed the Protected 8-Hour Sleep Reset and Hydration Protocols on Days 31-34. By Day 34, resting HR stepped down from 66 -> 63 -> 60 -> 59 bpm, sleep duration rebounded above 7.2 hours, and mood restored to 4. The rule engine observed return to nominal baseline and automatically transitioned the lifecycle state to RESOLVED.'
  },
  {
    topic: 'Space Radiation & SPE',
    keywords: ['radiation', 'spe', 'solar', 'cans', 'radi-n2', 'csa', 'dosimeter', 'day 50', 'storm shelter'],
    title: 'Space Radiation Monitoring and CSA Bubble Dosimetry',
    content: 'During deep-space transit, astronauts face constant Galactic Cosmic Rays (GCR) and sporadic Solar Particle Events (SPE). Nominal ISS/Gateway radiation is 0.35-0.55 mGy/day. On Day 50, a coronal mass ejection caused a radiation spike to 2.8 mGy/day. Mission Pulse triggered the Solar Particle Event Storm Shelter Advisory, prompting the crew to take shelter in the water-shielded habitat core and deploy CSA Radi-N2 neutron bubble dosimeters.'
  },
  {
    topic: 'Crew Stewardship & Trust',
    keywords: ['stewardship', 'trust', 'non-punitive', 'psychological', 'privacy', 'flight status', 'module j'],
    title: 'Non-Punitive Crew Stewardship & Transparent Trust',
    content: 'Astronauts historically underreport fatigue or mild symptoms out of fear of being grounded by Flight Surgeons. Mission Pulse solves this through Module J: Non-Punitive Crew Stewardship. Telemetry analysis runs locally on the spacecraft, raw mental health notes remain private to the astronaut, and reporting fatigue triggers supportive circadian countermeasures rather than disciplinary flight status removal.'
  }
];
