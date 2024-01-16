import {
  Popover,
  PopoverArrow,
  PopoverDescription,
  PopoverDisclosure,
  PopoverHeading,
  PopoverProvider,
} from '@ariakit/react';
import { useRef, useState } from 'react';

import LockIcon from '@material-symbols/svg-400/rounded/lock-fill.svg';
import LockOpenIcon from '@material-symbols/svg-400/rounded/lock_open.svg';

import { getDocumentById } from '@/stores/document';
import { getDocumentSettingsById } from '@/stores/document/get';
import { useDocumentStore } from '@/stores/document/use';
import { useCurrentDocumentId } from '@/stores/user';
import PopoverStyle from '@/styles/Popover.module.css';

import { formatProjectId } from '../takes/TakeNameFormat';
import SettingsFieldInput from './SettingsFieldInput';

export default function SettingsProjectIdField() {
  const inputRef = useRef(/** @type {HTMLInputElement|null} */ (null));
  const documentId = useCurrentDocumentId();
  const documentTitle = useDocumentStore(
    (ctx) => getDocumentById(ctx, documentId)?.documentTitle,
  );
  const [projectId, setProjectId] = useState('');
  const documentSettingsProjectId = useDocumentStore(
    (ctx) => getDocumentSettingsById(ctx, documentId)?.projectId,
  );
  const setDocumentSettingsProjectId = useDocumentStore(
    (ctx) => ctx.setDocumentSettingsProjectId,
  );
  const defaultProjectId = formatProjectId(documentTitle);
  const isProjectIdLocked = Boolean(documentSettingsProjectId);

  /**
   * @type {import('react').ChangeEventHandler<HTMLInputElement>}
   */
  function onChange(e) {
    const target = e.target;
    const value = target.value;
    if (!value || value.trim().length <= 0) {
      setProjectId('');
    } else {
      setProjectId(formatProjectId(value));
    }
  }

  function onBlur() {
    if (!documentSettingsProjectId) {
      setDocumentSettingsProjectId(documentId, projectId);
    }
  }

  function onLockClick() {
    if (!documentSettingsProjectId) {
      // Lock the current value!
      let value = documentSettingsProjectId || projectId || defaultProjectId;
      setDocumentSettingsProjectId(documentId, value);
    } else {
      // Unlock it for editing
      setProjectId(documentSettingsProjectId);
      setDocumentSettingsProjectId(documentId, '');
      inputRef.current?.focus();
    }
  }

  return (
    <PopoverProvider>
      <SettingsFieldInput
        title="Project ID:"
        id="project-id"
        placeholder={defaultProjectId}
        value={documentSettingsProjectId || projectId}
        onChange={onChange}
        disabled={isProjectIdLocked}
        inputRef={inputRef}
        onBlur={onBlur}>
        <button
          className="absolute right-0 top-0 rounded disabled:opacity-30"
          onClick={onLockClick}>
          {isProjectIdLocked ? (
            <LockIcon className="w-6 h-6 fill-current" />
          ) : (
            <LockOpenIcon className="w-6 h-6 fill-current" />
          )}
        </button>
        <PopoverDisclosure className="text-left text-sm text-blue-500 hover:underline cursor-pointer">
          What is this used for?
        </PopoverDisclosure>
        <Popover className={PopoverStyle.popover} modal={true}>
          <PopoverArrow className={PopoverStyle.arrow} />
          <PopoverHeading>What is Project ID?</PopoverHeading>
          <PopoverDescription>
            This is a unique identifier for all related project files and{' '}
            <b>cannot be changed</b> after creation.
          </PopoverDescription>
          <p>
            This is mostly used for file management by apps (and sometimes
            humans).
          </p>
        </Popover>
      </SettingsFieldInput>
    </PopoverProvider>
  );
}
