import { usePopoverContext } from '@ariakit/react';

import EditBlockIcon from '@material-symbols/svg-400/rounded/edit_note.svg';

import FieldButton from '@/fields/FieldButton';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').Dispatch<import('react').SetStateAction<Boolean>>} props.setEditable
 */
export default function BlockEditTextButton({ className, setEditable }) {
  const store = usePopoverContext();
  function onEditClick() {
    setEditable((prev) => !prev);
    store?.hide();
  }
  return (
    <FieldButton
      className={'w-auto rounded-full' + ' ' + className}
      title="Edit text"
      Icon={EditBlockIcon}
      onClick={onEditClick}
    />
  );
}
