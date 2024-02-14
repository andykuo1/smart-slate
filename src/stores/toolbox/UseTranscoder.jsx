import { useToolboxStore } from './UseToolboxStore';

export function useTranscoderFFmpeg() {
  return useToolboxStore((ctx) => ctx.transcoder.ffmpeg);
}

export function useTranscoderStatus() {
  return useToolboxStore((ctx) => ctx.transcoder.status);
}
