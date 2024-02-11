import SettingsField from './SettingsField';

/**
 * @param {object} props
 * @param {string} props.id
 * @param {string} props.title
 * @param {string} [props.className]
 * @param {boolean} [props.required]
 * @param {import('react').ReactNode} props.children
 * @param {string} [props.value]
 * @param {import('react').ChangeEventHandler<HTMLSelectElement>} [props.onChange]
 */
export default function SettingsFieldSelect({
  id,
  title,
  className,
  required,
  children,
  value,
  onChange,
}) {
  return (
    <SettingsField
      id={id}
      title={title}
      className={className}
      required={required}>
      <select
        id={id}
        className="m-1 flex-1 rounded bg-transparent outline outline-offset-2 disabled:opacity-30"
        value={value}
        onChange={onChange}
        disabled={!onChange}>
        {children}
      </select>
    </SettingsField>
  );
}
