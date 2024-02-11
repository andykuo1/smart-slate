import { useLocation, useNavigate } from 'react-router-dom';

import EditSquareIcon from '@material-symbols/svg-400/rounded/edit_square.svg';
import MovieIcon from '@material-symbols/svg-400/rounded/movie.svg';
import SubscriptionsIcon from '@material-symbols/svg-400/rounded/subscriptions.svg';
import TuneIcon from '@material-symbols/svg-400/rounded/tune.svg';

import { useFullscreen } from '@/libs/fullscreen';
import { getDocumentById } from '@/stores/document';
import { getDocumentSettingsById } from '@/stores/document/get';
import { useDocumentStore } from '@/stores/document/use';
import { useSettingsStore } from '@/stores/settings';
import { useCurrentDocumentId, useUserStore } from '@/stores/user';

import NavBarButton from './layout/NavBarButton';
import NavBarLayout from './layout/NavBarLayout';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.children
 */
export default function Navbar({ className, children }) {
  return (
    <NavBarLayout
      className={className}
      items={[
        <NavTuneButton />,
        <NavEditButton />,
        <NavRecordButton />,
        <NavPreviewButton />,
      ]}>
      {children}
    </NavBarLayout>
  );
}

function NavRecordButton() {
  const documentId = useCurrentDocumentId();
  const projectId = useDocumentStore(
    (ctx) => getDocumentSettingsById(ctx, documentId)?.projectId,
  );
  const shotCount = useDocumentStore(
    (ctx) => Object.keys(getDocumentById(ctx, documentId)?.shots || {}).length,
  );
  const setRecordMode = useUserStore((ctx) => ctx.setRecordMode);
  const navigate = useNavigate();
  const location = useLocation();
  const { enterFullscreen } = useFullscreen();
  const preferFullscreenRecorder = useSettingsStore(
    (ctx) => ctx.user.preferFullscreenRecorder,
  );

  function onClick() {
    setRecordMode('clapper');
    if (preferFullscreenRecorder) {
      enterFullscreen();
    }
    if (!location.pathname.includes('/rec')) {
      navigate('/rec');
    }
  }
  return (
    <NavBarButton
      title="Slate"
      abbr="Slate"
      active={location.pathname.includes('/rec')}
      Icon={MovieIcon /* RadioButtonCheckedIcon */}
      onClick={onClick}
      disabled={!projectId || shotCount <= 0}
    />
  );
}

function NavEditButton() {
  const documentId = useCurrentDocumentId();
  const projectId = useDocumentStore(
    (ctx) => getDocumentSettingsById(ctx, documentId)?.projectId,
  );
  const navigate = useNavigate();
  const location = useLocation();
  function onClick() {
    if (!location.pathname.includes('/edit')) {
      navigate('/edit');
    }
  }
  return (
    <NavBarButton
      title="Edit"
      abbr="Edit"
      Icon={EditSquareIcon}
      active={location.pathname.includes('/edit')}
      disabled={!projectId}
      onClick={onClick}
    />
  );
}

function NavTuneButton() {
  const navigate = useNavigate();
  const location = useLocation();
  function onClick() {
    if (!location.pathname.includes('/settings')) {
      navigate('/settings');
    }
  }
  return (
    <NavBarButton
      title="Project"
      abbr="Proj"
      Icon={TuneIcon}
      active={location.pathname.includes('/settings')}
      onClick={onClick}
    />
  );
}

function NavPreviewButton() {
  const navigate = useNavigate();
  const location = useLocation();
  function onClick() {
    if (!location.pathname.includes('/pre')) {
      navigate('/pre');
    }
  }
  return (
    <NavBarButton
      title="Visualize"
      abbr="Vis"
      Icon={SubscriptionsIcon}
      active={location.pathname.includes('/pre')}
      onClick={onClick}
      disabled={true}
    />
  );
}
