import Screenplay from '@/components/screenplay/Screenplay';
import { useCurrentDocumentId } from '@/stores/UserStoreContext';

export default function ViewPage() {
  return (
    <main className="w-full h-full flex flex-col items-center bg-white">
      <Screenplay />
    </main>
  );
}
