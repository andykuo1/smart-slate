/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').RefObject<HTMLElement>} props.containerRef
 * @param {import('react').ReactNode} props.children
 */
export default function SceneEntryLayout({
  className,
  containerRef,
  children,
}) {
  return (
    <section
      ref={containerRef}
      className={'flex flex-col mb-10' + ' ' + className}>
      {children}
    </section>
  );
}
