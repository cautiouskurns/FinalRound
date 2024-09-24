import React, { Suspense, useRef, useState } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Loader, OrbitControls } from '@react-three/drei'
import { InterviewerAvatar } from './InterviewerAvatar'
import { Object3D, Vector3 } from 'three'

function CameraPositionLogger({ setPosition }: { setPosition: (position: number[]) => void }) {
  const { camera } = useThree()
  const position = useRef(new Vector3())

  useFrame(() => {
    if (!position.current.equals(camera.position)) {
      position.current.copy(camera.position)
      setPosition(position.current.toArray().map(v => parseFloat(v.toFixed(2))))
    }
  })

  return null
}

export function Scene() {
  const avatarRef = useRef<Object3D>(null)
  const [cameraPosition, setCameraPosition] = useState([0, 1.6, 0.5])

  return (
    <>
      <Canvas camera={{ position: [0, 1.1, 0.5], fov: 70 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={2.5} />
          <pointLight position={[10, 10, 10]} />
          <InterviewerAvatar ref={avatarRef} position={[0, 0, 0]} scale={1} />
          <directionalLight position={[0, 2, 2]} intensity={0.5} />
          <OrbitControls makeDefault target={[0, 1.1, 0]} />
          <CameraPositionLogger setPosition={setCameraPosition} />
        </Suspense>
      </Canvas>
      <Loader />
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontFamily: 'monospace'
      }}>
        <h3>Camera Position:</h3>
        <p>X: {cameraPosition[0]}</p>
        <p>Y: {cameraPosition[1]}</p>
        <p>Z: {cameraPosition[2]}</p>
      </div>
    </>
  )
}
