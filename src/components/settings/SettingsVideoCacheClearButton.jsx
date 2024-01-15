import { useCallback, useEffect, useState } from 'react';

import DeleteIcon from '@material-symbols/svg-400/rounded/delete.svg';

import { useInterval } from '@/libs/UseInterval';
import { clearVideoCache } from '@/recorder/cache/VideoCache';
import { useCurrentDocumentId } from '@/stores/user';
import { formatBytes } from '@/utils/StringFormat';

import SettingsFieldButton from './SettingsFieldButton';

export default function SettingsVideoCacheClearButton() {
  const documentId = useCurrentDocumentId();
  const handleClick = useCallback(
    function handleClick() {
      if (window.confirm('Are you sure you want to clear ALL video cache?')) {
        clearVideoCache(documentId);
      }
    },
    [documentId],
  );

  return (
    <SettingsFieldButton Icon={DeleteIcon} onClick={handleClick}>
      <div className="flex-1 px-2 flex flex-col">
        <span>Clear video cache</span>
        <VideoCacheUsageProgress />
      </div>
    </SettingsFieldButton>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 */
function VideoCacheUsageProgress({ className }) {
  const [usage, setUsage] = useState(0);
  const [quota, setQuota] = useState(0);
  const onInterval = useCallback(function _onInterval() {
    if (typeof window === 'undefined' || !window.navigator?.storage) {
      return;
    }
    navigator.storage.estimate().then((result) => {
      setUsage(Number(result.usage));
      setQuota(Number(result.quota));
    });
  }, []);
  useInterval(onInterval, 10_000);
  useEffect(onInterval, [onInterval]);

  const percent =
    (quota > 0 ? Math.max(Number(usage / quota), 0.01).toFixed(2) : '--') + '%';
  return (
    <div className={'relative flex items-center' + ' ' + className}>
      <progress
        className="flex-1 rounded-full overflow-hidden h-6"
        value={usage}
        max={quota}
      />
      <output className="absolute left-2 font-mono text-white text-xs">
        {percent}
      </output>
      <output className="absolute right-2 font-mono text-white text-xs">
        {formatBytes(usage)}/{formatBytes(quota)}
      </output>
    </div>
  );
}
