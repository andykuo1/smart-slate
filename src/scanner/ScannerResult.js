/**
 * @typedef {Record<string, ScannerResult>&{ status: string }} ScannerOutput
 */

/**
 * @typedef {import('react').RefObject<ScannerOutput>} ScannerOutputRef
 */

/**
 * @callback OnScannerChangeCallback
 * @param {{ target: { value: ScannerOutput } }} e
 */

/**
 * @param {ScannerOutput} output
 */
export function createScannerChangeEvent(output) {
  return {
    target: {
      value: output,
    },
  };
}

/**
 * @typedef {ReturnType<createScannerResult>} ScannerResult
 */

/**
 * @param {import('./DirectoryPicker').FileWithHandles|null} file
 */
export function createScannerResult(file) {
  return {
    file,
    index: 0,
    code: '',
    snapshot: '',
    value: '',
    status: '',
    takeId: '',
    /** @type {{ projectId: string, shotHash: string }|null} */
    takeInfo: null,
  };
}

/**
 * @param {ScannerResult} out
 * @param {string} status
 */
export function updateScannerStatus(out, status) {
  out.status = status;
  return out;
}

/**
 * @param {ScannerResult} out
 * @param {number} index
 */
export function readyScanner(out, index) {
  out.status = '[READY]';
  out.index = index;
  return out;
}

/**
 * @param {ScannerResult} out
 * @param {import('@/stores/document/DocumentStore').TakeId} takeId
 */
export function attachTakeIdScanner(out, takeId) {
  out.takeId = takeId;
  return out;
}

/**
 * @param {ScannerResult} out
 * @param {{ projectId: string, shotHash: string }} takeInfo
 */
export function attachTakeInfoScanner(out, takeInfo) {
  out.takeInfo = takeInfo;
  return out;
}

/**
 * @param {ScannerResult} out
 */
export function skipScanner(out) {
  for (let key of Object.keys(out)) {
    // @ts-expect-error Skip should just make this look empty.
    delete out[key];
  }
  out.status = '[SKIP]';
  return out;
}

/**
 * @param {ScannerResult} out
 * @param {string} status
 * @param {boolean} [force]
 */
export function failScanner(out, status, force = true) {
  out.status = status;
  if (force) {
    out.file = null;
  }
  return out;
}

/**
 * @param {ScannerResult} out
 * @param {any} error
 * @param {boolean} [forceFailure]
 */
export function errorScanner(out, error, forceFailure = true) {
  if (error instanceof Error) {
    return failScanner(out, `[ERROR: ${error.message}]`, forceFailure);
  } else if (typeof error === 'string') {
    return failScanner(out, `[ERROR: ${error}]`, forceFailure);
  } else {
    return failScanner(out, `[ERROR: not an error? - ${error}]`, forceFailure);
  }
}

/**
 * @param {ScannerResult} out
 */
export function isScannerFailure(out) {
  return typeof out !== 'object' || !('file' in out) || !out.file;
}
