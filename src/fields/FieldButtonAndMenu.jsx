import {
  Popover,
  PopoverArrow,
  PopoverDisclosure,
  PopoverProvider,
  usePopoverContext,
} from '@ariakit/react';

import FieldButton from '@/fields/FieldButton';
import PopoverStyle from '@/styles/Popover.module.css';

/**
 * @param {object} props
 * @param {boolean} [props.inverted]
 * @param {string} props.title
 * @param {import('react').FC<any>} [props.Icon]
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} props.onClick
 * @param {Array<import('react').ReactNode>} [props.items]
 * @param {import('react').ReactNode} [props.children]
 */
export default function FieldButtonAndMenu({
  inverted,
  title,
  Icon,
  onClick,
  items = [],
  children,
}) {
  return (
    <PopoverProvider>
      <FieldButtonAndMenuDisclosure
        inverted={inverted}
        Icon={Icon}
        title={title}
        onClick={onClick}
      />
      <Popover className={PopoverStyle.popover}>
        <PopoverArrow className={PopoverStyle.arrow} />
        <FieldButtonAndMenuContent title={title} items={items} />
      </Popover>
    </PopoverProvider>
  );
}

/**
 * @param {object} props
 * @param {boolean} [props.inverted]
 * @param {import('react').FC<any>} [props.Icon]
 * @param {string} [props.title]
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} props.onClick
 * @param {import('react').ReactNode} [props.children]
 */
function FieldButtonAndMenuDisclosure({
  inverted,
  Icon,
  title,
  onClick,
  children,
}) {
  const store = usePopoverContext();
  return (
    <PopoverDisclosure toggleOnClick={false}>
      <FieldButton
        inverted={inverted}
        Icon={Icon}
        title={title}
        onClick={onClick}
        onContextMenu={(e) => {
          store?.show?.();
          e.preventDefault();
          e.stopPropagation();
        }}>
        {children}
      </FieldButton>
    </PopoverDisclosure>
  );
}

/**
 * @param {object} props
 * @param {string} props.title
 * @param {Array<import('react').ReactNode>} props.items
 */
function FieldButtonAndMenuContent({ title, items }) {
  const store = usePopoverContext();
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item, index) => (
        <li key={`menu-${title}-${index}`} onClick={() => store?.hide?.()}>
          {item}
        </li>
      ))}
    </ul>
  );
}
