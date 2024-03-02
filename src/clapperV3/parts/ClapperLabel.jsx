/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {string} [props.htmlFor]
 * @param {import('react').ReactNode} [props.children]
 */
export default function ClapperLabel({ className, htmlFor, children }) {
  return (
    <label className={'text-[1em]' + ' ' + className} htmlFor={htmlFor}>
      {children}
    </label>
  );
}
