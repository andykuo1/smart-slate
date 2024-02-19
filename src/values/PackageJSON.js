import PACKAGE_JSON from '../../package.json';

export const PACKAGE_VERSION = PACKAGE_JSON.version;
export const PACKAGE_NAME = PACKAGE_JSON.name.split('/').at(-1);
export const APP_TITLE = 'EagleStudio SmartSlate';
