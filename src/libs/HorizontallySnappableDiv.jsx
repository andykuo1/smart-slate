import { Children } from 'react';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.children
 */
export default function HorizontallySnappableDiv({ className, children }) {
  return (
    <div
      className={
        'flex w-full flex-row items-center' +
        ' ' +
        'snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-none' +
        ' ' +
        className
      }>
      {Children.map(children, (child, index) => (
        <div className="flex w-full flex-shrink-0 snap-start flex-row lg:max-w-[50%]">
          {child}
        </div>
      ))}
    </div>
  );
}
