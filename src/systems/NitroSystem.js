export function createNitroSystem(config) {
  let amount = config.maxNitro;

  return {
    update(delta, isBoosting) {
      if (isBoosting) {
        amount = Math.max(0, amount - config.drainRate * delta);
      } else {
        amount = Math.min(config.maxNitro, amount + config.rechargeRate * delta);
      }

      return amount;
    },
    refill(value) {
      amount = Math.min(config.maxNitro, amount + value);
    },
    reset() {
      amount = config.maxNitro;
    },
    getAmount() {
      return amount;
    },
    hasNitro() {
      return amount > 0.05;
    },
  };
}
