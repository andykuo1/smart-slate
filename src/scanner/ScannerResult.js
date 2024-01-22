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
 */
export function skipScanner(out) {
  return failScanner(out, '[SKIP]');
}

/**
 * @param {ScannerResult} out
 * @param {string} status
 */
export function failScanner(out, status) {
  out.status = status;
  out.file = null;
  return out;
}

/**
 * @param {ScannerResult} out
 * @param {any} error
 */
export function errorScanner(out, error) {
  if (error instanceof Error) {
    return failScanner(out, `[ERROR: ${error.message}]`);
  } else if (typeof error === 'string') {
    return failScanner(out, `[ERROR: ${error}]`);
  } else {
    return failScanner(out, `[ERROR: not an error? - ${error}]`);
  }
}

/**
 * @param {ScannerResult} out
 */
export function isScannerFailure(out) {
  return typeof out !== 'object' || !('file' in out) || !out.file;
}
