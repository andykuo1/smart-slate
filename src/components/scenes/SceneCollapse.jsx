import { useRef } from 'react';

import FiberManualRecordIcon from '@material-symbols/svg-400/rounded/fiber_manual_record-fill.svg';
import VerticalSplitIcon from '@material-symbols/svg-400/rounded/vertical_split.svg';
import ViewDayIcon from '@material-symbols/svg-400/rounded/view_day.svg';

import { useUserStore } from '@/stores/user';

import SettingsFieldButton from '../settings/SettingsFieldButton';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 */
export default function SceneCollapse({ documentId, sceneId }) {
  const containerRef = useRef(/** @type {HTMLDivElement|null} */ (null));
  const editMode = useUserStore((ctx) => ctx.editMode);
  const setEditMode = useUserStore((ctx) => ctx.setEditMode);
  const EditModeIcon = getEditModeIcon(editMode);

  function onClick() {
    setEditMode(editMode === 'inline' ? 'sequence' : 'inline');
    // Debounce to wait for layout changes...
    setTimeout(
      () =>
        containerRef.current?.scrollIntoView({
          block: 'start',
          behavior: 'instant',
        }),
      0,
    );
  }
  return (
    <div ref={containerRef} className="flex flex-row">
      <SettingsFieldButton Icon={EditModeIcon} onClick={onClick} />
    </div>
  );
}

/**
 * @param {string} editMode
 */
function getEditModeIcon(editMode) {
  switch (editMode) {
    case 'inline':
      return ViewDayIcon;
    case 'sequence':
      return VerticalSplitIcon;
    default:
      return FiberManualRecordIcon;
  }
}
