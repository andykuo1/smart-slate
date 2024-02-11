import { usePopoverContext } from '@ariakit/react';

import AutoInstallPopover from '@/progressive/AutoInstallPopover';
import { getDeviceInstallIcon } from '@/progressive/DeviceHelper';

const DeviceInstallIcon = getDeviceInstallIcon();

export default function SettingsProjectInstallField() {
  return (
    <AutoInstallPopover autoDisclose={false}>
      <PopoverButton className="mb-2 flex cursor-pointer items-center text-sm text-blue-500 hover:underline">
        <DeviceInstallIcon className="pointer-events-none inline-block h-6 w-6 fill-current" />
        <span className="ml-1">Try installing me as a web app!</span>
      </PopoverButton>
    </AutoInstallPopover>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').ReactNode} [props.children]
 */
function PopoverButton({ className, children }) {
  const store = usePopoverContext();
  function onClick() {
    store?.show();
  }
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
