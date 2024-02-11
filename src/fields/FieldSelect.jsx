import Field from '@/fields/Field';

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
export default function FieldSelect({
  id,
  title,
  className,
  required,
  children,
  value,
  onChange,
}) {
  return (
    <Field id={id} title={title} className={className} required={required}>
      <select
        id={id}
        className="m-1 flex-1 rounded bg-transparent outline outline-offset-2 disabled:opacity-30"
        value={value}
        onChange={onChange}
        disabled={!onChange}>
        {children}
      </select>
    </Field>
  );
}
