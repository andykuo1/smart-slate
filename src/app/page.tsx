import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col w-screen h-screen">
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
    </main>
  )
}
