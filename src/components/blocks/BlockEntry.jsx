import { useState } from 'react';

import ExpandLessIcon from '@material-symbols/svg-400/rounded/expand_less.svg';
import ExpandMoreIcon from '@material-symbols/svg-400/rounded/expand_more.svg';

import { useCurrentCursor } from '@/stores/user';

import ShotList from '../shots/ShotList';
import BlockContent from './BlockContent';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {boolean} [props.editable]
 */
export default function BlockEntry({
  documentId,
  sceneId,
  blockId,
  editable = true,
}) {
  const [open, setOpen] = useState(true);
  const hasActiveShot = Boolean(useCurrentCursor()?.shotId);
  return (
    <div>
      <div
        className={
          'relative overflow-y-hidden' + ' ' + (!open && 'max-h-[15vh]')
        }>
        <BlockContent
          documentId={documentId}
          blockId={blockId}
          editable={editable}
        />
        {!open && (
          <button
            className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent"
            onClick={() => setOpen(true)}>
            <span className="absolute bottom-0 left-0 right-0">
              <ExpandMoreIcon className="mx-auto w-6 h-6 fill-current" />
              Edit?
            </span>
          </button>
        )}
      </div>
      <fieldset>
        {open && (
          <button className="w-full" onClick={() => setOpen(false)}>
            <ExpandLessIcon className="mx-auto w-6 h-6 fill-current" />
            Ready?
          </button>
        )}
        <legend className="hidden">Shot list</legend>
        <ShotList
          documentId={documentId}
          sceneId={sceneId}
          blockId={blockId}
          editable={open && editable}
          collapsed={open && !hasActiveShot}
        />
      </fieldset>
    </div>
  );
}
