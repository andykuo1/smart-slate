import { useShotTake } from '@/components/ShotContext';

export default function ShotTakeInfo() {
  const { state } = useShotTake();
  const scene = state.scene > 0 ? Number(state.scene) : '--';
  const shot = state.shot > 0 ? Number(state.shot) : '--';
  const take = state.take >= 0 ? Number(state.take) + 1 : '--';
  return (
    <div className="sticky top-0 flex flex-row">
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
