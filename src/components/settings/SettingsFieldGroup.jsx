/**
 * @param {object} props
 * @param {string} props.title
 * @param {import('react').ReactNode} props.children
 */
export default function SettingsFieldGroup({ title, children }) {
  return (
    <fieldset className="flex flex-col gap-2 pt-4">
      <legend>{title}</legend>
      {children}
    </fieldset>
  );
}
