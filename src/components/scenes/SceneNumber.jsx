/**
 * @param {object} props
 * @param {number} props.sceneNumber
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} [props.onClick]
 */
export default function SceneNumber({ sceneNumber, onClick }) {
  const result = sceneNumber < 0 ? '??' : String(sceneNumber).padStart(2, '0');
  return (
    <button
      className="px-2 font-mono opacity-30 rounded-full"
      onClick={onClick}>
      {result}
    </button>
  );
}
