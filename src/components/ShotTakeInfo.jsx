import { useShotTake } from '@/components/ShotContext';

export default function ShotTakeInfo() {
  const { shotTake } = useShotTake();
  const scene = shotTake.scene > 0 ? Number(shotTake.scene) : '--';
  const shot = shotTake.shot > 0 ? Number(shotTake.shot) : '--';
  const take = shotTake.take > 0 ? Number(shotTake.take) : '--';
  return (
    <div className="sticky top-0 z-10 flex flex-row">
      <p className="flex flex-1 bg-black border-2 p-2 border-white text-white text-[4vh]">
        <span>Scene</span>
        <span className="flex-1 text-center">{scene}</span>
      </p>
      <p className="flex flex-1 bg-black border-2 p-2 border-white text-white text-[4vh]">
        <span>Shot</span>
        <span className="flex-1 text-center">{shot}</span>
      </p>
      <p className="flex flex-1 bg-black border-2 p-2 border-white text-white text-[4vh]">
        <span>Take</span>
        <span className="flex-1 text-center">{take}</span>
      </p>
    </div>
  );
}
