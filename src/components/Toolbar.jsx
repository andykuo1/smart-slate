import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ExpandLessIcon from '@material-symbols/svg-400/rounded/expand_less.svg';
import ExpandMoreIcon from '@material-symbols/svg-400/rounded/expand_more.svg';
import MenuIcon from '@material-symbols/svg-400/rounded/menu.svg';
import SearchIcon from '@material-symbols/svg-400/rounded/search.svg';

import LogoIcon from '@/assets/logo.svg';
import FieldButton from '@/fields/FieldButton';
import { useProjectId } from '@/stores/document/use';
import { useCurrentCursor, useCurrentDocumentId } from '@/stores/user';

import SceneLayoutButton from './scenes/SceneLayoutButton';
import SettingsSceneShotsDetailButton from './scenes/settings/SettingsSceneShotsDetailButton';

export default function Toolbar() {
  const { documentId, sceneId } = useCurrentCursor();
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  return (
    <div
      className={
        'fixed top-4 z-30 flex flex-row overflow-x-auto rounded-r-full border-2 border-white bg-white shadow dark:border-black dark:bg-black' +
        ' ' +
        (!open ? '-left-2 right-auto' : '-left-2 right-2 md:right-auto')
      }>
      <div className={'flex' + ' ' + (!open ? 'hidden' : '')}>
        <title
          className="sticky left-0 z-10 mr-2 flex h-full cursor-pointer select-none items-center gap-2 bg-white pl-4 font-mono font-bold dark:bg-black"
          onClick={() => navigate('/')}>
          <LogoIcon className="inline-block h-6 w-6" />
          EagleStudio
          <ToolbarDivider />
        </title>
        <div className="hidden items-center gap-2 px-2 md:flex">
          <ProjectId />
          <ToolbarDivider />
        </div>
        <div className="flex items-center">
          <SceneLayoutButton documentId={documentId} sceneId={sceneId} />
          <SettingsSceneShotsDetailButton className="" />
          <FieldButton className="" Icon={SearchIcon} />
          <FieldButton className="" Icon={MenuIcon} />
          <ToolbarDivider className="mx-2" />
        </div>
      </div>
      <div className="flex-1" />
      <FieldButton
        className="-rotate-90"
        Icon={open ? ExpandLessIcon : ExpandMoreIcon}
        onClick={() => setOpen((prev) => !prev)}
      />
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 */
function ProjectId({ className }) {
  const documentId = useCurrentDocumentId();
  const projectId = useProjectId(documentId);
  return <p className={className}>{projectId}</p>;
}

/**
 * @param {object} props
 * @param {string} [props.className]
 */
function ToolbarDivider({ className }) {
  return (
    <hr
      className={
        'inline-block h-6 border-r-2 border-t-0 border-gray-400 opacity-30' +
        ' ' +
        className
      }
    />
  );
}
