# MISSION PULSE — Explainable Astronaut Health State-Awareness & Autonomous Self-Assessment Platform
### NASA International Space Apps Challenge 2026

[![Live Demo](https://img.shields.io/badge/Live%20Spacecraft%20Console-mission--pulse--hz8r.vercel.app-0284c7?style=for-the-badge&logo=vercel&logoColor=white)](https://mission-pulse-hz8r.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-swanthalok--stack%2FMission--Pulse-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/swanthalok-stack/Mission-Pulse)
[![NASA HRP Grounded](https://img.shields.io/badge/NASA%20HRP-5%20Hazards%20Grounded-dc2626?style=for-the-badge&logo=nasa&logoColor=white)](https://www.nasa.gov/hrp/hazards/)
[![CSA Partner Integration](https://img.shields.io/badge/CSA%20ASC-CANS%20Dosimetry-e11d48?style=for-the-badge)](https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp)
[![Automated Test Suite](https://img.shields.io/badge/E2E%20Validation-16%2F16%20Modules%20Passing%20(100%25)-059669?style=for-the-badge&logo=checkmarx&logoColor=white)]()

> **Deployment Notice & Viewport Recommendation:**  
> **Live Console Demo:** [https://mission-pulse-hz8r.vercel.app/](https://mission-pulse-hz8r.vercel.app/)  
> **Source Code:** [https://github.com/swanthalok-stack/Mission-Pulse](https://github.com/swanthalok-stack/Mission-Pulse)  
> *Engineered specifically for onboard Crew Medical Officer (CMO) workstations, Mission Control Flight Surgeon consoles, and Apple visionOS spatial displays. Best experienced on Desktop/Laptop viewports at `1366×768` or higher.*

---

## Executive Summary & Deep-Space Challenge

During long-duration missions to the Moon (Artemis II/III/IV) and Mars, astronauts travel beyond the protection of Low Earth Orbit (LEO). In this operational environment, terrestrial telemedicine collapses:
1. **Communication Latency:** One-Way Light-Time (OWLT) delays range from **2.4 seconds** at lunar distances to **up to 20 minutes** during transit to Mars, compounded by planetary occultation and Loss-of-Signal (LOS) blackouts. Real-time physician consultation is physically impossible.
2. **Failure of Terrestrial Hospital Cutoffs:** Rigid clinical thresholds calibrated for Earth (e.g., resting heart rate $> 100\text{ bpm}$, blood pressure $> 120/80\text{ mmHg}$) trigger catastrophic alert fatigue due to normal microgravity adaptations (cephalad fluid redistribution, altered baroreflex sensitivity, post-exercise recovery after high-intensity resistive exercise on ARED).
3. **Subtle Multi-System Decompensation:** Life-threatening spaceflight conditions—such as Spaceflight-Associated Neuro-ocular Syndrome (SANS), orthostatic intolerance, insidious sleep debt, or early autonomic drift—manifest as faint, multi-vital cross-correlations that single-vital monitors overlook.

**MISSION PULSE** is an autonomous, explainable, edge-native clinical health state-awareness platform designed for astronauts operating under autonomous deep-space rules. Grounded in official NASA Human Research Program (HRP) evidence, Canadian Space Agency (CSA) radiation protocols, and NASA-STD-3001, MISSION PULSE replaces brittle Earth alarms with personalized rolling median bands, transparent decision trees, closed-loop crew self-examination protocols, and offline store-and-forward telemetry.

---

## Key Clinical Innovations

```
                                  MISSION PULSE ARCHITECTURE
 ┌────────────────────────────────────────────────────────────────────────────────────────┐
 │ 1. INGESTION & HARDWARE SENSOR LAYER                                                   │
 │    Bio-Monitor Smart Shirt • Bio-Harness Cuff • CSA CANS Dosimeter • Manual Crew Log  │
 └───────────────────────────────────────────┬────────────────────────────────────────────┘
                                             ▼
 ┌────────────────────────────────────────────────────────────────────────────────────────┐
 │ 2. 4-STAGE AUTONOMOUS PERSONAL BASELINE ENGINE (Zero Alert Fatigue)                   │
 │    Stage 1: SQI Optical Signal Quality Gate (Rejects bad sensor contact, e.g. Day 44) │
 │    Stage 2: Contextual Confounder Filter (Post-meal Day 16, Post-ARED Day 19)          │
 │    Stage 3: Median ± max(2*MAD, V_floor) Baseline Bands (Calibrated Days 1-14)         │
 │             BASELINE FROZEN AT DAY 26 (Prevents pathology absorption into normal)     │
 │    Stage 4: Authoritative 3-of-4 Day Persistence Trigger (Eliminates false alarms)    │
 └───────────────────────────────────────────┬────────────────────────────────────────────┘
                                             ▼
 ┌────────────────────────────────────────────────────────────────────────────────────────┐
 │ 3. EXPLAINABLE CLINICAL REASONING (XAI) & AUDIT TRAIL                                  │
 │    5-State Lifecycle (Detected -> Verifying -> Actionable -> Intervening -> Resolved)  │
 │    Counterfactual Signal Checklists • Transparent Decision Tree Audits                │
 └───────────────────────────────────────────┬────────────────────────────────────────────┘
                                             ▼
 ┌────────────────────────────────────────────────────────────────────────────────────────┐
 │ 4. INTERACTIVE CREW ACTION & GROUND SYNCHRONIZATION                                    │
 │    X-Ray Twin Medical Explorer • 5 Self-Exam Protocols • Pulse AI RAG Companion       │
 │    10x10 Digital Amsler SANS Grid • SPE Storm Shelter Drill • Store-and-Forward Queue  │
 └────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Comprehensive Architecture: All 16 Modules (A through P)

### Module A: Real-Time Holographic Telemetry Canvas & Interactive Scrubber
- **6 Core Vital Cards:** Real-time monitoring of Resting Heart Rate, Blood Pressure (Systolic/Diastolic), Capillary Glucose, Core Body Temperature, Sleep Duration, and Cumulative Radiation Dose (displayed in clinically accurate space radiation units: $\text{mGy/d}$).
- **Interactive Mission Day Scrubber:** Instant scrubbing across the 60-day mission timeline (`◀ | Day Selector (1–60) | ▶ | Play/Pause`), with smooth auto-play ($1.4\text{s/day}$) and dynamic badge updates.
- **Top Metric Selector Pills:** Direct linking from all 6 vital cards to the central spline chart with glowing glassmorphic active tabs.
- **3 Bottom Clinical Action Cards:** Dynamic, non-truncated action items linking directly to Events Rule Trace, NASA 5 Hazards matrix, and the 2-minute verification wizard.

### Module B: Wearable Streams, Multi-Sensor Integration & Fault Injection
- **Multi-Sensor Ingestion:** Integrated telemetry pipelines simulating the Bio-Monitor Artemis Smart Shirt, Bio-Harness blood pressure cuff, and CSA CANS personal radiation dosimeters.
- **Fault Injection Sandbox:** Live simulator testing sensor hardware failures (e.g., loose optical sensor band slippage outputting raw $205\text{ bpm}$) to prove the system rejects artifacts without triggering false clinical alarms.
- **Manual Crew Entry & CSV Sync:** Secure modal allowing astronauts to log offline fingerstick glucose, manual cuff pressure, and oral temperatures, complete with automatic provenance tagging (`[MANUAL CREW ENTRY]`).

### Module C: 4-Stage Autonomous Personal Baseline Engine
- **Stage 1 (Signal Quality Index Gate):** Evaluates multispectral PPG signal quality; automatically rejects optical slips when $\text{SQI} < 50\%$.
- **Stage 2 (Confounder Suppression):** Suppresses physiological spikes caused by known contextual events (e.g., Day 16 post-meal glucose spike of $138\text{ mg/dL}$; Day 19 post-workout heart rate spike of $142\text{ bpm}$ following 90-minute ARED exercise).
- **Stage 3 (Personal Median & MAD Bands):** Derives individual normative envelopes using Median Absolute Deviation:
  $$\text{Upper Band} = M + \max(2 \times \text{MAD}, V_{\text{floor}})$$
  $$\text{Lower Band} = M - \max(2 \times \text{MAD}, V_{\text{floor}})$$
  Calibrated during Days 1–14 and **frozen at Day 26** to prevent pathological drift from shifting the baseline.
- **Stage 4 (3-of-4 Persistence Evaluation):** Requires anomalies to persist across 3 of 4 consecutive days before sounding clinical alarms, suppressing 100% of transient false alarms while catching persistent autonomic drift on Day 30.

### Module D: In-Flight Self-Assessment & Verification Protocol Wizard
- **5 Guided Clinical Verification Protocols:**
  1. *Resting Heart Rate Verification* (neutral microgravity posture, 5-minute stabilization).
  2. *Orthostatic & Arterial Pressure Verification* (brachial cuff alignment with heart level).
  3. *Capillary Blood Glucose Check* (glucometer strip cross-validation with meal timing).
  4. *Core Body Temperature Verification* (tympanic thermometry, circadian trough audit).
  5. *Sleep Architecture & Mood Diary* (subjective sleep quality, cognitive load, Karolinska sleepiness score).
- **Voice Synthesizer / Audio Coach:** Built-in Web Audio speech synthesis reads instructions aloud to crew members in hands-free microgravity environments.
- **Closed-Loop Resolution:** Astronauts can record verified readings directly, immediately updating the status from *Active Alert* to *Resolved*.

### Module E: Interactive Anatomical X-Ray Twin & Medical Body Explorer
- **Clean Medical Viewer:** Single anatomical imaging viewport featuring translucent cyan-blue anatomy with a glowing cardiac silhouette, arms relaxed at the sides, eliminating toy-like holograms or distracting rings.
- **8 Anchored Anatomical Hotspots:**
  - *Neuro-Ocular System (SANS)* — Cranium / Eyes
  - *Brain & Circadian* — Forehead / Brain
  - *Cardiovascular System* — Chest / Heart
  - *Respiratory System* — Lungs
  - *Endocrine & Metabolic System* — Upper Abdomen / Liver
  - *Immune & Hematologic Defense* — Skin / Thermal
  - *Musculoskeletal System* — Pelvis
  - *Locomotor / ARED Mastery* — Leg Muscle
- **Strict Anomaly Gating:** On nominal days (Days 1–15, 17–18, 20–26, 31–43, 45–49, 51–60), the body displays **zero dots, zero circles, and zero pills** (`All 8 Systems Nominal`). On anomaly days, pulsing beacons illuminate directly on their anatomical organ with decoupled callout badges (e.g., Day 44 `Sensor Fault • 205 bpm` pinned directly on the Heart; Day 30 `Sleep Debt`, `Heart Drift`, `Temp`, and `Glucose` pins positioned with zero overlap).
- **Organ Inspector Box:** Displays clean system titles (`Cardiovascular System`, `Endocrine & Metabolic System`, etc.), status pills (`Nominal`, `Drift`, `Filtered`), telemetry vs. baseline bands, and instant `[ Filter Chart ]` / `[ Start Self-Exam ]` action buttons.

### Module F: NASA 5 Hazards Matrix & Spaceflight Context
- **Grounded in NASA HRP Framework:** Directly maps real-time telemetry to the 5 primary risks of human spaceflight:
  1. **Radiation:** Galactic Cosmic Rays (GCR) & Solar Particle Events (SPE).
  2. **Isolation & Confinement:** Circadian disruption, sleep architecture collapse, behavioral stress.
  3. **Distance from Earth:** Communication latency, autonomous medical care requirements.
  4. **Gravity Fields:** Cephalad fluid shift, cardiovascular deconditioning, bone mineral loss, muscle atrophy.
  5. **Hostile/Closed Environments:** Spacecraft atmospheric $\text{CO}_2$, toxic exposures, microbial shifts.
- **Interactive Evidence Library:** Deep-dive cards detailing NASA countermeasures, operational flight rules, and clinical guidelines.

### Module G: Pulse AI & Clinical Voice Companion (RAG & Space Medicine Knowledge)
- **NASA HRP RAG Engine:** Grounded exclusively in official NASA and CSA flight medicine evidence; answers clinical questions without LLM hallucinations.
- **Fast-Action Diagnostic Prompts:** Single-click queries:
  - *"Explain Day 30 Status"* (breaks down the 4-day persistent drift in HR, temp, and sleep).
  - *"Why Did Day 19 Workout Not Alert?"* (explains Stage 2 confounder suppression of post-ARED tachycardia).
  - *"Why Did Baseline Freeze at Day 26?"* (explains statistical baseline poisoning prevention).
  - *"Guide Me Through BP Self-Exam"* (launches interactive audio protocol).
- **Responsive Docked Drawer:** Smoothly docked side-panel drawer with pinned bottom input bar, voice dictation toggle, and transparent clinical reasoning citations.

### Module H: 60-Day Multi-Day Trends & Spline Correlation Engine
- **Dual-Metric Spline Canvas:** Plot and correlate any two vitals simultaneously across the entire 60-day mission (e.g., Resting HR vs. Sleep Duration).
- **Discontinuous Vector Gap Rendering:** When sensor artifacts occur (e.g., Day 44 loose band), the line series value is set to `null` so the cubic spline **breaks with an open, visible gap**, keeping the line flat at baseline ($\sim 58\text{--}59\text{ bpm}$) without rising toward $205\text{ bpm}$.
- **Top-Edge Pinned Excluded Diamonds:** Confounder and artifact spikes appear exclusively in a separate scatter series pinned to the top edge:
  - Day 19: Hollow amber diamond pinned at top edge, labelled `142 — post-exercise, excluded` (resting line stays at $59\text{ bpm}$).
  - Day 30: Solid amber diamond at peak ($69\text{ bpm}$) annotated `Day 30 — 3-of-4 drift alert`.
  - Day 44: Hollow amber diamond pinned at top edge, labelled `205 — rejected: low signal quality`.

### Module I: Events & Alerts Explainable Rule Trace (XAI)
- **5-State Clinical Lifecycle:** Visual progress bar tracking events through `Detected` $\rightarrow$ `Verifying` $\rightarrow$ `Actionable` $\rightarrow$ `Intervening` $\rightarrow$ `Resolved`.
- **Auditable Signal Checklist:** Displays green/red evaluation criteria showing exactly which rules passed or failed (e.g., Resting HR $> 61\text{ bpm}$ for 4 days, Sleep $< 6.0\text{h}$, Temp $> 37.1^\circ\text{C}$).
- **Counterfactual "What-If" Engine:** Shows astronauts what conditions would have suppressed the alert (e.g., *"If Sleep was $\ge 7.0\text{h}$, persistence score would drop to 2/4 and alert would downgrade to Nominal"*).

### Module J: Non-Punitive Astronaut Mastery & Routine Gamification Rings
- **Apple Health-Style Habit Rings:** Daily completion tracking for Sleep ($8.0\text{h}$ goal), Hydration ($2.5\text{L}$ goal), Exercise (ARED + Cycle Ergometer, $60\text{m}$ goal), and Cognitive Readiness (Mindfulness / SANS check).
- **Resilience Streak Counters:** Tracks consecutive days of mission operational readiness without using anxiety-inducing demerit scores.
- **Operational Mastery Badges:** Awards positive reinforcement milestones (e.g., *Deep Sleep Architect*, *Radiation Sentry*, *Cardiovascular Stalwart*).

### Module K: Offline-First Comm Delay Profiles & Store-and-Forward Telemetry Queue
- **Selectable Mission Delay Profiles:**
  - *ISS / LEO:* $2\text{s}$ latency.
  - *Lunar Far-Side / Artemis Gateway:* $5\text{s}$ latency.
  - *Deep Space / Mars Transit:* $20\text{m}$ One-Way Light-Time (OWLT).
- **Store-and-Forward Architecture:** All self-assessment outcomes, telemetry logs, and manual entries are committed to an indexed local queue; when comm windows open, packets are bundled, timestamped, and transmitted asynchronously.

### Module L: SANS Neuro-Ocular Eye Exam & 10×10 Digital Amsler Grid
- **Spaceflight-Associated Neuro-ocular Syndrome (SANS) Lab:** Dedicated screening tool for optic disc edema, globe flattening, and hyperopic refractive shifts common in microgravity.
- **Interactive 10×10 Amsler Grid:** Astronauts click grid coordinate intersections to plot visual scotomas or wavy lines (metamorphopsia), saving longitudinal distortion maps across mission days.

### Module M: Environmental Monitoring & CSA SPE Storm Shelter Drill
- **Cabin Telemetry:** Tracks ambient $\text{CO}_2$ partial pressure ($\text{mmHg}$), cabin pressure, oxygen concentration, and ambient ionizing radiation.
- **CSA CANS Radiation Integration:** Displays real-time and cumulative ionizing radiation dosimeter readings.
- **Solar Particle Event (SPE) Drill:** Interactive drill simulation triggering emergency shelter protocols, ordering the crew to move into water-shielded sleeping berths during solar proton storms (Day 50 scenario).

### Module N: Dual-Role Switcher (Crew View vs Flight Surgeon Console)
- **Role Perspective Toggle:** Seamless one-click switch between **Crew View** (optimized for crew calm, self-examination, and actionable recovery) and **Flight Surgeon Console** (dense multi-vital diagnostic dashboard, telemetry stream audits, and flight rule enforcement).
- **Medical Package Compilation:** Flight surgeons can review compiled telemetry packets, acknowledge crew verifications, and uplink clinical directives.

### Module O: Scientific Evidence Library & Official Citations Modal
- **Direct NASA & CSA Ground Truth Links:** Modal dialog accessible from the header emblem providing full citations, DOI links, and clinical rationale for all algorithms used in MISSION PULSE.

### Module P: Behavioral Health & Crew Private Enclave Mask
- **Cryptographic Confidentiality Mask:** Protects sensitive psychological reflections, private physician communications, and sleep mood logs from public spacecraft displays.
- **Redaction Overlay:** Renders an authenticated `[REDACTED — CREW PRIVATE ENCLAVE]` mask to honor astronaut psychological privacy while maintaining operational safety.

---

## Official NASA & Space Agency Partner Resources Grounding

MISSION PULSE is built upon published NASA and international space agency biomedical research:

1. **NASA Human Research Program (HRP) — The 5 Hazards of Human Spaceflight**  
   *URL:* [https://www.nasa.gov/hrp/hazards/](https://www.nasa.gov/hrp/hazards/)  
   *Application:* Grounded the core risk matrix in Module F, establishing the causal links between Space Radiation, Isolation & Confinement, Distance from Earth, Gravity Fields, and Hostile/Closed Environments.

2. **NASA Human Research Program (HRP) — Risks of Human Spaceflight**  
   *URL:* [https://www.nasa.gov/hrp/risks/](https://www.nasa.gov/hrp/risks/)  
   *Application:* Formed the evidentiary basis for the 4-stage baseline engine, ensuring alerts reflect true microgravity risks (cardiovascular deconditioning, SANS, circadian shifting).

3. **NASA Ongoing HRP Research in Space (Artemis II & Beyond)**  
   *URL:* [https://www.nasa.gov/hrp/ongoing-hrp-research/](https://www.nasa.gov/hrp/ongoing-hrp-research/)  
   *Application:* Dictated the communication latency constraints and autonomous edge diagnostic requirements for missions traveling beyond low Earth orbit.

4. **Canadian Space Agency (CSA / ASC) — Monitoring Radiation for Astronaut Health**  
   *URL:* [https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp](https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp)  
   *Application:* Integrated the CSA CANS (Complex Autonomous Neutron Sensor) and Radi-N2 dosimeter specifications for personal neutron dosimetry during lunar transit, driving Module M and the Day 50 SPE drill.

5. **Canadian Space Agency (CSA / ASC) — Why Do We Conduct Science Experiments in Space?**  
   *URL:* [https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp](https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp)  
   *Application:* Guided the cardiovascular deconditioning modeling and microgravity fluid shift physiological response curve.

6. **NASA-STD-3001: Spaceflight Human-System Standard (Volumes 1 & 2)**  
   *Application:* Dictated medical data privacy standards (Module P), clinical alarm audibility rules, and display ergonomics.

7. **The NASA Twins Study: A Multidimensional Analysis of a Year-Long Human Spaceflight**  
   *Reference:* Garrett-Bakelman et al., *Science* 364, eaau8650 (2019). [doi:10.1126/science.aau8650](https://doi.org/10.1126/science.aau8650)  
   *Application:* Calibrated baseline drift tolerances, inflammatory cytokine surrogate markers, and cognitive speed metrics.

---

## Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19, TypeScript 5.8, Vite 8 |
| **Styling & Design System** | Tailwind CSS v4, Apple visionOS Glassmorphism, Custom SVG Icons |
| **Visualization & Charts** | Monotone Cubic Spline SVG Interpolator, Multi-Day Time-Series Geometry |
| **3D & Imaging** | Three.js WebGL Engine, Medical Anatomical X-Ray Imaging Silhouette |
| **Audio & Speech Engine** | Web Audio API, SpeechSynthesis / Audio Synthesizer Coach |
| **Testing & CI** | Puppeteer E2E Testing, Oxlint, TypeScript strict mode |
| **Hosting & Deployment** | Vercel Serverless Edge Platform |

---

## Local Development & Automated Verification Suites

### Prerequisites
- Node.js 18+ (Node.js 22+ recommended)
- Google Chrome (for automated Puppeteer verification suites)

### 1. Clone & Install
```bash
git clone https://github.com/swanthalok-stack/Mission-Pulse.git
cd Mission-Pulse
npm install
```

### 2. Development Server
```bash
npm run dev
# Server boots at http://localhost:5173/ with instant Hot Module Replacement (HMR)
```

### 3. Production Build
```bash
npm run build
# Compiles clean TypeScript and bundles production assets into dist/ (zero errors)
```

### 4. Running the 5 Automated E2E Verification Suites

The repository includes 5 comprehensive Puppeteer verification scripts that validate all functionality headlessly against live Chrome DevTools:

```bash
# 1. Comprehensive 16-Module Suite (Modules A through P end-to-end validation)
node scripts/verify-all-16-modules.cjs

# 2. Live Screen Regression Suite (Scrubber, Metric Pills, Day 30 Waveform, Vector Emblem)
node scripts/verify-regressions.cjs

# 3. Pulse AI & Voice Companion Suite (36/36 tests: RAG latency, dynamic prompts, citations)
node scripts/verify-pulse-ai.cjs

# 4. Full Sidebar Suite (Vitals, Activity, Cognitive, Environment, Events, Mission Context)
node scripts/verify-full-sidebar-suite.cjs

# 5. Top Capsule Tabs & Comm Profiles Suite (Live, Trends, Events, Analysis, Reports, OWLT)
node scripts/verify-task-capsules.cjs
```

---

## Mission Scenario & Test Walkthrough

To experience the platform's autonomous clinical logic during demonstration, navigate through the mission days using the header scrubber:

| Day | Clinical Scenario | Expected Platform Response |
|---|---|---|
| **Day 1–14** | Baseline Calibration Phase | Personal median & MAD bands calculated; **0 alert beacons on X-Ray Twin** (`All 8 Systems Nominal`). |
| **Day 16** | Fake Alarm #1: Post-Meal Glucose | Glucose spikes to $138\text{ mg/dL}$; Stage 2 Confounder Filter identifies `[MANUAL CREW ENTRY]` post-prandial context; **alarm suppressed**. |
| **Day 19** | Fake Alarm #2: Post-Workout Tachycardia | Active HR reaches $142\text{ bpm}$ post-ARED; resting HR remains nominal ($59\text{ bpm}$); Stage 2 filter marks `EXCLUDED_POST_EXERCISE`; **no false alarm sounded**. |
| **Day 26** | Pre-Drift Baseline Freeze | Personal baseline calculation is **frozen** to prevent chronic pathology from corrupting nominal thresholds. |
| **Day 27–29** | Persistent Drift Onset | Resting HR rises ($63 \rightarrow 65 \rightarrow 67\text{ bpm}$), sleep declines ($5.7\text{h}$), core temp elevates ($37.2^\circ\text{C}$); system monitors without prematurely alerting. |
| **Day 30** | Authoritative 3-of-4 Day Drift Alert | 3-of-4 persistence rule fires; X-Ray Twin illuminates 4 organ alerts; Pulse AI provides transparent XAI explanation; Self-Exam wizard opens. |
| **Day 31–34** | Countermeasure Verification & Recovery | Crew performs guided self-assessment (hydration, sleep reset); vitals return to baseline; Day 34 marks event **RESOLVED**. |
| **Day 44** | Hardware Sensor Artifact | Loose wristband slips during sleep outputting raw $205\text{ bpm}$; Stage 1 SQI filter detects $<50\%$ signal quality; 60d chart renders **gap break**; amber diamond pinned at ceiling. |
| **Day 50** | CSA Solar Particle Event (SPE) Drill | Ionizing radiation reaches $2.80\text{ mGy/d}$; full-body radiation warning pulses; crew completes emergency storm-shelter drill. |

---

## License & Space Apps Submission

Developed for the **2026 NASA International Space Apps Challenge**.  
All mission profiles, synthetic telemetry streams, and clinical decision frameworks are open-source and intended to advance autonomous medical systems for human deep-space exploration.
