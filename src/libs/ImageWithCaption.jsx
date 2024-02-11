/**
 * @param {object} props
 * @param {string} props.src
 * @param {string} props.alt
 * @param {import('react').FC<any>|null} props.Icon
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
      }
      title={alt}>
      {src ? (
        <img
          className="flex-1 object-contain"
          src={src}
          alt={alt}
          loading="lazy"
        />
      ) : Icon ? (
        <Icon className="flex-1 fill-gray-400 dark:fill-gray-800" />
      ) : null}
      {caption && (
        <figcaption className="absolute bottom-0 right-2 text-right font-mono [text-shadow:_-1px_-1px_2px_white,_-1px_1px_2px_white,_1px_1px_2px_white,_1px_-1px_2px_white]">
          {caption}
        </figcaption>
      )}
      {children}
    </figure>
  );
}
