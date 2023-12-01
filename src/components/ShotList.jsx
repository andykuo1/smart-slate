'use client';

import Button from '../components/Button';

export default function ShotList({}) {
  return (
    <div>
      <div>
        <Button title="Import" onClick={() => {}}/>
        <Button title="Export" onClick={() => {}}/>
      </div>
      <div>
        <ul>
          <li>Scene A</li>
          <li>Shot A.1</li>
          <li>Shot A.2</li>
          <li>Scene B</li>
          <li>Shot B.1</li>
          <li>Shot B.2</li>
        </ul>
      </div>
    </div>
  );
}

function Scene() {
  
}

function Shot() {

}
