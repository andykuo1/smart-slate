import { Tooltip, TooltipAnchor, TooltipProvider } from '@ariakit/react';
import { useState } from 'react';

import CursorOnIcon from '@material-symbols/svg-400/rounded/arrow_selector_tool-fill.svg';
import CursorIcon from '@material-symbols/svg-400/rounded/arrow_selector_tool.svg';
import DataIcon from '@material-symbols/svg-400/rounded/cloud.svg';
import EditOnIcon from '@material-symbols/svg-400/rounded/edit_square-fill.svg';
import EditIcon from '@material-symbols/svg-400/rounded/edit_square.svg';
import HelpIcon from '@material-symbols/svg-400/rounded/help.svg';
import ShotListIcon from '@material-symbols/svg-400/rounded/lists.svg';
import ChangelogIcon from '@material-symbols/svg-400/rounded/new_releases.svg';
import ProfileIcon from '@material-symbols/svg-400/rounded/person.svg';
import MoodBoardIcon from '@material-symbols/svg-400/rounded/photo_library.svg';
import SearchIcon from '@material-symbols/svg-400/rounded/search.svg';
import SettingsIcon from '@material-symbols/svg-400/rounded/settings.svg';
import SplitViewIcon from '@material-symbols/svg-400/rounded/vertical_split.svg';
import InlineViewIcon from '@material-symbols/svg-400/rounded/view_day.svg';

import LogoIcon from '@/assets/eagle.svg';
import { useUserStore } from '@/stores/user';

import Style from './DocumentToolbarParts.module.css';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
export default function DocumentToolbarParts({ documentId }) {
  const [tab, setTab] = useState('');
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-30 flex">
        <div className="relative z-10 flex flex-1 flex-col">
          <div className="mr-auto mt-auto inline-block">
            <ToolbarButton
              className="m-2 rounded-full bg-black/70 p-3 text-white shadow-xl backdrop-blur hover:bg-neutral-500"
              Icon={SplitViewIcon}
              title="More"
              onClick={() => setOpen((prev) => !prev)}
            />
          </div>
          <div
            className={
              'absolute bottom-16 left-0 mx-3 flex w-48 flex-col overflow-y-auto whitespace-nowrap rounded-xl bg-black/60 text-white shadow-xl backdrop-blur' +
              ' ' +
              Style.navbar +
              ' ' +
              (open ? Style.navbarEnter : Style.navbarExit)
            }>
            <NavbarButton
              Icon={LogoIcon}
              title="Eagle Studio"
              className="hover:bg-white/10"
            />
            <NavbarButton
              Icon={DataIcon}
              title="Data"
              className="hover:bg-white/10"
            />
            <NavbarButton
              Icon={SettingsIcon}
              title="Settings"
              className="hover:bg-white/10"
            />
            <NavbarButton
              Icon={ProfileIcon}
              title="Profile"
              className="hover:bg-white/10"
            />
            <NavbarButton
              Icon={ChangelogIcon}
              title="What's New?"
              className="hover:bg-white/10"
            />
            <NavbarButton
              Icon={HelpIcon}
              title="Help"
              className="hover:bg-white/10"
            />
          </div>
        </div>
        <div className="mx-auto my-2 flex flex-col overflow-hidden rounded-2xl bg-black/60 text-white shadow-xl backdrop-blur">
          <div
            className={
              'flex flex-col' +
              ' ' +
              Style.toolbar +
              ' ' +
              (tab ? Style.toolbarEnter : Style.toolbarExit)
            }>
            <input
              className="mx-auto w-full max-w-[5in] rounded-3xl bg-black/40 p-4 outline outline-1 -outline-offset-8 outline-white/30 hover:outline-white focus:outline-yellow-300"
              placeholder="Search"
            />
            <div className="my-5">
              <div className="text-center text-2xl font-bold italic">
                🚧 UNDER CONSTRUCTION 🚧
              </div>
              <div className="text-center italic">Stay tuned :D</div>
            </div>
          </div>
          <div className="flex flex-row items-center bg-black/30 px-5">
            <div className="mx-auto flex">
              <ToolbarButton
                title="Search"
                className="m-1 mx-2 rounded-full hover:bg-white/10"
                Icon={SearchIcon}
                onClick={() => setTab((prev) => (!prev ? 'search' : ''))}
              />
              <div className="flex border-l-2 border-r-2 border-white/10">
                <CursorModeButton />
                <EditModeButton />
                <SplitViewButton />
                <ToolbarButton
                  className="h-full px-4 hover:bg-white/10"
                  title="Board"
                  Icon={MoodBoardIcon}
                  disabled={true}
                />
              </div>
              <ToolbarButton
                title="Shot List"
                className="m-1 mx-2 rounded-full hover:bg-white/10"
                Icon={ShotListIcon}
              />
            </div>
          </div>
        </div>
        <div className="flex-1" />
      </div>
    </>
  );
}

function CursorModeButton() {
  const cursorType = useUserStore(
    (ctx) => ctx?.editor?.documentEditor?.cursorType,
  );
  const toggleCursorType = useUserStore(
    (ctx) => ctx?.toggleDocumentEditorCursorType,
  );
  function onClick() {
    toggleCursorType('edit');
  }
  return (
    <ToolbarButton
      className={
        'h-full px-4 hover:bg-white/10' +
        ' ' +
        (cursorType === '' ? 'border-b-8 border-purple-400' : '')
      }
      title="Cursor"
      Icon={cursorType === '' ? CursorOnIcon : CursorIcon}
      onClick={onClick}
    />
  );
}

function EditModeButton() {
  const cursorType = useUserStore(
    (ctx) => ctx?.editor?.documentEditor?.cursorType,
  );
  const toggleCursorType = useUserStore(
    (ctx) => ctx?.toggleDocumentEditorCursorType,
  );
  function onClick() {
    toggleCursorType('edit');
  }
  return (
    <ToolbarButton
      className={
        'h-full px-4 hover:bg-white/10' +
        ' ' +
        (cursorType === 'edit' ? 'border-b-8 border-purple-400' : '')
      }
      title="Edit"
      Icon={cursorType === 'edit' ? EditOnIcon : EditIcon}
      onClick={onClick}
    />
  );
}

function SplitViewButton() {
  const editMode = useUserStore((ctx) => ctx?.editMode);
  const setEditMode = useUserStore((ctx) => ctx?.setEditMode);
  function onClick() {
    setEditMode(editMode !== 'sequence' ? 'sequence' : 'inline');
  }
  return (
    <ToolbarButton
      className="h-full px-4 hover:bg-white/10"
      title="Split View"
      Icon={editMode === 'sequence' ? SplitViewIcon : InlineViewIcon}
      onClick={onClick}
    />
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {string} props.title
 * @param {import('react').FC<any>} props.Icon
 * @param {import('react').MouseEventHandler<any>} [props.onClick]
 * @param {boolean} [props.disabled]
 */
function ToolbarButton({
  className,
  title,
  Icon,
  onClick,
  disabled = !onClick,
}) {
  return (
    <TooltipProvider showTimeout={0}>
      <TooltipAnchor disabled={disabled}>
        <button
          className={
            'p-2 hover:cursor-pointer disabled:opacity-30' + ' ' + className
          }
          onClick={onClick}
          disabled={disabled}>
          {Icon && <Icon className="h-6 w-6 fill-current" />}
        </button>
      </TooltipAnchor>
      <Tooltip className="z-50 rounded-full bg-neutral-600 px-2 py-1 text-xs">
        {title}
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {string} props.title
 * @param {import('react').FC<any>} props.Icon
 * @param {import('react').MouseEventHandler<any>} [props.onClick]
 * @param {boolean} [props.disabled]
 */
function NavbarButton({ className, title, Icon, onClick, disabled }) {
  return (
    <button
      className={'flex gap-2 p-2 hover:cursor-pointer' + ' ' + className}
      onClick={onClick}
      disabled={disabled}>
      {Icon && <Icon className="h-6 w-6 fill-current" />}
      {title}
    </button>
  );
}
