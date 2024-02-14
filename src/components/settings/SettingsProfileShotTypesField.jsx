import { useState } from 'react';

import FieldInput from '@/fields/FieldInput';
import { useSettingsStore } from '@/stores/settings';

export default function SettingsProfileShotTypesField() {
  const customShotTypes = useSettingsStore(
    (ctx) => ctx?.user?.customShotTypes ?? [],
  );
  const setCustomShotTypes = useSettingsStore((ctx) => ctx.setCustomShotTypes);
  const [state, setState] = useState(customShotTypes.join(', '));

  /**
   * @type {import('react').ChangeEventHandler<HTMLInputElement>}
   */
  function onChange(e) {
    let target = e.target;
    setState(target.value);
  }

  /**
   * @type {import('react').ChangeEventHandler<HTMLInputElement>}
   */
  function onBlur(e) {
    let target = e.target;
    let result = target.value
      .split(',')
      .map((value) => value.trim().toUpperCase());
    setCustomShotTypes(result);
    setState(result.join(', '));
  }

  return (
    <FieldInput
      title="Additional Shot Types:"
      id="shot-types"
      placeholder="WS, MS, CU"
      value={state}
      onChange={onChange}
      onBlur={onBlur}
      autoCapitalize="characters"
    />
  );
}
