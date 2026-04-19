import * as THREE from 'three';

export function createAudioSystem(camera) {
  const listener = new THREE.AudioListener();
  camera.add(listener);

  const engineSound = new THREE.Audio(listener);
  const crashSound = new THREE.Audio(listener);
  const audioLoader = new THREE.AudioLoader();
  let paused = false;

  const engineSoundUrl = new URL('../../assets/sounds/engine.mp3', import.meta.url).href;
  const crashSoundUrl = new URL('../../assets/sounds/crash.mp3', import.meta.url).href;

  audioLoader.load(engineSoundUrl, (buffer) => {
    engineSound.setBuffer(buffer);
    engineSound.setLoop(true);
    engineSound.setVolume(0.5);
  });

  audioLoader.load(crashSoundUrl, (buffer) => {
    crashSound.setBuffer(buffer);
    crashSound.setLoop(false);
    crashSound.setVolume(1);
  });

  const ensureReady = async () => {
    if (listener.context.state === 'suspended') {
      await listener.context.resume();
    }
  };

  const startEngine = () => {
    if (!paused && engineSound.buffer && !engineSound.isPlaying) {
      engineSound.play();
    }
  };

  return {
    crashSound,
    engineSound,
    setEngineRate(rate) {
      if (engineSound.buffer) {
        engineSound.setPlaybackRate(rate);
      }
    },
    setPaused(nextPaused) {
      paused = nextPaused;

      if (paused) {
        if (engineSound.isPlaying) {
          engineSound.stop();
        }

        if (crashSound.isPlaying) {
          crashSound.stop();
        }

        return;
      }

      startEngine();
    },
    async reset() {
      paused = false;
      if (crashSound.isPlaying) {
        crashSound.stop();
      }
      await ensureReady();
      startEngine();
    },
    stopEngine() {
      if (engineSound.isPlaying) {
        engineSound.stop();
      }
    },
  };
}
