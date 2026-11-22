import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

const FACING_Y = -Math.PI / 2;

function GhostModel({ isJumpscare }) {
  const groupRef = useRef();
  const { scene } = useGLTF("/ghost.glb");

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const elapsed = state.clock.elapsedTime;

    if (isJumpscare) {
      groupRef.current.rotation.y = FACING_Y + Math.sin(elapsed * 55) * 0.28;
      groupRef.current.rotation.z = Math.cos(elapsed * 48) * 0.16;
      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        0.55,
        delta * 16
      );
    } else {
      const microTwitch = Math.sin(elapsed * 19) > 0.96 ? 0.06 : 0;

      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        FACING_Y + microTwitch,
        delta * 8
      );
      groupRef.current.rotation.z = Math.sin(elapsed * 1.1) * 0.03;
      groupRef.current.position.y = Math.sin(elapsed * 1.8) * 0.07;
      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        0,
        delta * 6
      );
    }
  });

  return (
    <group ref={groupRef} rotation={[0, FACING_Y, 0]}>
      <Center>
        <primitive object={scene} scale={2.05} />
      </Center>
    </group>
  );
}

useGLTF.preload("/ghost.glb");

export default function Ghost({ isJumpscare }) {
  return (
    <div
      style={{
        width: "340px",
        height: "440px",
        flexShrink: 0,
        position: "relative",
        borderRadius: "20px",
        overflow: "visible",
        background:
          "radial-gradient(circle at 50% 42%, rgba(153, 27, 27, 0.34) 0%, rgba(45, 10, 10, 0.22) 48%, rgba(5, 5, 5, 0) 75%)",
      }}
    >
      <Canvas
        camera={{ position: [0, 0.05, 2.55], fov: 46 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <fog attach="fog" args={["#070404", 2.0, 4.6]} />

        <ambientLight intensity={0.45} />

        <spotLight
          position={[0, 1.4, 2.4]}
          angle={0.6}
          penumbra={0.85}
          intensity={isJumpscare ? 7 : 3.4}
          color="#e2e8f0"
        />

        <directionalLight position={[0, 2.5, -2.2]} intensity={2.8} color="#94a3b8" />

        <pointLight
          position={[0, -1.6, 1.5]}
          intensity={isJumpscare ? 10 : 4.5}
          color="#dc2626"
        />

        <Suspense fallback={null}>
          <GhostModel isJumpscare={isJumpscare} />
        </Suspense>
      </Canvas>
    </div>
  );
}