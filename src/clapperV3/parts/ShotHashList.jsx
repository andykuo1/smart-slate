import { SelectItem } from '@ariakit/react';
import { useShallow } from 'zustand/react/shallow';

import { getClapperById, useClapperStore } from '@/stores/clapper';
import SelectStyle from '@/styles/Select.module.css';

/**
 * @param {object} props
 * @param {import('@/stores/clapper/Store').ClapperId} props.clapperId
 * @param {string} props.shotHash
 */
export default function ShotHashList({ clapperId, shotHash }) {
  const shotHashes = useClapperStore(
    useShallow((ctx) =>
      Object.keys(getClapperById(ctx, clapperId)?.shotHashes ?? {}),
    ),
  );
  let result = [];
  for (let shotHash of shotHashes) {
    result.push(
      <SelectItem
        key={'shothash.' + shotHash}
        className={'whitespace-pre' + ' ' + SelectStyle.selectItem}
        value={shotHash}>
        #{shotHash}
      </SelectItem>,
    );
  }
  return result;
}
