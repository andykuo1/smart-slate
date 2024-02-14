import { Fragment, useState } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';

import FieldButton from '@/fields/FieldButton';

/**
 * @param {object} props
 * @param {Array<import('react').ReactNode>} props.items
 * @param {import('react').ReactNode} [props.children]
 */
export function ToolboxActionList({ items, children }) {
  const [tada, setTada] = useState(false);
  return (
    <ol className="m-1 grid grid-cols-[1.5rem_repeat(1,minmax(0,1fr))] gap-2">
      {items.map((item, index) => (
        <Fragment key={`toolbox-action-${index}`}>
          <div className="flex flex-col items-center gap-2">
            <div>{index + 1}.</div>
            <div className="flex-1 border-r-4 border-dashed" />
          </div>
          <li className="flex flex-col gap-2">{item}</li>
        </Fragment>
      ))}
      <div className="flex flex-col items-center gap-2">
        <div>{items.length + 1}.</div>
        <div className="flex-1 border-r-4 border-dashed" />
      </div>
      <li className="flex flex-col gap-2">
        <FieldButton
          className="italic outline-none"
          onClick={() => setTada(true)}
          disabled={tada}>
          <span>🎉 Hooray!</span>
        </FieldButton>
        {tada && (
          <ConfettiExplosion
            className="absolute left-[50%] top-0 z-50"
            onComplete={() => setTada(false)}
          />
        )}
        {children}
      </li>
    </ol>
  );
}
