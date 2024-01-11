import { getListItemStyleByViewMode } from './TakeListViewMode';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {'list'|'inline'} props.viewMode
 * @param {import('react').ReactNode} [props.children]
 */
export default function TakeEntryLayout({ className, viewMode, children }) {
  return (
    <li
      className={
        'flex flex-row bg-gray-100' +
        ' ' +
        getListItemStyleByViewMode(viewMode) +
        ' ' +
        className
      }>
      {children}
    </li>
  );
}
