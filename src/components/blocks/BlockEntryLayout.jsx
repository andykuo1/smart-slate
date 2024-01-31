import { useUserStore } from '@/stores/user';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.content
 * @param {import('react').ReactNode} props.children
 * @param {'faded'|'split'|'fullwidth'} [props.mode]
 */
export default function BlockEntryLayout({
  className,
  mode = 'fullwidth',
  content,
  children,
}) {
  const isWidthHalved = mode === 'split';
  const isHeightFaded = mode === 'faded';
  const setEditMode = useUserStore((ctx) => ctx.setEditMode);
  return (
    <div
      className={
        'flex' +
        ' ' +
        (isWidthHalved ? 'flex-row w-[50vw]' : 'flex-col') +
        ' ' +
        className
      }>
      <div
        className={
          'relative w-full' +
          ' ' +
          (isHeightFaded && 'max-h-[15vh] overflow-y-hidden')
        }>
        {content}
        {isHeightFaded && (
          <button
            className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent"
            onClick={() => setEditMode('sequence')}
          />
        )}
      </div>
      {children}
    </div>
  );
}
