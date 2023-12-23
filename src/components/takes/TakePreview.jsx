import ImageWithCaption from '@/lib/ImageWithCaption';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {string} props.previewImage
 * @param {string} props.title
 * @param {import('react').ReactNode} [props.children]
 */
export default function TakePreview({
  className,
  previewImage,
  title,
  children,
}) {
  return (
    <ImageWithCaption
      className={'w-32 h-[4.5rem]' + ' ' + className}
      src={previewImage}
      alt={title}>
      {children}
    </ImageWithCaption>
  );
}
