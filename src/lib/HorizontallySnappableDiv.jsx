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
        'flex flex-row items-center w-full' +
        ' ' +
        'overflow-x-auto overflow-y-hidden snap-x snap-mandatory overscroll-x-none' +
        ' ' +
        className
      }>
      {Children.map(children, (child, index) => (
        <div className="w-full lg:max-w-[50%] flex-shrink-0 flex flex-row snap-start">
          {child}
        </div>
      ))}
    </div>
  );
}
