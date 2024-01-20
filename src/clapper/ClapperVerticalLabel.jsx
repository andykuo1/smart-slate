/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').ReactNode} [props.children]
 */
export default function ClapperVerticalLabel({ className, children }) {
  return (
    <label
      className={'text-[2vmin] upright-rl py-1 text-center' + ' ' + className}>
      {children}
    </label>
  );
}
