/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.children
 */
export default function PageLayout({ className, children }) {
  return (
    <main className={'w-full h-full flex flex-col' + ' ' + className}>
      {children}
    </main>
  );
}
