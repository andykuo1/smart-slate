import Link from 'next/link';

/**
 * @param {object} props
 * @param {string} props.title
 */
export function Navigation({ title }) {
  return (
    <header className="flex flex-row bg-red-500 items-center">
      <nav className="flex">
        <a className="border-2 m-2 p-2">
          <Link href="/shots">Shots</Link>
        </a>
        <a className="border-2 m-2 p-2">
          <Link href="/slate">Slate</Link>
        </a>
        <a className="border-2 m-2 p-2">
          <Link href="/rec">Recorder</Link>
        </a>
      </nav>
      <h2 className="flex-1 mx-4 text-right">
        {title}
      </h2>
    </header>
  );
}
