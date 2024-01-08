import EditSquareIcon from '@material-symbols/svg-400/rounded/edit_square.svg';
import ListAltIcon from '@material-symbols/svg-400/rounded/list_alt.svg';
import RadioButtonCheckedIcon from '@material-symbols/svg-400/rounded/radio_button_checked.svg';
import SubscriptionsIcon from '@material-symbols/svg-400/rounded/subscriptions.svg';
import TuneIcon from '@material-symbols/svg-400/rounded/tune.svg';

import {
  useDocumentTitle,
  useSceneNumber,
  useShotNumber,
  useTakeNumber,
} from '@/stores/document';
import { useCurrentCursor } from '@/stores/user';

import {
  formatDocumentTitle,
  formatSceneNumber,
  formatShotNumber,
  formatTakeNumber,
} from './takes/TakeNameFormat';

export default function NavBar() {
  const { documentId, sceneId, shotId, takeId } = useCurrentCursor();
  const [documentTitle] = useDocumentTitle(documentId);
  const sceneNumber = useSceneNumber(documentId, sceneId);
  const shotNumber = useShotNumber(documentId, sceneId, shotId);
  const takeNumber = useTakeNumber(documentId, shotId, takeId);
  return (
    <nav className="fixed bottom-0 w-full flex flex-col z-30">
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
                {formatDocumentTitle(documentTitle)}
              </span>
            </td>
            <td>{formatSceneNumber(sceneNumber)}</td>
            <td>{formatShotNumber(shotNumber)}</td>
            <td>{formatTakeNumber(takeNumber)}</td>
          </tr>
        </tbody>
      </table>
      <ul className="flex-1 flex flex-row bg-black text-white border-t-2 border-white">
        <li className="flex-1 flex">
          <NavButton title="Project" abbr="Proj" Icon={TuneIcon} />
        </li>
        <li className="flex-1 flex">
          <NavButton title="Edit" abbr="Edit" Icon={EditSquareIcon} />
        </li>
        <li className="flex-1 flex">
          <NavButton title="Shotlist" abbr="Shot" Icon={ListAltIcon} />
        </li>
        <li className="flex-1 flex">
          <NavButton title="Record" abbr="Rec" Icon={RadioButtonCheckedIcon} />
        </li>
        <li className="flex-1 flex">
          <NavButton title="Visualize" abbr="Vis" Icon={SubscriptionsIcon} />
        </li>
      </ul>
    </nav>
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
 */
function NavButton({ className, title, abbr, children, onClick, Icon }) {
  return (
    <button
      className={
        'group relative flex-1 p-2 cursor-pointer hover:bg-white hover:text-black' +
        ' ' +
        className
      }
      title={title}
      onClick={onClick}
      disabled={!onClick}>
      {children}
      <Icon className="w-10 h-10 fill-current m-auto pointer-events-none" />
      <div
        className={
          'absolute w-10 h-10 z-10 -right-5 top-0 bottom-0 my-auto rotate-45 scale-50' +
          ' ' +
          'pointer-events-none' +
          ' ' +
          'bg-black group-hover:bg-white'
        }
      />
      <label className="hidden sm:inline absolute top-[50%] -translate-y-[50%] z-20 ml-6 my-auto text-black pointer-events-none">
        <span className="hidden lg:inline">{title}</span>
        <span className="inline lg:hidden">{abbr}</span>
      </label>
    </button>
  );
}
