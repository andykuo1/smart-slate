/**
 * @param {object} props
 * @param {number} props.height
 */
export default function ScenePlaceholder({ height }) {
  return (
    /* Placeholder container */
    <div
      style={{ height: `${height}px` }}
      className="w-full bg-white dark:bg-gray-900"
    />
  );
}
