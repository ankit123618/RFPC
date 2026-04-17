import * as THREE from 'three';
import { ASSET_CATALOG } from '../assets/AssetCatalog.js';

export async function createEnvironment(scene, models) {
  const dynamicProps = [];
  const ambient = new THREE.AmbientLight(0xbfd4ff, 0.9);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xfff2c7, 1.25);
  keyLight.position.set(8, 14, 6);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x79b8ff, 0.75);
  rimLight.position.set(-10, 7, -16);
  scene.add(rimLight);

  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(2.1, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xffd37a })
  );
  sun.position.set(-20, 20, -60);
  scene.add(sun);

  const skyline = new THREE.Mesh(
    new THREE.PlaneGeometry(140, 28),
    new THREE.MeshBasicMaterial({
      color: 0x17344d,
      transparent: true,
      opacity: 0.9,
    })
  );
  skyline.position.set(0, 10, -95);
  scene.add(skyline);

  const farGround = new THREE.Mesh(
    new THREE.PlaneGeometry(220, 220),
    new THREE.MeshStandardMaterial({
      color: 0x6c9265,
      flatShading: true,
    })
  );
  farGround.rotation.x = -Math.PI / 2;
  farGround.position.set(0, -0.03, -80);
  scene.add(farGround);

  await populateSkyline(scene, models, dynamicProps);

  for (let i = 0; i < 30; i += 1) {
    createTree(scene, -7 - Math.random() * 3, -i * 12);
    createTree(scene, 7 + Math.random() * 3, -i * 12);
    createLampPost(scene, -5.4, -i * 24);
    createLampPost(scene, 5.4, -12 - i * 24);
  }

  createMountains(scene);
  return { dynamicProps };
}

function createTree(scene, x, z) {
  const tree = new THREE.Group();

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.18, 1.8),
    new THREE.MeshStandardMaterial({ color: 0x533d2d })
  );
  trunk.position.y = 0.9;
  trunk.castShadow = true;
  trunk.receiveShadow = true;

  const leaves = new THREE.Mesh(
    new THREE.ConeGeometry(0.8, 2.2, 10),
    new THREE.MeshStandardMaterial({ color: 0x1d6a41 })
  );
  leaves.position.y = 2.2;
  leaves.castShadow = true;

  tree.add(trunk);
  tree.add(leaves);
  tree.position.set(x, 0, z);
  scene.add(tree);
}

function createLampPost(scene, x, z) {
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.07, 2.8, 6),
    new THREE.MeshStandardMaterial({ color: 0x7b8ca1, flatShading: true })
  );
  pole.position.set(x, 1.4, z);
  pole.castShadow = true;
  scene.add(pole);

  const lamp = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.18, 0.18),
    new THREE.MeshStandardMaterial({
      color: 0xffe8a3,
      emissive: 0x8c6b19,
      flatShading: true,
    })
  );
  lamp.position.set(x, 2.72, z);
  scene.add(lamp);

  const light = new THREE.PointLight(0xffd374, 0.5, 16, 2);
  light.position.set(x, 2.45, z);
  scene.add(light);
}

function createMountains(scene) {
  [-22, -8, 8, 22].forEach((x, index) => {
    const mountain = new THREE.Mesh(
      new THREE.ConeGeometry(8 + index, 12 + index * 1.5, 4),
      new THREE.MeshStandardMaterial({
        color: 0x22314a,
        flatShading: true,
      })
    );
    mountain.position.set(x, 5, -70 - index * 10);
    scene.add(mountain);
  });
}

async function populateSkyline(scene, models, dynamicProps) {
  let imported = 0;

  if (models) {
    for (let i = 0; i < ASSET_CATALOG.environment.skyline.length; i += 1) {
      const name = ASSET_CATALOG.environment.skyline[i];
      try {
        const model = await models.loadEnvironmentModel(name);
        model.scale.setScalar(3 + i);
        model.position.set(-24 + i * 18, 0, -92 - i * 4);
        scene.add(model);
        dynamicProps.push(model);
        imported += 1;
      } catch (_error) {
        // Fall back to procedural skyline when imported assets are missing.
      }
    }
  }

  if (imported > 0) {
    return;
  }

  for (let i = 0; i < 14; i += 1) {
    const block = new THREE.Mesh(
      new THREE.BoxGeometry(4 + Math.random() * 5, 6 + Math.random() * 10, 4),
      new THREE.MeshStandardMaterial({
        color: 0x1d2e3f,
        emissive: 0x09131d,
        flatShading: true,
      })
    );
    block.position.set(-36 + i * 5.6, 2.5 + Math.random() * 3, -90 + Math.random() * 4);
    block.castShadow = true;
    block.receiveShadow = true;
    scene.add(block);
    dynamicProps.push(block);
  }
}
