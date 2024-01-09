import TestVideoConstraints from './TestVideoConstraints';

const TEST_VERSION = 'v16';

export default function TestPage() {
  return (
    <main className="w-full h-full flex flex-col items-center ">
      <p>{TEST_VERSION}</p>
      <TestVideoConstraints />
    </main>
  );
}