import TestButton from './components/TestButton';
import TestStep from './components/TestStep';

export default function TestFFmpegTranscode() {
  return (
    <fieldset className="relative my-4 flex outline">
      <legend className="absolute -top-4 left-2 rounded border bg-white px-2 text-xl">
        TestTakeScanner
      </legend>
      <div className="border-r-2 border-gray-100 shadow-xl">
        <TestStep
          title="Step 1 - Scan directory"
          onExecute={async function* () {}}
        />
        <TestStep
          title="Step 2 - Analyze files"
          onExecute={async function* () {}}>
          <TestButton>Allow transcode</TestButton>
        </TestStep>
        <TestStep
          title="Step 3 - Import to project"
          onExecute={async function* () {}}
        />
        <TestStep
          title="Step 4 - Rename files on disk"
          onExecute={async function* () {}}
        />
        <TestStep
          title="Step 5 - Export list to .csv"
          onExecute={async function* () {}}
        />
      </div>
      <div className="flex flex-col">
        <button>WOOT</button>
      </div>
    </fieldset>
  );
}
