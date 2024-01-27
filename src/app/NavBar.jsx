import { useLocation, useNavigate } from 'react-router-dom';

import EditSquareIcon from '@material-symbols/svg-400/rounded/edit_square.svg';
import RadioButtonCheckedIcon from '@material-symbols/svg-400/rounded/radio_button_checked.svg';
import SubscriptionsIcon from '@material-symbols/svg-400/rounded/subscriptions.svg';
import TuneIcon from '@material-symbols/svg-400/rounded/tune.svg';

import {
  formatSceneNumber,
  formatShotNumber,
  formatTakeNumber,
} from '@/components/takes/TakeNameFormat';
import { useFullscreen } from '@/libs/fullscreen';
import { useSceneNumber } from '@/serdes/UseResolveSceneNumber';
import { useShotNumber } from '@/serdes/UseResolveShotNumber';
import { useTakeNumber } from '@/serdes/UseResolveTakeNumber';
import { getDocumentById } from '@/stores/document';
import { getDocumentSettingsById } from '@/stores/document/get';
import { useDocumentStore } from '@/stores/document/use';
import {
  useCurrentCursor,
  useCurrentDocumentId,
  useUserStore,
} from '@/stores/user';

export default function NavBar() {
  return (
    <nav className="fixed bottom-0 w-full h-20 flex flex-col z-30">
      {false /* TODO: Don't show until we have something better */ && (
        <NavSceneShotTake />
      )}
      <ul className="flex-1 flex flex-row bg-black text-white">
        <li className="flex-1 flex">
          <NavTuneButton />
        </li>
        <li className="flex-1 flex">
          <NavEditButton />
        </li>
        <li className="flex-1 flex">
          <NavRecorderButton />
        </li>
        <li className="flex-1 flex">
          <NavButton title="Visualize" abbr="Vis" Icon={SubscriptionsIcon} />
        </li>
      </ul>
    </nav>
  );
}

function NavRecorderButton() {
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
  function onClick() {
    setRecordMode('clapper');
    enterFullscreen();
    if (!location.pathname.includes('/rec')) {
      navigate('/rec');
    }
  }
  return (
    <NavButton
      title="Recorder"
      abbr="Rec"
      active={location.pathname.includes('/rec')}
      Icon={RadioButtonCheckedIcon}
      onClick={onClick}
      disabled={!projectId || shotCount <= 0}
    />
  );
}

function NavSceneShotTake() {
  const { documentId, sceneId, shotId, takeId } = useCurrentCursor();
  const projectId = useDocumentStore(
    (ctx) => getDocumentSettingsById(ctx, documentId)?.projectId,
  );
  const sceneNumber = useSceneNumber(documentId, sceneId);
  const shotNumber = useShotNumber(documentId, sceneId, shotId);
  const takeNumber = useTakeNumber(documentId, shotId, takeId);
  return (
    <table className="bg-black text-white">
      <thead>
        <tr className="text-xs opacity-60">
          <th scope="col" className="w-[55%]">
            Project
          </th>
          <th scope="col" className="w-[15%]">
            Scene
          </th>
          <th scope="col" className="w-[15%]">
            Shot
          </th>
          <th scope="col" className="w-[15%]">
            Take
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className="text-center">
          <td>
            <span className="inline-block w-[55vw] overflow-hidden overflow-ellipsis whitespace-nowrap">
              {projectId || '--'}
            </span>
          </td>
          <td>{formatSceneNumber(sceneNumber, false)}</td>
          <td>{formatShotNumber(shotNumber)}</td>
          <td>{formatTakeNumber(takeNumber)}</td>
        </tr>
      </tbody>
    </table>
  );
}

function NavEditButton() {
  const documentId = useCurrentDocumentId();
  const projectId = useDocumentStore(
    (ctx) => getDocumentSettingsById(ctx, documentId)?.projectId,
  );
  const isStoryMode = useUserStore((ctx) => ctx.editMode === 'story');
  const setEditMode = useUserStore((ctx) => ctx.setEditMode);
  const navigate = useNavigate();
  const location = useLocation();
  function onClick() {
    setEditMode('story');
    if (!location.pathname.includes('/edit')) {
      navigate('/edit');
    }
  }
  return (
    <NavButton
      title="Edit"
      abbr="Edit"
      Icon={EditSquareIcon}
      active={location.pathname.includes('/edit') && isStoryMode}
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
