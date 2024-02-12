import UploadIcon from '@material-symbols/svg-400/rounded/upload.svg';

import { useSingleFileInput } from '@/libs/UseSingleFileInput';

import FieldButton from './FieldButton';

/**
 * @param {object} props
 * @param {string} props.title
 * @param {string} props.accept
 * @param {import('@/libs/UseSingleFileInput').SingleFileInputChangeHandler} props.onChange
 * @param {boolean} props.disabled
 * @param {import('react').ReactNode} [props.children]
 */
export default function FieldUploadFile({
  accept,
  title = 'Upload file',
  onChange,
  disabled = !onChange,
  children = 'Upload file',
}) {
  const [render, click] = useSingleFileInput(accept, onChange);
  return (
    <>
      <FieldButton
        title={title}
        Icon={UploadIcon}
        onClick={click}
        disabled={disabled}>
        {children}
      </FieldButton>
      {render()}
    </>
  );
}
