import PhotoIcon from '@material-symbols/svg-400/rounded/photo.svg';

import ImageWithCaption from '@/libs/ImageWithCaption';

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
      alt={title}
      Icon={PhotoIcon}>
      {children}
    </ImageWithCaption>
  );
}
