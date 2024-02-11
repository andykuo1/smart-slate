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
        'md:text-8xl lg:text-9xl text-center text-6xl' +
        ' ' +
        'lg:mb-20 pointer-events-none mb-4 whitespace-nowrap underline' +
        ' ' +
        className
      }>
      &nbsp;[🗒️🎬🎥]&nbsp;
    </h1>
  );
}
