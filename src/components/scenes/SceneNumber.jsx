/**
 * @param {object} props
 * @param {number} props.sceneNumber
 */
export default function SceneNumber({ sceneNumber }) {
  const result = sceneNumber < 0 ? '??' : String(sceneNumber).padStart(2, '0');
  return (
    <span className="px-2 font-mono opacity-30 rounded-full">{result}</span>
  );
}
