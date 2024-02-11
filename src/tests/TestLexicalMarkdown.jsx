import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { useEffect, useState } from 'react';

import {
  BOLD_ITALIC_STAR,
  BOLD_ITALIC_UNDERSCORE,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  STRIKETHROUGH,
} from '@lexical/markdown';

const THEME = {
  link: 'cursor-pointer underline text-blue-500',
  heading: {
    h1: 'text-6xl pt-2 before:px-2 before:content-["#"] before:opacity-30',
    h2: 'text-5xl pt-2 before:px-2 before:content-["##"] before:opacity-30',
    h3: 'text-4xl pt-2 before:px-2 before:content-["###"] before:opacity-30',
    h4: 'text-2xl pt-2 before:px-2 before:content-["####"] before:opacity-30',
    h5: 'text-xl pt-2 before:px-2 before:content-["#####"] before:opacity-30',
    h6: 'text-xl text-gray-400 italic pt-2 before:px-2 before:content-["######"] before:opacity-30',
  },
  tag: 'underline px-2',
  text: {
    bold: 'font-semibold',
    underline: 'underline',
    italic: 'italic',
    strikethrough: 'line-through',
    underlineStrikethrough: 'underlined-line-through',
  },
};

const DEFAULT_TRANSFORMERS = [
  BOLD_ITALIC_STAR,
  BOLD_ITALIC_UNDERSCORE,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  STRIKETHROUGH,
];

export default function TestLexicalMarkdown() {
  const [state, setState] = useState('{}');

  /** @type {import('@lexical/react/LexicalComposer').InitialConfigType} */
  const initialConfig = {
    namespace: 'blockContent',
    theme: THEME,
    nodes: [],
    /**
     * @param {Error} error
     */
    onError(error) {
      console.error(error);
    },
  };

  /**
   * @param {import('lexical').EditorState} editorState
   */
  function onChange(editorState) {
    const jsonString = JSON.stringify(editorState.toJSON());
    setState(jsonString);
  }

  return (
    <article className="flex h-full w-full flex-col">
      <h2 className="font-bold">Lexical Markdown Test</h2>
      <p className="flex-1">
        <LexicalComposer initialConfig={initialConfig}>
          <RichTextPlugin
            contentEditable={<ContentEditable className="p-2" />}
            placeholder={
              <div className="pointer-events-none absolute left-2 top-2 opacity-30">
                What happens?...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <MarkdownShortcutPlugin transformers={[...DEFAULT_TRANSFORMERS]} />
          <OnChangePlugin onChange={onChange} />
        </LexicalComposer>
      </p>
      <pre className="h-[50%] overflow-y-auto text-xs">
        <code>{JSON.stringify(JSON.parse(state), null, 4)}</code>
      </pre>
    </article>
  );
}

/**
 * @param {object} props
 * @param {(editorState: import('lexical').EditorState) => void} props.onChange
 */
function OnChangePlugin({ onChange }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState);
    });
  }, [editor, onChange]);
  return null;
}
