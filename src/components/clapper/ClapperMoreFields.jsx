import { useState } from 'react';

import Style from './ClapperMoreFields.module.css';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 */
export default function ClapperMoreFields({ className, documentId }) {
  return (
    <div className={Style.grid + ' ' + className}>
      <ToggleSyncButton />
      <ToggleMOSButton />
    </div>
  );
}

function ToggleSyncButton() {
  const [state, setState] = useState(true);

  function onClick() {
    setState((prev) => !prev);
  }
  return (
    <button
      className={!state ? 'line-through opacity-30' : ''}
      onClick={onClick}>
      SYNC
    </button>
  );
}

function ToggleMOSButton() {
  const [state, setState] = useState(false);

  function onClick() {
    setState((prev) => !prev);
  }
  return (
    <button
      className={!state ? 'line-through opacity-30' : ''}
      onClick={onClick}>
      MOS
    </button>
  );
}
