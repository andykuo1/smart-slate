/**
 * @param {object} props
 * @param {string} props.value
 */
export default function MarkdownContent({ value }) {
  return value.split('\n').map((text, i) =>
    text && text.startsWith('#') ? (
      <h3 key={`${i}:${text}`} className="text-xl my-4">
        {text}
      </h3>
    ) : (
      <p key={`${i}:${text}`}>{text}</p>
    ),
  );
}
