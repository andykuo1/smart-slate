import ToggleOff from '@material-symbols/svg-400/rounded/toggle_off.svg';
import ToggleOn from '@material-symbols/svg-400/rounded/toggle_on-fill.svg';

import FieldButton from './FieldButton';

/**
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 * @param {string} [props.className]
 * @param {boolean} [props.value]
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} [props.onClick]
 * @param {boolean} [props.disabled]
 */
export default function FieldToggle({
  className,
  children,
  value,
  onClick,
  disabled = !onClick,
}) {
  return (
    <FieldButton
      className={'w-full' + ' ' + className}
      onClick={onClick}
      Icon={value ? ToggleOn : ToggleOff}
      disabled={disabled}>
      {children}
    </FieldButton>
  );
}
