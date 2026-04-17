import * as THREE from 'three';

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x88b7e8);
  scene.fog = new THREE.Fog(0xa6c8ef, 28, 180);
  return scene;
}
