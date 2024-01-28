/**
 * @param {object} props
 * @param {string} props.id
 * @param {string} props.title
 * @param {string} [props.className]
 * @param {boolean} [props.required]
 * @param {import('react').ReactNode} [props.children]
 */
export default function SettingsField({
  id,
  title,
  className,
  required,
  children,
}) {
  return (
    <div className={'relative my-2' + ' ' + (className || 'flex flex-col')}>
      <label htmlFor={id} className="flex-1" hidden={!title}>
        {title}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
