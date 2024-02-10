import ShotTextIcon from '@material-symbols/svg-400/rounded/table_rows.svg';
import ShotImageIcon from '@material-symbols/svg-400/rounded/window.svg';

import SettingsFieldButton from '@/components/settings/SettingsFieldButton';
import { useUserStore } from '@/stores/user';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} [props.onClick]
 */
export default function SettingsSceneShotsDetailButton({ className, onClick }) {
  const shotListMode = useUserStore((ctx) => ctx.shotListMode);
  const setShotListMode = useUserStore((ctx) => ctx.setShotListMode);
  const hasActiveShot = false; // useUserStore((ctx) => Boolean(ctx.cursor?.shotId));

  /**
   * @type {import('react').MouseEventHandler<HTMLButtonElement>}
   */
  function handleClick(e) {
    if (shotListMode !== 'detail' || hasActiveShot) {
      setShotListMode('detail');
    } else {
      setShotListMode('hidden');
    }
    onClick?.(e);
  }

  return (
    <SettingsFieldButton
      className={className}
      Icon={shotListMode === 'detail' ? ShotTextIcon : ShotImageIcon}
      title="Change shotlist view"
      onClick={handleClick}>
      Change View
    </SettingsFieldButton>
  );
}
