import ShadowStyle from '@/styles/Shadow.module.css';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {string} props.width
 */
export default function LetterboxOutline({ className, width }) {
  return (
    <div
      style={{
        width,
      }}
      className={
        'absolute bottom-0 left-0 right-0 top-0 m-auto outline outline-1 outline-black' +
        ' ' +
        'aspect-video' +
        ' ' +
        ShadowStyle.shadowOutline +
        ' ' +
        className
      }
    />
  );
}
