/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.children
 */
export default function PageLayout({ className, children }) {
  return (
    <main
      className={
        'flex h-full w-full flex-col overflow-hidden' + ' ' + className
      }>
      {children}
    </main>
  );
}
