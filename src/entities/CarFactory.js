import * as THREE from 'three';

export function createArcadeCar({
  bodyColor,
  cabinColor,
  accentColor,
  wheelColor = 0x111111,
  spoilerColor = accentColor,
  scale = 1,
}) {
  const car = new THREE.Group();

  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: bodyColor,
    flatShading: true,
    metalness: 0.1,
    roughness: 0.75,
  });
  const cabinMaterial = new THREE.MeshStandardMaterial({
    color: cabinColor,
    flatShading: true,
    metalness: 0.05,
    roughness: 0.55,
  });
  const accentMaterial = new THREE.MeshStandardMaterial({
    color: accentColor,
    flatShading: true,
    metalness: 0.15,
    roughness: 0.6,
  });
  const wheelMaterial = new THREE.MeshStandardMaterial({
    color: wheelColor,
    flatShading: true,
    roughness: 0.95,
  });

  const lowerBody = new THREE.Mesh(
    new THREE.BoxGeometry(1.25, 0.34, 2.5),
    bodyMaterial
  );
  lowerBody.position.y = 0.42;
  car.add(lowerBody);

  const hood = new THREE.Mesh(
    new THREE.BoxGeometry(1.15, 0.18, 0.8),
    accentMaterial
  );
  hood.position.set(0, 0.62, 0.82);
  car.add(hood);

  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(0.92, 0.34, 0.98),
    cabinMaterial
  );
  roof.position.set(0, 0.84, -0.02);
  car.add(roof);

  const rearDeck = new THREE.Mesh(
    new THREE.BoxGeometry(1.08, 0.18, 0.7),
    bodyMaterial
  );
  rearDeck.position.set(0, 0.62, -0.88);
  car.add(rearDeck);

  const spoiler = new THREE.Mesh(
    new THREE.BoxGeometry(1.02, 0.08, 0.14),
    new THREE.MeshStandardMaterial({
      color: spoilerColor,
      flatShading: true,
      roughness: 0.85,
    })
  );
  spoiler.position.set(0, 0.9, -1.25);
  car.add(spoiler);

  const spoilerStandGeometry = new THREE.BoxGeometry(0.08, 0.18, 0.08);
  [-0.34, 0.34].forEach((x) => {
    const stand = new THREE.Mesh(
      spoilerStandGeometry,
      new THREE.MeshStandardMaterial({
        color: spoilerColor,
        flatShading: true,
        roughness: 0.85,
      })
    );
    stand.position.set(x, 0.8, -1.16);
    car.add(stand);
  });

  const bumperGeometry = new THREE.BoxGeometry(1.18, 0.14, 0.12);
  const frontBumper = new THREE.Mesh(bumperGeometry, accentMaterial);
  frontBumper.position.set(0, 0.3, 1.28);
  car.add(frontBumper);

  const rearBumper = new THREE.Mesh(bumperGeometry, accentMaterial);
  rearBumper.position.set(0, 0.3, -1.28);
  car.add(rearBumper);

  const wheelGeometry = new THREE.CylinderGeometry(0.24, 0.24, 0.18, 10);
  wheelGeometry.rotateZ(Math.PI / 2);
  [
    [-0.68, 0.24, 0.9],
    [0.68, 0.24, 0.9],
    [-0.68, 0.24, -0.9],
    [0.68, 0.24, -0.9],
  ].forEach(([x, y, z]) => {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.position.set(x, y, z);
    car.add(wheel);
  });

  const windshield = new THREE.Mesh(
    new THREE.BoxGeometry(0.78, 0.22, 0.28),
    new THREE.MeshStandardMaterial({
      color: 0xa6d8ff,
      emissive: 0x173c59,
      flatShading: true,
      roughness: 0.3,
    })
  );
  windshield.position.set(0, 0.92, 0.28);
  car.add(windshield);

  const backGlass = windshield.clone();
  backGlass.position.z = -0.32;
  car.add(backGlass);

  const headLightGeometry = new THREE.BoxGeometry(0.22, 0.09, 0.06);
  [-0.36, 0.36].forEach((x) => {
    const headLight = new THREE.Mesh(
      headLightGeometry,
      new THREE.MeshStandardMaterial({
        color: 0xfff3c4,
        emissive: 0x8a6d16,
        flatShading: true,
      })
    );
    headLight.position.set(x, 0.44, 1.3);
    car.add(headLight);

    const tailLight = new THREE.Mesh(
      headLightGeometry,
      new THREE.MeshStandardMaterial({
        color: 0xff5f5f,
        emissive: 0x601010,
        flatShading: true,
      })
    );
    tailLight.position.set(x, 0.44, -1.3);
    car.add(tailLight);
  });

  car.scale.setScalar(scale);
  return car;
}
