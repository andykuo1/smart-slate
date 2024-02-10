import FiberManualRecordIcon from '@material-symbols/svg-400/rounded/fiber_manual_record-fill.svg';
import PostIcon from '@material-symbols/svg-400/rounded/post.svg';
import SubjectIcon from '@material-symbols/svg-400/rounded/subject.svg';
import VerticalSplitIcon from '@material-symbols/svg-400/rounded/vertical_split.svg';
import ViewDayIcon from '@material-symbols/svg-400/rounded/view_day.svg';

import { useScrollIntoView } from '@/libs/UseScrollIntoView';
import { useUserStore } from '@/stores/user';

import SettingsFieldButton from '../settings/SettingsFieldButton';

/**
 * @param {object} props
 * @param {import('react').RefObject<HTMLDivElement>} props.containerRef
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 */
export default function SceneCollapse({ containerRef }) {
  const editMode = useUserStore((ctx) => ctx.editMode);
  const setEditMode = useUserStore((ctx) => ctx.setEditMode);
  const EditModeIcon = getEditModeIcon(editMode);
  const scrollIntoView = useScrollIntoView(containerRef);

  function onClick() {
    setEditMode(
      editMode === 'inline'
        ? 'sequence'
        : editMode === 'sequence'
          ? 'shotonly'
          : editMode === 'shotonly'
            ? 'textonly'
            : editMode === 'textonly'
              ? 'inline'
              : 'inline',
    );
    scrollIntoView();
  }

  return (
    <div className="flex flex-row">
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
    case 'textonly':
      return SubjectIcon;
    case 'shotonly':
      return PostIcon;
    default:
      return FiberManualRecordIcon;
  }
}
