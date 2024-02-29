import { getShotTypeIcon } from '@/components/shots/options/ShotTypeIcon';

/**
 * @param {object} props
 * @param {string} props.shotType
 */
export default function ShotReferenceImagePlaceholder({ shotType }) {
  const Icon = getShotTypeIcon(shotType);
  return <Icon className="aspect-video h-full w-full fill-current py-[15%]" />;
}
