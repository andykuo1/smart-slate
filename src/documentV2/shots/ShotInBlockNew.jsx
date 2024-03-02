import AddIcon from '@material-symbols/svg-400/rounded/add.svg';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').MutableRefObject<HTMLFieldSetElement|null>} [props.containerRef]
 * @param {import('react').MouseEventHandler<any>} props.onClick
 * @param {import('react').ReactNode} [props.children]
 */
export default function ShotInBlockNew({
  className,
  containerRef,
  onClick,
  children,
}) {
  return (
    <fieldset
      className={
        'relative mx-auto flex w-[2.5in] flex-col overflow-hidden' +
        ' ' +
        className
      }
      onClick={onClick}>
      {/* NOTE: width-3in is closest to smallest supported screen at 320px (about 3.2in by CSS standard). */}
      <legend className="float-left flex w-full overflow-hidden whitespace-nowrap text-center">
        <div className="w-[4rem]">(--)</div>
        <div className="flex-1" />
        <div className="w-[4rem]">--</div>
      </legend>
      <div
        className={
          'mx-4 my-3 flex aspect-video items-center text-gray-500 outline outline-2 -outline-offset-1 outline-gray-300'
        }>
        <AddIcon className="mx-auto h-10 w-10 fill-current" />
      </div>
      {children}
    </fieldset>
  );
}
