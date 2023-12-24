import { MenuItem } from '@ariakit/react';
import { useCallback, useEffect, useState } from 'react';

import DeleteIcon from '@material-symbols/svg-400/rounded/delete.svg';

import { useInterval } from '@/lib/UseInterval';
import { clearVideoCache } from '@/recorder/cache/VideoCache';
import MenuStyle from '@/styles/Menu.module.css';
import { formatBytes } from '@/utils/StringFormat';

export default function ClearVideoCacheMenuItem() {
  const handleClick = useCallback(function handleClick() {
    if (window.confirm('Are you sure you want to clear ALL video cache?')) {
      clearVideoCache();
    }
  }, []);

  return (
    <MenuItem
      className={MenuStyle.menuItem + ' ' + 'flex flex-row fill-current'}
      onClick={handleClick}>
      <DeleteIcon className="h-full fill-current" />
      <div className="flex-1 flex flex-col">
        <span>Clear Video Cache</span>
        <VideoCacheUsageProgress />
      </div>
    </MenuItem>
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
    <div className={'relative flex' + ' ' + className}>
      <progress
        className="flex-1 rounded-full overflow-hidden"
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
