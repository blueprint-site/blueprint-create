import { useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import { Vector3 } from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { useKeyboard } from "../hooks/useKeyboard.tsx";

const velocity = new Vector3();
const direction = new Vector3();
const speed = new Vector3(200, 200, 200);

export function MinecraftControls() {
  const { actions } = useKeyboard();
  const { camera, gl } = useThree();
  const controls = useMemo(
    () => new PointerLockControls(camera, gl.domElement),
    [camera, gl.domElement]
  );

  document.querySelector("#schematic-viewer")?.addEventListener("click", () => {
    controls.lock();
  });

  useFrame((_, delta) => {
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    velocity.y -= velocity.y * 10.0 * delta;

    direction.z = Number(actions.moveForward) - Number(actions.moveBackward);
    direction.x = Number(actions.moveRight) - Number(actions.moveLeft);
    direction.y = Number(actions.shift) - Number(actions.jump);
    direction.normalize();

    if (actions.moveForward || actions.moveBackward)
      velocity.z -= direction.z * speed.z * delta;
    if (actions.moveLeft || actions.moveRight)
      velocity.x -= direction.x * speed.x * delta;
    if (actions.jump || actions.shift)
      velocity.y -= direction.y * speed.y * delta;

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);
    controls.getObject().position.y += velocity.y * delta;
  });

  return <primitive object={controls}></primitive>;
}
