import { useRef } from 'react';

import FaceIcon from '@material-symbols/svg-400/rounded/face-fill.svg';
import NaturePeopleIcon from '@material-symbols/svg-400/rounded/nature_people-fill.svg';
import PersonIcon from '@material-symbols/svg-400/rounded/person-fill.svg';
import StarsIcon from '@material-symbols/svg-400/rounded/stars-fill.svg';

import ShotTypes, {
  CLOSE_UP,
  MEDIUM_SHOT,
  WIDE_SHOT,
} from '@/stores/ShotTypes';

import { getShotTypeColor } from './ShotColors';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').ChangeEventHandler<any>} props.onChange
 * @param {import('@/stores/document/DocumentStore').ShotType} [props.activeShotType]
 * @param {boolean} [props.showMore]
 */
export function ShotTypeSelector({
  className,
  onChange,
  activeShotType = '',
  showMore = true,
}) {
  return (
    <div className={className}>
      <ShotTypeButton
        className="flex-1"
        shotType={WIDE_SHOT.value}
        onClick={onChange}
        isActive={activeShotType === WIDE_SHOT.value}
      />
      <ShotTypeButton
        className="flex-1"
        shotType={MEDIUM_SHOT.value}
        onClick={onChange}
        isActive={activeShotType === MEDIUM_SHOT.value}
      />
      <ShotTypeButton
        className="flex-1"
        shotType={CLOSE_UP.value}
        onClick={onChange}
        isActive={activeShotType === CLOSE_UP.value}
      />
      {showMore && (
        <MoreShotTypeSelector
          className="flex-1"
          activeShotType={activeShotType}
          onChange={onChange}
        />
      )}
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').ShotType} props.activeShotType
 * @param {import('react').ChangeEventHandler<any>} props.onChange
 */
export function MoreShotTypeSelector({ className, activeShotType, onChange }) {
  const selectRef = useRef(/** @type {HTMLSelectElement|null} */ (null));

  const isActive =
    !!activeShotType &&
    activeShotType !== WIDE_SHOT.value &&
    activeShotType !== MEDIUM_SHOT.value &&
    activeShotType !== CLOSE_UP.value;

  return (
    <select
      ref={selectRef}
      className={
        'text-center bg-transparent rounded' +
        ' ' +
        (isActive && getShotTypeColor(activeShotType)) +
        ' ' +
        className
      }
      value={activeShotType}
      onChange={onChange}>
      {ShotTypes.params().map((type) => (
        <option key={type.value} title={type.name} value={type.value}>
          {type.abbr}
        </option>
      ))}
    </select>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').ShotType} [props.shotType]
 * @param {string} [props.className]
 * @param {import('react').MouseEventHandler} [props.onClick]
 * @param {boolean} [props.isActive]
 */
export function ShotTypeButton({
  shotType,
  className,
  onClick,
  isActive = false,
}) {
  return (
    <button
      className={
        'px-1 rounded' +
        ' ' +
        (isActive && getShotTypeColor(shotType)) +
        ' ' +
        className
      }
      title={
        (shotType && ShotTypes.getParamsByType(shotType)?.name) || 'Special'
      }
      value={shotType}
      onClick={onClick}
      disabled={!onClick}>
      <ShotTypeIcon
        shotType={shotType}
        className="w-6 h-6 fill-current pointer-events-none"
      />
    </button>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').ShotType} [props.shotType]
 */
export function ShotTypeIcon({ className, shotType }) {
  switch (shotType) {
    case CLOSE_UP.value:
      return <FaceIcon className={className} />;
    case MEDIUM_SHOT.value:
      return <PersonIcon className={className} />;
    case WIDE_SHOT.value:
      return <NaturePeopleIcon className={className} />;
    default:
      return <StarsIcon className={className} />;
  }
}

/**
 * @param {import('@/stores/document/DocumentStore').ShotType} shotType
 */
export function getShotTypeIcon(shotType) {
  switch (shotType) {
    case CLOSE_UP.value:
      return FaceIcon;
    case MEDIUM_SHOT.value:
      return PersonIcon;
    case WIDE_SHOT.value:
      return NaturePeopleIcon;
    case '':
      return undefined;
    default:
      return StarsIcon;
  }
}
