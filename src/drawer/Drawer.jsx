import { useLocation, useNavigate } from 'react-router-dom';

import ArrowBackIcon from '@material-symbols/svg-400/rounded/arrow_back.svg';
import HomeIcon from '@material-symbols/svg-400/rounded/home.svg';
import ReceiptLongIcon from '@material-symbols/svg-400/rounded/receipt_long.svg';
import TuneIcon from '@material-symbols/svg-400/rounded/tune.svg';

import DocumentContentCount from '@/components/documents/DocumentContentCount';
import DrawerLayout from '@/drawer/layout/DrawerLayout';
import { useDocumentTitle } from '@/stores/document/use';
import { useCurrentDocumentId, useUserStore } from '@/stores/user';

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
  const setDrawerMode = useUserStore((ctx) => ctx.setDrawerMode);
  const drawerMode = useUserStore((ctx) => ctx.drawerMode);
  function onOutlineClick() {
    if (drawerMode !== 'outline') {
      setDrawerMode('outline');
    }
  }
  function onTuneClick() {
    if (drawerMode !== 'clapperSettings') {
      setDrawerMode('clapperSettings');
    }
  }
  return (
    <div className="outline rounded flex flex-row mt-2">
      <SettingsFieldButton Icon={ReceiptLongIcon} onClick={onOutlineClick} />
      <SettingsFieldButton Icon={TuneIcon} onClick={onTuneClick} />
    </div>
  );
}

function DrawerContent() {
  const documentId = useCurrentDocumentId();
  const [documentTitle] = useDocumentTitle(documentId);
  const drawerMode = useUserStore((ctx) => ctx.drawerMode);
  const navigate = useNavigate();
  const location = useLocation();
  const isBackToHome = location.pathname.includes('/edit');

  function onBackClick() {
    if (isBackToHome) {
      navigate('/');
    } else {
      navigate('/edit');
    }
  }

  return (
    <nav className="w-full font-mono">
      <div className="sticky top-0 z-10 w-full flex p-2 bg-gray-200 shadow">
        <div className="flex-1">
          <SettingsFieldButton
            className="mr-auto"
            Icon={isBackToHome ? HomeIcon : ArrowBackIcon}
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
          <SettingsFieldButton className="ml-auto" Icon={TuneIcon} />
        </div>
      </div>
      <div className="w-full">
        {drawerMode === 'outline' && <OutlineDrawer />}
        {drawerMode === 'clapperSettings' && <SettingsDrawer />}
      </div>
    </nav>
  );
}