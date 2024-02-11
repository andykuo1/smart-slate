import ShotTextIcon from '@material-symbols/svg-400/rounded/table_rows.svg';
import ShotDayIcon from '@material-symbols/svg-400/rounded/view_array.svg';
import ShotImageIcon from '@material-symbols/svg-400/rounded/window.svg';

import FieldButton from '@/fields/FieldButton';
import { useUserStore } from '@/stores/user';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} [props.onClick]
 */
export default function SettingsSceneShotsDetailButton({ className, onClick }) {
  const shotListMode = useUserStore((ctx) => ctx.shotListMode);
  const setShotListMode = useUserStore((ctx) => ctx.setShotListMode);

  /**
   * @type {import('react').MouseEventHandler<HTMLButtonElement>}
   */
  function handleClick(e) {
    if (shotListMode === 'hidden') {
      setShotListMode('detail');
    } else if (shotListMode === 'detail') {
      setShotListMode('group');
    } else {
      setShotListMode('hidden');
    }
    onClick?.(e);
  }

  return (
    <FieldButton
      className={className}
      Icon={getShotListViewIcon(shotListMode)}
      title="Change shotlist view"
      onClick={handleClick}
    />
  );
}

/**
 * @param {string} mode
 */
function getShotListViewIcon(mode) {
  switch (mode) {
    case 'detail':
      return ShotTextIcon;
    case 'hidden':
      return ShotImageIcon;
    case 'group':
      return ShotDayIcon;
  }
}
