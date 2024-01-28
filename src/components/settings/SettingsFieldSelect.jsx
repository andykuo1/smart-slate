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
      className={'flex flex-row' + ' ' + className}
      required={required}>
      <select
        id={id}
        className="flex-1 rounded my-2 mx-1 outline outline-offset-2 bg-transparent disabled:opacity-30"
        value={value}
        onChange={onChange}
        disabled={!onChange}>
        {children}
      </select>
    </SettingsField>
  );
}
