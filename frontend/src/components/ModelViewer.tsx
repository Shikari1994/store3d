import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment } from '@react-three/drei'
import * as THREE from 'three'

function SceneContent({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  const { camera } = useThree()
  const controlsRef = useRef<any>(null)

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const distance = (Math.max(size.x, size.y, size.z) / 2) / Math.tan((camera as THREE.PerspectiveCamera).fov * Math.PI / 360) * 1.5

    camera.position.set(center.x, center.y + size.y * 0.1, center.z + distance)
    camera.near = distance / 100
    camera.far = distance * 100
    camera.updateProjectionMatrix()

    if (controlsRef.current) {
      controlsRef.current.target.copy(center)
      controlsRef.current.minDistance = distance * 0.3
      controlsRef.current.maxDistance = distance * 4
      controlsRef.current.update()
    }
  }, [scene, camera])

  return (
    <>
      <primitive object={scene} />
      <Environment preset="city" />
      <OrbitControls ref={controlsRef} enablePan={false} autoRotate autoRotateSpeed={1} />
    </>
  )
}

export default function ModelViewer({ url, className = 'h-72 w-full bg-gray-50' }: { url: string; className?: string }) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={<mesh><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="#e5e7eb" /></mesh>}>
          <SceneContent url={url} />
        </Suspense>
      </Canvas>
      <p className="text-center text-xs text-gray-400 mt-1">Перетащите для вращения • Скролл для масштаба</p>
    </div>
  )
}
