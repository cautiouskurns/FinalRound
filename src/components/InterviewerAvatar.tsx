import React, { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useLoader } from '@react-three/fiber'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { AnimationMixer } from 'three'
import * as THREE from 'three'

export function InterviewerAvatar(props: any) {
  const group = useRef<THREE.Group>()
  const [mixer, setMixer] = useState<AnimationMixer | null>(null)
  const fbx = useLoader(FBXLoader, '/models/Sitting Idle.fbx')

  useEffect(() => {
    if (fbx) {
      const newMixer = new AnimationMixer(fbx)
      setMixer(newMixer)

      // Play the first animation if it exists
      if (fbx.animations.length > 0) {
        const action = newMixer.clipAction(fbx.animations[0])
        action.play()
      }
    }
  }, [fbx])

  useFrame((state, delta) => {
    mixer?.update(delta)
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <group ref={group} {...props}>
      <primitive object={fbx} scale={0.01} /> {/* Adjust scale as needed */}
    </group>
  )
}