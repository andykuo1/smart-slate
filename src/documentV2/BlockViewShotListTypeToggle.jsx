import ShotUnknownIcon from '@material-symbols/svg-400/rounded/help.svg';
import ShotTextIcon from '@material-symbols/svg-400/rounded/table_rows.svg';
import ShotDayIcon from '@material-symbols/svg-400/rounded/view_array.svg';
import ShotImageIcon from '@material-symbols/svg-400/rounded/window.svg';

import FieldButton from '@/fields/FieldButton';
import { useUserStore } from '@/stores/user';
import { getDocumentEditorBlockViewOptions } from '@/stores/user/EditorAccessor';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} [props.onClick]
 */
export default function BlockViewShotListTypeToggle({
  className,
  blockId,
  onClick,
}) {
  const shotListType = useUserStore(
    (ctx) =>
      getDocumentEditorBlockViewOptions(ctx, blockId)?.shotListType || '',
  );
  const setShotListType = useUserStore(
    (ctx) => ctx.setDocumentEditorBlockViewShotListType,
  );

  /**
   * @type {import('react').MouseEventHandler<HTMLButtonElement>}
   */
  function handleClick(e) {
    if (shotListType !== 'grid') {
      setShotListType(blockId, 'grid');
    } else {
      setShotListType(blockId, 'list');
    }
    onClick?.(e);
  }

  return (
    <FieldButton
      className={className}
      Icon={getShotListTypeIcon(shotListType)}
      title="Change shotlist view"
      onClick={handleClick}
    />
  );
}

/**
 * @param {import('@/stores/user/EditorStore').BlockViewShotListType} shotListType
 */
function getShotListTypeIcon(shotListType) {
  switch (shotListType) {
    case '':
    case 'list':
      return ShotTextIcon;
    case 'grid':
      return ShotImageIcon;
    case 'group':
      return ShotDayIcon;
    default:
      return ShotUnknownIcon;
  }
}
