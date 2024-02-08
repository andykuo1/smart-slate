/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {string} props.name
 * @param {string} props.value
 * @param {string} [props.placeholder]
 * @param {import('react').FocusEventHandler<HTMLInputElement>} [props.onFocus]
 * @param {import('react').FormEventHandler<HTMLInputElement>} props.onChange
 * @param {boolean} [props.disabled]
 * @param {'sentences'|'words'|'characters'|'on'|'off'|'none'} [props.autoCapitalize]
 */
export default function ClapperInput({
  className,
  name,
  value,
  placeholder,
  onFocus,
  onChange,
  disabled = !onChange,
  autoCapitalize,
}) {
  return (
    <input
      className={
        'w-full bg-transparent' +
        ' ' +
        (autoCapitalize === 'characters' ? 'uppercase' : '') +
        ' ' +
        className
      }
      style={{ lineHeight: '1em' }}
      type="text"
      name={name}
      value={value}
      onFocus={onFocus}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      autoCapitalize={autoCapitalize}
    />
  );
}
