import FaceIcon from '@material-symbols/svg-400/rounded/face-fill.svg';
import NaturePeopleIcon from '@material-symbols/svg-400/rounded/nature_people-fill.svg';
import PersonIcon from '@material-symbols/svg-400/rounded/person-fill.svg';
import PhotoIcon from '@material-symbols/svg-400/rounded/photo.svg';
import StarsIcon from '@material-symbols/svg-400/rounded/stars-fill.svg';

/**
 * @param {string} [shotType]
 * @returns {import('react').FC<any>}
 */
export function getShotTypeIcon(shotType = undefined) {
  switch (shotType) {
    case 'CU':
      return FaceIcon;
    case 'MS':
      return PersonIcon;
    case 'WS':
      return NaturePeopleIcon;
    case '':
      return PhotoIcon;
    default:
      return StarsIcon;
  }
}
