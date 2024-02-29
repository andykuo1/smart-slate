import ShadowStyle from '@/styles/Shadow.module.css';

/**
 * @param {object} props
 * @param {string} [props.className]
 */
export default function FadedBorder({ className }) {
  return (
    <div
      className={
        'absolute bottom-0 left-0 right-0 top-0 rounded-xl' +
        ' ' +
        ShadowStyle.shadowInner1rem +
        ' ' +
        className
      }
    />
  );
}
