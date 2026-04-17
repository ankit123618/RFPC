export function createCheckpointSystem(config) {
  let nextCheckpointDistance = config.checkpointDistance;
  let completed = 0;
  let finished = false;

  return {
    update(totalDistance) {
      if (finished) {
        return false;
      }

      let crossed = false;
      while (totalDistance >= nextCheckpointDistance && !finished) {
        completed += 1;
        crossed = true;
        nextCheckpointDistance += config.checkpointDistance;
        if (completed >= config.totalCheckpoints) {
          finished = true;
        }
      }

      return crossed;
    },
    reset() {
      nextCheckpointDistance = config.checkpointDistance;
      completed = 0;
      finished = false;
    },
    getCheckpointLabel() {
      return `CP ${Math.min(completed + 1, config.totalCheckpoints)}/${config.totalCheckpoints}`;
    },
    getCompletedCount() {
      return completed;
    },
    isFinished() {
      return finished;
    },
  };
}
