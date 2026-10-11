'use client';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { uni, store, SEGMENTS, ENGINE_KEYS, smootherstep, clamp01, lerp } from '@/lib/store';
import { buildFormations } from '@/lib/formations';
import { coreVertex, coreFragment, ringVertex, ringFragment, lineVertex, lineFragment } from '@/lib/shaders';

function glowTexture(): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(160,220,255,0.55)');
  g.addColorStop(0.6, 'rgba(110,140,255,0.16)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  return t;
}

function buildLinks(src: Float32Array, sample: number, maxDist: number, k: number, seed = 7) {
  const pts: THREE.Vector3[] = [];
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const n = src.length / 3;
  for (let i = 0; i < sample; i++) {
    const idx = Math.floor(rnd() * n) * 3;
    pts.push(new THREE.Vector3(src[idx], src[idx + 1], src[idx + 2]));
  }
  const verts: number[] = [];
  const ts: number[] = [];
  for (let i = 0; i < pts.length; i++) {
    const dists: { j: number; d: number }[] = [];
    for (let j = 0; j < pts.length; j++) {
      if (i === j) continue;
      const d = pts[i].distanceTo(pts[j]);
      if (d < maxDist) dists.push({ j, d });
    }
    dists.sort((a, b) => a.d - b.d);
    for (let e = 0; e < Math.min(k, dists.length); e++) {
      const j = dists[e].j;
      if (j < i) continue;
      const wobble = rnd() * 0.35;
      verts.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
      ts.push(wobble, wobble + 1 + rnd() * 0.2);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts), 3));
  g.setAttribute('aT', new THREE.BufferAttribute(new Float32Array(ts), 1));
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 120);
  return g;
}

/** The Creation Engine: core, orbital rings, orbiters, filaments, networks, light. */
export default function Engine() {
  const group = useRef<THREE.Group>(null!);
  const ringGroup = useRef<THREE.Group>(null!);
  const orbitersRef = useRef<THREE.InstancedMesh>(null!);
  const filMat = useRef<THREE.ShaderMaterial>(null!);
  const netMat = useRef<THREE.ShaderMaterial>(null!);
  const neuralMat = useRef<THREE.ShaderMaterial>(null!);
  const coreRef = useRef<THREE.Mesh>(null!);
  const glows = useRef<THREE.Sprite[]>([]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const formParams = useRef({ flatten: 0, scale: 1, tilt: 0.6, ringOp: 0.85, core: 1, fragment: 0, net: 0, speed: 1 });

  const tex = useMemo(glowTexture, []);
  const formations = useMemo(() => buildFormations(store.quality.particles), []);

  const coreGeo = useMemo(() => new THREE.IcosahedronGeometry(2.05, store.quality.tier > 0 ? 4 : 2), []);
  const wireGeo = useMemo(() => new THREE.IcosahedronGeometry(2.75, 1), []);
  const ringGeos = useMemo(
    () => [3.1, 4.7, 6.5].map((r) => new THREE.TorusGeometry(r, 0.014, 8, 160)),
    []
  );
  const filGeo = useMemo(() => buildLinks(formations.cloud, 220, 3.4, 2, 11), [formations]);
  const latGeo = useMemo(() => buildLinks(formations.lattice, 420, 2.6, 2, 23), [formations]);
  const neuGeo = useMemo(() => buildLinks(formations.neural, 320, 2.4, 2, 37), [formations]);

  useEffect(
    () => () => {
      coreGeo.dispose(); wireGeo.dispose();
      ringGeos.forEach((g) => g.dispose());
      filGeo.dispose(); latGeo.dispose(); neuGeo.dispose();
      tex.dispose();
    },
    [coreGeo, wireGeo, ringGeos, filGeo, latGeo, neuGeo, tex]
  );

  const coreMat = useMemo(
    () => new THREE.ShaderMaterial({ vertexShader: coreVertex, fragmentShader: coreFragment, uniforms: uni, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }),
    []
  );
  const wireMat = useMemo(
    () => new THREE.ShaderMaterial({ vertexShader: coreVertex, fragmentShader: coreFragment, uniforms: uni, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, wireframe: true }),
    []
  );
  const mkRingMat = () =>
    new THREE.ShaderMaterial({ vertexShader: ringVertex, fragmentShader: ringFragment, uniforms: { ...uni, uSpeed: { value: 0.8 + Math.random() * 0.7 }, uOpacity: { value: 1 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
  const ringMats = useMemo(() => [mkRingMat(), mkRingMat(), mkRingMat()], []);
  const mkLineMat = (op: number) =>
    new THREE.ShaderMaterial({ vertexShader: lineVertex, fragmentShader: lineFragment, uniforms: { ...uni, uDraw: { value: 1 }, uOpacity: { value: op } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const filamentMat = useMemo(() => mkLineMat(0.5), []);
  const latticeMat = useMemo(() => mkLineMat(0), []);
  const neuralLineMat = useMemo(() => mkLineMat(0), []);

  useEffect(
    () => () => {
      coreMat.dispose(); wireMat.dispose();
      ringMats.forEach((m) => m.dispose());
      filamentMat.dispose(); latticeMat.dispose(); neuralLineMat.dispose();
    },
    [coreMat, wireMat, ringMats, filamentMat, latticeMat, neuralLineMat]
  );

  const orbitAngles = useMemo(() => {
    const arr: { r: number; a: number; speed: number; ring: number }[] = [];
    for (let i = 0; i < 42; i++) {
      const ring = i % 3;
      arr.push({ r: [3.1, 4.7, 6.5][ring], a: Math.random() * Math.PI * 2, speed: (0.14 + Math.random() * 0.3) * (ring % 2 ? -1 : 1), ring });
    }
    return arr;
  }, []);

  const orbMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: new THREE.Color('#9ff3ff'), transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false }),
    []
  );
  useEffect(() => () => orbMat.dispose(), [orbMat]);

  useFrame((state, delta) => {
    const F = store.phase;
    const s = Math.min(Math.floor(F), SEGMENTS.length - 2);
    const f = smootherstep(clamp01(F - s));
    const A = ENGINE_KEYS[SEGMENTS[s]], B = ENGINE_KEYS[SEGMENTS[s + 1]];
    const p = formParams.current;
    p.flatten = lerp(A.flatten, B.flatten, f);
    p.scale = lerp(A.scale, B.scale, f);
    p.tilt = lerp(A.tilt, B.tilt, f);
    p.ringOp = lerp(A.ringOp, B.ringOp, f);
    p.core = lerp(A.core, B.core, f);
    p.fragment = lerp(A.fragment, B.fragment, f);
    p.net = lerp(A.net, B.net, f);
    p.speed = lerp(A.speed, B.speed, f);

    const t = state.clock.elapsedTime;
    const act1W = Math.exp(-Math.pow(F - 1, 2) * 1.4);
    const act6W = Math.exp(-Math.pow(F - 11, 2) * 2.0);

    // core
    uni.uFragment.value = p.fragment * (0.55 + 0.45 * Math.sin(t * 0.5)) * act1W + p.fragment * 0.4 * (1 - act1W);
    const coreScale = Math.max(0.001, p.core * (0.92 + uni.uEnergy.value * 0.12));
    coreRef.current.scale.setScalar(coreScale);
    coreRef.current.rotation.y += delta * 0.1 * p.speed;
    (coreRef.current.children[0] as THREE.Mesh | undefined)?.rotation.set(t * 0.07, -t * 0.05, 0);

    // rings — flatten into design planes, tighten into mechanism, expand for growth
    ringGroup.current.scale.set(p.scale, Math.max(0.045, 1 - p.flatten * 0.955) * p.scale, p.scale);
    ringGroup.current.rotation.x = p.tilt * 0.5;
    ringGroup.current.rotation.z = p.tilt * 0.22;
    ringGroup.current.rotation.y += delta * 0.06 * p.speed;
    const ringBase = [0.9, 0.65, 0.5];
    ringMats.forEach((m, i) => {
      m.uniforms.uOpacity.value = ringBase[i] * p.ringOp * (0.55 + 0.45 * uni.uIntro.value);
      (m.uniforms.uSpeed as { value: number }).value = (0.6 + i * 0.33) * p.speed;
    });
    const ringMeshes = ringGroup.current.children as THREE.Mesh[];
    ringMeshes[0]?.rotateZ(delta * 0.12 * p.speed);
    ringMeshes[1]?.rotateZ(-delta * 0.08 * p.speed);
    ringMeshes[2]?.rotateZ(delta * 0.05 * p.speed);

    // orbiters travel the ring paths
    const inst = orbitersRef.current;
    if (inst) {
      for (let i = 0; i < orbitAngles.length; i++) {
        const o = orbitAngles[i];
        o.a += delta * o.speed * p.speed;
        dummy.position.set(Math.cos(o.a) * o.r, 0, Math.sin(o.a) * o.r);
        dummy.rotation.set(o.a, o.a * 1.7, 0);
        const sc = 0.6 + 0.4 * Math.sin(t * 2 + i);
        dummy.scale.setScalar(sc * p.ringOp);
        dummy.updateMatrix();
        inst.setMatrixAt(i, dummy.matrix);
      }
      inst.instanceMatrix.needsUpdate = true;
      inst.visible = uni.uIntro.value > 0.5 && p.ringOp > 0.05;
      orbMat.opacity = 0.8 * p.ringOp;
    }

    // filaments: hero energy web + act-1 inner architecture reveal
    filamentMat.uniforms.uOpacity.value = clamp01(1.7 - F * 0.5) * 0.6 * uni.uIntro.value;
    latticeMat.uniforms.uOpacity.value = p.net * 0.85 * (0.4 + act1W * 0.6);
    neuralLineMat.uniforms.uOpacity.value = p.net * 0.7 * Math.exp(-Math.pow(F - 4, 2) * 0.8);

    // volumetric-ish glow sprites
    const intro = uni.uIntro.value;
    if (glows.current[0]) {
      glows.current[0].material.opacity = 0.15 * intro * (0.5 + uni.uEnergy.value * 0.5) * (1 + act6W * 0.7);
      glows.current[0].scale.setScalar(7 + uni.uEnergy.value * 2.4 + act6W * 2.4);
    }
    if (glows.current[1]) glows.current[1].material.opacity = 0.028 * intro * (0.4 + p.ringOp * 0.6);
    if (glows.current[2]) glows.current[2].material.opacity = 0.034 * intro * p.ringOp * (1 + act6W);
  });

  return (
    <group ref={group}>
      {/* central procedural core + technical wireframe shell */}
      <mesh ref={coreRef} geometry={coreGeo} material={coreMat} frustumCulled={false}>
        <mesh geometry={wireGeo} material={wireMat} frustumCulled={false} />
      </mesh>

      {/* orbital ring structures (morph into grid planes / mechanism / halo) */}
      <group ref={ringGroup}>
        {ringGeos.map((g, i) => (
          <mesh key={i} geometry={g} material={ringMats[i]} frustumCulled={false} />
        ))}
        <instancedMesh
          ref={orbitersRef}
          args={[undefined, undefined, 42] as unknown as [THREE.BufferGeometry, THREE.Material, number]}
          frustumCulled={false}
        >
          <octahedronGeometry args={[0.075, 0]} />
          <primitive object={orbMat} attach="material" />
        </instancedMesh>
      </group>

      {/* hero energy filaments */}
      <lineSegments geometry={filGeo} material={filamentMat} ref={(m) => { if (m) filMat.current = filamentMat; }} frustumCulled={false} />
      {/* act III engineered network */}
      <lineSegments geometry={latGeo} material={latticeMat} ref={(m) => { if (m) netMat.current = latticeMat; }} frustumCulled={false} />
      {/* act IV neural connectome */}
      <lineSegments geometry={neuGeo} material={neuralLineMat} ref={(m) => { if (m) neuralMat.current = neuralLineMat; }} frustumCulled={false} />

      {/* glow core + light shafts */}
      <sprite ref={(s) => { if (s) glows.current[0] = s; }}>
        <spriteMaterial map={tex} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0} />
      </sprite>
      <sprite ref={(s) => { if (s) glows.current[1] = s; }} position={[-4, 5, -6]} rotation={[0, 0, 0.6]} scale={[16, 34, 1]}>
        <spriteMaterial map={tex} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0} />
      </sprite>
      <sprite ref={(s) => { if (s) glows.current[2] = s; }} position={[5, -4, -4]} rotation={[0, 0, -0.7]} scale={[14, 30, 1]}>
        <spriteMaterial map={tex} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0} />
      </sprite>
    </group>
  );
}
