import { useLocation, useNavigate } from 'react-router-dom';

import ArrowBackIcon from '@material-symbols/svg-400/rounded/arrow_back.svg';
import DoorOpenIcon from '@material-symbols/svg-400/rounded/door_open.svg';
import HomeIcon from '@material-symbols/svg-400/rounded/home.svg';
import ReceiptLongIcon from '@material-symbols/svg-400/rounded/receipt_long.svg';
import TuneIcon from '@material-symbols/svg-400/rounded/tune.svg';

import DocumentContentCount from '@/components/documents/DocumentContentCount';
import DrawerLayout from '@/drawer/layout/DrawerLayout';
import { useDocumentTitle } from '@/stores/document/use';
import {
  useCurrentDocumentId,
  useSetUserCursor,
  useUserStore,
} from '@/stores/user';

import SettingsFieldButton from '../components/settings/SettingsFieldButton';
import OutlineDrawer from './OutlineDrawer';
import SettingsDocumentNavButton from './SettingsDocumentNavButton';
import SettingsDrawer from './SettingsDrawer';

/**
 * @param {object} props
 * @param {boolean} [props.darkMode]
 * @param {import('react').ReactNode} props.children
 */
export default function Drawer({ darkMode, children }) {
  return (
    <DrawerLayout
      darkMode={darkMode}
      toolbar={<DrawerToolbar />}
      content={<DrawerContent />}>
      {children}
    </DrawerLayout>
  );
}

function DrawerToolbar() {
  return <SettingsDocumentNavButton />;
}

function DrawerNavBar() {
  const drawerActiveTab = useUserStore((ctx) => ctx.drawer.activeTab);
  const setDrawerActiveTab = useUserStore((ctx) => ctx.setDrawerActiveTab);
  function onOutlineClick() {
    if (drawerActiveTab !== 'outline') {
      setDrawerActiveTab('outline');
    }
  }
  function onTuneClick() {
    if (drawerActiveTab !== 'settings') {
      setDrawerActiveTab('settings');
    }
  }
  return (
    <div className="mt-2 flex flex-row rounded outline">
      <SettingsFieldButton
        Icon={ReceiptLongIcon}
        onClick={onOutlineClick}
        disabled={true}
      />
      <SettingsFieldButton
        Icon={TuneIcon}
        onClick={onTuneClick}
        disabled={true}
      />
    </div>
  );
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
  }

  return (
    <nav className="w-full font-mono">
      <div className="sticky top-0 z-10 flex w-full bg-gray-200 p-2 shadow">
        <div className="flex-1">
          <SettingsFieldButton
            className="mr-auto"
            Icon={ArrowBackIcon}
            onClick={onBackClick}
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
          <SettingsFieldButton
            className="ml-auto"
            Icon={isBackToHome ? DoorOpenIcon : HomeIcon}
            onClick={onHomeClick}
          />
        </div>
      </div>
      <div className="w-full">
        {drawerActiveTab === 'outline' && <OutlineDrawer />}
        {drawerActiveTab === 'settings' && <SettingsDrawer />}
      </div>
    </nav>
  );
}
