/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').RefObject<HTMLElement>} [props.containerRef]
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
      className={'mb-10 flex flex-col' + ' ' + className}>
      {children}
    </section>
  );
}
