const LANES = [-2, 0, 2];

export function updateTraffic(enemies, delta) {
  enemies.forEach((enemy) => {
    enemy.userData.laneChangeCooldown = Math.max(
      0,
      (enemy.userData.laneChangeCooldown ?? 0) - delta
    );

    if (
      enemy.userData.targetLane == null &&
      enemy.userData.laneChangeCooldown === 0 &&
      Math.random() < 0.35 * delta
    ) {
      const currentIndex = LANES.indexOf(enemy.userData.lane ?? 0);
      const direction = Math.random() > 0.5 ? 1 : -1;
      const nextLane = LANES[currentIndex + direction];
      if (nextLane != null) {
        enemy.userData.targetLane = nextLane;
        enemy.userData.laneChangeCooldown = 1.8 + Math.random() * 1.6;
      }
    }

    if (enemy.userData.targetLane != null) {
      const offset = enemy.userData.targetLane - enemy.position.x;
      const step = Math.sign(offset) * delta * 1.6;
      if (Math.abs(offset) <= Math.abs(step)) {
        enemy.position.x = enemy.userData.targetLane;
        enemy.userData.lane = enemy.userData.targetLane;
        enemy.userData.targetLane = null;
      } else {
        enemy.position.x += step;
      }
    }
  });
}
