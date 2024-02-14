import { useEffect } from 'react';

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

import {
  FFmpegLogging,
  getFFmpegHelp,
  getFFmpegSupportedCodecs,
} from '@/scanner/FFmpegTranscoder';
import { useToolboxStore } from '@/stores/toolbox/UseToolboxStore';
import {
  useTranscoderFFmpeg,
  useTranscoderStatus,
} from '@/stores/toolbox/UseTranscoder';

export default function ScannerTranscoderInit() {
  const currentFFmpeg = useTranscoderFFmpeg();
  const status = useTranscoderStatus();
  const setCurrentFFmpeg = useToolboxStore((ctx) => ctx.setTranscoderFFmpeg);
  const setStatus = useToolboxStore((ctx) => ctx.setTranscoderStatus);
  const setLogger = useToolboxStore((ctx) => ctx.setTranscoderLogger);
  const setCodecs = useToolboxStore((ctx) => ctx.setTranscoderCodecs);

  useEffect(() => {
    if (currentFFmpeg && status !== 'unloaded') {
      return;
    }

    const ffmpeg = new FFmpeg();
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
    // NOTE: For multi-threading...
    // const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm';
    const logging = new FFmpegLogging(ffmpeg, true);
    setCurrentFFmpeg(ffmpeg);
    setLogger(logging);
    setStatus('loading');

    (async () => {
      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          'text/javascript',
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          'application/wasm',
        ),
        /*
        workerURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.worker.js`,
          'text/javascript',
        ),
        */
      });
      if ((await getFFmpegHelp(ffmpeg)).length <= 0) {
        console.log('Failed to start ffmpeg!');
      } else {
        console.log('FFmpeg is ready!');
      }

      const supportedCodecs = await getFFmpegSupportedCodecs(ffmpeg);
      setCodecs(supportedCodecs);
    })()
      .then(() => setStatus('ready'))
      .catch(() => setStatus('error'));
  }, [
    currentFFmpeg,
    setCodecs,
    setCurrentFFmpeg,
    setLogger,
    setStatus,
    status,
  ]);
  return null;
}
