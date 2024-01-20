import HorizontallySnappableDiv from '@/libs/HorizontallySnappableDiv';
import { useTake } from '@/stores/document';

import { getListDecorationStyleByViewMode } from './TakeListViewMode';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').TakeId} props.takeId
 * @param {'inline'|'list'} props.viewMode
 */
export default function TakeEntryDetails({
  className,
  documentId,
  takeId,
  viewMode,
}) {
  const { exportDetails } = useTake(documentId, takeId) || {};
  const { fileName, timestampMillis } = exportDetails || {};
  const listDecorationStyle = getListDecorationStyleByViewMode(viewMode);
  return (
    <HorizontallySnappableDiv className={listDecorationStyle}>
      {/* PANEL 1 */}
      <div className="flex-1 flex flex-row">
        <p className="flex-1 opacity-30 whitespace-nowrap overflow-x-auto text-center">
          {!timestampMillis || timestampMillis <= 0
            ? '--'
            : new Date(timestampMillis).toLocaleString()}
        </p>
      </div>
      {/* PANEL 2 */}
      <div className="flex-1 flex flex-row">
        <p className="flex-1 opacity-30 overflow-x-auto text-center">
          {fileName}
        </p>
      </div>
    </HorizontallySnappableDiv>
  );
}
