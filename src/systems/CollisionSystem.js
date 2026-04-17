export function checkCollision(a, b) {
  return (
    Math.abs(a.position.x - b.position.x) < 1 &&
    Math.abs(a.position.z - b.position.z) < 1.5
  );
}
