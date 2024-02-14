import { useNavigate } from 'react-router-dom';

import ArrowBackIcon from '@material-symbols/svg-400/rounded/arrow_back.svg';

import FieldButton from '@/fields/FieldButton';
import { useCurrentDocumentId } from '@/stores/user';

export default function ToolboxNavigateBackButton() {
  const documentId = useCurrentDocumentId();
  const navigate = useNavigate();
  function onClick() {
    if (documentId) {
      navigate('/edit');
    } else {
      navigate('/');
    }
  }
  return (
    <FieldButton Icon={ArrowBackIcon} onClick={onClick}>
      Return home
    </FieldButton>
  );
}
