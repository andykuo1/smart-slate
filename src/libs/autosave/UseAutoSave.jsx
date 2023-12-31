import { useEffect, useState } from 'react';

/**
 * @callback SerializerFunction
 * @param {Record<string, any>} dst The data object to serialize into.
 *
 * @callback DeserializerFunction
 * @param {Record<string, any>} src The data object to deserialize from.
 */

/**
 * Performs auto saving and loading using the given save key from localStorage. On initial call, it will
 * load from storage. For every subsequent state update, it will attempt to save after a short buffer time.
 * If no state changes occur, no saves will be performed.
 *
 * @param {string} saveKey The unique key to save to in localStorage.
 * @param {SerializerFunction} serializer The serializer function to be called on save.
 * @param {DeserializerFunction} deserializer The deserializer function to be called on load.
 * @param {object} [opts] Any additional options.
 * @param {number} [opts.debounceMillis] The number of milliseconds to wait after state change before saving.
 * @param {boolean} [opts.autosave] Whether to automatically save on state update.
 * @param {boolean} [opts.autoload] Whether to automatically load on mount.
 */
export function useAutoSave(saveKey, serializer, deserializer, opts = {}) {
  const { debounceMillis = 1_000, autosave = true, autoload = true } = opts;

  const [init, setInit] = useState(false);
  useEffect(() => {
    if (!init) {
      setInit((init) => {
        if (init || !autoload) {
          return true;
        }
        const saveDataString = localStorage.getItem(saveKey);
        if (saveDataString) {
          try {
            let saveData = JSON.parse(saveDataString);
            deserializer(saveData);
          } catch (e) {
            console.error(e);
          }
        }
        return true;
      });
    } else if (autosave) {
      let shouldPerformSave = true;
      const timeoutHandle = setTimeout(() => {
        if (!shouldPerformSave) {
          return;
        }
        try {
          let saveData = {};
          serializer(saveData);
          if (Object.keys(saveData).length > 0) {
            localStorage.setItem(saveKey, JSON.stringify(saveData));
          } else {
            localStorage.removeItem(saveKey);
          }
        } catch (e) {
          console.error(e);
        }
      }, debounceMillis);
      return () => {
        shouldPerformSave = true;
        clearTimeout(timeoutHandle);
      };
    }
  }, [
    autoload,
    autosave,
    debounceMillis,
    deserializer,
    init,
    saveKey,
    serializer,
  ]);
}
