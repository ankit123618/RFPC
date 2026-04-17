import { ASSET_CATALOG } from '../assets/AssetCatalog.js';
import { createArcadeCar } from './CarFactory.js';

const lanes = [-2, 0, 2];
const enemyStyles = [
  { bodyColor: 0xff5c5c, cabinColor: 0xffd7d7, accentColor: 0x2c2c54, scale: 0.95 },
  { bodyColor: 0x3ddc97, cabinColor: 0xd9fff0, accentColor: 0x123524, scale: 1.02 },
  { bodyColor: 0xff9f43, cabinColor: 0xfff1d6, accentColor: 0x5c2f0a, scale: 0.92 },
];

export async function createEnemyCar(scene, models) {
  const enemy = createArcadeCar(
    enemyStyles[Math.floor(Math.random() * enemyStyles.length)]
  );

  const lane = lanes[Math.floor(Math.random() * lanes.length)];
  enemy.position.set(lane, 0, -50);
  enemy.userData.velocity = 20 + Math.random() * 12;
  enemy.userData.lane = lane;
  scene.add(enemy);

  if (models) {
    const names = ASSET_CATALOG.cars.traffic;
    const modelName = names[Math.floor(Math.random() * names.length)];
    try {
      const model = await models.loadCarModel(modelName);
      model.scale.setScalar(1.05);
      model.position.y = 0.05;
      clearChildren(enemy);
      enemy.add(model);
    } catch (_error) {
      // Procedural fallback is intentional when imported models are missing.
    }
  }

  return enemy;
}

function clearChildren(group) {
  while (group.children.length > 0) {
    group.remove(group.children[0]);
  }
}
