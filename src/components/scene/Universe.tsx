'use client';
import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from '@react-three/postprocessing';
import { uni, store, SEGMENTS, CAM_KEYS, PALETTES, smootherstep, clamp01, lerp } from '@/lib/store';
import { audio } from '@/lib/audio';
import Particles from './Particles';
import Engine from './Engine';

/* ----------------------------- camera rig ------------------------------ */
function CameraRig() {
  const { camera, pointer } = useThree();
  const look = useMemo(() => new THREE.Vector3(), []);
  const pos = useMemo(() => new THREE.Vector3(...CAM_KEYS.hero.pos), []);
  const tgt = useMemo(() => new THREE.Vector3(), []);
  const pk = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const cam = camera as THREE.PerspectiveCamera;
    const F = store.phase;
    const s = Math.min(Math.floor(F), SEGMENTS.length - 2);
    const f = smootherstep(clamp01(F - s));
    const A = CAM_KEYS[SEGMENTS[s]], B = CAM_KEYS[SEGMENTS[s + 1]];

    tgt.set(lerp(A.pos[0], B.pos[0], f), lerp(A.pos[1], B.pos[1], f), lerp(A.pos[2], B.pos[2], f));
    look.set(lerp(A.look[0], B.look[0], f), lerp(A.look[1], B.look[1], f), lerp(A.look[2], B.look[2], f));

    // intro cinematic: slow approach through the dark, orbiting in
    const it = smootherstep(store.introT);
    const t = state.clock.elapsedTime;
    const introPos = pk.set(
      Math.sin((1 - it) * 1.15) * 6,
      3.4 - it * 3.0 + Math.sin(t * 0.1) * 0.15,
      30 - it * (30 - tgt.z)
    );
    tgt.lerpVectors(introPos, tgt, it);
    look.lerp(new THREE.Vector3(0, 0.8 * (1 - it), -4 * (1 - it)), 1 - it);

    // gentle pointer parallax (engine room responds to visitor)
    const px = store.reduced ? 0 : pointer.x;
    const py = store.reduced ? 0 : pointer.y;
    tgt.x += px * 0.55;
    tgt.y += py * -0.4;
    look.x += px * 0.35;
    look.y += py * -0.25;

    // idle drift — the hero stays alive after the intro
    if (!store.reduced) {
      tgt.x += Math.sin(t * 0.16) * 0.16;
      tgt.y += Math.cos(t * 0.21) * 0.12;
    }

    // impact shake (meaningful moments only)
    if (store.shake > 0.001 && !store.reduced) {
      const sh = store.shake * store.shake * 0.22;
      tgt.x += Math.sin(t * 61.7) * sh;
      tgt.y += Math.cos(t * 53.3) * sh;
      store.shake *= Math.exp(-delta * 3.4);
    }

    pos.lerp(tgt, 1 - Math.exp(-delta * 2.2));
    cam.position.copy(pos);
    cam.lookAt(look);
    const fov = lerp(A.fov, B.fov, f);
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
  });
  return null;
}

/* ------------------------- environment grading ------------------------- */
function Environment() {
  const { scene, gl } = useThree();
  const bg = useMemo(() => new THREE.Color('#04060e'), []);
  const fog = useMemo(() => new THREE.FogExp2('#04060e', 0.016), []);
  const cA = useMemo(() => new THREE.Color(), []);
  const cB = useMemo(() => new THREE.Color(), []);
  const cC = useMemo(() => new THREE.Color(), []);
  const cAcc = useMemo(() => new THREE.Color(), []);
  const cBg = useMemo(() => new THREE.Color(), []);

  const dustGeo = useMemo(() => {
    const n = 320;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 40 + Math.random() * 70;
      const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(ph) * Math.cos(th);
      arr[i * 3 + 1] = r * Math.cos(ph);
      arr[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 200);
    return g;
  }, []);
  const dustMat = useMemo(
    () => new THREE.PointsMaterial({ color: '#5a7bb8', size: 0.5, sizeAttenuation: true, transparent: true, opacity: 0.26, blending: THREE.AdditiveBlending, depthWrite: false }),
    []
  );
  useEffect(() => () => { dustGeo.dispose(); dustMat.dispose(); }, [dustGeo, dustMat]);

  useEffect(() => {
    scene.fog = fog;
    scene.background = bg;
    const pr = Math.min(gl.getPixelRatio(), store.quality.dpr);
    gl.setPixelRatio(pr);
    uni.uPixelRatio.value = pr;
    uni.uReduced.value = store.reduced ? 1 : 0;
    return () => {
      scene.fog = null;
      scene.background = null;
    };
  }, [scene, gl, fog, bg]);

  const commit = useRef(0);

  useFrame((state, delta) => {
    const F = store.phase;
    const s = Math.min(Math.floor(F), SEGMENTS.length - 2);
    const f = smootherstep(clamp01(F - s));
    const A = PALETTES[SEGMENTS[s]], B = PALETTES[SEGMENTS[s + 1]];

    cA.set(A.a).lerp(cB.set(B.a), f);
    uni.uColorA.value.lerp(cA, 1 - Math.exp(-delta * 5));
    cA.set(A.b).lerp(cB.set(B.b), f);
    uni.uColorB.value.lerp(cA, 1 - Math.exp(-delta * 5));
    cA.set(A.acc).lerp(cB.set(B.acc), f);
    uni.uAcc.value.lerp(cA, 1 - Math.exp(-delta * 5));
    cA.set(A.bg).lerp(cB.set(B.bg), f);
    bg.lerp(cA, 1 - Math.exp(-delta * 3));
    (scene.background as THREE.Color).copy(bg);
    cBg.copy(bg).multiplyScalar(0.6).add(cAcc.set(A.a).multiplyScalar(0.1));
    fog.color.copy(cBg);
    fog.density = lerp(0.016, 0.011, Math.min(1, F / 11));

    // scene dimming while the contact form has focus of attention
    uni.uDim.value = lerp(uni.uDim.value, F > 11.55 ? 0.5 : 0, 1 - Math.exp(-delta * 3));

    // narrative commits: radial burst + shake + sound on entering a new act
    const c = Math.round(F);
    if (c !== commit.current) {
      commit.current = c;
      store.activeSeg = SEGMENTS[Math.min(c, SEGMENTS.length - 1)];
      if (c > 0 && store.introDone) {
        uni.uWaveT.value = state.clock.elapsedTime;
        if (!store.reduced) store.shake = Math.min(1, store.shake + 0.55);
        audio.blip();
        audio.setScene(c);
        if (c === 11) audio.chord();
      }
      store.emit('seg', store.activeSeg);
    }

    // intro signature: at full activation the frame breathes
    const act6W = Math.exp(-Math.pow(F - 11, 2) * 2.0);
    uni.uEnergy.value = 0.14 + 0.5 * store.introT + act6W * 0.35;
    uni.uIntro.value = store.introT;
    uni.uTime.value = state.clock.elapsedTime * (store.reduced ? 0.25 : 1);
    store.clockTime = uni.uTime.value;
  });

  return (
    <points geometry={dustGeo} material={dustMat} frustumCulled={false} />
  );
}

/* ---------------------------- postprocessing --------------------------- */
function Effects() {
  // postprocessing effect instances (loosely typed to bridge wrapper generics)
  const ca = useRef<{ offset: { set: (x: number, y: number) => void } } | null>(null);
  const bloom = useRef<{ intensity: number } | null>(null);
  const caOffset = useMemo(() => new THREE.Vector2(0.0004, 0.0005), []);
  useFrame((state) => {
    const burst = Math.max(0, 1 - (state.clock.elapsedTime - uni.uWaveT.value) / 1.4);
    const off = 0.00035 + burst * burst * 0.0035 + store.shake * 0.002;
    if (ca.current) ca.current.offset.set(off, off * 0.8);
    if (bloom.current) {
      const act6W = Math.exp(-Math.pow(store.phase - 11, 2) * 2.0);
      bloom.current.intensity = (store.quality.bloom ? 0.62 : 0.34) + burst * 0.32 + act6W * 0.3;
    }
  });
  return (
    <EffectComposer multisampling={0}>
      <Bloom ref={(r) => { bloom.current = r as unknown as { intensity: number } | null; }} mipmapBlur intensity={0.62} luminanceThreshold={0.24} luminanceSmoothing={0.3} />
      <ChromaticAberration ref={(r) => { ca.current = r as unknown as { offset: { set: (x: number, y: number) => void } } | null; }} offset={caOffset} radialModulation={false} modulationOffset={0} />
      <Noise opacity={0.05} />
      <Vignette eskil={false} offset={0.24} darkness={0.74} />
    </EffectComposer>
  );
}

/* ------------------------------ canvas root ---------------------------- */
export default function Universe() {
  return (
    <Canvas
      dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, store.quality.dpr)}
      camera={{ position: [0, 3.4, 30], fov: 52, near: 0.1, far: 220 }}
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance', stencil: false, depth: true }}
      onCreated={({ gl }) => {
        gl.setClearColor('#04060e', 1);
        store.emit('webgl-ready');
      }}
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
      eventSource={typeof document !== 'undefined' ? document.body : undefined}
      eventPrefix="client"
    >
      <CameraRig />
      <Environment />
      <Particles />
      <Engine />
      <Effects />
    </Canvas>
  );
}
