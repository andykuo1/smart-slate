import { useSetUserCursor } from '@/stores/user';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').SceneId} props.sceneId
 * @param {import('react').ReactNode} props.content
 * @param {import('react').ReactNode} props.children
 * @param {'faded'|'split'|'fullwidth'} [props.mode]
 */
export default function BlockEntryLayout({
  className,
  documentId,
  sceneId,
  mode = 'fullwidth',
  content,
  children,
}) {
  const isWidthHalved = mode === 'split';
  const isHeightFaded = mode === 'faded';
  const setUserCursor = useSetUserCursor();
  return (
    <div
      className={
        'flex-1 flex' +
        ' ' +
        (isWidthHalved ? 'flex-row w-[50vw]' : 'flex-col') +
        ' ' +
        className
      }>
      <div
        className={
          'relative w-full' +
          ' ' +
          (isHeightFaded &&
            'min-h-[10vh] max-h-[20vh] overflow-y-hidden bg-black text-white')
        }>
        {content}
        {isHeightFaded && (
          <button
            className="absolute top-0 bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black to-transparent"
            onClick={() => {
              setUserCursor(documentId, sceneId, '', '');
            }}
          />
        )}
      </div>
      {children}
    </div>
  );
}
