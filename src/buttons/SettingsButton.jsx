import {
  Menu,
  MenuButton,
  MenuButtonArrow,
  MenuProvider,
} from '@ariakit/react';

import SettingsIcon from '@material-symbols/svg-400/rounded/settings-fill.svg';

import ButtonStyle from '@/styles/Button.module.css';
import MenuStyle from '@/styles/Menu.module.css';

import ClearVideoCacheMenuItem from './settings/ClearVideoCacheMenuItem';
import DeleteProjectMenuItem from './settings/DeleteProjectMenuItem';
import EnableDriveSyncMenuItem from './settings/EnableDriveSyncMenuItem';
import EnableThumbnailWhileRecordingMenuItem from './settings/EnableThumbnailWhileRecordingMenuItem';
import NerdInfoMenuItem from './settings/NerdInfoMenuItem';
import PreferMutedWhileRecordingMenuItem from './settings/PreferMutedWhileRecordingMenuItem';
import PreferNativeRecorderMenuItem from './settings/PreferNativeRecorderMenuItem';

/**
 * @param {object} props
 * @param {string} [props.className]
 */
export default function SettingsButton({ className }) {
  return (
    <MenuProvider>
      <MenuButton
        className={ButtonStyle.button + ' ' + 'm-2' + ' ' + className}>
        <SettingsIcon className="h-full" />
        <MenuButtonArrow />
      </MenuButton>
      <Menu gutter={8} className={MenuStyle.menu}>
        <DeleteProjectMenuItem />
        <PreferNativeRecorderMenuItem />
        <PreferMutedWhileRecordingMenuItem />
        <EnableThumbnailWhileRecordingMenuItem />
        <EnableDriveSyncMenuItem />
        <ClearVideoCacheMenuItem />
        <NerdInfoMenuItem />
      </Menu>
    </MenuProvider>
  );
}
