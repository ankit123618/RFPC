import { createArcadeCar } from './CarFactory.js';

export async function createPlayerCar(scene, models) {
  const car = createArcadeCar({
    bodyColor: 0x16a3ff,
    cabinColor: 0xd8f2ff,
    accentColor: 0xffe066,
    spoilerColor: 0xffffff,
    scale: 1,
  });

  car.position.set(0, 0, 5);
  car.name = 'Zipsy';

  scene.add(car);

  try {
    const model = await models.loadCarModel('zipsy');
    model.scale.setScalar(1.2);
    model.position.y = 0.05;
    clearChildren(car);
    car.add(model);
  } catch (_error) {
    // Procedural fallback is intentional when no imported model exists yet.
  }

  return car;
}

function clearChildren(group) {
  while (group.children.length > 0) {
    group.remove(group.children[0]);
  }
}
