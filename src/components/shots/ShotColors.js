import { CLOSE_UP, MEDIUM_SHOT, WIDE_SHOT } from '@/stores/ShotTypes';

/**
 * @param {import('@/stores/DocumentStore').ShotType} [shotType]
 */
export function getShotTypeColor(shotType) {
  switch (shotType) {
    case CLOSE_UP.value:
      return 'bg-blue-300';
    case MEDIUM_SHOT.value:
      return 'bg-green-300';
    case WIDE_SHOT.value:
      return 'bg-red-300';
    default:
      return 'bg-yellow-300';
  }
}
