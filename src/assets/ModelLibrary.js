import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

export function createModelLibrary() {
  const cache = new Map();

  async function load(url) {
    if (cache.has(url)) {
      return cache.get(url).clone(true);
    }

    const gltf = await loader.loadAsync(url);
    const scene = gltf.scene || new Group();
    cache.set(url, scene);
    return scene.clone(true);
  }

  return {
    async loadCarModel(name) {
      const url = new URL(`../../assets/models/${name}.glb`, import.meta.url).href;
      return load(url);
    },
    async loadEnvironmentModel(name) {
      const url = new URL(`../../assets/models/${name}.glb`, import.meta.url).href;
      return load(url);
    },
  };
}
