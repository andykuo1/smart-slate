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
  title = 'Open directory on local device',
  onChange,
  disabled,
  children = 'Open directory',
}) {
  async function onClick() {
    const files = await openDirectory();
    if (!files) {
      return;
    }
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
