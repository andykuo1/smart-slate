import { useState } from 'react';

import InMemoryCRUD from '@/libs/googleapi/sync/InMemoryCRUD';
import {
  createConfiguration,
  createSyncFile,
  diff,
  sync,
} from '@/libs/googleapi/sync/Sync';

const CRUD_A = new InMemoryCRUD();
const CRUD_B = new InMemoryCRUD();

function randNum() {
  return Math.floor(Math.random() * 1_000);
}

/**
 * @param {InMemoryCRUD} crud
 */
function computeConfig(crud) {
  let result = createConfiguration();
  for (let key of Object.keys(crud.cache)) {
    let file = createSyncFile(key);
    file.fileId = key;
    file.lastUpdatedMillis = crud.cache[key].time;
    result.files.push(file);
  }
  return result;
}

export default function TestCRUDSync() {
  const [configA, setConfigA] = useState(createConfiguration());
  const [configB, setConfigB] = useState(createConfiguration());
  const [output, setOutput] = useState({});
  return (
    <div className="w-[80%]">
      <div className="flex flex-col items-start gap-2">
        <button
          onClick={() => {
            setConfigA(createConfiguration());
            setConfigB(createConfiguration());
            setOutput({});
            for (let key of Object.keys(CRUD_A.cache)) {
              delete CRUD_A.cache[key];
            }
            for (let key of Object.keys(CRUD_B.cache)) {
              delete CRUD_B.cache[key];
            }
          }}>
          Reset
        </button>
        <button
          onClick={() => {
            // NOTE: It's important that CRUD_A re-computes the config.
            let newConfigA = computeConfig(CRUD_A);
            setConfigA(newConfigA);
            sync(
              CRUD_A,
              CRUD_B,
              async () => newConfigA,
              async () => configB,
              async (config) => setConfigB(config),
            );
          }}>
          Sync
        </button>
        <button
          onClick={() => {
            setOutput(diff(configA, configB));
          }}>
          Diff
        </button>
        <button
          onClick={async () => {
            let keys = await CRUD_A.list();
            CRUD_A.update(keys[0].id, 'renamed' + randNum(), {
              stuff: 'updated' + randNum(),
            });
            setConfigA(computeConfig(CRUD_A));
          }}>
          Change Local File
        </button>
        <button
          onClick={() => {
            CRUD_A.create('', 'newfile' + randNum(), {
              stuff: 'more stuff' + randNum(),
            });
            setConfigA(computeConfig(CRUD_A));
          }}>
          New Local File
        </button>
        <button
          onClick={() => {
            CRUD_B.create('', 'otherfile' + randNum(), {
              stuff: 'more and more stuff' + randNum(),
            });
            setConfigB(computeConfig(CRUD_B));
          }}>
          New Remote File
        </button>
        <button onClick={() => setConfigA(computeConfig(CRUD_A))}>
          Compute Local Config
        </button>
        <button onClick={() => setConfigB(computeConfig(CRUD_B))}>
          Compute Remote Config
        </button>
      </div>
      <hr className="my-4" />
      <div className="flex flex-row text-xs">
        <div className="flex-1">
          <h2>LOCAL CACHE</h2>
          <pre>
            <output>{JSON.stringify(CRUD_A.cache, null, 4)}</output>
          </pre>
          <h2>LOCAL CONFIG</h2>
          <pre>
            <output>{JSON.stringify(configA, null, 4)}</output>
          </pre>
        </div>
        <div className="flex-1">
          <h2>REMOTE CACHE</h2>
          <pre>
            <output>{JSON.stringify(CRUD_B.cache, null, 4)}</output>
          </pre>
          <h2>REMOTE CONFIG</h2>
          <pre>
            <output>{JSON.stringify(configB, null, 4)}</output>
          </pre>
        </div>
      </div>
      <hr className="my-4" />
      <h2>OUTPUT</h2>
      <output>
        <pre>{JSON.stringify(output, null, 4)}</pre>
      </output>
    </div>
  );
}
