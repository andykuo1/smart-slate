/**
 * @param {string} [shotType]
 */
export function getShotTypeColor(shotType) {
  switch (shotType) {
    case 'CU':
      return 'bg-blue-300';
    case 'MS':
      return 'bg-green-300';
    case 'WS':
      return 'bg-red-300';
    case '':
    case '--':
      return 'bg-gray-300';
    default:
      return 'bg-yellow-300';
  }
}
