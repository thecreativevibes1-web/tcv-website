'use client';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { uni, store, SEG_FORMATION, smootherstep, clamp01 } from '@/lib/store';
import { buildFormations } from '@/lib/formations';
import { pointsVertex, pointsFragment } from '@/lib/shaders';

/**
 * Intelligent particle field. Formations are precomputed, deterministic
 * position sets; the field morphs between them in the vertex shader as the
 * narrative phase advances (scroll-driven, bidirectionally safe).
 */
export default function Particles() {
  const count = store.quality.particles;
  const formations = useMemo(() => buildFormations(count), [count]);
  const pair = useRef({ a: 0, b: 1 });

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(formations[SEG_FORMATION[0]].slice(), 3));
    g.setAttribute('aPosB', new THREE.BufferAttribute(formations[SEG_FORMATION[1]].slice(), 3));
    const rand = new Float32Array(count);
    const size = new Float32Array(count);
    const r = () => Math.random();
    for (let i = 0; i < count; i++) {
      rand[i] = Math.pow(r(), 1.35);
      size[i] = 0.45 + Math.pow(r(), 3.0) * 1.5;
    }
    g.setAttribute('aRand', new THREE.BufferAttribute(rand, 1));
    g.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 120);
    return g;
  }, [formations, count]);

  useEffect(() => () => geo.dispose(), [geo]);

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: pointsVertex,
        fragmentShader: pointsFragment,
        uniforms: uni,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );
  useEffect(() => () => mat.dispose(), [mat]);

  useFrame(() => {
    const F = store.phase;
    const s = Math.min(Math.floor(F), SEG_FORMATION.length - 2);
    const f = smootherstep(clamp01(F - s));
    if (pair.current.a !== s) {
      pair.current = { a: s, b: Math.min(s + 1, SEG_FORMATION.length - 1) };
      const pos = geo.getAttribute('position') as THREE.BufferAttribute;
      const posB = geo.getAttribute('aPosB') as THREE.BufferAttribute;
      (pos.array as Float32Array).set(formations[SEG_FORMATION[pair.current.a]]);
      (posB.array as Float32Array).set(formations[SEG_FORMATION[pair.current.b]]);
      pos.needsUpdate = true;
      posB.needsUpdate = true;
    }
    uni.uMorph.value = f;
  });

  return <points geometry={geo} material={mat} frustumCulled={false} />;
}
