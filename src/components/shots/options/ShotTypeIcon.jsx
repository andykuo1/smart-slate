import NewIcon from '@material-symbols/svg-400/rounded/add.svg';
import FaceIcon from '@material-symbols/svg-400/rounded/face-fill.svg';
import NaturePeopleIcon from '@material-symbols/svg-400/rounded/nature_people-fill.svg';
import PersonIcon from '@material-symbols/svg-400/rounded/person-fill.svg';
import PhotoIcon from '@material-symbols/svg-400/rounded/photo.svg';
import StarsIcon from '@material-symbols/svg-400/rounded/stars-fill.svg';

export const SHOT_TYPE_NEW_SHOT = '__NEW__';

/**
 * @param {string} shotType
 */
export function getShotTypeText(shotType) {
  switch (shotType) {
    case SHOT_TYPE_NEW_SHOT:
      return '';
    default:
      return shotType;
  }
}

/**
 * @param {string} [shotType]
 * @returns {import('react').FC<any>}
 */
export function getShotTypeIcon(shotType) {
  switch (shotType) {
    case 'CU':
      return FaceIcon;
    case 'MS':
      return PersonIcon;
    case 'WS':
      return NaturePeopleIcon;
    case '':
      return PhotoIcon;
    case SHOT_TYPE_NEW_SHOT:
      return NewIcon;
    default:
      return StarsIcon;
  }
}
