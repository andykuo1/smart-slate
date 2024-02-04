import DrawerLayout from '@/app/DrawerLayout';

import DocumentOutline from './DocumentOutline';
import DocumentToolbar from './DocumentToolbar';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {boolean} [props.darkMode]
 * @param {import('react').ReactNode} props.children
 */
export default function DocumentDrawer({ documentId, darkMode, children }) {
  return (
    <DrawerLayout
      darkMode={darkMode}
      toolbar={<DocumentToolbar documentId={documentId} />}
      content={<DocumentOutline documentId={documentId} />}>
      {children}
    </DrawerLayout>
  );
}
