import FolderOpenIcon from '@material-symbols/svg-400/rounded/folder_open.svg';

import { openDirectory } from '@/scanner/DirectoryPicker';

import FieldButton from './FieldButton';

/**
 * @param {object} props
 * @param {(files: Array<import('@/scanner/DirectoryPicker').FileWithHandles>) => void} props.onChange
 * @param {string} [props.title]
 * @param {boolean} [props.disabled]
 * @param {import('react').ReactNode} [props.children]
 */
export default function FieldOpenDirectoryInput({
  title = 'Select directory on local device',
  onChange,
  disabled,
  children = 'Select directory',
}) {
  async function onClick() {
    let files = await openDirectory();
    if (!files) {
      return;
    }
    // NOTE: Removes any hidden files (starting with '.')
    files = files.filter((file) => !file.name.startsWith('.'));
    onChange(files);
  }
  return (
    <FieldButton
      Icon={FolderOpenIcon}
      title={title}
      onClick={onClick}
      disabled={disabled}>
      {children}
    </FieldButton>
  );
}
