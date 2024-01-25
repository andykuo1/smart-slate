import { useOpenPreferredRecorder } from './UseOpenRecorder';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {import('react').ReactNode} [props.children]
 * @param {import('react').MouseEventHandler<HTMLButtonElement>} [props.onClick]
 */
export default function RecorderOpenButton({ className, children, onClick }) {
  const openRecorder = useOpenPreferredRecorder(onClick);
  return (
    <button title="Record" className={className} onClick={openRecorder}>
      {children}
    </button>
  );
}
