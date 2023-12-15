import { toScenShotTakeType } from '@/stores/DocumentStore';
import {
  useSceneNumber,
  useSetShotType,
  useShotNumber,
  useShotTakeCount,
  useShotType,
  useTakeNumber,
} from '@/stores/DocumentStoreContext';
import ShotTypes from '@/stores/ShotTypes';

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/DocumentStore').ShotId} props.shotId
 * @param {import('@/stores/DocumentStore').TakeId} [props.takeId]
 */
export default function ShotName({ documentId, sceneId, shotId, takeId = '' }) {
  const sceneNumber = useSceneNumber(documentId, sceneId);
  const shotNumber = useShotNumber(documentId, sceneId, shotId);
  const takeCount = useShotTakeCount(documentId, shotId);
  const takeIndex = useTakeNumber(documentId, shotId, takeId);
  const takeNumber = takeId ? takeIndex : takeCount + 1;

  const [SCENE, SHOT, TAKE, _] = toScenShotTakeType(
    sceneNumber,
    shotNumber,
    takeNumber,
  );

  return (
    <ShotNameLayout
      scene={() => SCENE}
      shot={() => SHOT}
      take={() => TAKE}
      type={() => <ShotTypesMore documentId={documentId} shotId={shotId} />}
    />
  );
}

/** @typedef {() => import('react').ReactNode} RenderProp */

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {RenderProp} [props.scene]
 * @param {RenderProp} [props.shot]
 * @param {RenderProp} [props.take]
 * @param {RenderProp} [props.type]
 */
function ShotNameLayout({ className, scene, shot, take, type = undefined }) {
  return (
    <table
      className={
        'relative text-center group flex flex-col items-center my-auto' +
        ' ' +
        className
      }>
      <tbody className="flex-1 w-full h-full flex">
        <tr className="flex-1 text-xl scale-y-125 whitespace-nowrap self-center">
          <td className="font-mono text-right">{scene?.()}</td>
          <td className="font-mono text-left">{shot?.()}</td>
          <td className="font-mono px-2">{take?.()}</td>
          <td className="font-mono">{type?.()}</td>
        </tr>
      </tbody>
      <tfoot className="absolute -bottom-4 w-full flex">
        <tr className="flex-1 text-xs select-none transition-opacity opacity-0 group-hover:opacity-30">
          <th className="font-normal">scene</th>
          <th className="font-normal">shot</th>
          <th className="font-normal px-2">take</th>
          <th className="font-normal">type</th>
        </tr>
      </tfoot>
    </table>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').ShotId} props.shotId
 */
function ShotTypesMore({ documentId, shotId }) {
  const shotType = useShotType(documentId, shotId);
  const setShotType = useSetShotType();

  /** @type {import('react').ChangeEventHandler<HTMLSelectElement>} */
  function onShotTypeChange(e) {
    let el = e.target;
    setShotType(
      documentId,
      shotId,
      /** @type {import('@/stores/DocumentStore').ShotType} */ (el.value),
    );
  }

  return (
    <select
      className="text-center bg-transparent"
      value={shotType}
      onChange={onShotTypeChange}>
      {ShotTypes.params().map((type) => (
        <option key={type.value} title={type.name} value={type.value}>
          {type.abbr}
        </option>
      ))}
    </select>
  );
}
