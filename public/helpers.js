/**
 * Gets a random item from an array.
 * @param arr
 * @returns {*}
 */
const shuffleArray = arr => arr
  .map(a => [Math.random(), a])
  .sort((a, b) => a[0] - b[0])
  .map(a => a[1]);
