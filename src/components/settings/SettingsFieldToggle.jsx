import ToggleOff from '@material-symbols/svg-400/rounded/toggle_off.svg';
import ToggleOn from '@material-symbols/svg-400/rounded/toggle_on-fill.svg';

import SettingsFieldButton from './SettingsFieldButton';

/**
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 * @param {string} [props.className]
 * @param {boolean} [props.value]
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} [props.onClick]
 * @param {boolean} [props.disabled]
 */
export default function SettingsFieldToggle({
  className,
  children,
  value,
  onClick,
  disabled = !onClick,
}) {
  return (
    <SettingsFieldButton
      className={'w-full' + ' ' + className}
      onClick={onClick}
      Icon={value ? ToggleOn : ToggleOff}
      disabled={disabled}>
      {children}
    </SettingsFieldButton>
  );
}
