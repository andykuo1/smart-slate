import { useSlug } from '@/slugs';

export { useCurrentDocumentId } from '@/slugs';

export function useSetUserCursor() {
  const { changeCurrentSlug } = useSlug();
  return changeCurrentSlug;
}

export function useCurrentCursor() {
  const { currentSlug } = useSlug();
  return currentSlug;
}
