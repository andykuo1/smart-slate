import {
  Disclosure,
  DisclosureContent,
  DisclosureProvider,
} from '@ariakit/react';
import { useRef } from 'react';

import ExpandMoreIcon from '@material-symbols/svg-400/rounded/expand_more.svg';

import { useScrollIntoView } from '@/libs/UseScrollIntoView';

/**
 * @param {object} props
 * @param {string} props.title
 * @param {boolean} [props.defaultOpen]
 * @param {import('react').ReactNode} props.children
 */
export default function FieldGroupDiscloseable({
  title,
  defaultOpen,
  children,
}) {
  const containerRef = useRef(null);
  const scrollIntoView = useScrollIntoView(containerRef);

  function onClick() {
    scrollIntoView({ block: 'center' });
  }

  return (
    <DisclosureProvider defaultOpen={defaultOpen}>
      <Disclosure
        ref={containerRef}
        className="flex w-full items-center border-b-2 border-black"
        onClick={onClick}>
        <span className="flex-1">{title}</span>
        <ExpandMoreIcon className="h-6 w-6 fill-current" />
      </Disclosure>
      <DisclosureContent className="flex flex-col gap-4 py-4">
        {children}
      </DisclosureContent>
    </DisclosureProvider>
  );
}
