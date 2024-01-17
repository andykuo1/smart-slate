/**
 * @typedef {File & { directoryHandle?: FileSystemDirectoryHandle, handle?: FileSystemHandle, webkitRelativePath?: string }} FileWithHandles
 */

/**
 * @param {'read'|'readwrite'} mode
 * @returns {Promise<FileWithHandles[]>}
 */
export async function openDirectory(mode = 'read') {
  // Feature detection. The API needs to be supported
  // and the app not run in an iframe.
  const supportsFileSystemAccess =
    'showDirectoryPicker' in window &&
    (() => {
      try {
        return window.self === window.top;
      } catch {
        return false;
      }
    })();
  // If the File System Access API is supported…
  if (supportsFileSystemAccess) {
    /** @type {Promise<File[]>|undefined} */
    let directoryStructure = undefined;

    // @ts-ignore
    const getFiles = async (dirHandle, path = dirHandle.name) => {
      /** @type {Array<Promise<File[]>>} */
      const dirs = [];
      /** @type {Array<Promise<File>>} */
      const files = [];
      // @ts-ignore
      for await (const entry of dirHandle.values()) {
        const nestedPath = `${path}/${entry.name}`;
        if (entry.kind === 'file') {
          files.push(
            entry
              .getFile()
              .then(
                (
                  /** @type {{ directoryHandle: any; handle: any; }} */ file,
                ) => {
                  file.directoryHandle = dirHandle;
                  file.handle = entry;
                  return Object.defineProperty(file, 'webkitRelativePath', {
                    configurable: true,
                    enumerable: true,
                    get: () => nestedPath,
                  });
                },
              ),
          );
        } else if (entry.kind === 'directory') {
          dirs.push(getFiles(entry, nestedPath));
        }
      }
      return [
        ...(await Promise.all(dirs)).flat(),
        ...(await Promise.all(files)),
      ];
    };

    try {
      // @ts-ignore
      const handle = await showDirectoryPicker({
        mode,
      });
      directoryStructure = getFiles(handle, undefined);
      console.log('[DirectoryPicker] Used showDirectoryPicker().');
    } catch (err) {
      let e = /** @type {Error} */ (err);
      if (e.name !== 'AbortError') {
        console.error(e.name, e.message);
      }
    }
    // @ts-ignore
    return directoryStructure;
  }
  // Fallback if the File System Access API is not supported.
  return new Promise((resolve) => {
    /** @type {HTMLInputElement} */
    const input = document.createElement('input');
    input.type = 'file';
    input.webkitdirectory = true;

    input.addEventListener('change', () => {
      let files = Array.from(input.files || []);
      resolve(files);
    });
    if ('showPicker' in HTMLInputElement.prototype) {
      console.log('[DirectoryPicker] Used showPicker().');
      input.showPicker();
    } else {
      console.log('[DirectoryPicker] Used click().');
      input.click();
    }
  });
}
