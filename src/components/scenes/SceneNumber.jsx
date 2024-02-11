/**
 * @param {object} props
 * @param {number} props.sceneNumber
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} [props.onClick]
 */
export default function SceneNumber({ sceneNumber, onClick }) {
  const result = sceneNumber < 0 ? '??' : String(sceneNumber).padStart(2, '0');
  return (
    <button
      className="rounded-full px-2 font-mono text-xl font-bold opacity-30"
      onClick={onClick}>
      {result}
    </button>
  );
}
