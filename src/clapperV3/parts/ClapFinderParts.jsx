import { Select, SelectPopover, SelectProvider } from '@ariakit/react';

import { formatTakeNumber } from '@/components/takes/TakeNameFormat';
import {
  findClapBySceneShotTakeNumber,
  findSlateByShotHash,
  useUNSAFE_getClapperStore,
} from '@/stores/clapper';
import { useClapperCursorDispatch } from '@/stores/clapper/cursor';
import SelectStyle from '@/styles/Select.module.css';

import ShotNumber from '../ShotNumber';
import ClapperLabel from './ClapperLabel';
import SceneNumberInput from './SceneNumberInput';
import ShotHashList from './ShotHashList';
import ShotNumberList from './ShotNumberList';
import TakeNumberList from './TakeNumberList';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/clapper/Store').ClapperId} props.clapperId
 * @param {import('@/stores/clapper/Store').SlateId} props.slateId
 * @param {number} props.sceneNumber
 * @param {number} props.shotNumber
 * @param {string} props.shotHash
 * @param {number} props.takeNumber
 * @param {boolean} props.disabled
 */
export default function ClapFinderParts({
  className,
  clapperId,
  slateId,
  sceneNumber,
  shotNumber,
  shotHash,
  takeNumber,
  disabled,
}) {
  const UNSAFE_getClapperStore = useUNSAFE_getClapperStore();
  const focusClap = useClapperCursorDispatch((ctx) => ctx.focusClap);
  const changeSceneNumber = useClapperCursorDispatch(
    (ctx) => ctx.changeSceneNumber,
  );
  const changeShotNumber = useClapperCursorDispatch(
    (ctx) => ctx.changeShotNumber,
  );

  /**
   * @param {number} sceneNumber
   */
  function onSceneNumberChange(sceneNumber) {
    changeSceneNumber(sceneNumber);
    changeShotNumber(1);
    focusClap(clapperId, '');
  }

  /**
   * @param {number} shotNumber
   */
  function onShotNumberChange(shotNumber) {
    changeShotNumber(shotNumber);
    focusClap(clapperId, '');
  }

  /**
   * @param {string} shotHash
   */
  function onShotHashChange(shotHash) {
    const store = UNSAFE_getClapperStore();
    const slate = findSlateByShotHash(store, clapperId, shotHash);
    if (slate) {
      changeSceneNumber(slate.sceneNumber);
      changeShotNumber(slate.shotNumber);
    } else {
      changeSceneNumber(1);
      changeShotNumber(1);
    }
    focusClap(clapperId, '');
  }

  /**
   * @param {number} takeNumber
   */
  function onTakeNumberChange(takeNumber) {
    const store = UNSAFE_getClapperStore();
    const clap = findClapBySceneShotTakeNumber(
      store,
      clapperId,
      sceneNumber,
      shotNumber,
      takeNumber,
    );
    if (clap) {
      focusClap(clapperId, clap.clapId);
    } else {
      focusClap(clapperId, '');
    }
  }

  return (
    <fieldset
      className={
        'mx-auto flex flex-row gap-4 overflow-hidden text-[1em]' +
        ' ' +
        className
      }>
      <div className="flex flex-1 flex-col items-center rounded-xl border-2 px-2">
        <ClapperSceneShotNumberField
          clapperId={clapperId}
          sceneNumber={sceneNumber}
          shotNumber={shotNumber}
          onSceneNumberChange={onSceneNumberChange}
          onShotNumberChange={onShotNumberChange}
          disabled={disabled}
        />
        <ClapperShotHashField
          className="ml-auto"
          clapperId={clapperId}
          shotHash={shotHash}
          onShotHashChange={onShotHashChange}
          disabled={disabled}
        />
      </div>
      <ClapperTakeNumberField
        className="flex-1 rounded-xl border-2 px-2"
        clapperId={clapperId}
        slateId={slateId}
        takeNumber={takeNumber}
        onTakeNumberChange={onTakeNumberChange}
        disabled={!slateId || disabled}
      />
    </fieldset>
  );
}

/**
 * @param {object} props
 * @param {string} props.className
 * @param {import('@/stores/clapper/Store').ClapperId} props.clapperId
 * @param {string} props.shotHash
 * @param {boolean} props.disabled
 * @param {(value: string) => void} props.onShotHashChange
 */
function ClapperShotHashField({
  className,
  clapperId,
  shotHash,
  disabled,
  onShotHashChange,
}) {
  return (
    <SelectProvider value={shotHash} setValue={onShotHashChange}>
      <Select className={'flex flex-col' + ' ' + className} disabled={disabled}>
        <output
          style={{ lineHeight: '1em' }}
          className={'text-[1.5em]' + ' ' + className}>
          #{shotHash}
        </output>
      </Select>
      <SelectPopover className={SelectStyle.popover}>
        <ShotHashList clapperId={clapperId} shotHash={shotHash} />
      </SelectPopover>
    </SelectProvider>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/clapper/Store').ClapperId} props.clapperId
 * @param {number} props.sceneNumber
 * @param {number} props.shotNumber
 * @param {boolean} props.disabled
 * @param {(value: number) => void} props.onSceneNumberChange
 * @param {(value: number) => void} props.onShotNumberChange
 */
function ClapperSceneShotNumberField({
  clapperId,
  sceneNumber,
  shotNumber,
  disabled,
  onSceneNumberChange,
  onShotNumberChange,
}) {
  const sceneOutputId = 'clapSceneNo-' + sceneNumber;
  const shotOutputId = 'clapShotNo-' + shotNumber;
  return (
    <div className="flex flex-row gap-1">
      <div className="flex flex-col items-end">
        <ClapperLabel htmlFor={sceneOutputId}>SCENE</ClapperLabel>
        <SceneNumberInput
          id={sceneOutputId}
          sceneNumber={sceneNumber}
          onSceneNumberChange={onSceneNumberChange}
          disabled={disabled}
        />
      </div>
      <SelectProvider
        value={String(shotNumber)}
        setValue={(value) => onShotNumberChange(Number(value))}>
        <Select className="flex flex-col items-start" disabled={disabled}>
          <ClapperLabel htmlFor={shotOutputId}>SHOT</ClapperLabel>
          <output
            id={shotOutputId}
            style={{ lineHeight: '1em' }}
            className="whitespace-pre p-1 text-[3em]">
            {ShotNumber(shotNumber)}
          </output>
        </Select>
        <SelectPopover
          className={'-mt-[4em] text-[2em]' + ' ' + SelectStyle.popover}>
          <ShotNumberList
            clapperId={clapperId}
            sceneNumber={sceneNumber}
            shotNumber={shotNumber}
          />
        </SelectPopover>
      </SelectProvider>
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} props.className
 * @param {import('@/stores/clapper/Store').ClapperId} props.clapperId
 * @param {import('@/stores/clapper/Store').SlateId} props.slateId
 * @param {number} props.takeNumber
 * @param {(value: number) => void} props.onTakeNumberChange
 * @param {boolean} props.disabled
 */
function ClapperTakeNumberField({
  className,
  clapperId,
  slateId,
  takeNumber,
  onTakeNumberChange,
  disabled,
}) {
  const takeOutputId = 'clapTakeNo-' + takeNumber;
  return (
    <SelectProvider
      value={String(takeNumber)}
      setValue={(value) => onTakeNumberChange(Number(value))}>
      <Select
        className={'flex flex-col items-center' + ' ' + className}
        disabled={disabled}>
        <ClapperLabel htmlFor={takeOutputId}>TAKE</ClapperLabel>
        <output
          id={takeOutputId}
          style={{ lineHeight: '1em' }}
          className="translate-y-[25%] scale-y-150 whitespace-nowrap pb-[0.5em] text-[3em]">
          {formatTakeNumber(takeNumber, true)}
        </output>
      </Select>
      <SelectPopover
        className={'-mt-[4em] text-[2em]' + ' ' + SelectStyle.popover}>
        <TakeNumberList
          clapperId={clapperId}
          slateId={slateId}
          takeNumber={takeNumber}
        />
      </SelectPopover>
    </SelectProvider>
  );
}
