import { createCamera } from './core/Camera.js';
import { createRenderer } from './core/Renderer.js';
import { createCheckpointSystem } from './systems/CheckpointSystem.js';
import { createModelLibrary } from './assets/ModelLibrary.js';
import { createScene } from './core/Scene.js';
import { createPlayerCar } from './entities/PlayerCar.js';
import { createEnemyCar } from './entities/EnemyCar.js';
import { createAudioSystem } from './systems/AudioSystem.js';
import { createCameraRig } from './systems/CameraRig.js';
import { checkCollision } from './systems/CollisionSystem.js';
import { createInputSystem } from './systems/InputSystem.js';
import { createNitroSystem } from './systems/NitroSystem.js';
import { updateTraffic } from './systems/TrafficSystem.js';
import { GAME_CONFIG } from './utils/Constants.js';
import { createEnvironment } from './world/Environment.js';
import { createRoad } from './world/Road.js';
import * as THREE from 'three';

const scene = createScene();
const camera = createCamera();
const renderer = createRenderer(scene, camera);
const input = createInputSystem();
const cameraRig = createCameraRig(camera);
const models = createModelLibrary();
const checkpoints = createCheckpointSystem(GAME_CONFIG);
const nitro = createNitroSystem({
  drainRate: GAME_CONFIG.nitroDrainRate,
  maxNitro: GAME_CONFIG.maxNitro,
  rechargeRate: GAME_CONFIG.nitroRechargeRate,
});
const clock = new THREE.Clock();

const environment = await createEnvironment(scene, models);

const { roadLength, segmentCount, roadSegments, laneSegments, roadsideProps, pickups } = createRoad(scene);
const car = await createPlayerCar(scene, models);
const audio = createAudioSystem(camera);

const scoreEl = document.getElementById('score');
const speedEl = document.getElementById('speed');
const statusEl = document.getElementById('status');
const checkpointEl = document.getElementById('checkpoint');
const nitroFillEl = document.getElementById('nitroFill');
const startScreenEl = document.getElementById('startScreen');
const startButtonEl = document.getElementById('startButton');
const gameOverEl = document.getElementById('gameOver');
const gameOverTitle = gameOverEl.querySelector('h1');
const gameOverCopyEl = document.getElementById('gameOverCopy');

let score = 0;
let speed = GAME_CONFIG.initialSpeed;
let gameStarted = false;
let gameOver = false;
let paused = false;
const enemies = [];
let enemyTimer = 0;
let totalDistance = 0;
let pendingEnemyLoads = 0;

scoreEl.innerText = 'ZIPSY // STAGE 01 // SCORE 0';
speedEl.innerText = `${Math.floor(speed).toString().padStart(3, '0')} KM/H`;
statusEl.innerText = GAME_CONFIG.introMessage;
checkpointEl.innerText = checkpoints.getCheckpointLabel();
nitroFillEl.style.width = '100%';

function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight, Math.min(window.devicePixelRatio, 2));
}

window.addEventListener('resize', handleResize);
startButtonEl.addEventListener('click', startRace);

async function spawnEnemy() {
  if (gameOver) {
    return;
  }

  if (pendingEnemyLoads > 2) {
    return;
  }

  pendingEnemyLoads += 1;
  try {
    enemies.push(await createEnemyCar(scene, models));
  } finally {
    pendingEnemyLoads -= 1;
  }
}

function startRace() {
  gameStarted = true;
  paused = false;
  startScreenEl.style.display = 'none';
  statusEl.innerText = 'RACING';
  audio.reset();
}

function restartGame() {
  score = 0;
  speed = GAME_CONFIG.initialSpeed;
  gameOver = false;
  gameStarted = true;
  paused = false;
  totalDistance = 0;
  car.position.set(0, 0, 5);
  gameOverEl.style.display = 'none';
  startScreenEl.style.display = 'none';
  checkpoints.reset();
  nitro.reset();
  scoreEl.innerText = 'ZIPSY // STAGE 01 // SCORE 0';
  speedEl.innerText = `${Math.floor(speed).toString().padStart(3, '0')} KM/H`;
  statusEl.innerText = 'RACING';
  checkpointEl.innerText = checkpoints.getCheckpointLabel();
  nitroFillEl.style.width = '100%';

  enemies.forEach((enemy) => scene.remove(enemy));
  enemies.length = 0;
  audio.reset();
}

window.restartGame = restartGame;

function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.05);

  if (!gameStarted && input.start) {
    startRace();
  }

  if (paused !== input.pause) {
    paused = input.pause;
    statusEl.innerText = paused ? 'PAUSED' : gameStarted ? 'RACING' : GAME_CONFIG.introMessage;
  }

  if (gameOver || !gameStarted || paused) {
    cameraRig.update(car, delta, speed);
    renderer.render();
    return;
  }

  if (speed < GAME_CONFIG.maxSpeed) {
    speed += GAME_CONFIG.acceleration * delta * 10;
  }

  const boosting = input.boost && nitro.hasNitro();
  nitro.update(delta, boosting);

  if (boosting) {
    speed = Math.min(GAME_CONFIG.maxSpeed * GAME_CONFIG.boostMultiplier, speed + 18 * delta);
    statusEl.innerText = 'BOOST';
  } else if (input.brake) {
    speed = Math.max(GAME_CONFIG.minSpeed, speed - GAME_CONFIG.brakeDrag * 14 * delta);
    statusEl.innerText = 'BRAKE';
  } else {
    speed = Math.max(GAME_CONFIG.minSpeed, speed - 6 * delta);
    statusEl.innerText = 'RACING';
  }

  score += speed * delta * 5;
  totalDistance += speed * delta;
  scoreEl.innerText = `ZIPSY // STAGE 01 // SCORE ${Math.floor(score)}`;
  speedEl.innerText = `${Math.floor(speed).toString().padStart(3, '0')} KM/H`;
  audio.setEngineRate(0.85 + speed / 70);
  nitroFillEl.style.width = `${Math.max(0, Math.min(100, nitro.getAmount() * 100))}%`;

  if (checkpoints.update(totalDistance)) {
    checkpointEl.innerText = checkpoints.getCheckpointLabel();
    nitro.refill(GAME_CONFIG.checkpointNitroReward);
    score += 500;
    statusEl.innerText = checkpoints.isFinished() ? 'STAGE CLEAR' : 'CHECKPOINT';
  }

  if (checkpoints.isFinished()) {
    gameOver = true;
    gameOverTitle.innerText = 'STAGE CLEAR';
    gameOverCopyEl.innerText = `You cleared Stage 01 with score ${Math.floor(score)}. More tracks come next.`;
    gameOverEl.style.display = 'block';
    statusEl.innerText = 'FINISHED';
    audio.stopEngine();
  }

  enemyTimer += delta * 1000;
  if (enemyTimer >= GAME_CONFIG.spawnIntervalMs) {
    enemyTimer = 0;
    spawnEnemy();
  }

  roadSegments.forEach((road) => {
    road.position.z += speed * delta;
    if (road.position.z > roadLength) {
      road.position.z -= roadLength * segmentCount;
    }
  });

  laneSegments.forEach((lane) => {
    lane.position.z += speed * delta;
    if (lane.position.z > 10) {
      lane.position.z -= roadLength * segmentCount;
    }
  });

  roadsideProps.forEach((prop) => {
    prop.position.z += speed * delta;
    if (prop.position.z > 12) {
      prop.position.z -= roadLength * segmentCount;
    }
  });

  environment.dynamicProps.forEach((prop) => {
    if (prop.position.z > 20) {
      prop.position.z -= roadLength * segmentCount;
    }
  });

  pickups.forEach((pickup) => {
    pickup.rotation.y += delta * 2.2;
    pickup.position.z += speed * delta;
    if (pickup.position.z > 12) {
      pickup.position.z -= roadLength * segmentCount;
      pickup.position.x = Math.random() > 0.5 ? -2 : 2;
    }

    const xClose = Math.abs(car.position.x - pickup.position.x) < 0.8;
    const zClose = Math.abs(car.position.z - pickup.position.z) < 1.2;
    if (xClose && zClose) {
      nitro.refill(GAME_CONFIG.nitroPickupReward);
      score += 150;
      pickup.position.z -= roadLength * segmentCount;
      pickup.position.x = Math.random() > 0.5 ? -2 : 2;
      statusEl.innerText = 'NITRO PICKUP';
    }
  });

  if (input.moveLeft && car.position.x > -GAME_CONFIG.roadLimit) {
    car.position.x -= GAME_CONFIG.carSpeed * delta;
  }
  if (input.moveRight && car.position.x < GAME_CONFIG.roadLimit) {
    car.position.x += GAME_CONFIG.carSpeed * delta;
  }

  updateTraffic(enemies, delta);

  enemies.slice().forEach((enemy) => {
    enemy.position.z += (speed - enemy.userData.velocity) * delta;

    if (enemy.position.z > 10) {
      scene.remove(enemy);
      enemies.splice(enemies.indexOf(enemy), 1);
      return;
    }

    if (checkCollision(car, enemy)) {
      gameOver = true;
      audio.stopEngine();
      if (audio.crashSound.buffer && !audio.crashSound.isPlaying) {
        audio.crashSound.play();
      }
      gameOverTitle.innerText = 'ZIPSY WRECKED';
      gameOverCopyEl.innerText = `You reached ${checkpoints.getCompletedCount()} checkpoints and scored ${Math.floor(score)}.`;
      gameOverEl.style.display = 'block';
      statusEl.innerText = 'CRASHED';
    }
  });

  cameraRig.update(car, delta, speed);
  renderer.render();
}

handleResize();
animate();
