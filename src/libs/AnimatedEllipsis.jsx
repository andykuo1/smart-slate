import { useCallback, useState } from 'react';

import { useInterval } from '@/libs/UseInterval';

/**
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 */
export default function AnimatedEllipsis({ children }) {
  const [ellipsis, setEllipsis] = useState('....');
  const onInterval = useCallback(
    function onInterval() {
      setEllipsis((prev) => (prev.length >= 4 ? '.' : prev + '.'));
    },
    [setEllipsis],
  );
  useInterval(onInterval, 500);
  return (
    <pre className="inline-block">
      {children}
      {ellipsis.padEnd(4, ' ')}
    </pre>
  );
}
