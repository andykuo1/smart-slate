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

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.children
 */
export default function NavBar({ className, children }) {
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

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {Array<import('react').ReactNode>} props.items
 * @param {import('react').ReactNode} props.children
 */
function NavBarLayout({ className, items, children }) {
  return (
    <>
      <div
        className={
          'relative w-full h-full flex flex-col items-center overflow-y-auto mb-20' +
          ' ' +
          className
        }>
        {children}
      </div>
      <nav className="fixed bottom-0 w-full h-20 flex flex-col z-40">
        <ul className="flex-1 flex flex-row bg-black text-white">
          {items.map((item, index) => (
            <li key={'nav-' + index} className="flex-1 flex">
              {item}
            </li>
          ))}
        </ul>
      </nav>
    </>
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
    <NavButton
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
    <NavButton
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
    <NavButton
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
    <NavButton
      title="Visualize"
      abbr="Vis"
      Icon={SubscriptionsIcon}
      active={location.pathname.includes('/pre')}
      onClick={onClick}
      disabled={true}
    />
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {string} props.title
 * @param {string} props.abbr
 * @param {import('react').ReactNode} [props.children]
 * @param {() => void} [props.onClick]
 * @param {import('react').FC<any>} props.Icon
 * @param {boolean} [props.active]
 * @param {boolean} [props.disabled]
 */
function NavButton({
  className,
  title,
  abbr,
  children,
  onClick,
  Icon,
  active,
  disabled = !onClick,
}) {
  return (
    <button
      className={
        // NOTE: This is pb-5, since pb-2 collides with iOS menu bar
        'group relative flex-1 p-2 pb-5' +
        ' ' +
        'enabled:cursor-pointer enabled:hover:bg-white enabled:hover:text-black disabled:opacity-30' +
        ' ' +
        (active ? 'bg-white text-black' : '') +
        ' ' +
        className
      }
      title={title}
      onClick={onClick}
      disabled={disabled}>
      {children}
      <Icon className="w-10 h-10 fill-current m-auto pointer-events-none" />
      <div
        className={
          'absolute w-10 h-10 z-10 -right-5 top-0 bottom-0 my-auto rotate-45 scale-50' +
          ' ' +
          'pointer-events-none' +
          ' ' +
          'bg-black group-enabled:group-hover:bg-white' +
          ' ' +
          (active ? 'bg-white' : '')
        }
      />
      <label className="hidden sm:inline absolute top-[50%] -translate-y-[50%] z-20 ml-6 my-auto text-black pointer-events-none">
        <span className="hidden lg:inline">{title}</span>
        <span className="inline lg:hidden">{abbr}</span>
      </label>
    </button>
  );
}
