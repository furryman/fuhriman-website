'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Group } from 'three'
import { BufferAttribute, BufferGeometry, Line, LineBasicMaterial } from 'three'

const NODES = 14
const RADIUS = 2.2

function buildLineObject(
  ax: number,
  ay: number,
  az: number,
  bx: number,
  by: number,
  bz: number,
  opacity: number
): Line {
  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(new Float32Array([ax, ay, az, bx, by, bz]), 3))
  const mat = new LineBasicMaterial({ color: '#f0a868', transparent: true, opacity })
  return new Line(geo, mat)
}

function ClusterMesh() {
  const groupRef = useRef<Group>(null)
  const [reduced, setReduced] = useState(false)
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)

    const onMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 0.4
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 0.4
    }
    window.addEventListener('mousemove', onMove)

    return () => {
      mq.removeEventListener('change', onChange)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  useFrame((_state, delta) => {
    const g = groupRef.current
    if (!g) return
    if (reduced) return
    g.rotation.y += delta * 0.4
    g.rotation.x += (target.current.y - g.rotation.x) * 0.05
    g.rotation.z += (target.current.x - g.rotation.z) * 0.05
  })

  const nodes = useMemo(() => {
    const pts: { x: number; y: number; z: number }[] = []
    for (let i = 0; i < NODES; i++) {
      const angle = (i / NODES) * Math.PI * 2
      pts.push({
        x: Math.cos(angle) * RADIUS,
        y: Math.sin(angle) * RADIUS * 0.55,
        z: Math.sin(angle * 2) * 0.6,
      })
    }
    return pts
  }, [])

  const lineObjects = useMemo(
    () =>
      nodes.map((a, i) => {
        const b = nodes[(i + 1) % NODES]
        const c = nodes[(i + 2) % NODES]
        return {
          ab: buildLineObject(a.x, a.y, a.z, b.x, b.y, b.z, 0.35),
          ac: buildLineObject(a.x, a.y, a.z, c.x, c.y, c.z, 0.28),
        }
      }),
    [nodes]
  )

  return (
    <group ref={groupRef}>
      {nodes.map((n, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static geometry nodes never reorder
        <mesh key={`node-${i}`} position={[n.x, n.y, n.z]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshBasicMaterial color="#f0a868" transparent opacity={0.85} />
        </mesh>
      ))}
      {lineObjects.map(({ ab, ac }, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static geometry lines never reorder
        <group key={`line-${i}`}>
          <primitive object={ab} />
          <primitive object={ac} />
        </group>
      ))}
    </group>
  )
}

export default function HeroScene() {
  return (
    <div
      aria-label="K8s cluster — animated illustration"
      role="img"
      style={{ width: '100%', height: '100%', minHeight: 320 }}
    >
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ClusterMesh />
      </Canvas>
    </div>
  )
}
