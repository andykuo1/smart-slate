import { useState } from 'react';

import SceneNumber from '../SceneNumber';

/**
 * @param {object} props
 * @param {string} props.id
 * @param {number} props.sceneNumber
 * @param {(value: number) => void} props.onSceneNumberChange
 * @param {boolean} props.disabled
 */
export default function SceneNumberInput({
  id,
  sceneNumber,
  onSceneNumberChange,
  disabled,
}) {
  const [nextSceneNumber, setNextSceneNumber] = useState(
    /** @type {number|undefined} */ (undefined),
  );
  return (
    <input
      id={id}
      style={{ lineHeight: '1em', letterSpacing: '-0.1em' }}
      className="inline w-[1.56em] overflow-hidden whitespace-pre bg-transparent text-[3em]"
      pattern="[0-9]*"
      type="text"
      inputMode="numeric"
      value={SceneNumber.stringify(nextSceneNumber ?? sceneNumber)}
      onChange={(e) => {
        let next = SceneNumber.parse(e.target.value);
        setNextSceneNumber(next);
      }}
      onFocus={(e) => {
        e.target.select();
      }}
      onBlur={() => {
        let next = Number(nextSceneNumber ?? sceneNumber);
        next = SceneNumber.sanitize(next);
        if (next <= 0) {
          next = 1;
        }
        setNextSceneNumber(undefined);
        if (next !== sceneNumber) {
          onSceneNumberChange(next);
        }
      }}
      disabled={disabled}
    />
  );
}
