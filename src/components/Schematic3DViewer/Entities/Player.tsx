import { useSphere } from "@react-three/cannon";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Mesh, Vector3 } from "three";
import { useKeyboard } from "../hooks/useKeyboard";

const FLY_FORCE = 0.2;
const SPEED = 8;

export function Player() {
  const { actions } = useKeyboard();
  const { camera } = useThree();
  const [ref, api] = useSphere<Mesh>(() => ({
    mass: 0,
    type: "Dynamic",
    position: [0, 1, 0],
  }));
  const position = useRef([0, 0, 0]);
  const velocity = useRef([0, 0, 0]);

  useEffect(() => {
    api.velocity.subscribe((v) => (velocity.current = v));
  }, [api.velocity]);

  useEffect(() => {
    api.position.subscribe((p) => (position.current = p));
  }, [api.position]);

  useFrame(() => {
    camera.position.copy(
      new Vector3(position.current[0], position.current[1], position.current[2])
    );
    const direction = new Vector3();
    const frontVector = new Vector3(
      0,
      0,
      (actions.moveBackward ? 1 : 0) - (actions.moveForward ? 1 : 0)
    );
    const sideVector = new Vector3(
      (actions.moveLeft ? 1 : 0) - (actions.moveRight ? 1 : 0),
      0,
      0
    );

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(camera.rotation);

    api.velocity.set(direction.x, velocity.current[1], direction.z);

    if (actions.jump) {
      api.position.set(
        position.current[0],
        position.current[1] + FLY_FORCE,
        position.current[2]
      );
    }
    if (actions.shift) {
      if (position.current[1] <= 0) {
        api.position.set(position.current[0], direction.y, position.current[2]);
      } else {
        api.position.set(
          position.current[0],
          position.current[1] - FLY_FORCE,
          position.current[2]
        );
      }
    }
  });

  return <mesh ref={ref} />;
}
