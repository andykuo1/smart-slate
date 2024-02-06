import { useSlugToSearchParams } from '@/slugs';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.children
 */
export default function PageLayout({ className, children }) {
  useSlugToSearchParams();
  return (
    <main
      className={
        'overflow-hidden w-full h-full flex flex-col' + ' ' + className
      }>
      {children}
    </main>
  );
}
