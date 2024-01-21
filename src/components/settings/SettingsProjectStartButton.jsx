import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import ArrowForwardIcon from '@material-symbols/svg-400/rounded/arrow_forward.svg';

import { useResolveDocumentProjectId } from '@/serdes/UseResolveDocumentProjectId';
import { useCurrentDocumentId } from '@/stores/user';

import SettingsFieldButton from './SettingsFieldButton';

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
    <SettingsFieldButton
      inverted={true}
      Icon={ArrowForwardIcon}
      onClick={onStart}>
      Start!
    </SettingsFieldButton>
  );
}
