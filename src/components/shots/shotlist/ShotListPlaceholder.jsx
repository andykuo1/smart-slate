/**
 * @param {object} props
 * @param {number} props.height
 * @param {import('react').MouseEventHandler<HTMLDivElement>} props.onClick
 */
export default function ShotListPlaceholder({ height, onClick }) {
  return (
    <div
      style={{ minHeight: '2rem', height: `${height}px` }}
      className="w-full rounded-xl bg-white text-center opacity-30 outline outline-gray-300 dark:bg-gray-900"
      onClick={onClick}>
      <span className="pointer-events-none">Loading...</span>
    </div>
  );
}
