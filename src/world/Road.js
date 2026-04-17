import * as THREE from 'three';

export function createRoad(scene) {
  const roadWidth = 6;
  const roadLength = 50;
  const segmentCount = 5;
  const roadSegments = [];
  const laneSegments = [];
  const roadsideProps = [];
  const pickups = [];

  const roadMaterial = new THREE.MeshStandardMaterial({
    color: 0x3d434d,
    flatShading: true,
  });

  const shoulderMaterial = new THREE.MeshStandardMaterial({
    color: 0xb64747,
    flatShading: true,
  });

  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x355d3a,
    flatShading: true,
  });

  for (let i = 0; i < segmentCount; i += 1) {
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(30, roadLength),
      groundMaterial
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -0.02, -i * roadLength);
    ground.receiveShadow = true;
    scene.add(ground);
    roadSegments.push(ground);

    const road = new THREE.Mesh(
      new THREE.PlaneGeometry(roadWidth, roadLength),
      roadMaterial
    );

    road.rotation.x = -Math.PI / 2;
    road.position.z = -i * roadLength;
    road.receiveShadow = true;
    scene.add(road);
    roadSegments.push(road);

    [-3.45, 3.45].forEach((x) => {
      const shoulder = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.03, roadLength),
        shoulderMaterial
      );
      shoulder.position.set(x, 0.01, -i * roadLength);
      shoulder.receiveShadow = true;
      scene.add(shoulder);
      roadSegments.push(shoulder);
    });

    [-9.2, 9.2].forEach((x, index) => {
      const billboard = new THREE.Mesh(
        new THREE.BoxGeometry(2.8, 1.6, 0.15),
        new THREE.MeshStandardMaterial({
          color: index === 0 ? 0x324b7d : 0x803c36,
          emissive: index === 0 ? 0x0f2249 : 0x351311,
          flatShading: true,
        })
      );
      billboard.position.set(x, 2.8, -i * roadLength - 18);
      billboard.castShadow = true;
      scene.add(billboard);
      roadsideProps.push(billboard);
    });

    if (i < segmentCount - 1) {
      const pickup = createNitroPickup();
      pickup.position.set(i % 2 === 0 ? -2 : 2, 0.8, -i * roadLength - 28);
      scene.add(pickup);
      pickups.push(pickup);
    }
  }

  for (let i = 0; i < segmentCount; i += 1) {
    for (let j = 0; j < 5; j += 1) {
      const lane = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.02, 3.2),
        new THREE.MeshBasicMaterial({ color: 0xf9f3bc })
      );

      lane.position.set(0, 0.02, -i * roadLength - j * 10);
      scene.add(lane);
      laneSegments.push(lane);
    }
  }

  return { roadLength, segmentCount, roadSegments, laneSegments, roadsideProps, pickups };
}

function createNitroPickup() {
  const pickup = new THREE.Group();
  const core = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.16, 0.8, 8),
    new THREE.MeshStandardMaterial({
      color: 0x37d6ff,
      emissive: 0x0f5e84,
      flatShading: true,
    })
  );
  core.rotation.z = Math.PI / 2;

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.34, 0.06, 6, 12),
    new THREE.MeshStandardMaterial({
      color: 0xffef7a,
      emissive: 0x7d6615,
      flatShading: true,
    })
  );
  ring.rotation.y = Math.PI / 2;

  pickup.add(core);
  pickup.add(ring);
  pickup.userData.kind = 'nitro';
  return pickup;
}
