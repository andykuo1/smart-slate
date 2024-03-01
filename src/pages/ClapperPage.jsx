import { useEffect } from 'react';

import ClapperParts from '@/clapperV3/ClapperParts';
import Drawer from '@/drawer/Drawer';
import {
  getClapperById,
  useClapperDispatch,
  useUNSAFE_getClapperStore,
} from '@/stores/clapper';
import { createClapper } from '@/stores/clapper/Store';
import {
  useClapperCursorClapperId,
  useClapperCursorDispatch,
} from '@/stores/clapper/cursor';

import PageLayout from './PageLayout';

export default function ClapperPage() {
  const UNSAFE_getClapperStore = useUNSAFE_getClapperStore();
  const clapperId = useClapperCursorClapperId();
  const focusClapper = useClapperCursorDispatch((ctx) => ctx.focusClapper);
  const addClapper = useClapperDispatch((ctx) => ctx.addClapper);
  useEffect(() => {
    if (!clapperId) {
      const store = UNSAFE_getClapperStore();
      const firstClapperId = Object.keys(store.clappers)[0];
      let clapper = getClapperById(store, firstClapperId);
      if (!clapper) {
        clapper = createClapper();
        addClapper(clapper);
      }
      focusClapper(clapper.clapperId);
    }
  }, [clapperId, addClapper, focusClapper, UNSAFE_getClapperStore]);
  return (
    <PageLayout className={'overflow-hidden overscroll-none'}>
      <Drawer darkMode={true}>
        <ClapperParts clapperId={clapperId} />
      </Drawer>
    </PageLayout>
  );
}
