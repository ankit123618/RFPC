export function createInputSystem() {
  const state = {
    boost: false,
    brake: false,
    moveLeft: false,
    moveRight: false,
    start: false,
    pause: false,
  };

  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      state.moveLeft = true;
    }
    if (event.key === 'ArrowRight') {
      state.moveRight = true;
    }
    if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') {
      state.boost = true;
    }
    if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') {
      state.brake = true;
    }
    if (event.key === 'Enter') {
      state.start = true;
    }
    if (event.key.toLowerCase() === 'p') {
      state.pause = !state.pause;
    }
  });

  window.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft') {
      state.moveLeft = false;
    }
    if (event.key === 'ArrowRight') {
      state.moveRight = false;
    }
    if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') {
      state.boost = false;
    }
    if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') {
      state.brake = false;
    }
    if (event.key === 'Enter') {
      state.start = false;
    }
  });

  return state;
}
