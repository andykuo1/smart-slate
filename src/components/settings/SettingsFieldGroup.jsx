/**
 * @param {object} props
 * @param {string} props.title
 * @param {import('react').ReactNode} props.children
 */
export default function SettingsFieldGroup({ title, children }) {
  return (
    <fieldset>
      <legend>{title}</legend>
      {children}
    </fieldset>
  );
}
