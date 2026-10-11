'use client';
import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/*  Segment / choreography model                                       */
/* ------------------------------------------------------------------ */

export const SEGMENTS = [
  'hero', 'act1', 'act2', 'act3', 'act4', 'act5',
  'svc0', 'svc1', 'svc2', 'svc3', 'svc4',
  'act6', 'contact',
] as const;
export type SegmentId = (typeof SEGMENTS)[number];
export const SEG_IDX: Record<SegmentId, number> = Object.fromEntries(
  SEGMENTS.map((s, i) => [s, i])
) as Record<SegmentId, number>;

export type FormationId =
  | 'cloud' | 'shell' | 'grid' | 'lattice' | 'neural' | 'galaxy'
  | 'web' | 'cortex' | 'modules' | 'prism' | 'network' | 'halo';

/** formation per segment index (13 entries, last repeated) */
export const SEG_FORMATION: FormationId[] = [
  'cloud', 'shell', 'grid', 'lattice', 'neural', 'galaxy',
  'web', 'cortex', 'modules', 'prism', 'network', 'halo', 'halo',
];

/* ------------------------------------------------------------------ */
/*  Camera keys per segment                                            */
/* ------------------------------------------------------------------ */

export interface CamKey { pos: [number, number, number]; look: [number, number, number]; fov: number }
export const CAM_KEYS: Record<SegmentId, CamKey> = {
  hero:    { pos: [0.0, 0.35, 13.4], look: [0, 0.1, 0],   fov: 52 },
  act1:    { pos: [3.4, 1.1, 8.6],   look: [-1.4, 0.2, 0], fov: 50 },
  act2:    { pos: [-4.0, 2.2, 9.0],  look: [1.4, 0.0, 0],  fov: 48 },
  act3:    { pos: [0.5, -1.7, 7.8],  look: [0, 0.7, 0],    fov: 46 },
  act4:    { pos: [3.8, 1.9, 9.6],   look: [-1.0, 0.2, 0], fov: 48 },
  act5:    { pos: [0, 2.6, 18.0],    look: [0, 0.6, 0],    fov: 55 },
  svc0:    { pos: [-2.8, 1.1, 11.4], look: [1.0, 0, 0],    fov: 50 },
  svc1:    { pos: [2.9, -0.7, 10.6], look: [-1.0, 0, 0],   fov: 50 },
  svc2:    { pos: [-2.4, 2.3, 11.8], look: [0.7, 0, 0],    fov: 50 },
  svc3:    { pos: [2.5, 0.9, 11.0],  look: [-0.6, 0.2, 0], fov: 50 },
  svc4:    { pos: [0, 1.5, 14.8],    look: [0, 0.4, 0],    fov: 52 },
  act6:    { pos: [0, 0.4, 11.6],    look: [0, 0.1, 0],    fov: 50 },
  contact: { pos: [0, 2.0, 15.5],    look: [0, 0.6, 0],    fov: 55 },
};

/* ------------------------------------------------------------------ */
/*  Engine parameter keys per segment                                  */
/* ------------------------------------------------------------------ */

export interface EngineKey {
  flatten: number; scale: number; tilt: number; ringOp: number;
  core: number; fragment: number; net: number; speed: number;
}
export const ENGINE_KEYS: Record<SegmentId, EngineKey> = {
  hero:    { flatten: 0.00, scale: 1.00, tilt: 0.60, ringOp: 0.85, core: 1.00, fragment: 0.00, net: 0.00, speed: 1.0 },
  act1:    { flatten: 0.00, scale: 1.14, tilt: 0.95, ringOp: 0.95, core: 0.90, fragment: 0.85, net: 0.35, speed: 1.3 },
  act2:    { flatten: 0.93, scale: 1.55, tilt: 1.05, ringOp: 0.55, core: 0.55, fragment: 0.15, net: 0.10, speed: 0.5 },
  act3:    { flatten: 0.10, scale: 0.85, tilt: 0.35, ringOp: 1.00, core: 0.80, fragment: 0.05, net: 1.00, speed: 1.6 },
  act4:    { flatten: 0.35, scale: 1.06, tilt: 0.50, ringOp: 0.70, core: 0.95, fragment: 0.10, net: 0.90, speed: 0.9 },
  act5:    { flatten: 0.00, scale: 1.90, tilt: 0.75, ringOp: 0.75, core: 1.15, fragment: 0.18, net: 0.35, speed: 0.6 },
  svc0:    { flatten: 0.85, scale: 1.30, tilt: 0.95, ringOp: 0.45, core: 0.60, fragment: 0.05, net: 0.30, speed: 0.4 },
  svc1:    { flatten: 0.20, scale: 1.00, tilt: 0.50, ringOp: 0.65, core: 1.05, fragment: 0.08, net: 0.90, speed: 1.2 },
  svc2:    { flatten: 0.10, scale: 1.05, tilt: 0.40, ringOp: 0.80, core: 0.85, fragment: 0.04, net: 0.60, speed: 0.8 },
  svc3:    { flatten: 0.30, scale: 1.15, tilt: 0.70, ringOp: 0.70, core: 0.90, fragment: 0.20, net: 0.25, speed: 0.7 },
  svc4:    { flatten: 0.00, scale: 1.60, tilt: 0.80, ringOp: 0.75, core: 1.00, fragment: 0.10, net: 0.75, speed: 0.5 },
  act6:    { flatten: 0.06, scale: 1.25, tilt: 0.50, ringOp: 1.00, core: 1.35, fragment: 0.00, net: 0.50, speed: 1.1 },
  contact: { flatten: 0.15, scale: 1.40, tilt: 0.65, ringOp: 0.50, core: 0.80, fragment: 0.00, net: 0.20, speed: 0.4 },
};

/* ------------------------------------------------------------------ */
/*  Palettes per segment                                               */
/* ------------------------------------------------------------------ */

export interface Palette { a: string; b: string; acc: string; bg: string }
export const PALETTES: Record<SegmentId, Palette> = {
  hero:    { a: '#4de8ff', b: '#7a5cff', acc: '#ffb454', bg: '#04060e' },
  act1:    { a: '#8fd8ff', b: '#4de8ff', acc: '#ffffff', bg: '#050912' },
  act2:    { a: '#7a5cff', b: '#4de8ff', acc: '#c7b8ff', bg: '#070714' },
  act3:    { a: '#3f8cff', b: '#4de8ff', acc: '#9ff3ff', bg: '#04070f' },
  act4:    { a: '#6a5cff', b: '#37f2d8', acc: '#ff5c8a', bg: '#06060f' },
  act5:    { a: '#ffb454', b: '#ffd9a0', acc: '#fff4e0', bg: '#0a0806' },
  svc0:    { a: '#4de8ff', b: '#3f8cff', acc: '#9ff3ff', bg: '#04060f' },
  svc1:    { a: '#37f2d8', b: '#6a5cff', acc: '#a7fff0', bg: '#040809' },
  svc2:    { a: '#3f8cff', b: '#37f2d8', acc: '#9fc3ff', bg: '#04060d' },
  svc3:    { a: '#c77dff', b: '#ff5c8a', acc: '#ffd9a0', bg: '#0a0510' },
  svc4:    { a: '#ffb454', b: '#4de8ff', acc: '#fff4e0', bg: '#070608' },
  act6:    { a: '#4de8ff', b: '#ffb454', acc: '#ffffff', bg: '#04060e' },
  contact: { a: '#3f8cff', b: '#4de8ff', acc: '#ffb454', bg: '#04060e' },
};

/* ------------------------------------------------------------------ */
/*  Shared shader uniforms (singleton, mutated in render loop)         */
/* ------------------------------------------------------------------ */

export const uni = {
  uTime: { value: 0 },
  uMorph: { value: 0 },
  uIntro: { value: 0 },
  uEnergy: { value: 0 },
  uFragment: { value: 0 },
  uSpin: { value: 1 },
  uWaveT: { value: -100 },
  uPixelRatio: { value: 1 },
  uSize: { value: 1.15 },
  uOpacity: { value: 0.85 },
  uColorA: { value: new THREE.Color('#4de8ff') },
  uColorB: { value: new THREE.Color('#7a5cff') },
  uAcc: { value: new THREE.Color('#ffb454') },
  uReduced: { value: 0 },
  uDim: { value: 0 },
};

/* ------------------------------------------------------------------ */
/*  Global mutable store (no React re-renders for per-frame data)      */
/* ------------------------------------------------------------------ */

type Listener = (evt: string, data?: unknown) => void;

export const store = {
  phase: 0,              // continuous 0..12
  progress: 0,           // global scroll 0..1
  introT: 0,             // 0..1 intro cinematic
  introStage: 0,         // 0 dormant, 1 signal, 2 activation, 3 formation, 4 typography, 5 living
  introDone: false,
  reduced: false,
  sound: false,
  webgl: true,
  pointer: { x: 0, y: 0 },
  shake: 0,
  activeSeg: 'hero' as SegmentId,
  activeService: 0,
  pendingService: null as number | null,
  clockTime: 0,
  msr: [] as { id: SegmentId; top: number; height: number; span: number }[],
  quality: { tier: 2 as 0 | 1 | 2, dpr: 1.5, particles: 8000, bloom: true },
  subs: new Set<Listener>(),
  on(l: Listener) { this.subs.add(l); return () => { this.subs.delete(l); }; },
  emit(evt: string, data?: unknown) { this.subs.forEach((l) => l(evt, data)); },
};

/* ------------------------------------------------------------------ */
/*  Math / helpers                                                     */
/* ------------------------------------------------------------------ */

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smoothstep = (t: number) => { t = clamp01(t); return t * t * (3 - 2 * t); };
export const smootherstep = (t: number) => { t = clamp01(t); return t * t * t * (t * (t * 6 - 15) + 10); };

/** deterministic PRNG for consistent formations across builds */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const ACT_LABELS: { id: SegmentId; num: string; label: string }[] = [
  { id: 'hero', num: '00', label: 'ORIGIN' },
  { id: 'act1', num: '01', label: 'IMAGINATION' },
  { id: 'act2', num: '02', label: 'DESIGN' },
  { id: 'act3', num: '03', label: 'ENGINEERING' },
  { id: 'act4', num: '04', label: 'INTELLIGENCE' },
  { id: 'act5', num: '05', label: 'GROWTH' },
  { id: 'act6', num: '06', label: 'INVITATION' },
];
