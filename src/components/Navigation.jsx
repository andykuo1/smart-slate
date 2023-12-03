'use client';

import Link from 'next/link';

import packageJson from '../../package.json';

/**
 * @param {object} props
 * @param {string} props.title
 */
export function Navigation({ title }) {
  return (
    <header className="flex flex-row bg-red-500 items-center">
      <nav className="flex">
        <Link className="border-2 m-2 p-2" href="/shots">
          Shots
        </Link>
        <Link className="border-2 m-2 p-2" href="/slate">
          Slate
        </Link>
        <Link className="border-2 m-2 p-2" href="/rec">
          Recorder
        </Link>
      </nav>
      <h2 className="flex-1 mx-4 text-right">
        {title} v{packageJson.version}
      </h2>
    </header>
  );
}
