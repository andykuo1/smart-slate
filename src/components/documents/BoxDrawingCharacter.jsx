/**
 *
 * @param {object} props
 * @param {boolean} props.start
 * @param {boolean} props.end
 * @param {number} props.depth
 * @param {string} [props.className]
 * @param {object} [props.containerProps]
 */
export default function BoxDrawingCharacter({
  start = false,
  end = false,
  depth = 0,
  className = '',
  containerProps = {},
}) {
  return (
    <span
      className={'font-mono text-2xl my-auto select-none' + ' ' + className}
      {...containerProps}>
      {getCharacter(depth === 0, !start || !end, end)}
    </span>
  );
}

/**
 * @param {boolean} dashed
 * @param {boolean} isChild
 * @param {boolean} isLast
 */
function getCharacter(dashed, isChild, isLast) {
  if (isChild) {
    if (isLast) {
      return dashed ? '╙' : '└';
    } else {
      return dashed ? '╟' : '├';
    }
  } else {
    if (isLast) {
      return dashed ? '═' : '─';
    } else {
      return dashed ? '╓' : '┌';
    }
  }
}
