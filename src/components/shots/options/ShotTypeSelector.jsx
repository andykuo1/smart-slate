import { useRef } from 'react';

import ShotTypes, {
  CLOSE_UP,
  MEDIUM_SHOT,
  WIDE_SHOT,
} from '@/stores/ShotTypes';

import { getShotTypeColor } from '../ShotColors';
import { getShotTypeIcon } from './ShotTypeIcon';

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
function MoreShotTypeSelector({ className, activeShotType, onChange }) {
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
        'text-center bg-transparent rounded py-1' +
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
function ShotTypeButton({ shotType, className, onClick, isActive = false }) {
  const Icon = getShotTypeIcon(shotType);
  return (
    <button
      className={
        'p-1 rounded' +
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
      <Icon className="w-6 h-6 fill-current pointer-events-none mx-auto" />
    </button>
  );
}
