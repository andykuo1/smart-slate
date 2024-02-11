import Field from '@/fields/Field';

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
 * @param {boolean} [props.autoFocus]
 * @param {'sentences'|'words'|'characters'|'on'|'off'|'none'} [props.autoCapitalize]
 */
export default function FieldInput({
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
  autoFocus,
  autoCapitalize,
}) {
  return (
    <Field id={id} title={title} className={className} required={required}>
      <input
        ref={inputRef}
        id={id}
        className={
          'm-1 flex-1 rounded bg-transparent px-1 outline outline-offset-2 disabled:opacity-30' +
          ' ' +
          (autoCapitalize === 'characters' ? 'uppercase' : '')
        }
        type="text"
        name={id}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        autoFocus={autoFocus}
        autoCapitalize={autoCapitalize}
      />
      {children}
    </Field>
  );
}
