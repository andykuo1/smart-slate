import { useRef } from 'react';

import { SHOT_TYPES } from '@/stores/document/value/ShotTypes';

import { getShotTypeColor } from '../ShotColors';
import { getShotTypeIcon } from './ShotTypeIcon';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').ChangeEventHandler<any>} props.onChange
 * @param {string} [props.activeShotType]
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
        shotType="WS"
        onClick={onChange}
        isActive={activeShotType === 'WS'}
      />
      <ShotTypeButton
        className="flex-1"
        shotType="MS"
        onClick={onChange}
        isActive={activeShotType === 'MS'}
      />
      <ShotTypeButton
        className="flex-1"
        shotType="CU"
        onClick={onChange}
        isActive={activeShotType === 'CU'}
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
 * @param {string} props.activeShotType
 * @param {import('react').ChangeEventHandler<any>} props.onChange
 */
function MoreShotTypeSelector({ className, activeShotType, onChange }) {
  const selectRef = useRef(/** @type {HTMLSelectElement|null} */ (null));

  const isActive =
    !!activeShotType &&
    activeShotType !== 'WS' &&
    activeShotType !== 'MS' &&
    activeShotType !== 'CU';

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
      {SHOT_TYPES.map((shotType) => (
        <option key={shotType} title={shotType} value={shotType}>
          {shotType}
        </option>
      ))}
    </select>
  );
}

/**
 * @param {object} props
 * @param {string} [props.shotType]
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
      title={shotType}
      value={shotType}
      onClick={onClick}
      disabled={!onClick}>
      <Icon className="w-6 h-6 fill-current pointer-events-none mx-auto" />
    </button>
  );
}
