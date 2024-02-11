import GridViewIcon from '@material-symbols/svg-400/rounded/grid_view.svg';

import FieldButton from '@/fields/FieldButton';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {boolean} props.inverted
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} props.onClick
 */
export default function DrawerButton({ className, inverted, onClick }) {
  return (
    <FieldButton
      className={
        'pointer-events-auto z-10 rounded-full p-2 shadow-md' +
        ' ' +
        (inverted ? 'bg-black' : 'bg-white') +
        ' ' +
        className
      }
      inverted={inverted}
      Icon={GridViewIcon}
      onClick={onClick}
    />
  );
}
