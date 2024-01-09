import { useState } from 'react';

import { useDocumentStore } from '@/stores/document';
import { createShot } from '@/stores/document/DocumentStore';

import { ShotTypeSelector } from './options/ShotTypeSelector';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 */
export default function ShotEntryNew({ documentId, blockId }) {
  const [shotType, setShotType] = useState(
    /** @type {import('@/stores/document/DocumentStore').ShotType} */ (''),
  );
  const addShot = useDocumentStore((ctx) => ctx.addShot);

  function onClick() {
    let newShot = createShot();
    addShot(documentId, blockId, newShot);
  }

  /** @type {import('react').ChangeEventHandler<any>} */
  function onShotTypeChange(e) {
    const newShotType = e.target.value;
    setShotType(newShotType);
    let newShot = createShot();
    newShot.shotType = newShotType;
    addShot(documentId, blockId, newShot);
  }

  return (
    <li className="group flex flex-row ml-auto">
      <div className="flex-1" />
      <ShotTypeSelector
        className="mx-2 flex flex-row items-center"
        activeShotType={shotType}
        onChange={onShotTypeChange}
      />
      <button
        className="pl-[20%] text-right whitespace-nowrap bg-gradient-to-l from-gray-300 to-transparent px-4 py-2 my-2 rounded-full"
        onClick={onClick}>
        + New Shot
      </button>
    </li>
  );
}
