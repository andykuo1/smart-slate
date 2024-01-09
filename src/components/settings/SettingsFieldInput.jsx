import SettingsField from './SettingsField';

/**
 * @param {object} props
 * @param {string} props.id
 * @param {string} props.title
 * @param {string} [props.value]
 * @param {import('react').ChangeEventHandler<HTMLInputElement>} [props.onChange]
 * @param {import('react').FocusEventHandler<HTMLInputElement>} [props.onBlur]
 * @param {string} [props.className]
 * @param {string} [props.placeholder]
 * @param {boolean} [props.required]
 * @param {import('react').ReactNode} [props.children]
 * @param {boolean} [props.disabled]
 * @param {import('react').MutableRefObject<HTMLInputElement|null>} [props.inputRef]
 */
export default function SettingsFieldInput({
  id,
  title,
  value,
  onChange,
  onBlur,
  className,
  placeholder,
  required,
  children,
  disabled = !onChange,
  inputRef,
}) {
  return (
    <SettingsField
      id={id}
      title={title}
      className={className}
      required={required}>
      <input
        ref={inputRef}
        id={id}
        className="flex-1 rounded my-2 mx-1 px-1 outline outline-offset-2 bg-transparent disabled:opacity-30"
        type="text"
        name={id}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
      />
      {children}
    </SettingsField>
  );
}
