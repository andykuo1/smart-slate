/**
 * @param {object} props
 * @param {string} props.src
 * @param {string} props.alt
 * @param {import('react').FC<any>} props.Icon
 * @param {string} [props.caption]
 * @param {string} [props.className]
 * @param {import('react').ReactNode} [props.children]
 */
export default function ImageWithCaption({
  className,
  src,
  alt,
  caption,
  children,
  Icon,
}) {
  return (
    <figure
      className={
        'relative flex items-center overflow-hidden whitespace-nowrap' +
        ' ' +
        className
      }>
      {src ? (
        <img className="flex-1 object-contain" src={src} alt={alt} />
      ) : (
        <Icon className="flex-1 fill-gray-400" />
      )}
      {caption && (
        <figcaption className="absolute right-2 bottom-0 text-right font-mono [text-shadow:_-1px_-1px_2px_white,_-1px_1px_2px_white,_1px_1px_2px_white,_1px_-1px_2px_white]">
          {caption}
        </figcaption>
      )}
      {children}
    </figure>
  );
}
