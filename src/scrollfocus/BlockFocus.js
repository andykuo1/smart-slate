/**
 * @param {import('@/stores/document/DocumentStore').BlockId} blockId
 */
export function getBlockFocusId(blockId) {
  return `blockFocus-${blockId}`;
}

/**
 * @param {import('@/stores/document/DocumentStore').BlockId} blockId
 */
export function scrollBlockFocusIntoView(blockId) {
  let id = getBlockFocusId(blockId);
  let element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }
}
