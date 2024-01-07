import { formatSceneShotNumber } from '../takes/TakeNameFormat';

/**
 * @param {object} props
 * @param {number} props.sceneNumber
 * @param {number} props.shotNumber
 */
export default function ShotNumber({ sceneNumber, shotNumber }) {
  return (
    <span className="px-2 font-mono opacity-30 rounded-full">
      {formatSceneShotNumber(sceneNumber, shotNumber).substring(1)}
    </span>
  );
}
