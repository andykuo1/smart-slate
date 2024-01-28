import { usePopoverContext } from '@ariakit/react';

import AutoInstallPopover from '@/progressive/AutoInstallPopover';
import { getDeviceInstallIcon } from '@/progressive/DeviceHelper';

const DeviceInstallIcon = getDeviceInstallIcon();

export default function SettingsProjectInstallField() {
  return (
    <AutoInstallPopover autoDisclose={false}>
      <PopoverButton className="flex mb-2 text-sm items-center text-blue-500 cursor-pointer hover:underline">
        <DeviceInstallIcon className="inline-block w-6 h-6 fill-current pointer-events-none" />
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
