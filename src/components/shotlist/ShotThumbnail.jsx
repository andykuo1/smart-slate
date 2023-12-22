import {
  Button,
  Popover,
  PopoverArrow,
  PopoverDisclosure,
  PopoverProvider,
  Tab,
  TabList,
  TabPanel,
  TabProvider,
} from '@ariakit/react';
import { useCallback, useRef } from 'react';

import ImageWithCaption from '@/lib/ImageWithCaption';
import { isInputCaptureSupported } from '@/recorder/MediaRecorderSupport';
import { drawElementToCanvasWithRespectToAspectRatio } from '@/recorder/snapshot/VideoSnapshot';
import { shotNumberToChar } from '@/stores/DocumentStore';
import {
  useSceneNumber,
  useSetShotThumbnail,
  useShotNumber,
  useShotThumbnail,
} from '@/stores/DocumentStoreContext';
import PopoverStyle from '@/styles/Popover.module.css';
import TabStyle from '@/styles/Tab.module.css';
import {
  MAX_THUMBNAIL_HEIGHT,
  MAX_THUMBNAIL_WIDTH,
} from '@/values/Resolutions';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').SceneId} props.sceneId
 * @param {import('@/stores/DocumentStore').ShotId} props.shotId
 * @param {boolean} [props.editable]
 */
export default function ShotThumbnail({
  className,
  documentId,
  sceneId,
  shotId,
  editable = false,
}) {
  const sceneNumber = useSceneNumber(documentId, sceneId);
  const shotNumber = useShotNumber(documentId, sceneId, shotId);
  const sceneShotString = `${sceneNumber}${shotNumberToChar(shotNumber)}`;

  return (
    <div className={'relative flex items-center' + ' ' + className}>
      <PopoverProvider>
        <ShotThumbnailImage
          className={'flex-1 bg-gray-300'}
          documentId={documentId}
          shotId={shotId}
          alt={sceneShotString}
        />
        <PopoverDisclosure
          className="absolute left-0 top-0 bottom-0 right-0"
          disabled={!editable}
        />
        <Popover className={PopoverStyle.popover} modal={true}>
          <PopoverArrow className={PopoverStyle.arrow} />
          <TabProvider>
            <TabList
              className={TabStyle.tabList + ' ' + 'flex flex-row'}
              aria-label="Where to get thumbnail images?">
              <Tab className={TabStyle.tab + ' ' + 'flex-1'}>Upload</Tab>
              <Tab className={TabStyle.tab + ' ' + 'flex-1'}>Link</Tab>
              <Tab
                className={TabStyle.tab + ' ' + 'flex-1'}
                disabled={!isInputCaptureSupported()}>
                Camera
              </Tab>
            </TabList>
            <TabPanel className="flex flex-col">
              <ThumbnailOptionUpload documentId={documentId} shotId={shotId} />
            </TabPanel>
            <TabPanel className="flex flex-col">
              <ThumbnailOptionEmbed documentId={documentId} shotId={shotId} />
            </TabPanel>
            <TabPanel className="flex flex-col">
              <ThumbnailOptionCamera documentId={documentId} shotId={shotId} />
            </TabPanel>
          </TabProvider>
        </Popover>
      </PopoverProvider>
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} props.documentId
 * @param {string} props.shotId
 */
function ThumbnailOptionUpload({ documentId, shotId }) {
  const setShotThumbnail = useSetShotThumbnail();
  const inputRef = useRef(/** @type {HTMLInputElement|null} */ (null));
  const canvasRef = useRef(/** @type {HTMLCanvasElement|null} */ (null));

  const handleClick = useCallback(function _handleClick() {
    inputRef.current?.click();
  }, []);

  const handleChange = useCallback(
    function _handleChange() {
      const input = inputRef.current;
      if (!input) {
        return;
      }
      const file = input.files?.[0];
      if (!file) {
        return;
      }
      input.value = '';
      blobToDataURI(
        file,
        MAX_THUMBNAIL_WIDTH,
        MAX_THUMBNAIL_HEIGHT,
        canvasRef,
      ).then((uri) => setShotThumbnail(documentId, shotId, uri));
    },
    [documentId, shotId, setShotThumbnail],
  );

  return (
    <>
      <Button
        className="border rounded-xl p-2 w-full hover:bg-opacity-10 bg-opacity-0 bg-white"
        onClick={handleClick}>
        Upload file
      </Button>
      <canvas ref={canvasRef} className="hidden" />
      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept="image/*"
        onChange={handleChange}
      />
      <p className="opacity-30 text-xs text-center mt-4">
        Please keep image size small :)
      </p>
    </>
  );
}

/**
 * @param {object} props
 * @param {string} props.documentId
 * @param {string} props.shotId
 */
function ThumbnailOptionEmbed({ documentId, shotId }) {
  const inputRef = useRef(/** @type {HTMLInputElement|null} */ (null));
  const setShotThumbnail = useSetShotThumbnail();

  const handleClick = useCallback(
    function _handleClick() {
      const input = inputRef.current;
      if (!input) {
        return;
      }
      const url = input.value;
      input.value = '';
      setShotThumbnail(documentId, shotId, url);
    },
    [documentId, shotId, setShotThumbnail],
  );

  return (
    <>
      <input
        ref={inputRef}
        className="mb-4 p-1 rounded"
        type="url"
        placeholder="Paste image link..."
      />
      <Button
        className="border rounded-xl p-2 w-full hover:bg-opacity-10 bg-opacity-0 bg-white"
        onClick={handleClick}>
        Embed image
      </Button>
      <p className="opacity-30 text-xs text-center mt-4">
        Works with any image from the web
      </p>
    </>
  );
}
/**
 * @param {object} props
 * @param {string} props.documentId
 * @param {string} props.shotId
 */
function ThumbnailOptionCamera({ documentId, shotId }) {
  const inputRef = useRef(/** @type {HTMLInputElement|null} */ (null));
  const canvasRef = useRef(/** @type {HTMLCanvasElement|null} */ (null));
  const setShotThumbnail = useSetShotThumbnail();

  const handleClick = useCallback(function _handleClick() {
    inputRef.current?.click();
  }, []);

  const handleChange = useCallback(
    /** @type {import('react').ChangeEventHandler<HTMLInputElement>} */
    function _handleChange(e) {
      const el = /** @type {HTMLInputElement} */ (e.target);
      const file = el.files?.[0];
      if (!file) {
        return;
      }
      el.value = '';

      // Upload the take.
      blobToDataURI(
        file,
        MAX_THUMBNAIL_WIDTH,
        MAX_THUMBNAIL_HEIGHT,
        canvasRef,
      ).then((uri) => setShotThumbnail(documentId, shotId, uri));
    },
    [documentId, shotId, setShotThumbnail],
  );

  return (
    <>
      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
      />
      <canvas ref={canvasRef} className="hidden" />
      <Button
        className="border rounded-xl p-2 w-full hover:bg-opacity-10 bg-opacity-0 bg-white"
        onClick={handleClick}>
        Take a photo
      </Button>
      <p className="opacity-30 text-xs text-center mt-4">
        Make it something inspiring :)
      </p>
    </>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {string} props.alt
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').ShotId} props.shotId
 */
function ShotThumbnailImage({ className, alt, documentId, shotId }) {
  const thumbnail = useShotThumbnail(documentId, shotId);
  return (
    <ImageWithCaption
      src={thumbnail}
      alt={alt}
      className={'max-w-sm w-[128px] h-[72px]' + ' ' + className}
      usage="add"
    />
  );
}

/**
 * @param {Blob} blob
 * @param {number} maxWidth
 * @param {number} maxHeight
 * @param {import('react').RefObject<HTMLCanvasElement>} canvasRef
 * @returns {Promise<string>}
 */
async function blobToDataURI(blob, maxWidth, maxHeight, canvasRef) {
  return new Promise((resolve, reject) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      reject(new Error('No valid canvas element.'));
      return;
    }
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.addEventListener('load', () => {
      URL.revokeObjectURL(url);
      drawElementToCanvasWithRespectToAspectRatio(
        canvas,
        img,
        img.width,
        img.height,
        maxWidth,
        maxHeight,
      );
      const uri = canvas.toDataURL('image/png', 0.5);
      resolve(uri);
    });
    img.addEventListener('error', reject);
    img.src = url;
  });
}
