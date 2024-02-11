import FiberManualRecordIcon from '@material-symbols/svg-400/rounded/fiber_manual_record-fill.svg';
import PostIcon from '@material-symbols/svg-400/rounded/post.svg';
import SubjectIcon from '@material-symbols/svg-400/rounded/subject.svg';
import VerticalSplitIcon from '@material-symbols/svg-400/rounded/vertical_split.svg';
import ViewDayIcon from '@material-symbols/svg-400/rounded/view_day.svg';

import FieldButtonAndMenu from '@/components/FieldButtonAndMenu';
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
  const EditModeIcon = getScreenplayViewIcon(editMode);
  const scrollIntoView = useScrollIntoView(containerRef);

  /** @param {ScreenplayView} mode */
  function changeView(mode) {
    setEditMode(mode);
    scrollIntoView();
  }

  return (
    <FieldButtonAndMenu
      title="Edit Mode"
      Icon={EditModeIcon}
      onClick={() =>
        changeView(
          editMode === 'inline'
            ? 'sequence'
            : editMode === 'sequence'
              ? 'shotonly'
              : editMode === 'shotonly'
                ? 'textonly'
                : editMode === 'textonly'
                  ? 'inline'
                  : 'inline',
        )
      }
      items={SCREEPLAY_VIEWS.map((mode) => (
        <SettingsFieldButton
          className="h-8 w-full text-right outline-none"
          title={mode}
          Icon={getScreenplayViewIcon(mode)}
          onClick={() => changeView(mode)}>
          <span className="ml-4 text-xs">
            {getScreenplayViewLocaleString(mode)}
          </span>
        </SettingsFieldButton>
      ))}
    />
  );
}

/** @typedef {'textonly'|'inline'|'sequence'|'shotonly'} ScreenplayView */

/** @type {Array<ScreenplayView>} */
const SCREEPLAY_VIEWS = ['textonly', 'inline', 'sequence', 'shotonly'];

/**
 * @param {string} editMode
 */
function getScreenplayViewLocaleString(editMode) {
  switch (editMode) {
    case 'textonly':
      return 'Text-only';
    case 'inline':
      return 'Inline';
    case 'sequence':
      return 'Sequence';
    case 'shotonly':
      return 'Shot-only';
    default:
      return 'Unknown';
  }
}

/**
 * @param {string} editMode
 */
function getScreenplayViewIcon(editMode) {
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
