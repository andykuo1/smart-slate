/**
 * @template {object} T
 * @param {object} out
 * @param {T} target
 * @returns {T}
 */
export function slowShallowCopyObjects(out, target) {
  // TODO: Eventually make this faster ;)
  for (let key of Object.keys(target)) {
    // @ts-expect-error both objects should be generic json objects
    out[key] = target[key];
  }
  return /** @type {T} */ (out);
}
