/**
 * @param {object} props
 * @param {string} [props.className]
 */
export default function AppTitle({ className }) {
  return (
    <h1
      className={
        'px-[10vmin] pt-[10vmin]' +
        ' ' +
        'text-center text-6xl md:text-8xl lg:text-9xl' +
        ' ' +
        'pointer-events-none mb-4 whitespace-nowrap underline lg:mb-20' +
        ' ' +
        className
      }>
      &nbsp;[🗒️🎬🎥]&nbsp;
    </h1>
  );
}
