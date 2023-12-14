import {
  useCurrentDocumentId,
  useCurrentRecorder,
} from '@/stores/UserStoreContext';

import VideoBooth from '../recorder/VideoBooth';
import DocumentPanel from './DocumentPanel';
import MadeWithLove from './MadeWithLove';
import WelcomePanel from './WelcomePanel';

export default function Workspace() {
  const documentId = useCurrentDocumentId();
  const recorder = useCurrentRecorder();
  return (
    <>
      <div
        className={
          'absolute top-0 left-0 bottom-0 right-0 z-20 w-full h-full flex flex-col' +
          ' ' +
          (documentId ? 'hidden' : '')
        }>
        <WelcomePanel />
      </div>
      <div
        className={
          'absolute top-0 left-0 bottom-0 right-0 z-10 w-full h-full flex flex-col' +
          ' ' +
          (documentId && recorder.active ? '' : 'hidden')
        }>
        <VideoBooth />
      </div>
      <div
        className={
          'absolute top-0 left-0 bottom-0 right-0 z-0 w-full h-full flex flex-col' +
          ' ' +
          (documentId && !recorder.active ? '' : 'hidden')
        }>
        <DocumentPanel documentId={documentId} />
      </div>
      <MadeWithLove />
    </>
  );
}
