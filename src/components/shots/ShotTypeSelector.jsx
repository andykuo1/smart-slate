import { useCallback, useRef } from 'react';

import FaceIcon from '@material-symbols/svg-400/rounded/face-fill.svg';
import NaturePeopleIcon from '@material-symbols/svg-400/rounded/nature_people-fill.svg';
import PersonIcon from '@material-symbols/svg-400/rounded/person-fill.svg';
import StarsIcon from '@material-symbols/svg-400/rounded/stars-fill.svg';

import ShotTypes, {
  CLOSE_UP,
  MEDIUM_SHOT,
  WIDE_SHOT,
} from '@/stores/ShotTypes';
import { useSetShotType, useShotType } from '@/stores/document';

import { getShotTypeColor } from './ShotColors';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 */
export function ShotTypesSelector({ className, documentId, shotId }) {
  const shotType = useShotType(documentId, shotId);
  const setShotType = useSetShotType();

  return (
    <div className={'flex flex-row items-center' + ' ' + className}>
      <div className="flex flex-col items-center">
        <ShotTypeButton
          shotType={WIDE_SHOT.value}
          onClick={() => setShotType(documentId, shotId, WIDE_SHOT.value)}
          isActive={shotType === WIDE_SHOT.value}
        />
        <ShotTypeButton
          shotType={MEDIUM_SHOT.value}
          onClick={() => setShotType(documentId, shotId, MEDIUM_SHOT.value)}
          isActive={shotType === MEDIUM_SHOT.value}
        />
        <ShotTypeButton
          shotType={CLOSE_UP.value}
          onClick={() => setShotType(documentId, shotId, CLOSE_UP.value)}
          isActive={shotType === CLOSE_UP.value}
        />
      </div>
      <MoreShotTypeSelector documentId={documentId} shotId={shotId} />
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 */
export function MoreShotTypeSelector({ className, documentId, shotId }) {
  const selectRef = useRef(/** @type {HTMLSelectElement|null} */ (null));
  const shotType = useShotType(documentId, shotId);
  const setShotType = useSetShotType();

  /** @type {import('react').ChangeEventHandler<HTMLSelectElement>} */
  const onShotTypeChange = useCallback(
    function onShotTypeChange(e) {
      let el = e.target;
      setShotType(
        documentId,
        shotId,
        /** @type {import('@/stores/document/DocumentStore').ShotType} */ (
          el.value
        ),
      );
    },
    [documentId, shotId, setShotType],
  );

  const isActive =
    !!shotType &&
    shotType !== WIDE_SHOT.value &&
    shotType !== MEDIUM_SHOT.value &&
    shotType !== CLOSE_UP.value;

  return (
    <select
      ref={selectRef}
      className={
        'text-center bg-transparent rounded' +
        ' ' +
        (isActive && getShotTypeColor(shotType) + ' ' + className)
      }
      value={shotType}
      onChange={onShotTypeChange}>
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
      onClick={onClick}
      disabled={!onClick}>
      <ShotTypeIcon shotType={shotType} className="w-6 h-6 fill-current" />
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
