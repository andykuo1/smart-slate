import { useLocation, useNavigate } from 'react-router-dom';

import EditSquareIcon from '@material-symbols/svg-400/rounded/edit_square.svg';
import MovieIcon from '@material-symbols/svg-400/rounded/movie.svg';

import DrawerLayout from '@/app/DrawerLayout';
import { useFullscreen } from '@/libs/fullscreen';
import { useUserStore } from '@/stores/user';

import SettingsFieldButton from '../settings/SettingsFieldButton';
import DocumentOutline from './DocumentOutline';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {boolean} props.darkMode
 * @param {import('react').ReactNode} props.children
 */
export default function DocumentDrawer({ documentId, darkMode, children }) {
  const setRecordMode = useUserStore((ctx) => ctx.setRecordMode);
  const navigate = useNavigate();
  const location = useLocation();
  const { enterFullscreen, exitFullscreen } = useFullscreen();
  const setShotListMode = useUserStore((ctx) => ctx.setShotListMode);

  function onSlateClick() {
    setRecordMode('clapper');
    enterFullscreen();
    navigate('/rec');
  }

  function onDocumentClick() {
    setShotListMode('detail');
    exitFullscreen();
    navigate('/edit');
  }

  return (
    <DrawerLayout
      darkMode={darkMode}
      toolbar={
        <>
          <SettingsFieldButton
            className={'bg-white rounded-full p-2 shadow-md'}
            Icon={MovieIcon}
            disabled={location.pathname.includes('/rec')}
            onClick={onSlateClick}
          />
          <SettingsFieldButton
            className={'bg-white rounded-full p-2 shadow-md'}
            Icon={EditSquareIcon}
            disabled={location.pathname.includes('/edit')}
            onClick={onDocumentClick}
          />
        </>
      }
      content={<DocumentOutline documentId={documentId} />}>
      {children}
    </DrawerLayout>
  );
}
