import { useCallback, useEffect, useRef, useState } from 'react';

import AddIcon from '@material-symbols/svg-400/rounded/add.svg';
import QRCode2AddIcon from '@material-symbols/svg-400/rounded/qr_code_2_add.svg';
import ThumbUpFillIcon from '@material-symbols/svg-400/rounded/thumb_up-fill.svg';
import ThumbUpIcon from '@material-symbols/svg-400/rounded/thumb_up.svg';

import ClapperVerticalLabel from '@/clapper/ClapperVerticalLabel';
import { useQRCodeCanvas } from '@/clapper/UseQRCodeCanvas';
import FieldButton from '@/fields/FieldButton';
import { useInterval } from '@/libs/UseInterval';
import {
  findSlateBySceneShotNumber,
  getClapById,
  getClapperDetailsById,
  getSlateById,
  useClapPrintRating,
  useClapQRCodeKey,
  useClapperDispatch,
  useClapperProductionTitle,
  useClapperStore,
} from '@/stores/clapper';
import {
  useClapperCursorClapId,
  useClapperCursorDispatch,
  useClapperCursorSceneNumber,
  useClapperCursorShotNumber,
  useClapperCursorSlateId,
} from '@/stores/clapper/cursor';
import {
  useClapperSettingsBlackboard,
  useClapperSettingsStore,
} from '@/stores/clapper/settings';

import { useClapCapture } from './parts/ClapCaptureParts';
import ClapCommentParts from './parts/ClapCommentParts';
import ClapFinderParts from './parts/ClapFinderParts';
import ClapRollParts from './parts/ClapRollParts';

/**
 * @param {object} props
 * @param {import('@/stores/clapper/Store').ClapperId} props.clapperId
 */
export default function ClapperParts({ clapperId }) {
  const blackboard = useClapperSettingsBlackboard();

  const clapId = useClapperCursorClapId();
  const slateId = useClapperCursorSlateId();

  const cursorSceneNumber = useClapperCursorSceneNumber();
  const clapSceneNumber = useClapperStore(
    (ctx) => getClapById(ctx, clapperId, clapId)?.sceneNumber ?? 0,
  );
  const sceneNumber = clapId ? clapSceneNumber : cursorSceneNumber;

  const cursorShotNumber = useClapperCursorShotNumber();
  const clapShotNumber = useClapperStore(
    (ctx) => getClapById(ctx, clapperId, clapId)?.shotNumber ?? 0,
  );
  const shotNumber = clapId ? clapShotNumber : cursorShotNumber;

  const slate = useClapperStore((ctx) =>
    findSlateBySceneShotNumber(ctx, clapperId, sceneNumber, shotNumber),
  );

  const productionTitle = useClapperProductionTitle(clapperId);
  const changeProductionTitle = useClapperDispatch(
    (ctx) => ctx.changeProductionTitle,
  );

  const printRating = useClapPrintRating(clapperId, clapId);
  const toggleClapPrintRating = useClapperDispatch(
    (ctx) => ctx.toggleClapPrintRating,
  );

  const qrCodeKey = useClapQRCodeKey(clapperId, clapId);
  const focusClap = useClapperCursorDispatch((ctx) => ctx.focusClap);

  const takeNumber = useClapperStore(
    (ctx) => getClapById(ctx, clapperId, clapId)?.takeNumber ?? 0,
  );
  const nextTakeNumber = useClapperStore(
    (ctx) =>
      getSlateById(ctx, clapperId, slate?.slateId ?? '')?.nextTakeNumber ?? 1,
  );

  function onNewTakeClick() {
    focusClap(clapperId, slateId, '');
  }

  const capture = useClapCapture();
  function onQRCodeClick() {
    if (clapId) {
      return;
    }
    capture(clapperId, slateId);
  }

  const portraitStyle = 'portrait:flex portrait:flex-col';
  const landscapeStyle =
    'landscape:grid landscape:grid-cols-2 landscape:grid-rows-1';
  const smallestStyle = 'flex flex-col';
  const smallStyle = 'sm:grid sm:grid-cols-2 sm:grid-rows-1';

  return (
    <div
      className={
        'flex h-full w-full flex-col gap-x-4 gap-y-0 p-[2em] font-mono text-[3vmin]' +
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
        <ClapFinderParts
          className="w-full"
          clapperId={clapperId}
          slateId={slate?.slateId ?? ''}
          sceneNumber={sceneNumber}
          shotHash={slate?.shotHash || '----'}
          takeNumber={clapId ? takeNumber : nextTakeNumber}
          disabled={!clapperId}
        />
        <div className="my-2 w-full px-2" />
        <div className="hidden flex-1 flex-col sm:flex portrait:hidden landscape:flex">
          <fieldset className="mx-auto flex w-full flex-row gap-4 overflow-hidden rounded-xl border-2 px-4 font-mono">
            <ClapperDateField />
            <ul className="my-auto flex flex-1 flex-col items-center text-[1.5vmin]"></ul>
            <ClapRollParts clapperId={clapperId} clapId={clapId} />
          </fieldset>
          <div className="flex w-full flex-1 flex-row gap-1 short:hidden">
            <div className="flex w-[calc(100%-4em)] flex-col">
              <ClapCommentParts clapperId={clapperId} clapId={clapId} />
              <ClapperCreditFields clapperId={clapperId} />
            </div>
            <ClapperPrintButton
              className="flex-1"
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
            (blackboard ? 'bg-black text-white' : 'bg-white text-black')
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
 * @param {import('@/stores/clapper/Store').ClapperId} props.clapperId
 */
function ClapperCreditFields({ clapperId }) {
  const directorName = useClapperStore(
    (ctx) => getClapperDetailsById(ctx, clapperId)?.directorName,
  );
  const cameraName = useClapperStore(
    (ctx) => getClapperDetailsById(ctx, clapperId)?.cameraName,
  );
  const enableCrewNames = useClapperSettingsStore((ctx) => ctx.enableCrewNames);
  if (!enableCrewNames) {
    return null;
  }
  return (
    <div className="flex flex-col overflow-hidden">
      {directorName && (
        <p className="flex items-center uppercase">
          <ClapperVerticalLabel>DIR</ClapperVerticalLabel>
          {directorName}
        </p>
      )}
      {cameraName && (
        <p className="flex items-center uppercase">
          <ClapperVerticalLabel>CAM</ClapperVerticalLabel>
          {cameraName}
        </p>
      )}
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {string} [props.qrCodeKey]
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} [props.onClick]
 * @param {boolean} [props.disabled]
 */
function ClapperQRCodeField({ className, qrCodeKey, onClick, disabled }) {
  return (
    <button
      className={'flex h-full w-full items-center' + ' ' + className}
      onClick={onClick}
      disabled={disabled}>
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
      placeholder="MYMOVIE"
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
