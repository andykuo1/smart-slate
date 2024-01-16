import { useUserStore } from '@/stores/user';

/**
 * @param {object} props
 * @param {import('react').ReactNode} props.content
 * @param {import('react').ReactNode} props.children
 * @param {boolean} [props.collapsed]
 */
export default function BlockEntryLayout({ collapsed, content, children }) {
  const setEditMode = useUserStore((ctx) => ctx.setEditMode);
  return (
    <div
      className={
        'flex' + ' ' + (!collapsed ? 'flex-col' : 'flex-col md:flex-row')
      }>
      <div
        className={
          'relative' +
          ' ' +
          (!collapsed
            ? 'max-h-[15vh] overflow-y-hidden'
            : 'md:min-w-[50vw] md:max-w-[60vw]')
        }>
        {content}
        {!collapsed && (
          <button
            className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent"
            onClick={() => setEditMode('story')}
          />
        )}
      </div>
      {children}
    </div>
  );
}