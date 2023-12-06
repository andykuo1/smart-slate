'use client';

import { useCallback } from 'react';

import Link from 'next/link';

import Button from './Button';
import {
  SHOT_TAKE_SESSION_STORAGE_KEY,
  getShotTakeId,
  useShotTake,
} from './ShotContext';
import { useShotList } from './ShotListContext';
import { createShotTake } from './ShotTake';
import ShotTakeInfo from './ShotTakeInfo';

export default function ShotList() {
  const { setShotList } = useShotList();
  return (
    <div>
      <ShotTakeInfo />
      <div>
        <Button title="New" onClick={() => setShotList([])} />
        <Button title="Import" disabled={true} onClick={() => {}} />
        <Button title="Export" disabled={true} onClick={() => {}} />
      </div>
      <ShotListDocument />
    </div>
  );
}

export function ShotListDocument() {
  const { shotTake, setShotTake } = useShotTake();
  const { shotList } = useShotList();
  /** @type {Array<number>} */
  let scenes = [];
  let maxScene = 0;
  for (let { scene } of shotList) {
    if (scene > 0 && !scenes.includes(scene)) {
      scenes.push(scene);
      maxScene = Math.max(maxScene, scene);
    }
  }

  const onTitleChange = useCallback(
    function onTitleChange(e) {
      const value = e.target.value;
      setShotTake((prev) => ({ ...prev, title: value }));
    },
    [setShotTake],
  );

  return (
    <div className="flex flex-col my-20">
      <label htmlFor="shotList" className="text-center text-2xl">
        <input
          type="text"
          className="bg-transparent text-center opacity-60 border-b-8 border-double border-neutral-700"
          placeholder="Untitled"
          value={shotTake.title}
          onChange={onTitleChange}
        />
      </label>
      <ul id="shotList">
        {scenes.map((scene) => (
          <ShotListScene key={scene} sceneNum={scene} />
        ))}
        <ShotListSceneNew sceneNum={maxScene + 1} />
      </ul>
    </div>
  );
}

/**
 * @param {object} props
 * @param {number} props.sceneNum
 */
export function ShotListScene({ sceneNum }) {
  const { shotList } = useShotList();
  let scenes = shotList.filter((shotTake) => shotTake.scene === sceneNum);
  /** @type {Array<number>} */
  let shots = [];
  let maxShot = 0;
  for (let { shot } of scenes) {
    if (shot > 0 && !shots.includes(shot)) {
      shots.push(shot);
      maxShot = Math.max(maxShot, shot);
    }
  }
  return (
    <>
      <ShotListSceneHeader sceneNum={sceneNum} />
      {shots.map((shot) => (
        <ShotListShot key={shot} sceneNum={sceneNum} shotNum={shot} />
      ))}
      <ShotListShotNew sceneNum={sceneNum} shotNum={maxShot + 1} />
    </>
  );
}

/**
 * @param {object} props
 * @param {number} props.sceneNum
 */
function ShotListSceneHeader({ sceneNum }) {
  return (
    <ShotListItemContainer className="flex items-center mt-4 opacity-30 bg-transparent border-none">
      <span>Scene {sceneNum}</span>
      <span className="flex-1 text-center mx-8 border-t-2 border-dotted"></span>
      <span>Scene {sceneNum}</span>
    </ShotListItemContainer>
  );
}

/**
 * @param {object} props
 * @param {number} props.sceneNum
 */
function ShotListSceneNew({ sceneNum }) {
  const { setShotList } = useShotList();
  function onClick() {
    setShotList((prev) => [...prev, createShotTake(0, sceneNum, 1, 0)]);
  }
  return (
    <ShotListItemContainer className="flex items-center my-4 opacity-30 bg-transparent border-none">
      <span className="flex-1 text-center mx-8 border-t-2 border-dotted" />
      <button className="text-center" onClick={onClick}>
        + New Scene +
      </button>
      <span className="flex-1 text-center mx-8 border-t-2 border-dotted" />
    </ShotListItemContainer>
  );
}

/**
 * @param {object} props
 * @param {number} props.sceneNum
 * @param {number} props.shotNum
 */
export function ShotListShot({ sceneNum, shotNum }) {
  const { shotList } = useShotList();
  let shots = shotList.filter(
    (shotTake) => shotTake.scene === sceneNum && shotTake.shot === shotNum,
  );
  /** @type {Array<number>} */
  let takes = [];
  let maxTake = 0;
  for (let { take } of shots) {
    if (take > 0 && !takes.includes(take)) {
      takes.push(take);
      maxTake = Math.max(maxTake, take);
    }
  }
  return (
    <>
      <ShotListShotHeader sceneNum={sceneNum} shotNum={shotNum} />
      <ul className="ml-8">
        {takes.map((take) => (
          <ShotListTake
            key={take}
            sceneNum={sceneNum}
            shotNum={shotNum}
            takeNum={take}
          />
        ))}
        <ShotListTakeNew
          sceneNum={sceneNum}
          shotNum={shotNum}
          takeNum={maxTake + 1}
        />
      </ul>
    </>
  );
}

/**
 * @param {object} props
 * @param {number} props.sceneNum
 * @param {number} props.shotNum
 */
function ShotListShotHeader({ sceneNum, shotNum }) {
  const [isActive, onClick] = useCurrentShotTake(sceneNum, shotNum, undefined);
  return (
    <ShotListItemContainer
      className={
        'flex flex-row mt-4' + ' ' + (isActive && 'bg-white text-black')
      }
      onClick={onClick}>
      <div>
        <span>Scene {sceneNum}</span>
        <span> / </span>
        <span>Shot {shotNum}</span>
      </div>
      <input
        type="text"
        className="flex-1 mx-2 px-2 bg-transparent opacity-60"
        placeholder="Details"
      />
    </ShotListItemContainer>
  );
}

/**
 * @param {object} props
 * @param {number} props.sceneNum
 * @param {number} props.shotNum
 */
export function ShotListShotNew({ sceneNum, shotNum }) {
  const { setShotList } = useShotList();
  function onClick() {
    setShotList((prev) => [...prev, createShotTake(0, sceneNum, shotNum, 0)]);
  }
  return (
    <ShotListItemContainer className="flex flex-row m-0 border-none p-0">
      <button
        className="flex-1 bg-gradient-to-l from-gray-600 to-transparent text-white p-2 text-right hover:from-gray-400"
        onClick={onClick}>
        + New Shot
      </button>
    </ShotListItemContainer>
  );
}

/**
 * @param {object} props
 * @param {number} props.sceneNum
 * @param {number} props.shotNum
 * @param {number} props.takeNum
 */
export function ShotListTake({ sceneNum, shotNum, takeNum }) {
  const [isActive, onClick] = useCurrentShotTake(sceneNum, shotNum, takeNum);
  return (
    <ShotListItemContainer
      className={
        'flex -mt-[2px] px-2' + ' ' + (isActive && 'bg-white text-black')
      }
      onClick={onClick}>
      <span>Take {takeNum}</span>
      <input
        type="text"
        className="flex-1 mx-2 px-2 bg-transparent opacity-60"
        placeholder="Notes"
      />
    </ShotListItemContainer>
  );
}

/**
 * @param {number} sceneNum
 * @param {number} shotNum
 * @param {number} [takeNum]
 * @returns {[boolean, import('react').MouseEventHandler]}
 */
function useCurrentShotTake(sceneNum, shotNum, takeNum = undefined) {
  const { shotTake, setShotTake } = useShotTake();
  /** @type {import('react').MouseEventHandler} */
  function onClick(e) {
    setShotTake((prev) => {
      const shotTakeId = getShotTakeId(sceneNum, shotNum);
      const next = {
        ...prev,
        scene: sceneNum,
        shot: shotNum,
      };
      if (typeof takeNum !== 'undefined') {
        next.take = takeNum;
      }
      let result = sessionStorage.getItem(shotTakeId) || takeNum;
      next.take = Number(result);
      sessionStorage.setItem(
        SHOT_TAKE_SESSION_STORAGE_KEY,
        JSON.stringify(next),
      );
      return next;
    });
  }
  const isActive =
    sceneNum == shotTake.scene &&
    shotNum == shotTake.shot &&
    (typeof takeNum === 'undefined' || takeNum == shotTake.take);
  return [isActive, onClick];
}

/**
 * @param {object} props
 * @param {number} props.sceneNum
 * @param {number} props.shotNum
 * @param {number} props.takeNum
 */
export function ShotListTakeNew({ sceneNum, shotNum, takeNum }) {
  const { shotTake, setShotTake } = useShotTake();
  const isActive =
    sceneNum == shotTake.scene &&
    shotNum == shotTake.shot &&
    takeNum == shotTake.take;

  const { setShotList } = useShotList();

  function onClick() {
    setShotTake((prev) => {
      const shotTakeId = getShotTakeId(sceneNum, shotNum);
      const next = { ...prev, scene: sceneNum, shot: shotNum, take: takeNum };
      let result = sessionStorage.getItem(shotTakeId) || takeNum;
      next.take = Number(result);
      sessionStorage.setItem(
        SHOT_TAKE_SESSION_STORAGE_KEY,
        JSON.stringify(next),
      );
      return next;
    });
  }
  return (
    <ShotListItemContainer
      className={
        'flex -mt-[2px] px-2 items-center' +
        ' ' +
        (isActive && 'bg-white text-black')
      }
      onClick={onClick}>
      <span className="opacity-60">Take {takeNum}</span>
      <input
        type="text"
        className="flex-1 mx-2 px-2 bg-transparent opacity-60"
        placeholder="Notes"
      />
      <Link href="/rec">Record</Link>
    </ShotListItemContainer>
  );
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').MouseEventHandler} [props.onClick]
 * @param {import('react').ReactNode} [props.children]
 */
export function ShotListItemContainer({ className, onClick, children }) {
  return (
    <li
      className={
        'border-2 p-2 overflow-x-auto overflow-y-hidden' + ' ' + className
      }
      onClick={onClick}>
      {children}
    </li>
  );
}
