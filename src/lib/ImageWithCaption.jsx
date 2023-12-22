import AddPhotoAltIcon from '@material-symbols/svg-400/rounded/add_photo_alternate.svg';
import PhotoIcon from '@material-symbols/svg-400/rounded/photo.svg';

/**
 * @param {object} props
 * @param {string} props.src
 * @param {string} props.alt
 * @param {string} [props.className]
 * @param {'add'} [props.usage]
 */
export default function ImageWithCaption({ className, src, alt, usage }) {
  const Icon = getIconByUsage(usage);
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
      <figcaption className="absolute right-2 bottom-0 text-right [text-shadow:_-1px_-1px_2px_white,_-1px_1px_2px_white,_1px_1px_2px_white,_1px_-1px_2px_white]">
        {alt}
      </figcaption>
    </figure>
  );
}

/**
 * @param {'add'} [usage]
 */
function getIconByUsage(usage) {
  switch (usage) {
    case 'add':
      return AddPhotoAltIcon;
    default:
      return PhotoIcon;
  }
}
