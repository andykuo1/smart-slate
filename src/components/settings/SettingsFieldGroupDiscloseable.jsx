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
 * @param {import('react').ReactNode} props.children
 */
export default function SettingsFieldGroupDiscloseable({ title, children }) {
  const containerRef = useRef(null);
  const scrollIntoView = useScrollIntoView(containerRef);

  function onClick() {
    scrollIntoView();
  }

  return (
    <DisclosureProvider>
      <Disclosure
        ref={containerRef}
        className="w-full flex items-center border-b-2 border-black"
        onClick={onClick}>
        <span className="flex-1">{title}</span>
        <ExpandMoreIcon className="w-6 h-6 fill-current" />
      </Disclosure>
      <DisclosureContent className="py-4 flex flex-col gap-4">
        {children}
      </DisclosureContent>
    </DisclosureProvider>
  );
}
