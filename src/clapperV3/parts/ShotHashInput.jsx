import { useState } from 'react';

import ShotHash from '../ShotHash';

/**
 * @param {object} props
 * @param {string} props.id
 * @param {string} props.shotHash
 * @param {(value: string) => void} props.onShotHashChange
 * @param {boolean} props.disabled
 */
export default function ShotHashInput({
  id,
  shotHash,
  onShotHashChange,
  disabled,
}) {
  const [nextShotHash, setNextShotHash] = useState(
    /** @type {string|undefined} */ (undefined),
  );
  return (
    <input
      id={id}
      style={{ lineHeight: '1em' }}
      className="inline w-[2.4em] whitespace-pre bg-transparent text-[1.5em] uppercase"
      pattern="[0-9]*"
      type="text"
      inputMode="numeric"
      value={ShotHash(
        typeof nextShotHash !== 'undefined' ? nextShotHash : shotHash,
      )}
      onChange={(e) => {
        let next = ShotHash(e.target.value);
        setNextShotHash(next);
      }}
      onFocus={(e) => {
        e.target.select();
      }}
      onBlur={() => {
        let next = ShotHash(nextShotHash ?? shotHash);
        setNextShotHash(undefined);
        if (next !== shotHash) {
          onShotHashChange(next);
        }
      }}
      disabled={disabled}
    />
  );
}
