import {
  Select,
  SelectItem,
  SelectPopover,
  SelectProvider,
} from '@ariakit/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import AddIcon from '@material-symbols/svg-400/rounded/add.svg';
import QRCode2AddIcon from '@material-symbols/svg-400/rounded/qr_code_2_add.svg';
import ThumbUpFillIcon from '@material-symbols/svg-400/rounded/thumb_up-fill.svg';
import ThumbUpIcon from '@material-symbols/svg-400/rounded/thumb_up.svg';

import { useQRCodeCanvas } from '@/clapper/UseQRCodeCanvas';
import {
  formatSceneNumber,
  formatShotNumber,
  formatTakeNumber,
} from '@/components/takes/TakeNameFormat';
import FieldButton from '@/fields/FieldButton';
import { useInterval } from '@/libs/UseInterval';
import {
  findClapBySceneShotTakeNumber,
  findShotHashBySceneShotNumber,
  findShotHashByShotHashString,
  getClapById,
  getClapperById,
  getShotHashById,
  useClapComments,
  useClapPrintRating,
  useClapQRCodeKey,
  useClapperDispatch,
  useClapperProductionTitle,
  useClapperStore,
  useUNSAFE_getClapperStore,
} from '@/stores/clapper';
import { createClap } from '@/stores/clapper/Store';
import {
  useClapperCursorClapId,
  useClapperCursorDispatch,
  useClapperCursorRollName,
  useClapperCursorSceneNumber,
  useClapperCursorShotNumber,
} from '@/stores/clapper/cursor';
import { useSettingsStore } from '@/stores/settings';
import SelectStyle from '@/styles/Select.module.css';

/**
 * @param {object} props
 * @param {import('@/stores/clapper/Store').ClapperId} props.clapperId
 */
export default function ClapperParts({ clapperId }) {
  const preferDarkSlate = useSettingsStore((ctx) => ctx.user?.preferDarkSlate);

  const UNSAFE_getClapperStore = useUNSAFE_getClapperStore();
  const finalizeClap = useClapperDispatch((ctx) => ctx.finalizeClap);

  const clapId = useClapperCursorClapId();
  const sceneNumber = useClapperCursorSceneNumber();
  const changeSceneNumber = useClapperCursorDispatch(
    (ctx) => ctx.changeSceneNumber,
  );
  const shotNumber = useClapperCursorShotNumber();
  const changeShotNumber = useClapperCursorDispatch(
    (ctx) => ctx.changeShotNumber,
  );

  const rollName = useClapperStore(
    (ctx) => getClapById(ctx, clapperId, clapId)?.rollName ?? '',
  );
  const changeRollName = useClapperDispatch((ctx) => ctx.changeClapRollName);
  const nextRollName = useClapperCursorRollName();
  const changeNextRollName = useClapperCursorDispatch(
    (ctx) => ctx.changeRollName,
  );
  const shotHash = useClapperStore((ctx) =>
    findShotHashBySceneShotNumber(ctx, clapperId, sceneNumber, shotNumber),
  );

  const productionTitle = useClapperProductionTitle(clapperId);
  const changeProductionTitle = useClapperDispatch(
    (ctx) => ctx.changeProductionTitle,
  );

  const printRating = useClapPrintRating(clapperId, clapId);
  const toggleClapPrintRating = useClapperDispatch(
    (ctx) => ctx.toggleClapPrintRating,
  );

  const comments = useClapComments(clapperId, clapId);
  const changeClapComments = useClapperDispatch(
    (ctx) => ctx.changeClapComments,
  );

  const qrCodeKey = useClapQRCodeKey(clapperId, clapId);
  const focusClap = useClapperCursorDispatch((ctx) => ctx.focusClap);

  const takeNumber = useClapperStore(
    (ctx) => getClapById(ctx, clapperId, clapId)?.takeNumber ?? 0,
  );
  const nextTakeNumber = useClapperStore(
    (ctx) =>
      getShotHashById(ctx, clapperId, shotHash?.shotHashId ?? '')
        ?.nextTakeNumber ?? 1,
  );

  /**
   * @param {number} sceneNumber
   */
  function onSceneNumberChange(sceneNumber) {
    changeSceneNumber(sceneNumber);
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
   * @param {string} shotHashString
   */
  function onShotHashChange(shotHashString) {
    const store = UNSAFE_getClapperStore();
    const shotHash = findShotHashByShotHashString(
      store,
      clapperId,
      shotHashString,
    );
    if (shotHash) {
      changeSceneNumber(shotHash.sceneNumber);
      changeShotNumber(shotHash.shotNumber);
    } else {
      changeSceneNumber(0);
      changeShotNumber(0);
    }
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

  function onNewTakeClick() {
    focusClap(clapperId, '');
  }

  function onQRCodeClick() {
    if (clapId) {
      // NOTE: Clap already exists, so qr code must also be generated!
      return;
    }
    let clap = createClap();
    finalizeClap(clapperId, sceneNumber, shotNumber, rollName, clap);
    focusClap(clapperId, clap.clapId);
  }

  /**
   * @param {string} value
   */
  function onRollNameChange(value) {
    if (clapId) {
      changeRollName(clapperId, clapId, value);
    }
    // Always change the buffered value.
    changeNextRollName(value);
  }

  const portraitStyle = 'portrait:flex portrait:flex-col';
  const landscapeStyle =
    'landscape:grid landscape:grid-cols-2 landscape:grid-rows-1';
  const smallestStyle = 'flex flex-col';
  const smallStyle = 'sm:grid sm:grid-cols-2 sm:grid-rows-1';

  return (
    <div
      className={
        'flex h-full w-full flex-col gap-x-4 gap-y-0 p-[2em] text-[3vmin]' +
        ' ' +
        smallestStyle +
        ' ' +
        smallStyle +
        ' ' +
        landscapeStyle +
        ' ' +
        portraitStyle
      }>
      <div className="flex flex-col">
        <ClapperProductionTitleField
          className="-mt-2 mb-1 w-full truncate text-center text-[3em] disabled:opacity-100"
          value={productionTitle}
          onChange={(e) =>
            changeProductionTitle(clapperId, e.target.value.toUpperCase())
          }
          disabled={!clapperId}
        />
        <ClapperIdentifierFields
          className="w-full"
          clapperId={clapperId}
          shotHashId={shotHash?.shotHashId ?? ''}
          sceneNumber={sceneNumber}
          shotNumber={shotNumber}
          shotHash={shotHash?.string || '----'}
          takeNumber={clapId ? takeNumber : nextTakeNumber}
          disabled={!clapperId}
          onSceneNumberChange={onSceneNumberChange}
          onShotNumberChange={onShotNumberChange}
          onShotHashChange={onShotHashChange}
          onTakeNumberChange={onTakeNumberChange}
        />
        <div className="my-2 w-full px-2" />
        <div className="hidden flex-1 flex-col sm:flex portrait:hidden landscape:flex">
          <fieldset className="mx-auto flex w-full flex-row gap-4 overflow-hidden rounded-xl border-2 px-4 font-mono">
            <ClapperDateField />
            <ul className="my-auto flex flex-1 flex-col items-center text-[1.5vmin]"></ul>
            <ClapperRollField
              value={clapId ? rollName : nextRollName}
              onChange={onRollNameChange}
            />
          </fieldset>
          <div className="flex w-full flex-1 flex-row gap-1 short:hidden">
            <ClapperCommentField
              value={comments}
              onChange={(e) =>
                changeClapComments(clapperId, clapId, e.target.value)
              }
              disabled={!clapperId}
            />
            <ClapperPrintButton
              printed={printRating > 0}
              onClick={() => toggleClapPrintRating(clapperId, clapId)}
              disabled={!clapId}
            />
          </div>
        </div>
      </div>
      <div
        className={
          'flex flex-1 flex-row gap-4' +
          ' ' +
          'sm:flex-row portrait:flex-col landscape:flex-row'
        }>
        <div
          className={
            'min-h-[40vh] flex-1 overflow-hidden rounded-xl' +
            ' ' +
            (preferDarkSlate ? 'bg-black text-white' : 'bg-white text-black')
          }>
          <ClapperQRCodeField qrCodeKey={qrCodeKey} onClick={onQRCodeClick} />
        </div>
        <ClapperControlFields
          className="rounded-xl font-bold"
          onClick={onNewTakeClick}
          disabled={!qrCodeKey}
        />
      </div>
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {string} [props.qrCodeKey]
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} [props.onClick]
 */
function ClapperQRCodeField({ className, qrCodeKey, onClick }) {
  return (
    <button
      className={'flex h-full w-full items-center' + ' ' + className}
      onClick={onClick}>
      {qrCodeKey ? (
        <QRCodeView data={qrCodeKey} />
      ) : (
        <div className="m-auto flex flex-col">
          <QRCode2AddIcon className="m-auto h-32 w-32 fill-current" />
        </div>
      )}
    </button>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {string} props.data
 */
function QRCodeView({ className, data }) {
  const containerRef = useRef(/** @type {HTMLDivElement|null} */ (null));
  const canvasRef = useRef(/** @type {HTMLCanvasElement|null} */ (null));
  useQRCodeCanvas(data, containerRef, canvasRef);
  return (
    <div
      ref={containerRef}
      className={'relative flex h-full w-full items-center' + ' ' + className}>
      <canvas
        ref={canvasRef}
        className="absolute bottom-0 left-0 right-0 top-0 mx-auto block h-full w-full"
      />
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {string} props.name
 * @param {string} props.value
 * @param {string} [props.placeholder]
 * @param {import('react').FocusEventHandler<HTMLInputElement>} [props.onFocus]
 * @param {import('react').FormEventHandler<HTMLInputElement>} props.onChange
 * @param {boolean} [props.disabled]
 * @param {'sentences'|'words'|'characters'|'on'|'off'|'none'} [props.autoCapitalize]
 */
function ClapperInput({
  className,
  name,
  value,
  placeholder,
  onFocus,
  onChange,
  disabled = !onChange,
  autoCapitalize,
}) {
  return (
    <input
      className={
        'w-full bg-transparent' +
        ' ' +
        (autoCapitalize === 'characters' ? 'uppercase' : '') +
        ' ' +
        className
      }
      style={{ lineHeight: '1em' }}
      type="text"
      name={name}
      value={value}
      onFocus={onFocus}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      autoCapitalize={autoCapitalize}
    />
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {string} props.value
 * @param {boolean} props.disabled
 * @param {import('react').ChangeEventHandler<HTMLInputElement>} props.onChange
 */
function ClapperProductionTitleField({ className, value, disabled, onChange }) {
  return (
    <ClapperInput
      className={'uppercase' + ' ' + className}
      name="production-title"
      value={value}
      placeholder="MOVIE"
      onChange={onChange}
      autoCapitalize="characters"
      disabled={disabled}
    />
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} props.onClick
 * @param {boolean} props.disabled
 */
function ClapperControlFields({ className, onClick, disabled }) {
  return (
    <FieldButton
      className={'flex items-center gap-2 landscape:flex-col' + ' ' + className}
      Icon={AddIcon}
      title="New take"
      onClick={onClick}
      disabled={disabled}>
      <div className="whitespace-nowrap landscape:vertical-rl">NEW TAKE</div>
    </FieldButton>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {boolean} props.printed
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} props.onClick
 * @param {boolean} props.disabled
 */
function ClapperPrintButton({ className, printed, onClick, disabled }) {
  return (
    <FieldButton
      className={
        'relative mt-auto flex flex-col pb-[0.5em] text-[2em] outline-none' +
        ' ' +
        className
      }
      Icon={printed ? ThumbUpFillIcon : ThumbUpIcon}
      title="Mark good take"
      onClick={onClick}
      disabled={disabled}>
      <span
        className={
          'absolute bottom-0 left-0 right-0 translate-y-[25%] text-[0.5em]' +
          ' ' +
          (!printed ? 'line-through' : '')
        }>
        PRINT
      </span>
    </FieldButton>
  );
}

function ClapperDateField() {
  const { year, month, day } = useRealTimeDate();
  return (
    <div className="m-auto flex flex-col items-center">
      <div className="flex flex-row gap-1 text-[1.5em]">
        <span>{getMonthString(month)}</span>
        <span>{String(day).padStart(2, '0')}</span>
      </div>
      <div className="text-[2em]">{year}</div>
    </div>
  );
}

/**
 * @param {number} month
 */
function getMonthString(month) {
  switch (month) {
    case 0:
      return 'JAN';
    case 1:
      return 'FEB';
    case 2:
      return 'MAR';
    case 3:
      return 'APR';
    case 4:
      return 'MAY';
    case 5:
      return 'JUN';
    case 6:
      return 'JUL';
    case 7:
      return 'AUG';
    case 8:
      return 'SEP';
    case 9:
      return 'OCT';
    case 10:
      return 'NOV';
    case 11:
      return 'DEC';
    default:
      return '---';
  }
}

function useRealTimeDate() {
  const [date, setDate] = useState({ year: 0, month: 0, day: 0 });

  const onInterval = useCallback(
    function _onInterval() {
      let now = new Date();
      setDate({
        year: now.getFullYear(),
        month: now.getMonth(),
        day: now.getDate(),
      });
    },
    [setDate],
  );
  useInterval(onInterval, 1_000);
  // NOTE: Run once at the start.
  useEffect(onInterval, [onInterval]);
  return date;
}

/**
 * @param {object} props
 * @param {string} props.value
 * @param {(value: string) => void} props.onChange
 */
function ClapperRollField({ value, onChange }) {
  return (
    <div className="flex flex-1 flex-col items-center">
      <ClapperLabel className="text-[1em]">ROLL</ClapperLabel>
      <ClapperInput
        className="w-full translate-y-[25%] scale-y-150 rounded-xl bg-gray-900 text-center text-[2em] uppercase"
        name="camera-roll"
        value={value}
        onChange={(e) => {
          const value = /** @type {HTMLInputElement} */ (
            e.target
          ).value.toUpperCase();
          onChange(value);
        }}
        onFocus={(e) => e.target.select()}
        autoCapitalize="characters"
      />
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} props.value
 * @param {boolean} props.disabled
 * @param {import('react').ChangeEventHandler<HTMLTextAreaElement>} props.onChange
 */
function ClapperCommentField({ value, disabled, onChange }) {
  return (
    <textarea
      style={{ lineHeight: '1em' }}
      className="my-1 w-full resize-none rounded-xl bg-transparent p-2 font-mono text-[1.5em] placeholder:opacity-30"
      value={value}
      onChange={onChange}
      placeholder="Comments"
      disabled={disabled}
    />
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/clapper/Store').ClapperId} props.clapperId
 * @param {import('@/stores/clapper/Store').ShotHashId} props.shotHashId
 * @param {number} props.sceneNumber
 * @param {number} props.shotNumber
 * @param {string} props.shotHash
 * @param {number} props.takeNumber
 * @param {boolean} props.disabled
 * @param {(value: number) => void} props.onSceneNumberChange
 * @param {(value: number) => void} props.onShotNumberChange
 * @param {(value: string) => void} props.onShotHashChange
 * @param {(value: number) => void} props.onTakeNumberChange
 */
function ClapperIdentifierFields({
  className,
  clapperId,
  shotHashId,
  sceneNumber,
  shotNumber,
  shotHash,
  takeNumber,
  onSceneNumberChange,
  onShotNumberChange,
  onShotHashChange,
  onTakeNumberChange,
  disabled,
}) {
  return (
    <fieldset
      className={
        'mx-auto flex flex-row gap-4 overflow-hidden font-mono text-[1em]' +
        ' ' +
        className
      }>
      <div className="flex flex-1 flex-col items-center rounded-xl border-2 px-2">
        <ClapperSceneShotNumberField
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
        shotHashId={shotHashId}
        takeNumber={takeNumber}
        onTakeNumberChange={onTakeNumberChange}
        disabled={!shotHashId || disabled}
      />
    </fieldset>
  );
}

/**
 * @param {object} props
 * @param {number} props.sceneNumber
 */
function SceneNumberList({ sceneNumber }) {
  let result = [];
  for (let i = 1; i < sceneNumber; ++i) {
    result.push(
      <SelectItem
        key={'scene.' + i}
        className={'whitespace-pre' + ' ' + SelectStyle.selectItem}
        value={String(i)}>
        {formatSceneNumber(i, true).padStart(3, '0')}
      </SelectItem>,
    );
  }
  result.push(
    <SelectItem
      key={'scene.' + sceneNumber}
      className={'whitespace-pre bg-blue-100' + ' ' + SelectStyle.selectItem}
      value={String(sceneNumber)}>
      {formatSceneNumber(sceneNumber, true).padStart(3, '0')}
    </SelectItem>,
  );
  let max = sceneNumber + 100;
  for (let i = sceneNumber + 1; i < max; ++i) {
    result.push(
      <SelectItem
        key={'scene.' + i}
        className={
          'whitespace-pre text-gray-300' + ' ' + SelectStyle.selectItem
        }
        value={String(i)}>
        {formatSceneNumber(i, true).padStart(3, '0')}
      </SelectItem>,
    );
  }
  return result;
}

/**
 * @param {object} props
 * @param {number} props.shotNumber
 */
function ShotNumberList({ shotNumber }) {
  let result = [];
  for (let i = 1; i < shotNumber; ++i) {
    result.push(
      <SelectItem
        key={'shot.' + i}
        className={'whitespace-pre' + ' ' + SelectStyle.selectItem}
        value={String(i)}>
        {formatShotNumber(i).padEnd(2, ' ')}
      </SelectItem>,
    );
  }
  result.push(
    <SelectItem
      key={'shot.' + shotNumber}
      className={'whitespace-pre bg-blue-100' + ' ' + SelectStyle.selectItem}
      value={String(shotNumber)}>
      {formatShotNumber(shotNumber).padEnd(2, ' ')}
    </SelectItem>,
  );
  let max = shotNumber + 26;
  for (let i = shotNumber + 1; i < max; ++i) {
    result.push(
      <SelectItem
        key={'shot.' + i}
        className={
          'whitespace-pre text-gray-300' + ' ' + SelectStyle.selectItem
        }
        value={String(i)}>
        {formatShotNumber(i).padEnd(2, ' ')}
      </SelectItem>,
    );
  }
  return result;
}

/**
 * @param {object} props
 * @param {import('@/stores/clapper/Store').ClapperId} props.clapperId
 * @param {string} props.shotHash
 */
function ShotHashList({ clapperId, shotHash }) {
  const shotHashes = useClapperStore(
    useShallow((ctx) =>
      Object.keys(getClapperById(ctx, clapperId)?.shotHashStrings ?? {}),
    ),
  );
  let result = [];
  for (let shotHash of shotHashes) {
    result.push(
      <SelectItem
        key={'shothash.' + shotHash}
        className={'whitespace-pre' + ' ' + SelectStyle.selectItem}
        value={shotHash}>
        #{shotHash}
      </SelectItem>,
    );
  }
  return result;
}

/**
 * @param {object} props
 * @param {import('@/stores/clapper/Store').ClapperId} props.clapperId
 * @param {import('@/stores/clapper/Store').ShotHashId} props.shotHashId
 * @param {number} props.takeNumber
 */
function TakeNumberList({ clapperId, shotHashId, takeNumber }) {
  const nextTakeNumber = useClapperStore(
    (ctx) => getShotHashById(ctx, clapperId, shotHashId)?.nextTakeNumber,
  );
  let result = [];
  for (let i = 1; i < nextTakeNumber; ++i) {
    result.push(
      <SelectItem
        key={'take.' + i}
        className={
          'whitespace-pre' +
          ' ' +
          (takeNumber === i ? 'bg-blue-100' : '') +
          ' ' +
          SelectStyle.selectItem
        }
        value={String(i)}>
        {formatTakeNumber(i).padStart(2, '0')}
      </SelectItem>,
    );
  }
  result.push(
    <SelectItem
      key={'take.' + nextTakeNumber}
      className={'whitespace-pre' + ' ' + SelectStyle.selectItem}
      value={String(nextTakeNumber)}>
      {formatTakeNumber(nextTakeNumber).padStart(2, '0')}
    </SelectItem>,
  );
  return result;
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
 * @param {number} props.sceneNumber
 * @param {number} props.shotNumber
 * @param {boolean} props.disabled
 * @param {(value: number) => void} props.onSceneNumberChange
 * @param {(value: number) => void} props.onShotNumberChange
 */
function ClapperSceneShotNumberField({
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
      <SelectProvider
        value={String(sceneNumber)}
        setValue={(value) => onSceneNumberChange(Number(value))}>
        <Select className="flex flex-col items-end" disabled={disabled}>
          <ClapperLabel htmlFor={sceneOutputId}>SCENE</ClapperLabel>
          <output
            id={sceneOutputId}
            style={{ lineHeight: '1em' }}
            className="whitespace-pre text-[3em]">
            {formatSceneNumber(sceneNumber, true).padStart(3, '0')}
          </output>
        </Select>
        <SelectPopover
          className={'-mt-[4em] text-[2em]' + ' ' + SelectStyle.popover}>
          <SceneNumberList sceneNumber={sceneNumber} />
        </SelectPopover>
      </SelectProvider>
      <SelectProvider
        value={String(shotNumber)}
        setValue={(value) => onShotNumberChange(Number(value))}>
        <Select className="flex flex-col" disabled={disabled}>
          <ClapperLabel htmlFor={shotOutputId}>SHOT</ClapperLabel>
          <output
            id={shotOutputId}
            style={{ lineHeight: '1em' }}
            className="whitespace-pre text-[3em]">
            {shotNumber <= 0
              ? '--'
              : formatShotNumber(shotNumber).padEnd(2, ' ')}
          </output>
        </Select>
        <SelectPopover
          className={'-mt-[4em] text-[2em]' + ' ' + SelectStyle.popover}>
          <ShotNumberList shotNumber={shotNumber} />
        </SelectPopover>
      </SelectProvider>
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} props.className
 * @param {import('@/stores/clapper/Store').ClapperId} props.clapperId
 * @param {import('@/stores/clapper/Store').ShotHashId} props.shotHashId
 * @param {number} props.takeNumber
 * @param {(value: number) => void} props.onTakeNumberChange
 * @param {boolean} props.disabled
 */
function ClapperTakeNumberField({
  className,
  clapperId,
  shotHashId,
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
          shotHashId={shotHashId}
          takeNumber={takeNumber}
        />
      </SelectPopover>
    </SelectProvider>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {string} [props.htmlFor]
 * @param {import('react').ReactNode} [props.children]
 */
function ClapperLabel({ className, htmlFor, children }) {
  return (
    <label className={'text-[1em]' + ' ' + className} htmlFor={htmlFor}>
      {children}
    </label>
  );
}
