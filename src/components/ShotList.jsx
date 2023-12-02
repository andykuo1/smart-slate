'use client';

import Button from './Button';
import { useShotTake } from './ShotContext';
import ShotTakeInfo from './ShotTakeInfo';

export default function ShotList({}) {
  return (
    <div>
      <ShotTakeInfo />
      <div>
        <Button title="Import" disabled={true} onClick={() => {}} />
        <Button title="Export" disabled={true} onClick={() => {}} />
      </div>
      <div>
        <ul className="w-full flex flex-col items-center">
          <SceneHeading scene={1} />
          <ShotButton scene={1} shot={1} />
          <ShotButton scene={1} shot={2} />
          <ShotButton scene={1} shot={3} />
          <ShotButton scene={1} shot={4} />
          <SceneHeading scene={2} />
          <ShotButton scene={2} shot={1} />
        </ul>
      </div>
    </div>
  );
}

function SceneHeading({ scene }) {
  return (
    <li className="flex w-full">
      <h4 className="border-2 border-gray-600 m-2 p-2">Scene {scene}</h4>
    </li>
  );
}

function ShotButton({ scene, shot }) {
  const { setState } = useShotTake();
  return (
    <li className="flex w-full">
      <Button
        title={`Scene ${scene} / Shot ${shot}`}
        className="flex-1"
        onClick={() => setState({ scene, shot })}
      />
    </li>
  );
}
