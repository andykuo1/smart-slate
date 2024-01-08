import { TabPanel } from '@ariakit/react';

/**
 * @param {object} props
 * @param {string} props.documentId
 * @param {string} props.shotId
 */
export default function ShotThumbnailCameraTabPanel({ documentId, shotId }) {
  return (
    <TabPanel className="flex flex-col">
      <p className="opacity-30 text-xs text-center">
        Make it something inspiring :)
      </p>
    </TabPanel>
  );
}
