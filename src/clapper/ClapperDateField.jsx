import { useCallback, useEffect, useState } from 'react';

import { useInterval } from '@/libs/UseInterval';
import { formatYearMonthDay } from '@/utils/StringFormat';

export default function ClapperDateString() {
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

  return <output className="uppercase">{dateString}</output>;
}
