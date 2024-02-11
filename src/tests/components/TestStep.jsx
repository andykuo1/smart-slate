import { useCallback, useState } from 'react';

import TestButton from './TestButton';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {string} props.title
 * @param {() => AsyncGenerator<string, void, undefined>} props.onExecute
 * @param {import('react').ReactNode} [props.children]
 */
export default function TestStep({ className, title, onExecute, children }) {
  const [output, setOutput] = useState('');

  const onClick = useCallback(
    /** @type {import('react').MouseEventHandler<HTMLButtonElement>} */
    async function _onClick(e) {
      setOutput('');
      try {
        for await (let line of onExecute()) {
          setOutput((prev) => prev + '\n' + line);
        }
        setOutput((prev) => prev + '\n' + 'DONE!');
      } catch (e) {
        setOutput((prev) =>
          prev + '\n' + 'ERROR - ' + e && typeof e === 'object'
            ? String(/** @type {any} */ (e).message)
            : String(e),
        );
        return;
      } finally {
        setOutput((prev) => prev + '\n' + '--end of output--');
      }
    },
    [onExecute, setOutput],
  );

  return (
    <section className={'my-4 flex flex-col p-4' + ' ' + className}>
      <h2 className="text-xl font-bold">{title}</h2>
      {children}
      <TestButton onClick={onClick}>Execute</TestButton>
      <hr />
      <fieldset className="relative flex flex-1">
        <legend className="absolute right-0 top-0 font-bold opacity-30">
          OUTPUT
        </legend>
        <output
          id={title + '-output'}
          className="max-h-40 w-80 flex-1 overflow-auto">
          <pre className=" whitespace-pre-line">{output || '--empty--'}</pre>
        </output>
      </fieldset>
    </section>
  );
}
