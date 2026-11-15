// src/components/ActivitySleepView.tsx
// Module J: Ethical Non-Punitive Gamification, Apple Fitness+ Routine Rings & Mastery Badges
// 100% Apple VisionOS Dark Frosted Glass with Interactive Rings, 14-Day Streak & Quiz

import React, { useState } from 'react';
import { 
  Bed, 
  Dumbbell, 
  Sun, 
  CheckCircle2, 
  Award, 
  ShieldCheck, 
  HelpCircle, 
  Flame, 
  Lock, 
  Sparkles 
} from 'lucide-react';
import type { DayRecord } from '../types/mission';

interface Props {
  currentDay: number;
  record: DayRecord;
  onOpenCitations: () => void;
  morningDone?: boolean;
  exerciseDone?: boolean;
  eveningDone?: boolean;
  onToggleMorning?: () => void;
  onToggleExercise?: () => void;
  onToggleEvening?: () => void;
}

export const ActivitySleepView: React.FC<Props> = ({
  currentDay,
  record,
  onOpenCitations,
  morningDone: propMorning,
  exerciseDone: propExercise,
  eveningDone: propEvening,
  onToggleMorning,
  onToggleExercise,
  onToggleEvening
}) => {
  // 3 Daily Routine Ring Completion States (fallback to local if not wired from context)
  const [localMorning, setLocalMorning] = useState(true);
  const [localExercise, setLocalExercise] = useState(false);
  const [localEvening, setLocalEvening] = useState(false);

  const morningDone = propMorning !== undefined ? propMorning : localMorning;
  const exerciseDone = propExercise !== undefined ? propExercise : localExercise;
  const eveningDone = propEvening !== undefined ? propEvening : localEvening;

  const toggleMorning = onToggleMorning || (() => setLocalMorning(!localMorning));
  const toggleExercise = onToggleExercise || (() => setLocalExercise(!localExercise));
  const toggleEvening = onToggleEvening || (() => setLocalEvening(!localEvening));

  // Mastery Quiz States (3 Questions)
  const [q1Answer, setQ1Answer] = useState<number | null>(null);
  const [q2Answer, setQ2Answer] = useState<number | null>(null);
  const [q3Answer, setQ3Answer] = useState<number | null>(null);

  // 3 Apple Fitness+ Routine Rings (Coral-Pink, Emerald-Green, Sky-Blue)
  const rings = [
    {
      id: 'morning',
      title: 'Morning Baseline Check-In Completed',
      subtitle: 'Resting HR, Brachial BP & Fasting Glucose',
      isCompleted: morningDone,
      percent: morningDone ? 100 : 35,
      strokeColor: '#FB7185', // Coral-Pink Ring
      icon: Sun,
      toggle: toggleMorning
    },
    {
      id: 'exercise',
      title: 'Countermeasure Exercise (ARED + Treadmill) Logged',
      subtitle: '90-min resistive loading & aerobic compliance',
      isCompleted: exerciseDone,
      percent: exerciseDone ? 100 : (currentDay === 19 ? 85 : 45),
      strokeColor: '#10B981', // Emerald-Green Ring
      icon: Dumbbell,
      toggle: toggleExercise
    },
    {
      id: 'evening',
      title: 'Evening Sleep & Mood Log Recorded',
      subtitle: 'Actigraphy sleep sync & subjective resilience check',
      isCompleted: eveningDone,
      percent: eveningDone ? 100 : Math.round((record.sleepHours / 8.0) * 100),
      strokeColor: '#38BDF8', // Sky-Blue Ring
      icon: Bed,
      toggle: toggleEvening
    }
  ];

  // Quiz questions
  const questions = [
    {
      id: 1,
      question: '1. What physiological phenomenon causes cephalad fluid shifts in microgravity?',
      options: [
        'Loss of hydrostatic column pressure gradient toward lower extremities',
        'Direct osmotic fluid loss from deep muscle tissues',
        'Acute renal hypoperfusion from space radiation'
      ],
      correct: 0,
      badgeTitle: 'Microgravity Fluid-Shift Explorer',
      badgeDesc: 'Mastered microgravity intravascular hemodynamics'
    },
    {
      id: 2,
      question: '2. Which diagnostic tool detects microgravity visual distortion & metamorphopsia?',
      options: [
        'Brachial Hemodynamic Cuff',
        'Digital High-Contrast Amsler Grid (Module L)',
        'Silicon Neutron Spectrometer'
      ],
      correct: 1,
      badgeTitle: 'SANS Vigilance Steward',
      badgeDesc: 'Certified in Spaceflight-Associated Neuro-ocular Assessment'
    },
    {
      id: 3,
      question: '3. Why does Mission Pulse require 3 of 4 days persistent drift before escalating to MCC?',
      options: [
        'To prevent single-day workout or post-meal spikes from causing false alarms',
        'Because spacecraft memory cannot transmit single records',
        'To reduce power consumption of satellite transmitters'
      ],
      correct: 0,
      badgeTitle: 'Deep-Space Autonomous Responder',
      badgeDesc: 'Qualified in deterministic clinical decision support logic'
    }
  ];

  const q1Correct = q1Answer === 0;
  const q2Correct = q2Answer === 1;
  const q3Correct = q3Answer === 0;

  return (
    <div className="h-full flex flex-col justify-between space-y-4 select-none pr-1 overflow-y-auto">
      
      {/* 1. VIEW HEADER */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Bed className="w-5 h-5 text-sky-400" />
            <span>Ethical Non-Punitive Gamification & Daily Routine Rings (Module J)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Consistency Over Perfection · Transparent Astronaut Trust Charter · 14-Day Calibration Streak
          </p>
        </div>

        <button
          onClick={onOpenCitations}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-semibold text-slate-200 transition-all"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Non-Punitive Charter</span>
        </button>
      </div>

      {/* 2. NON-PUNITIVE CHARTER BANNER & 14-DAY STREAK */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
        
        {/* Non-Punitive Charter Box (8 cols) */}
        <div className="md:col-span-8 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/25 via-sky-950/25 to-slate-900/40 border border-emerald-400/30 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-emerald-300 block">
              Explicit Non-Punitive Clinical Charter (Zero Flawed 0–100% "Health Scores")
            </span>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
              Composite single-score wellness ratings are strictly prohibited because they incentivize crew to suppress symptoms or hide fatigue out of fear of flight disqualification. MISSION PULSE rewards <strong>data honesty, routine consistency, and countermeasure compliance</strong>. Reporting fatigue earns 100% routine credit!
            </p>
          </div>
        </div>

        {/* 14-Day Streak Card (4 cols) */}
        <div className="md:col-span-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-400/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">Active Streak</span>
              <span className="text-sm font-bold text-white leading-tight">14-Day Countermeasure Streak</span>
            </div>
          </div>
          <span className="text-lg font-bold text-amber-300 tabular-nums">14d</span>
        </div>

      </div>

      {/* 3. 3 ANIMATED DAILY ROUTINE RINGS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rings.map((ring) => {
          const Icon = ring.icon;
          const radius = 34;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (ring.percent / 100) * circumference;

          return (
            <div
              key={ring.id}
              className="p-4 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-lg flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-white/[0.06] flex items-center justify-center text-white">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white tracking-tight">{ring.title}</h3>
                    <span className="text-[10px] text-slate-400 leading-none">{ring.subtitle}</span>
                  </div>
                </div>
              </div>

              {/* Progress Ring Graphic */}
              <div className="flex items-center justify-center py-2 relative">
                <svg className="w-24 h-24 -rotate-90 transform" viewBox="0 0 84 84">
                  <circle
                    cx="42"
                    cy="42"
                    r={radius}
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="7"
                    fill="transparent"
                  />
                  <circle
                    cx="42"
                    cy="42"
                    r={radius}
                    stroke={ring.strokeColor}
                    strokeWidth="7"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-lg font-bold text-white tracking-tight tabular-nums">
                    {ring.percent}%
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {ring.isCompleted ? 'Completed' : 'In Progress'}
                  </span>
                </div>
              </div>

              {/* Mark Complete Action Button */}
              <button
                onClick={ring.toggle}
                className={`w-full py-2 px-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  ring.isCompleted
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                    : 'bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/10'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{ring.isCompleted ? 'Routine Complete' : "Log Today's Routine"}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* 4. INTERACTIVE SPACE PHYSIOLOGY MASTERY QUIZ & UNLOCKED BADGES */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 flex-1 min-h-0">
        
        {/* Left: 3 Interactive Quiz Questions (8 cols) */}
        <div className="xl:col-span-8 p-5 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-lg flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-sky-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Spaceflight Physiology 60-Second Quiz
              </h3>
            </div>
            <span className="text-[10px] text-slate-400">
              Interactive NASA HRP Knowledge Check
            </span>
          </div>

          <div className="space-y-3">
            {questions.map((q) => {
              const currentAns = q.id === 1 ? q1Answer : q.id === 2 ? q2Answer : q3Answer;
              const setAns = q.id === 1 ? setQ1Answer : q.id === 2 ? setQ2Answer : setQ3Answer;

              return (
                <div key={q.id} className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <span className="text-xs font-bold text-white block">{q.question}</span>
                  
                  <div className="grid grid-cols-1 gap-1.5">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = currentAns === optIdx;
                      const isCorrect = isSelected && optIdx === q.correct;
                      const isWrong = isSelected && optIdx !== q.correct;

                      return (
                        <button
                          key={optIdx}
                          onClick={() => setAns(optIdx)}
                          className={`text-left py-1.5 px-3 rounded-xl text-xs transition-all flex items-center justify-between ${
                            isCorrect
                              ? 'bg-emerald-500/25 border border-emerald-400 text-white font-semibold'
                              : isWrong
                              ? 'bg-rose-500/25 border border-rose-400 text-rose-200'
                              : isSelected
                              ? 'bg-white/15 text-white'
                              : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300'
                          }`}
                        >
                          <span>{opt}</span>
                          {isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Unlocked Mastery Badges (4 cols) */}
        <div className="xl:col-span-4 p-5 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-lg flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Mastery Badges
              </h3>
            </div>
            <span className="text-[10px] text-amber-300 font-semibold">
              {[q1Correct, q2Correct, q3Correct].filter(Boolean).length}/3 Unlocked
            </span>
          </div>

          <div className="space-y-2.5">
            {questions.map((q) => {
              const isUnlocked = (q.id === 1 && q1Correct) || (q.id === 2 && q2Correct) || (q.id === 3 && q3Correct);

              return (
                <div
                  key={q.id}
                  className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                    isUnlocked
                      ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-400/50 text-white shadow-md'
                      : 'bg-white/[0.02] border-white/5 text-slate-500 opacity-60'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isUnlocked ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-white/5 text-slate-500'
                  }`}>
                    {isUnlocked ? <Sparkles className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold leading-tight">{q.badgeTitle}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{q.badgeDesc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-2.5 rounded-2xl bg-black/40 border border-white/5 text-[10px] text-slate-400 text-center">
            Answer all 3 questions to complete Spaceflight Medical Proficiency
          </div>
        </div>

      </div>

    </div>
  );
};
