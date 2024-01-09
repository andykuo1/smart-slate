import { formatSceneShotNumber } from '../takes/TakeNameFormat';

/**
 * @param {object} props
 * @param {number} props.sceneNumber
 * @param {number} props.shotNumber
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} [props.onClick]
 */
export default function ShotNumber({ sceneNumber, shotNumber, onClick }) {
  return (
    <button
      className="px-2 font-mono opacity-30 rounded-full"
      onClick={onClick}>
      {formatSceneShotNumber(sceneNumber, shotNumber).substring(1)}
    </button>
  );
}
