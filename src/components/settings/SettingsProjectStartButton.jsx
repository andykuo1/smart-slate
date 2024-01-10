import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import ArrowForwardIcon from '@material-symbols/svg-400/rounded/arrow_forward.svg';

import {
  getDocumentById,
  getDocumentSettingsById,
  useDocumentStore,
} from '@/stores/document';
import { useCurrentDocumentId } from '@/stores/user';

import { formatProjectId } from '../takes/TakeNameFormat';
import SettingsFieldButton from './SettingsFieldButton';

export default function SettingsProjectStartButton() {
  const navigate = useNavigate();

  const documentId = useCurrentDocumentId();
  const documentTitle = useDocumentStore(
    (ctx) => getDocumentById(ctx, documentId)?.documentTitle,
  );
  const documentSettingsProjectId = useDocumentStore(
    (ctx) => getDocumentSettingsById(ctx, documentId)?.projectId,
  );
  const setDocumentSettingsProjectId = useDocumentStore(
    (ctx) => ctx.setDocumentSettingsProjectId,
  );

  const onStart = useCallback(
    function _onStart() {
      if (!documentSettingsProjectId) {
        const defaultProjectId = formatProjectId(documentTitle);
        setDocumentSettingsProjectId(documentId, defaultProjectId);
      }
      navigate('/edit');
    },
    [
      documentId,
      documentSettingsProjectId,
      documentTitle,
      setDocumentSettingsProjectId,
      navigate,
    ],
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
