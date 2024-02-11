/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').ReactNode} [props.children]
 */
export default function ClapperVerticalLabel({ className, children }) {
  return (
    <label
      className={'py-1 text-center text-[2vmin] upright-rl' + ' ' + className}>
      {children}
    </label>
  );
}
