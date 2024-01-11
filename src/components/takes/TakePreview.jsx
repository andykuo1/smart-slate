import VideoFileIcon from '@material-symbols/svg-400/rounded/video_file.svg';

import ImageWithCaption from '@/libs/ImageWithCaption';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {string} props.previewImage
 * @param {string} props.title
 * @param {string} props.caption
 * @param {import('react').FC<any>} [props.Icon]
 * @param {import('react').ReactNode} [props.children]
 */
export default function TakePreview({
  className,
  previewImage,
  title,
  caption,
  Icon = VideoFileIcon,
  children,
}) {
  return (
    <ImageWithCaption
      className={'w-32 h-[4.5rem]' + ' ' + className}
      src={previewImage}
      alt={title}
      caption={caption}
      Icon={Icon}>
      {children}
    </ImageWithCaption>
  );
}
