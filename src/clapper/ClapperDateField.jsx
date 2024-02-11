import { useCallback, useEffect, useState } from 'react';

import { useInterval } from '@/libs/UseInterval';
import { formatYearMonthDay } from '@/utils/StringFormat';

/**
 * @param {object} props
 * @param {string} [props.className]
 */
export default function ClapperDateString({ className }) {
  const [dateString, setDateString] = useState('----/--/--');

  const onInterval = useCallback(
    function _onInterval() {
      setDateString(formatYearMonthDay(new Date()));
    },
    [setDateString],
  );
  useInterval(onInterval, 1_000);
  // NOTE: Run once at the start.
  useEffect(onInterval, [onInterval]);

  return (
    <output
      style={{ lineHeight: '1em' }}
      className={'my-[1px] uppercase' + ' ' + className}>
      {dateString}
    </output>
  );
}
