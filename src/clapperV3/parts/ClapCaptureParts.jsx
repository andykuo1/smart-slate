import { useCallback } from 'react';

import {
  formatProjectId,
  formatSceneShotNumber,
} from '@/components/takes/TakeNameFormat';
import { tryEncodeQRCodeKeyV1 } from '@/serdes/UseResolveTakeQRCodeKey';
import {
  findNextAvailableShotHash,
  getClapperDetailsById,
  getSlateById,
  useClapperDispatch,
  useUNSAFE_getClapperStore,
} from '@/stores/clapper';
import { createClap, createSlate } from '@/stores/clapper/Store';
import {
  useClapperCursorDispatch,
  useUNSAFE_getClapperCursorStore,
} from '@/stores/clapper/cursor';
import { uuid } from '@/utils/uuid';

export function useClapCapture() {
  const UNSAFE_getClapperStore = useUNSAFE_getClapperStore();
  const UNSAFE_getClapperCursorStore = useUNSAFE_getClapperCursorStore();
  const addClap = useClapperDispatch((ctx) => ctx.addClap);
  const addSlate = useClapperDispatch((ctx) => ctx.addSlate);
  const focusClap = useClapperCursorDispatch((ctx) => ctx.focusClap);
  const obtainSlateTakeNumber = useClapperDispatch(
    (ctx) => ctx.obtainSlateTakeNumber,
  );

  const capture = useCallback(
    /**
     * @param {import('@/stores/clapper/Store').ClapperId} clapperId
     * @param {import('@/stores/clapper/Store').SlateId} slateId
     */
    function capture(clapperId, slateId) {
      const store = UNSAFE_getClapperStore();
      const cursorStore = UNSAFE_getClapperCursorStore();

      const clapper = getClapperDetailsById(store, clapperId);
      if (!clapper) {
        return;
      }
      const productionTitle =
        getClapperDetailsById(store, clapperId)?.productionTitle ?? 'MYMOVIE';
      const projectId = formatProjectId(productionTitle);

      let clap = createClap();

      let takeNumber;
      let slate;
      if (!slateId) {
        slate = createSlate();
        slateId = slate.slateId;
        slate.sceneNumber = cursorStore.sceneNumber;
        slate.shotNumber = cursorStore.shotNumber;
        slate.nextTakeNumber = 2;
        takeNumber = 1;
        slate.shotHash = findNextAvailableShotHash(store, clapperId);
        slate.clapIds.push(clap.clapId);
        addSlate(clapperId, slate);
      } else {
        slate = getSlateById(store, clapperId, slateId);
        takeNumber = slate.nextTakeNumber;
        obtainSlateTakeNumber(clapperId, slateId, clap.clapId);
      }

      clap.rollName = cursorStore.rollName;
      clap.sceneNumber = slate.sceneNumber;
      clap.shotNumber = slate.shotNumber;
      clap.takeNumber = takeNumber;
      clap.timestampMillis = Date.now();
      clap.takeId = uuid();
      clap.comments = '';

      const sceneShotNumber = formatSceneShotNumber(
        clap.sceneNumber,
        clap.shotNumber,
        true,
      );
      const qrCodeKey = tryEncodeQRCodeKeyV1(
        projectId,
        sceneShotNumber,
        takeNumber,
        slate.shotHash,
        clap.takeId,
      );

      clap.qrCodeKey = qrCodeKey;

      addClap(clapperId, slateId, clap);
      focusClap(clapperId, slateId, clap.clapId);
    },
    [
      UNSAFE_getClapperCursorStore,
      UNSAFE_getClapperStore,
      addClap,
      addSlate,
      focusClap,
      obtainSlateTakeNumber,
    ],
  );

  return capture;
}
