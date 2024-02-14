import { useLocation, useNavigate } from 'react-router-dom';

import ArrowForwardIcon from '@material-symbols/svg-400/rounded/arrow_forward.svg';
import DoorOpenIcon from '@material-symbols/svg-400/rounded/door_open.svg';
import HomeIcon from '@material-symbols/svg-400/rounded/home.svg';
import PDFIcon from '@material-symbols/svg-400/rounded/picture_as_pdf.svg';
import VideoIcon from '@material-symbols/svg-400/rounded/subscriptions.svg';

import DocumentContentCount from '@/components/documents/DocumentContentCount';
import DrawerLayout from '@/drawer/layout/DrawerLayout';
import { useDocumentTitle } from '@/stores/document/use';
import {
  useCurrentDocumentId,
  useSetUserCursor,
  useUserStore,
} from '@/stores/user';

import FieldButton from '../fields/FieldButton';
import OutlineDrawer from './OutlineDrawer';
import SettingsDocumentNavButton from './SettingsDocumentNavButton';

/**
 * @param {object} props
 * @param {boolean} [props.darkMode]
 * @param {string} [props.className]
 * @param {string} [props.containerClassName]
 * @param {import('react').ReactNode} props.children
 */
export default function Drawer({
  className,
  containerClassName,
  darkMode,
  children,
}) {
  return (
    <DrawerLayout
      darkMode={darkMode}
      className={className}
      containerClassName={containerClassName}
      toolbar={<DrawerToolbar />}
      content={<DrawerContent />}>
      {children}
    </DrawerLayout>
  );
}

function DrawerToolbar() {
  return <SettingsDocumentNavButton />;
}

function DrawerContent() {
  const documentId = useCurrentDocumentId();
  const [documentTitle] = useDocumentTitle(documentId);
  const drawerActiveTab = useUserStore((ctx) => ctx.drawer.activeTab);
  const toggleDrawer = useUserStore((ctx) => ctx.toggleDrawer);
  const navigate = useNavigate();
  const location = useLocation();
  const isBackToHome = location.pathname.includes('/edit');
  const setUserCursor = useSetUserCursor();

  function onBackClick() {
    toggleDrawer(false);
  }

  function onHomeClick() {
    if (isBackToHome) {
      navigate('/');
      setUserCursor('', '', '', '');
    } else {
      navigate('/edit');
      setUserCursor(documentId, '', '', '');
    }
    toggleDrawer(false);
  }

  return (
    <nav className="w-full font-mono">
      <div className="sticky top-0 z-10 flex w-full bg-gray-200 p-2 shadow dark:bg-gray-800">
        <div className="flex-1">
          <FieldButton
            className="mr-auto"
            Icon={isBackToHome ? DoorOpenIcon : HomeIcon}
            onClick={onHomeClick}
          />
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-center">
            <span className="underline">{documentTitle}</span>
          </h3>
          <DocumentContentCount documentId={documentId} />
          <DrawerNavBar />
        </div>
        <div className="flex-1">
          <FieldButton
            className="ml-auto"
            Icon={ArrowForwardIcon}
            onClick={onBackClick}
          />
        </div>
      </div>
      <div className="w-full">
        {drawerActiveTab === 'outline' && <OutlineDrawer />}
      </div>
    </nav>
  );
}

function DrawerNavBar() {
  const navigate = useNavigate();
  const setViewerMode = useUserStore((ctx) => ctx.setViewerMode);
  function onPDFViewClick() {
    setViewerMode('pdf');
    navigate('/view');
  }
  return (
    <div className="mt-2 flex flex-row rounded outline">
      <FieldButton Icon={VideoIcon} disabled={true} />
      <FieldButton Icon={PDFIcon} onClick={onPDFViewClick} />
    </div>
  );
}
