import * as THREE from 'three';

export function createCameraRig(camera) {
  const desiredPosition = new THREE.Vector3();
  const lookTarget = new THREE.Vector3();

  return {
    update(target, delta, speed) {
      desiredPosition.set(
        target.position.x * 0.55,
        4.3 + Math.min(speed * 0.5, 2.2),
        9.5
      );
      lookTarget.set(target.position.x * 0.45, 0.9, -8);

      camera.position.lerp(desiredPosition, 1 - Math.exp(-delta * 4.5));
      camera.lookAt(lookTarget);
    },
  };
}
