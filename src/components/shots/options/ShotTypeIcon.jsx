import FaceIcon from '@material-symbols/svg-400/rounded/face-fill.svg';
import NaturePeopleIcon from '@material-symbols/svg-400/rounded/nature_people-fill.svg';
import PersonIcon from '@material-symbols/svg-400/rounded/person-fill.svg';
import PhotoIcon from '@material-symbols/svg-400/rounded/photo.svg';
import StarsIcon from '@material-symbols/svg-400/rounded/stars-fill.svg';

import { CLOSE_UP, MEDIUM_SHOT, WIDE_SHOT } from '@/stores/document/value';

/**
 * @param {import('@/stores/document/DocumentStore').ShotType} [shotType]
 * @returns {import('react').FC<any>}
 */
export function getShotTypeIcon(shotType = undefined) {
  switch (shotType) {
    case CLOSE_UP.value:
      return FaceIcon;
    case MEDIUM_SHOT.value:
      return PersonIcon;
    case WIDE_SHOT.value:
      return NaturePeopleIcon;
    case '':
      return PhotoIcon;
    default:
      return StarsIcon;
  }
}
