import React from 'react';
import { Object3D, Vector3 } from 'three';
import { useThree } from '@react-three/fiber';

interface DebugInfoProps {
  avatarRef: React.RefObject<Object3D>;
}

export function DebugInfo({ avatarRef }: DebugInfoProps) {
  const { camera } = useThree();
  const position = camera.position;

  return (
    <div className="debug-info" style={{
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
      <p>X: {position.x.toFixed(2)}</p>
      <p>Y: {position.y.toFixed(2)}</p>
      <p>Z: {position.z.toFixed(2)}</p>
    </div>
  );
}