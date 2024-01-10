import { useRef, useState } from 'react';

import { useDocumentStore } from '@/stores/document';
import { createShot } from '@/stores/document/DocumentStore';

import { ShotTypeSelector } from './options/ShotTypeSelector';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').BlockId} props.blockId
 */
export default function ShotEntryNew({ documentId, blockId }) {
  const containerRef = useRef(/** @type {HTMLLIElement|null} */ (null));
  const [shotType, setShotType] = useState(
    /** @type {import('@/stores/document/DocumentStore').ShotType} */ (''),
  );
  const addShot = useDocumentStore((ctx) => ctx.addShot);

  function onClick() {
    let newShot = createShot();
    addShot(documentId, blockId, newShot);
    containerRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }

  /** @type {import('react').ChangeEventHandler<any>} */
  function onShotTypeChange(e) {
    const newShotType = e.target.value;
    setShotType(newShotType);
    let newShot = createShot();
    newShot.shotType = newShotType;
    addShot(documentId, blockId, newShot);
    containerRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }

  return (
    <li
      ref={containerRef}
      className={
        'group flex flex-col-reverse lg:flex-row py-2 items-center ml-auto m-2 bg-gradient-to-l from-gray-300 to-transparent rounded-full overflow-hidden'
      }>
      <div className="flex-1 w-full px-2">
        <ShotTypeSelector
          className="w-full flex flex-row items-center"
          activeShotType={shotType}
          onChange={onShotTypeChange}
        />
      </div>
      <button className="px-4 text-center whitespace-nowrap" onClick={onClick}>
        + New Shot
      </button>
    </li>
  );
}
