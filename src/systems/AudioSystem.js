import * as THREE from 'three';

export function createAudioSystem(camera) {
  const listener = new THREE.AudioListener();
  camera.add(listener);

  const engineSound = new THREE.Audio(listener);
  const crashSound = new THREE.Audio(listener);
  const audioLoader = new THREE.AudioLoader();

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

  const startEngine = () => {
    if (engineSound.buffer && !engineSound.isPlaying) {
      engineSound.play();
    }
  };

  window.addEventListener('click', startEngine, { once: false });

  return {
    crashSound,
    engineSound,
    setEngineRate(rate) {
      if (engineSound.buffer) {
        engineSound.setPlaybackRate(rate);
      }
    },
    reset() {
      if (crashSound.isPlaying) {
        crashSound.stop();
      }
      startEngine();
    },
    stopEngine() {
      if (engineSound.isPlaying) {
        engineSound.stop();
      }
    },
  };
}
