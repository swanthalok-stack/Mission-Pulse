// src/components/Anatomy3DExplorer.tsx
// Module E & F: Real 3D WebGL Holographic Astronaut Anatomical Explorer using React Three Fiber & Drei
// 100% Apple VisionOS Dark Frosted Glass with Zero Monospace

import React, { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { SystemId } from '../types/mission';
import { PHYSIOLOGICAL_SYSTEMS, SPACEFLIGHT_HAZARDS, OFFICIAL_NASA_CSA_RESOURCES } from '../data/nasaKnowledgeBase';
import { 
  ExternalLink, 
  Layers, 
  RotateCw, 
  Play
} from 'lucide-react';

interface Props {
  currentDay: number;
  onOpenProtocol: (protocolId: string) => void;
  onOpenCitations: (resourceId?: string) => void;
}

interface Hotspot3D {
  id: SystemId;
  label: string;
  position: [number, number, number];
}

const HOTSPOTS_3D: Hotspot3D[] = [
  { id: 'neuro_ocular', label: 'NEURO-OCULAR / SANS', position: [0, 0.65, 0.15] },
  { id: 'cardiovascular', label: 'CARDIOVASCULAR', position: [0, 0.28, 0.18] },
  { id: 'respiratory', label: 'RESPIRATORY', position: [0, 0.35, -0.1] },
  { id: 'immune_hematology', label: 'IMMUNE / LYMPH', position: [-0.22, 0.22, 0.1] },
  { id: 'endocrine_metabolic', label: 'ENDOCRINE / GLUCOSE', position: [0.15, 0.05, 0.12] },
  { id: 'renal_fluid', label: 'RENAL / FLUID', position: [-0.15, -0.05, -0.1] },
  { id: 'musculoskeletal', label: 'MUSCULOSKELETAL', position: [0.14, -0.42, 0.1] },
  { id: 'psychological_circadian', label: 'CIRCADIAN PACEMAKER', position: [0, 0.78, 0.05] },
];

function ProceduralMannequin({ selectedId }: { selectedId: SystemId }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Head */}
      <mesh position={[0, 0.65, 0]}>
        <sphereGeometry args={[0.13, 24, 24]} />
        <meshPhysicalMaterial 
          color="#38BDF8" 
          wireframe 
          transparent 
          opacity={selectedId === 'neuro_ocular' ? 0.95 : 0.6} 
        />
      </mesh>
      
      {/* Torso / Ribcage */}
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.22, 0.16, 0.52, 20]} />
        <meshPhysicalMaterial 
          color="#38BDF8" 
          wireframe 
          transparent 
          opacity={selectedId === 'cardiovascular' ? 0.95 : 0.6} 
        />
      </mesh>

      {/* Internal Spine */}
      <mesh position={[0, 0.28, -0.02]}>
        <cylinderGeometry args={[0.03, 0.03, 0.6, 12]} />
        <meshBasicMaterial color="#06B6D4" wireframe />
      </mesh>

      {/* Pelvis */}
      <mesh position={[0, -0.08, 0]}>
        <cylinderGeometry args={[0.17, 0.19, 0.2, 16]} />
        <meshPhysicalMaterial color="#0284C7" wireframe transparent opacity={0.5} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.1, -0.48, 0]}>
        <cylinderGeometry args={[0.07, 0.05, 0.65, 14]} />
        <meshPhysicalMaterial color="#0284C7" wireframe transparent opacity={0.45} />
      </mesh>
      <mesh position={[0.1, -0.48, 0]}>
        <cylinderGeometry args={[0.07, 0.05, 0.65, 14]} />
        <meshPhysicalMaterial color="#0284C7" wireframe transparent opacity={0.45} />
      </mesh>
    </group>
  );
}

export const Anatomy3DExplorer: React.FC<Props> = ({
  currentDay: _currentDay,
  onOpenProtocol,
  onOpenCitations
}) => {
  const [selectedSystemId, setSelectedSystemId] = useState<SystemId>('cardiovascular');

  const selectedSystem = PHYSIOLOGICAL_SYSTEMS.find(s => s.id === selectedSystemId) || PHYSIOLOGICAL_SYSTEMS[0];
  const associatedHazard = SPACEFLIGHT_HAZARDS.find(h => h.associatedSystems.includes(selectedSystemId)) || SPACEFLIGHT_HAZARDS[0];
  const officialRef = OFFICIAL_NASA_CSA_RESOURCES.find(r => r.id === selectedSystem.nasaReferenceId) || OFFICIAL_NASA_CSA_RESOURCES[0];

  return (
    <div className="w-full h-full flex flex-col xl:flex-row gap-4 text-slate-100 select-none">
      
      {/* 3D WebGL Canvas Viewport (Left) */}
      <div className="flex-1 min-h-[420px] rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 relative flex flex-col overflow-hidden shadow-xl">
        
        {/* Canvas HUD Header */}
        <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-2xl text-xs">
          <Layers className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-semibold text-white tracking-wider">3D Holographic Mannequin</span>
          <span className="text-slate-500">·</span>
          <span className="text-sky-300">WebGL Telemetry</span>
        </div>

        {/* Rotation Hint */}
        <div className="absolute bottom-3.5 left-3.5 z-10 flex items-center gap-1.5 bg-black/50 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-xl text-[11px] text-slate-300">
          <RotateCw className="w-3 h-3 text-sky-400" />
          <span>Drag to rotate 3D body · Scroll to zoom</span>
        </div>

        {/* Three.js Canvas */}
        <div className="w-full flex-1">
          <Canvas
            camera={{ position: [0, 0.4, 2.6], fov: 45 }}
            style={{ background: 'transparent' }}
          >
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 10, 5]} intensity={1.2} />
            <pointLight position={[-5, 5, -5]} intensity={0.6} color="#38BDF8" />

            <OrbitControls 
              enablePan={false} 
              minDistance={1.2} 
              maxDistance={3.8} 
              maxPolarAngle={Math.PI / 1.7} 
              minPolarAngle={Math.PI / 4} 
            />

            <Suspense fallback={null}>
              <ProceduralMannequin selectedId={selectedSystemId} />
            </Suspense>

            {/* 3D Interactive Hotspot Markers */}
            {HOTSPOTS_3D.map((spot) => {
              const isSelected = selectedSystemId === spot.id;

              return (
                <Html
                  key={spot.id}
                  position={spot.position}
                  center
                  distanceFactor={2.8}
                >
                  <button
                    onClick={() => setSelectedSystemId(spot.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[10px] font-semibold whitespace-nowrap transition-all shadow-md ${
                      isSelected 
                        ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 border-white shadow-[0_0_12px_rgba(56,189,248,0.5)] scale-105' 
                        : 'bg-black/75 text-slate-300 border-white/20 hover:text-white hover:border-sky-400'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-slate-950' : 'bg-sky-400'}`} />
                    <span>{spot.label}</span>
                  </button>
                </Html>
              );
            })}
          </Canvas>
        </div>

      </div>

      {/* Right Column: 8 Organ Systems & NASA RIDGE Hazards Inspector */}
      <div className="w-full xl:w-[440px] flex flex-col gap-3 shrink-0 overflow-y-auto">
        
        {/* Organ System Selection Strip */}
        <div className="grid grid-cols-2 gap-1.5 bg-white/[0.04] p-1.5 border border-white/10 rounded-2xl text-xs">
          {PHYSIOLOGICAL_SYSTEMS.map(sys => {
            const active = selectedSystemId === sys.id;
            return (
              <button
                key={sys.id}
                onClick={() => setSelectedSystemId(sys.id)}
                className={`px-2.5 py-1.5 rounded-xl text-left transition-all truncate border font-medium ${
                  active 
                    ? 'bg-sky-500/25 text-white border-sky-400/50 shadow-sm font-semibold' 
                    : 'text-slate-400 border-transparent hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {sys.name.split('&')[0]}
              </button>
            );
          })}
        </div>

        {/* Selected System Detail Card */}
        <div className="p-4 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-lg space-y-3">
          
          <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2.5">
            <div>
              <span className="text-[10px] uppercase text-sky-400 font-bold tracking-wider">
                Target: {selectedSystem.organTarget}
              </span>
              <h3 className="text-sm font-bold text-white tracking-tight mt-0.5">
                {selectedSystem.name}
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              NOMINAL
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedSystem.summary}
          </p>

          {/* Key Spaceflight Risks */}
          <div className="space-y-1.5 pt-1 border-t border-white/10">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
              NASA Microgravity Physiological Risks:
            </span>
            <ul className="space-y-1 text-xs text-slate-300">
              {selectedSystem.spaceflightRisks.map((risk, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-sky-400">•</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* NASA RIDGE Spaceflight Hazard Correlation */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-lg flex items-center justify-center bg-sky-500/20 text-sky-300 font-bold text-xs border border-sky-400/30">
                  {associatedHazard.letter}
                </span>
                <span className="text-xs font-bold text-white">
                  Hazard: {associatedHazard.title}
                </span>
              </div>
              <button
                onClick={() => onOpenCitations?.(selectedSystem.nasaReferenceId)}
                className="inline-flex items-center gap-1 text-[11px] text-sky-300 hover:underline"
              >
                <span>{officialRef.badge}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <p className="text-[11px] text-slate-400 leading-normal">
              {associatedHazard.aerospaceImpact}
            </p>
          </div>

          {/* Launch Associated Clinical Protocol */}
          <div className="pt-1 flex items-center justify-between">
            <span className="text-xs text-slate-400">Autonomous Guide:</span>
            <button
              onClick={() => onOpenProtocol('protocol-posture-orthostatic')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>Launch Clinical Protocol</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
