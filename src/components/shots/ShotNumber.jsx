/**
 * @param {object} props
 * @param {number} props.sceneNumber
 * @param {number} props.shotNumber
 */
export default function ShotNumber({ sceneNumber, shotNumber }) {
  const scenePart =
    sceneNumber < 0 ? '??' : String(sceneNumber).padStart(2, '0');
  const shotPart = shotNumberToChar(shotNumber);
  return (
    <span className="px-2 font-mono opacity-30 rounded-full">
      {scenePart + '' + shotPart}
    </span>
  );
}

const SHOT_CHARACTERS = 'Z'.charCodeAt(0) - 'A'.charCodeAt(0);

/**
 * @param {number} shotNumber
 */
export function shotNumberToChar(shotNumber) {
  if (!Number.isFinite(shotNumber)) {
    return '-';
  }
  let result = '';
  if (shotNumber > SHOT_CHARACTERS) {
    result = shotNumberToChar(Math.floor(shotNumber / SHOT_CHARACTERS));
    shotNumber = shotNumber % SHOT_CHARACTERS;
  }
  return result + String.fromCharCode('A'.charCodeAt(0) + (shotNumber - 1));
}
