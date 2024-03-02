import {
  getClapById,
  useClapperDispatch,
  useClapperStore,
} from '@/stores/clapper';
import {
  useClapperCursorDispatch,
  useClapperCursorRollName,
} from '@/stores/clapper/cursor';

import ClapperLabel from './ClapperLabel';

/**
 * @param {object} props
 * @param {import('@/stores/clapper/Store').ClapperId} props.clapperId
 * @param {import('@/stores/clapper/Store').ClapId} props.clapId
 */
export default function ClapRollParts({ clapperId, clapId }) {
  const clapRollName = useClapperStore(
    (ctx) => getClapById(ctx, clapperId, clapId)?.rollName ?? '',
  );
  const changeClapRollName = useClapperDispatch(
    (ctx) => ctx.changeClapRollName,
  );

  const cursorRollName = useClapperCursorRollName();
  const changeRollName = useClapperCursorDispatch((ctx) => ctx.changeRollName);

  /**
   * @param {import('react').ChangeEvent} e
   */
  function onChange(e) {
    const target = /** @type {HTMLInputElement} */ (e.target);
    if (clapId) {
      changeClapRollName(clapperId, clapId, target.value);
    } else {
      changeRollName(target.value);
    }
  }

  return (
    <ClapperRollField
      value={clapId ? clapRollName : cursorRollName}
      onChange={onChange}
    />
  );
}

/**
 * @param {object} props
 * @param {string} props.value
 * @param {import('react').ChangeEventHandler<HTMLInputElement>} props.onChange
 */
function ClapperRollField({ value, onChange }) {
  return (
    <div className="flex flex-1 flex-col items-center">
      <ClapperLabel className="text-[1em]">ROLL</ClapperLabel>
      <input
        style={{ lineHeight: '1em' }}
        className="w-full translate-y-[25%] scale-y-150 rounded-xl bg-gray-900 bg-transparent text-center text-[2em] uppercase"
        name="camera-roll"
        value={value}
        onChange={onChange}
        onFocus={(e) => e.target.select()}
        autoCapitalize="characters"
      />
    </div>
  );
}
