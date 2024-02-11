import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import ArrowForwardIcon from '@material-symbols/svg-400/rounded/arrow_forward.svg';

import { useResolveDocumentProjectId } from '@/serdes/UseResolveDocumentProjectId';
import { useCurrentDocumentId } from '@/stores/user';

import FieldButton from '../../fields/FieldButton';

export default function SettingsProjectStartButton() {
  const navigate = useNavigate();

  const documentId = useCurrentDocumentId();
  const resolveDocumentProjectId = useResolveDocumentProjectId();

  const onStart = useCallback(
    function _onStart() {
      resolveDocumentProjectId(documentId);
      navigate('/edit');
    },
    [documentId, resolveDocumentProjectId, navigate],
  );

  return (
    <FieldButton inverted={true} Icon={ArrowForwardIcon} onClick={onStart}>
      Start!
    </FieldButton>
  );
}
