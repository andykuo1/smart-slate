import { useState } from 'react';

import ShotNumber from '../ShotNumber';

/**
 * @param {object} props
 * @param {string} props.id
 * @param {number} props.shotNumber
 * @param {(value: number) => void} props.onShotNumberChange
 * @param {boolean} props.disabled
 */
export default function ShotNumberInput({
  id,
  shotNumber,
  onShotNumberChange,
  disabled,
}) {
  const [nextShotNumber, setNextShotNumber] = useState(
    /** @type {number|undefined} */ (undefined),
  );
  return (
    <input
      id={id}
      style={{ lineHeight: '1em' }}
      className="inline w-[1.2em] whitespace-pre bg-transparent text-[3em] uppercase"
      pattern="[A-Za-z]*"
      type="text"
      inputMode="text"
      value={ShotNumber.stringify(
        typeof nextShotNumber !== 'undefined' ? nextShotNumber : shotNumber,
      )}
      onChange={(e) => {
        let next = ShotNumber.parse(e.target.value);
        setNextShotNumber(next);
      }}
      onFocus={(e) => {
        e.target.select();
      }}
      onBlur={() => {
        let next = Number(nextShotNumber ?? shotNumber);
        next = ShotNumber.sanitize(next);
        if (next <= 0) {
          next = 1;
        }
        setNextShotNumber(undefined);
        if (next !== shotNumber) {
          onShotNumberChange(next);
        }
      }}
      disabled={disabled}
    />
  );
}
