/** @typedef {ReturnType<createShotTake>} ShotTake */

export function createShotTake(document = 0, scene = 0, shot = 0, take = 0) {
  return {
    document,
    scene,
    shot,
    take,
  };
}
