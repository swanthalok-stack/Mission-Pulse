// src/components/MissionContextView.tsx
// Modules F & O: NASA 5 Spaceflight Hazards Matrix (RIDGE) & Scientific Evidence Library
// 100% Apple VisionOS Dark Frosted Glass with Supported Evidence & Scientific Uncertainty Badges

import React, { useState } from 'react';
import { 
  Rocket, 
  ExternalLink, 
  ShieldAlert, 
  Users, 
  Radio, 
  Compass, 
  Box, 
  BookOpen, 
  ShieldCheck, 
  HelpCircle,
  Activity
} from 'lucide-react';
import { SPACEFLIGHT_HAZARDS, OFFICIAL_NASA_CSA_RESOURCES } from '../data/nasaKnowledgeBase';
import type { PinId } from '../context/MissionContext';

interface Props {
  currentDay: number;
  onOpenCitations: (resourceId?: string) => void;
  onHighlightOrgan?: (pinId: PinId) => void;
}

interface DetailedHazardInfo {
  id: string;
  letter: string;
  title: string;
  fullName: string;
  aerospaceImpact: string;
  supportedEvidence: string;
  scientificUncertainty: string;
  primaryCountermeasures: string[];
  linkedOrgans: { id: PinId; label: string }[];
  csaNasaUrl: string;
}

const DETAILED_HAZARDS: DetailedHazardInfo[] = [
  {
    id: 'R',
    letter: 'R',
    title: 'Space Radiation',
    fullName: 'Galactic Cosmic Rays (GCR) & Solar Particle Events (SPE)',
    aerospaceImpact: 'Deep-space ionizing radiation damages DNA, accelerates endothelial aging, elevates lifetime cancer risk, and creates acute radiation sickness during solar particle storms.',
    supportedEvidence: 'Acute SPE proton storms produce dose rates >1.5 mGy/d requiring shielded storm shelter ingress. Microdosimetry (CSA CANS/Radi-N2) accurately maps cabin absorbed dose.',
    scientificUncertainty: 'Routine non-invasive daily vitals (HR, BP) cannot measure subclinical cellular DNA fragmentation or long-term radiobiological degenerative tissue risks in transit.',
    primaryCountermeasures: ['Storm shelter polyethylene water-wall sheltering', 'Radi-N2 neutron bubble dosimeters', 'AstroRad radiation protective vest'],
    linkedOrgans: [
      { id: 'immune', label: 'Immune & Hematologic Defense' },
      { id: 'heart', label: 'Cardiovascular Endothelium' }
    ],
    csaNasaUrl: 'https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp'
  },
  {
    id: 'I',
    letter: 'I',
    title: 'Isolation & Confinement',
    fullName: 'Psychological Isolation, Sensory Deprivation & Small Crew Dynamics',
    aerospaceImpact: 'Small habitat confinement desynchronizes circadian rhythms, fragments sleep architecture, elevates autonomic sympathetic tone, and causes neurocognitive fatigue.',
    supportedEvidence: 'NASA-STD-3001 documents that chronic sleep reduction (<6h) degrades psychomotor vigilance, reaction latency, and affective valence.',
    scientificUncertainty: 'Subjective visual mood and stress scales exhibit wide individual coping variability; psychological adaptation cannot be predicted from a single scalar metric.',
    primaryCountermeasures: ['Circadian dynamic lighting (480nm blue-enriched morning)', 'Protected 8h sleep berths', 'Private psychological journal enclaves'],
    linkedOrgans: [
      { id: 'circadian', label: 'Pineal / Circadian Pacemaker' },
      { id: 'brain', label: 'Frontal Cortex & Autonomic Tone' }
    ],
    csaNasaUrl: 'https://www.nasa.gov/hrp/hazards/'
  },
  {
    id: 'D',
    letter: 'D',
    title: 'Distance from Earth',
    fullName: 'One-Way Light-Time (OWLT) Comm Delay & Complete Operational Autonomy',
    aerospaceImpact: 'Up to 22-minute light-time delay on Mars missions eliminates real-time ground surgical guidance. Crew must possess self-contained, explainable clinical state-awareness.',
    supportedEvidence: 'Autonomous onboard edge inference and deterministic persistence rules enable immediate countermeasure deployment without waiting for Houston MCC handshake.',
    scientificUncertainty: 'Optimal crew autonomous threshold for overriding conservative ground clinical rules during ambiguous multi-vital physiological drifts is actively researched.',
    primaryCountermeasures: ['Autonomous onboard inference (Mission Pulse)', 'Store-and-forward telemetry uplink packages', 'Pre-authorized countermeasure protocol wizards'],
    linkedOrgans: [
      { id: 'brain', label: 'Crew Cognitive Decision-Making' },
      { id: 'heart', label: 'Autonomic Systemic Stability' }
    ],
    csaNasaUrl: 'https://www.nasa.gov/hrp/hazards/'
  },
  {
    id: 'G',
    letter: 'G',
    title: 'Gravity Fields',
    fullName: 'Microgravity (0g) to Lunar (0.16g) and Martian (0.38g) Transitions',
    aerospaceImpact: 'Cephalad fluid shift causes venous jugular engorgement, intracranial hypertension proxies, Spaceflight-Associated Neuro-ocular Syndrome (SANS), and cardiovascular deconditioning.',
    supportedEvidence: 'ARED resistive loading (2h/day) and lower-extremity aerobic exercise significantly attenuate bone demineralization and cardiovascular stroke volume loss in 0g.',
    scientificUncertainty: 'Exact individual genetic and anatomical vulnerability to persistent SANS optic disc edema and globe flattening remains unresolved in long-duration flight.',
    primaryCountermeasures: ['ARED resistive exercise (squat/deadlift/heel-raise)', 'T2 treadmill with bungee harness', 'SANS Digital Amsler Grid screening', 'Saline rehydration loading'],
    linkedOrgans: [
      { id: 'heart', label: 'Cardiovascular Vasculature' },
      { id: 'eyes', label: 'Neuro-Ocular Optic Disc & Retina (SANS)' },
      { id: 'femur', label: 'Musculoskeletal Weight-Bearing Skeleton' }
    ],
    csaNasaUrl: 'https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp'
  },
  {
    id: 'E',
    letter: 'E',
    title: 'Hostile / Closed Environments',
    fullName: 'Spacecraft Habitat Ecology: Elevated CO2, Microbial Biome & Acoustics',
    aerospaceImpact: 'Elevated cabin partial pressure CO2 (>2.5 mmHg) triggers hypercapnic morning headaches, mucosal irritation from closed air circulation, and acoustic sleep disruption.',
    supportedEvidence: 'Continuous environmental monitoring of cabin ppCO2, ambient temp (21.8°C), and acoustic noise (52 dBA) correlates directly with astronaut sleep continuity.',
    scientificUncertainty: 'Multi-factor synergistic interactions between mild chronic hypercapnia and microgravity cephalic venous congestion on SANS progression remain an open medical investigation.',
    primaryCountermeasures: ['Continuous CDRA (CO2 Removal Assembly) scrubbing', 'Berth acoustic acoustic baffle silencers', 'HEPA and trace contaminant scrubbers'],
    linkedOrgans: [
      { id: 'lungs', label: 'Respiratory Ventilation-Perfusion' },
      { id: 'immune', label: 'Airway Mucosal & Immune Defense' }
    ],
    csaNasaUrl: 'https://www.nasa.gov/hrp/hazards/'
  }
];

// 6 Explicit Provenance Classifications (Module O)
const PROVENANCE_CLASSIFICATIONS = [
  {
    code: '[NASA TECHNICAL STANDARD]',
    name: 'NASA Technical Standards (NASA-STD-3001)',
    badgeColor: 'bg-blue-500/20 text-sky-300 border-blue-400/30',
    description: 'NASA-STD-3001 Volume 1 (Crew Health) and Volume 2 (Habitability and Environmental Health) establishing operational baseline standards.'
  },
  {
    code: '[NASA RESEARCH EVIDENCE]',
    name: 'NASA HRP Evidence Books & OSDR',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    description: 'Peer-reviewed aerospace evidence from NASA Open Science Data Repository (OSDR), Twins Study, and Artemis flight medical logs.'
  },
  {
    code: '[NASA OPERATIONAL CONTEXT]',
    name: 'NASA Operational Flight Rules & Constraints',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
    description: 'Documented mission timeline constraints, ARED loading cadence, and deep-space comm latency profiles.'
  },
  {
    code: '[PROTOTYPE ENGINEERING ASSUMPTION]',
    name: 'MISSION PULSE Mathematical Heuristics',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
    description: 'Transparent disclosure: our M ± max(2*MAD, V_floor) bands and 3-of-4 day persistence rules are hackathon clinical models, not formal agency diagnostic protocols.'
  },
  {
    code: '[SYNTHETIC SCENARIO PARAMETER]',
    name: 'Commander Vega 60-Day Scenario Dataset',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
    description: 'Synthetic 60-day longitudinal mission dataset designed to rigorously test nominal, confounder, drift, and recovery states.'
  },
  {
    code: '[UNKNOWN / NOT ESTABLISHED]',
    name: 'Active Space Medicine Scientific Frontiers',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/30',
    description: 'Clinical domains (such as non-invasive intracranial pressure estimation or SANS genetic susceptibility) where science remains incomplete.'
  }
];

export const MissionContextView: React.FC<Props> = ({
  currentDay,
  onOpenCitations,
  onHighlightOrgan
}) => {
  const [selectedHazard, setSelectedHazard] = useState<string>('R');

  const hazardIcons: Record<string, React.FC<any>> = {
    R: ShieldAlert,
    I: Users,
    D: Radio,
    G: Compass,
    E: Box
  };

  const currentH = DETAILED_HAZARDS.find(h => h.id === selectedHazard) || DETAILED_HAZARDS[0];
  const HazardIcon = hazardIcons[currentH.id] || ShieldAlert;

  const handleSelectHazard = (hId: string) => {
    setSelectedHazard(hId);
  };

  return (
    <div className="h-full flex flex-col justify-between space-y-4 select-none pr-1 overflow-y-auto">
      
      {/* 1. VIEW HEADER */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Rocket className="w-5 h-5 text-sky-400" />
            <span>NASA 5 Spaceflight Hazards (RIDGE) & Evidence Matrix (Modules F & O)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            NASA Human Research Program (HRP) Architecture · 6 Provenance Classifications · Supported Evidence & Uncertainty
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-sky-300">
            Mission Epoch: Day {currentDay} / 60
          </span>
          <button
            onClick={() => onOpenCitations()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-xs font-semibold text-white transition-all shadow-md active:scale-95"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-300" />
            <span>Open Citations Modal</span>
          </button>
        </div>
      </div>

      {/* 2. NASA 5 HAZARDS (RIDGE) SELECTOR BAR */}
      <div className="space-y-3">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          RIDGE Operational Hazards Framework:
        </span>

        <div className="grid grid-cols-5 gap-3">
          {DETAILED_HAZARDS.map((hz) => {
            const Icon = hazardIcons[hz.id] || ShieldAlert;
            const isSelected = selectedHazard === hz.id;

            return (
              <button
                key={hz.id}
                onClick={() => handleSelectHazard(hz.id)}
                className={`p-3.5 rounded-3xl border transition-all flex flex-col items-center text-center space-y-1.5 group ${
                  isSelected
                    ? 'bg-gradient-to-b from-blue-500/25 to-sky-500/25 border-sky-400 text-white shadow-[0_0_20px_rgba(56,189,248,0.35)] scale-102'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-transform ${
                  isSelected ? 'bg-sky-400 text-slate-950 font-bold scale-105' : 'bg-white/10 text-white group-hover:scale-105'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white tracking-tight leading-tight">{hz.letter} · {hz.title}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Hazard Deep Dive Card */}
        <div className="p-5 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-lg space-y-3.5">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300">
                <HazardIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{currentH.letter} — {currentH.fullName}</h3>
                <span className="text-[11px] text-sky-400 font-medium">NASA HRP Categorical Hazard</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={currentH.csaNasaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-xs font-semibold text-slate-200 hover:text-white transition-all"
              >
                <span>Official Agency Docs</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {currentH.aerospaceImpact}
          </p>

          {/* Supported Evidence & Scientific Uncertainty Badges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Supported Research Evidence:
              </span>
              <p className="text-emerald-200/90 text-xs leading-relaxed">
                {currentH.supportedEvidence}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                Explicit Scientific Uncertainty:
              </span>
              <p className="text-amber-200/90 text-xs leading-relaxed">
                {currentH.scientificUncertainty}
              </p>
            </div>
          </div>

          {/* Linked Organ Systems & Countermeasures */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-white/10">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Linked Organ Hotspots (Module E):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentH.linkedOrgans.map(org => (
                  <button
                    key={org.id}
                    onClick={() => onHighlightOrgan?.(org.id)}
                    className="px-2.5 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/30 text-sky-200 text-xs flex items-center gap-1 transition-all"
                  >
                    <Activity className="w-3 h-3 text-sky-400" />
                    <span>{org.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Primary Spacecraft Countermeasures:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentH.primaryCountermeasures.map((cm, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/[0.06] border border-white/10 text-slate-200"
                  >
                    ✓ {cm}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MODULE O: 6 PROVENANCE CLASSIFICATIONS REGISTRY */}
      <div className="space-y-3 pt-1">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Module O: Scientific Evidence Provenance Classifications
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {PROVENANCE_CLASSIFICATIONS.map((prov, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between space-y-1.5"
            >
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${prov.badgeColor}`}>
                  {prov.code}
                </span>
                <h4 className="text-xs font-bold text-white mt-1.5">{prov.name}</h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {prov.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. ALL 5 OFFICIAL 2026 CHALLENGE RESOURCE LINKS (PROMINENTLY CLICKABLE) */}
      <div className="space-y-2.5 pt-1">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Official NASA & CSA Partner Resources (Click to Open Official Agency Ground Truth):
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {OFFICIAL_NASA_CSA_RESOURCES.map((res) => (
            <a
              key={res.id}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-sky-400/40 transition-all flex flex-col justify-between space-y-2 group"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    res.agency === 'NASA' ? 'bg-blue-500/20 text-sky-300 border-blue-400/30' : 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                  }`}>
                    {res.badge}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-sky-200 transition-colors line-clamp-1">
                  {res.name}
                </h4>
              </div>

              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {res.summary}
              </p>
            </a>
          ))}
        </div>
      </div>

    </div>
  );
};
