/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.header
 * @param {import('react').ReactNode} props.children
 */
export default function SceneEntryLayout({ className, header, children }) {
  return (
    <section className={'flex flex-col mb-10' + ' ' + className}>
      {header}
      {children}
    </section>
  );
}
