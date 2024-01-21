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

import { useResolveDocumentProjectId } from '@/serdes/UseResolveDocumentProjectId';
import { getDocumentById } from '@/stores/document';
import { getDocumentSettingsById } from '@/stores/document/get';
import { useDocumentStore } from '@/stores/document/use';
import { useCurrentDocumentId } from '@/stores/user';
import PopoverStyle from '@/styles/Popover.module.css';

import SettingsFieldInput from './SettingsFieldInput';

export default function SettingsProjectIdField() {
  const inputRef = useRef(/** @type {HTMLInputElement|null} */ (null));
  const [inputText, setInputText] = useState('');
  const documentId = useCurrentDocumentId();
  const documentTitle = useDocumentStore(
    (ctx) => getDocumentById(ctx, documentId)?.documentTitle,
  );
  const documentSettingsProjectId = useDocumentStore(
    (ctx) => getDocumentSettingsById(ctx, documentId)?.projectId,
  );
  const setDocumentSettingsProjectId = useDocumentStore(
    (ctx) => ctx.setDocumentSettingsProjectId,
  );
  const resolveDocumentProjectId = useResolveDocumentProjectId();
  const projectId = resolveDocumentProjectId(
    documentId,
    documentTitle || inputText,
    true,
  );
  const isProjectIdLocked = Boolean(documentSettingsProjectId);

  /**
   * @type {import('react').ChangeEventHandler<HTMLInputElement>}
   */
  function onChange(e) {
    const target = e.target;
    const value = target.value;
    if (!value || value.trim().length <= 0) {
      setInputText('');
    } else {
      setInputText(value);
    }
  }

  function onBlur() {
    if (!documentSettingsProjectId) {
      console.log('[SettingsProjectIdField] Changed project id on blur!');
      setDocumentSettingsProjectId(documentId, projectId);
    }
  }

  function onLockClick() {
    if (!documentSettingsProjectId) {
      console.log('[SettingsProjectIdField] Changed project id on lock!');
      // Lock the current value!
      setDocumentSettingsProjectId(documentId, projectId);
    } else {
      // Unlock it for editing
      setInputText(documentSettingsProjectId);
      setDocumentSettingsProjectId(documentId, '');
      inputRef.current?.focus();
    }
  }

  return (
    <PopoverProvider>
      <SettingsFieldInput
        title="Project ID:"
        id="project-id"
        placeholder={projectId}
        value={documentSettingsProjectId || inputText}
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
