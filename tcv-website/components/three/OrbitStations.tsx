'use client'

import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface OrbitingObjectProps {
  orbitRadius: number
  orbitSpeed: number
  selfRotation: number
  startAngle: number
  type: 'web' | 'ai' | 'leads'
}

function OrbitingObject({ orbitRadius, orbitSpeed, selfRotation, startAngle, type }: OrbitingObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const angleRef = useRef(startAngle)
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (!meshRef.current) return
    angleRef.current += orbitSpeed
    meshRef.current.position.x = Math.cos(angleRef.current) * orbitRadius
    meshRef.current.position.z = Math.sin(angleRef.current) * orbitRadius
    meshRef.current.rotation.x += selfRotation
    meshRef.current.rotation.y += selfRotation * 0.7

    // Scale on hover
    const targetScale = hovered ? 1.3 : 1
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
  })

  if (type === 'web') {
    return (
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <icosahedronGeometry args={[0.35, 1]} />
        <meshStandardMaterial
          color="#00f5ff"
          wireframe
          emissive="#00f5ff"
          emissiveIntensity={hovered ? 1.0 : 0.4}
        />
      </mesh>
    )
  }

  if (type === 'ai') {
    return (
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <torusKnotGeometry args={[0.3, 0.1, 80, 12]} />
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={hovered ? 1.0 : 0.5}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>
    )
  }

  // leads
  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <octahedronGeometry args={[0.45]} />
      <meshPhongMaterial
        color="#ffab00"
        emissive="#ffab00"
        emissiveIntensity={hovered ? 0.6 : 0.2}
        shininess={80}
      />
      {hovered && <pointLight color="#ffab00" intensity={3} distance={3} />}
    </mesh>
  )
}

function CenterCore() {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.3
    ref.current.rotation.x = state.clock.elapsedTime * 0.2
  })
  return (
    <mesh ref={ref}>
      <dodecahedronGeometry args={[0.15]} />
      <meshStandardMaterial
        color="#00f5ff"
        emissive="#00f5ff"
        emissiveIntensity={0.8}
        transparent
        opacity={0.7}
      />
    </mesh>
  )
}

function OrbitRing({ radius }: { radius: number }) {
  const points: THREE.Vector3[] = []
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2
    points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius))
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  return (
    <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: '#00f5ff', transparent: true, opacity: 0.06 }))} />
  )
}

export function OrbitStations() {
  return (
    <div style={{ width: '100%', height: '360px' }}>
      <Canvas
        camera={{ position: [0, 3, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 5, 0]} color="#00f5ff" intensity={0.5} />

        <CenterCore />
        <OrbitRing radius={2.5} />

        <OrbitingObject
          type="web"
          orbitRadius={2.5}
          orbitSpeed={0.003}
          selfRotation={0.005}
          startAngle={0}
        />
        <OrbitingObject
          type="ai"
          orbitRadius={2.5}
          orbitSpeed={0.005}
          selfRotation={0.008}
          startAngle={(Math.PI * 2) / 3}
        />
        <OrbitingObject
          type="leads"
          orbitRadius={2.5}
          orbitSpeed={0.004}
          selfRotation={0.006}
          startAngle={(Math.PI * 4) / 3}
        />
      </Canvas>
    </div>
  )
}
