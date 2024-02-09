import { useCallback, useState } from 'react';

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
    <section className={'flex flex-col p-4 my-4' + ' ' + className}>
      <h2 className="text-xl font-bold">{title}</h2>
      {children}
      <button
        className="block outline rounded p-2 m-2 bg-gray-100"
        onClick={onClick}>
        Execute
      </button>
      <hr />
      <fieldset className="relative flex-1 flex">
        <legend className="absolute top-0 right-0 opacity-30 font-bold">
          OUTPUT
        </legend>
        <output
          id={title + '-output'}
          className="flex-1 overflow-auto w-80 max-h-40">
          <pre className=" whitespace-pre-line">{output || '--empty--'}</pre>
        </output>
      </fieldset>
    </section>
  );
}
