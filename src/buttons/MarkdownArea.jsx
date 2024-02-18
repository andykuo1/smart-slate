/**
 * @param {object} props
 * @param {string} props.value
 */
export default function MarkdownContent({ value }) {
  return value.split('\n').map((text, i) =>
    text && text.startsWith('#') ? (
      <h3
        key={`heading-${i}:${text}`}
        className="mt-8 flex flex-row items-center gap-2 text-2xl font-bold">
        <span>{text}</span>
        <div className="flex-1 border-t-4 border-dashed border-white opacity-30" />
      </h3>
    ) : text === '' ? (
      <div key={`newline-${i}:${text}`} className="my-2" />
    ) : (
      <p key={`text-${i}:${text}`}>{text}</p>
    ),
  );
}
