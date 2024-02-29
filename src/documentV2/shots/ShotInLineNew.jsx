import AddIcon from '@material-symbols/svg-400/rounded/add.svg';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').MutableRefObject<HTMLFieldSetElement|null>} [props.containerRef]
 * @param {import('react').MouseEventHandler<any>} props.onClick
 * @param {import('react').ReactNode} [props.children]
 */
export default function ShotInLineNew({
  className,
  containerRef,
  onClick,
  children,
}) {
  return (
    <fieldset
      ref={containerRef}
      className={
        'relative flex h-12 w-full flex-row items-center gap-4 px-4' +
        ' ' +
        className
      }
      onClick={onClick}>
      <div className="flex-1 border-t-2 border-current opacity-30" />
      <AddIcon className="h-6 w-6 fill-current" />
      <div className="flex-1 border-t-2 border-current opacity-30" />
      {children}
    </fieldset>
  );
}
