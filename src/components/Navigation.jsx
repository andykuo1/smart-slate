'use client';

import Link from 'next/link';

import packageJson from '../../package.json';

/**
 * @param {object} props
 * @param {string} props.title
 */
export function Navigation({ title }) {
  return (
    <header className="flex flex-row bg-red-500 items-center w-full overflow-x-auto overflow-y-hidden">
      <nav className="flex">
        <Link
          className="text-2xl border-2 m-2 p-2 px-3 rounded-full bg-red-400"
          href="/shots">
          🗒️
        </Link>
        <Link
          className="text-2xl border-2 m-2 p-2 px-3 rounded-full bg-red-400"
          href="/slate">
          🎬
        </Link>
        <Link
          className="text-2xl border-2 m-2 p-2 px-3 rounded-full bg-red-400"
          href="/rec">
          🎥
        </Link>
      </nav>
      <h2 className="flex-1 mx-4 text-right">
        {title} v{packageJson.version}
      </h2>
    </header>
  );
}
