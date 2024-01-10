import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import AddIcon from '@material-symbols/svg-400/rounded/add-fill.svg';

import ChangelogButton from '@/buttons/ChangelogButton';
import ImportProjectButton from '@/buttons/ImportProjectButton';
import ProfileButton from '@/buttons/ProfileButton';
import FancyButton from '@/libs/FancyButton';
import HorizontallyScrollableDiv from '@/libs/HorizontallyScrollableDiv';
import {
  useDocumentIds,
  useDocumentLastUpdatedMillis,
  useDocumentStore,
} from '@/stores/document';
import { getDocumentById } from '@/stores/document';
import { createDocument } from '@/stores/document/DocumentStore';
import { useSetUserCursor } from '@/stores/user';

import AppTitle from './AppTitle';

export default function WelcomePanel() {
  const addDocument = useDocumentStore((ctx) => ctx.addDocument);
  const setUserCursor = useSetUserCursor();
  const navigate = useNavigate();

  const onNewProjectClick = useCallback(
    function onNewProjectClick() {
      let newDocument = createDocument();
      newDocument.documentTitle = 'My Movie';
      newDocument.lastUpdatedMillis = Date.now();
      addDocument(newDocument);
      setUserCursor(newDocument.documentId, '', '', '');
      navigate('/settings');
    },
    [addDocument, setUserCursor, navigate],
  );

  return (
    <>
      <AppTitle />
      <div className="flex flex-row text-center mx-auto">
        <ProfileButton />
        <FancyButton
          title="New Project"
          className="mx-1 px-12"
          onClick={onNewProjectClick}>
          <AddIcon className="inline w-6 fill-current" />
        </FancyButton>
        <ImportProjectButton />
        <ChangelogButton />
      </div>
      <SavedProjectView className="mx-auto mb-auto" />
    </>
  );
}

/**
 * @param {object} props
 * @param {string} props.className
 */
function SavedProjectView({ className }) {
  const documentIds = useDocumentIds();
  if (documentIds.length <= 0) {
    return (
      <label className={'mx-auto my-2 text-gray-400' + ' ' + className}>
        Pick one to get started!
      </label>
    );
  }
  return (
    <>
      <label className="mx-auto my-2 text-gray-400">
        Or open an existing project...
      </label>
      <HorizontallyScrollableDiv
        className={
          'w-[60%] max-w-[60%] rounded-xl bg-black border-x-8 border-y-4 border-black' +
          ' ' +
          className
        }>
        <ul className={'flex flex-row'}>
          <div className="flex-1 min-w-[2rem] text-white text-right my-auto">
            |
          </div>
          {documentIds.map((documentId) => (
            <SavedProjectItem key={documentId} documentId={documentId} />
          ))}
          <div className="flex-1 min-w-[2rem] text-white text-left my-auto">
            |
          </div>
        </ul>
      </HorizontallyScrollableDiv>
    </>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
function SavedProjectItem({ documentId }) {
  const title = useDocumentStore(
    (ctx) => getDocumentById(ctx, documentId)?.documentTitle,
  );
  const millis = useDocumentLastUpdatedMillis(documentId);
  const setUserCursor = useSetUserCursor();
  const navigate = useNavigate();

  const onClick = useCallback(
    function onClick() {
      setUserCursor(documentId, '', '', '');
      navigate('/edit');
    },
    [documentId, setUserCursor, navigate],
  );

  const titleWithPlaceholder = title || 'Untitled';

  return (
    <li
      className={
        'overflow-hidden text-center w-[8rem] min-w-[8rem] max-w-[8rem]' +
        ' ' +
        'bg-gray-100 rounded-xl mx-2 my-4 p-2' +
        ' ' +
        'transition-transform hover:-translate-y-1 hover:bg-white hover:cursor-pointer'
      }
      title={`Open "${titleWithPlaceholder}" Project`}
      onClick={onClick}>
      <div className="flex flex-col">
        <h3 className="text-gray-300">Open</h3>
        <p>{titleWithPlaceholder}</p>
        <p className="text-gray-400">{new Date(millis).toLocaleString()}</p>
      </div>
    </li>
  );
}
