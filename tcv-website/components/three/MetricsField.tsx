'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

const METRIC_LABELS = ['47', '12.4K', '23', '280%']

const POSITIONS: [number, number, number][] = [
  [-2.5, 1.2, 0],
  [2.5, 0.5, -1],
  [-1.8, -1.0, 0.5],
  [2.0, -0.8, -0.5],
]

function FloatingText({
  text,
  position,
  offset,
  speed,
}: {
  text: string
  position: [number, number, number]
  offset: number
  speed: number
}) {
  const ref = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.position.y = position[1] + Math.sin(t * speed + offset) * 0.12
    ref.current.rotation.y = Math.sin(t * 0.2 + offset) * 0.08
  })

  return (
    <group ref={ref} position={position}>
      <Text
        fontSize={0.5}
        color="#00f5ff"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/spacegrotesk/v16/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gozuOn1TQ.woff2"
        letterSpacing={-0.02}
      >
        {text}
      </Text>
    </group>
  )
}

function ConnectionLines() {
  const points: THREE.Vector3[] = POSITIONS.map((p) => new THREE.Vector3(...p))
  const linePoints: THREE.Vector3[] = []

  // Connect all pairs
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      linePoints.push(points[i], points[j])
    }
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(linePoints)

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#00f5ff" transparent opacity={0.08} />
    </lineSegments>
  )
}

function BackgroundSphere() {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.05
    ref.current.rotation.x = state.clock.elapsedTime * 0.03
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[3.5, 12, 8]} />
      <meshBasicMaterial color="#00f5ff" wireframe transparent opacity={0.025} />
    </mesh>
  )
}

export function MetricsField() {
  return (
    <div style={{ width: '100%', height: '320px' }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.5} />

        <BackgroundSphere />
        <ConnectionLines />

        {METRIC_LABELS.map((label, i) => (
          <FloatingText
            key={label}
            text={label}
            position={POSITIONS[i]}
            offset={i * 1.5}
            speed={0.4 + i * 0.1}
          />
        ))}
      </Canvas>
    </div>
  )
}
