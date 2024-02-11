import { useSceneNumber } from '@/serdes/UseResolveSceneNumber';
import { useShotNumber } from '@/serdes/UseResolveShotNumber';
import { useTakeNumber } from '@/serdes/UseResolveTakeNumber';
import { useSetShotType, useShotType } from '@/stores/document';
import { useShotTakeCount } from '@/stores/document/use';
import { SHOT_TYPES } from '@/stores/document/value';

import {
  formatSceneNumber,
  formatShotNumber,
  formatTakeNumber,
} from '../takes/TakeNameFormat';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {import('@/stores/document/DocumentStore').TakeId} [props.takeId]
 * @param {boolean} [props.editable]
 */
export default function ShotName({
  documentId,
  sceneId,
  shotId,
  takeId = '',
  editable = false,
}) {
  const sceneNumber = useSceneNumber(documentId, sceneId);
  const shotNumber = useShotNumber(documentId, sceneId, shotId);
  const shotType = useShotType(documentId, shotId);
  const takeCount = useShotTakeCount(documentId, shotId);
  const takeIndex = useTakeNumber(documentId, shotId, takeId);
  const takeNumber = takeId ? takeIndex : takeCount + 1;
  return (
    <ShotNameLayout
      scene={() => formatSceneNumber(sceneNumber, false)}
      shot={() => formatShotNumber(shotNumber)}
      take={() => formatTakeNumber(takeNumber)}
      type={() =>
        editable ? (
          <ShotTypesMore documentId={documentId} shotId={shotId} />
        ) : (
          shotType
        )
      }
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
        'group relative my-auto flex flex-col items-center text-center' +
        ' ' +
        className
      }>
      <tbody className="flex h-full w-full flex-1">
        <tr className="flex-1 scale-y-125 self-center whitespace-nowrap text-xl">
          <td className="text-right font-mono">{scene?.()}</td>
          <td className="text-left font-mono">{shot?.()}</td>
          <td className="px-2 font-mono">{take?.()}</td>
          <td className="font-mono">{type?.()}</td>
        </tr>
      </tbody>
      <tfoot className="absolute -bottom-3 flex w-full">
        <tr className="flex-1 select-none text-xs opacity-0 transition-opacity group-hover:opacity-30">
          <th className="font-normal">scene</th>
          <th className="font-normal">shot</th>
          <th className="px-2 font-normal">take</th>
          <th className="font-normal">type</th>
        </tr>
      </tfoot>
    </table>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 */
function ShotTypesMore({ documentId, shotId }) {
  const shotType = useShotType(documentId, shotId);
  const setShotType = useSetShotType();

  /** @type {import('react').ChangeEventHandler<HTMLSelectElement>} */
  function onShotTypeChange(e) {
    let el = e.target;
    setShotType(documentId, shotId, el.value);
  }

  return (
    <select
      className="-mx-1 bg-transparent text-center"
      value={shotType}
      onChange={onShotTypeChange}>
      {SHOT_TYPES.map((shotType) => (
        <option key={shotType} title={shotType} value={shotType}>
          {shotType}
        </option>
      ))}
    </select>
  );
}
