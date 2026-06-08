'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const CONNECTION_THRESHOLD = 0.8
const MAX_CONNECTIONS = 3

function ParticleNetwork({ particleCount }: { particleCount: number }) {
  const meshRef = useRef<THREE.Points>(null!)
  const lineRef = useRef<THREE.LineSegments>(null!)
  const mouseRef = useRef(new THREE.Vector2(0, 0))
  const { gl } = useThree()

  const { positions, colors, originalPositions } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const originalPositions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      // Random sphere distribution
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = Math.cbrt(Math.random()) * 3

      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
      originalPositions[i * 3] = x
      originalPositions[i * 3 + 1] = y
      originalPositions[i * 3 + 2] = z

      // Cyan color with variation
      const opacity = Math.random() * 0.6 + 0.2
      colors[i * 3] = 0 * opacity
      colors[i * 3 + 1] = 0.96 * opacity
      colors[i * 3 + 2] = 1.0 * opacity
    }
    return { positions, colors, originalPositions }
  }, [particleCount])

  // Build connection lines
  const linePositions = useMemo(() => {
    const pts = []
    const connCount = new Array(particleCount).fill(0)

    for (let i = 0; i < particleCount; i++) {
      if (connCount[i] >= MAX_CONNECTIONS) continue
      const ax = originalPositions[i * 3]
      const ay = originalPositions[i * 3 + 1]
      const az = originalPositions[i * 3 + 2]

      for (let j = i + 1; j < particleCount; j++) {
        if (connCount[i] >= MAX_CONNECTIONS || connCount[j] >= MAX_CONNECTIONS) continue
        const bx = originalPositions[j * 3]
        const by = originalPositions[j * 3 + 1]
        const bz = originalPositions[j * 3 + 2]
        const dist = Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2 + (az - bz) ** 2)
        if (dist < CONNECTION_THRESHOLD) {
          pts.push(ax, ay, az, bx, by, bz)
          connCount[i]++
          connCount[j]++
        }
      }
    }
    return new Float32Array(pts)
  }, [originalPositions, particleCount])

  useEffect(() => {
    const canvas = gl.domElement
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [gl])

  useFrame((state) => {
    if (!meshRef.current) return

    // Slow rotation
    meshRef.current.rotation.y += 0.0008
    if (lineRef.current) lineRef.current.rotation.y += 0.0008

    // Mouse distortion on nearest particles
    const pos = meshRef.current.geometry.attributes.position.array as Float32Array
    const mouseX = mouseRef.current.x * 3
    const mouseY = mouseRef.current.y * 2

    for (let i = 0; i < Math.min(50, particleCount); i++) {
      const idx = i * 3
      const ox = originalPositions[idx]
      const oy = originalPositions[idx + 1]

      const dx = mouseX - ox
      const dy = mouseY - oy
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 1.5) {
        const strength = (1.5 - dist) / 1.5 * 0.3
        pos[idx] = ox + dx * strength * 0.1
        pos[idx + 1] = oy + dy * strength * 0.1
      } else {
        pos[idx] = ox + (pos[idx] - ox) * 0.95
        pos[idx + 1] = oy + (pos[idx + 1] - oy) * 0.95
      }
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <>
      <points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.015}
          vertexColors
          transparent
          depthWrite={false}
          sizeAttenuation
        />
      </points>
      <lineSegments ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#00f5ff"
          transparent
          opacity={0.08}
        />
      </lineSegments>
    </>
  )
}

export function SignalMesh() {
  const [particleCount, setParticleCount] = useState(1200)

  useEffect(() => {
    setParticleCount(window.innerWidth < 768 ? 600 : 1200)
  }, [])

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: false, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        <ParticleNetwork particleCount={particleCount} />
      </Canvas>
    </div>
  )
}
