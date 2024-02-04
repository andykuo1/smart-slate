/**
 * @param {object} props
 * @param {string} [props.className]
 */
export default function AppTitle({ className }) {
  return (
    <h1
      className={
        'pt-[10vmin] px-[10vmin]' +
        ' ' +
        'text-center text-6xl md:text-8xl lg:text-9xl' +
        ' ' +
        'underline pointer-events-none whitespace-nowrap mb-4 lg:mb-20' +
        ' ' +
        className
      }>
      &nbsp;[🗒️🎬🎥]&nbsp;
    </h1>
  );
}
