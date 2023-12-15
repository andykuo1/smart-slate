// @ts-expect-error Importing virtual module vite-pwa
import { registerSW } from 'virtual:pwa-register';

// NOTE: Until we can control this better, just force push everything.
registerSW({ immediate: true });
