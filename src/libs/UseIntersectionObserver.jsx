import { useState } from 'react';
import { useEffect } from 'react';

/**
 * @param {import('react').RefObject<HTMLElement>} elementRef
 * @param {IntersectionObserverInit['rootMargin']} rootMargin
 */
export function useIntersectionObserver(elementRef, rootMargin) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { rootMargin },
    );
    const element = elementRef.current;
    if (element) {
      observer.observe(element);
      return () => observer.unobserve(element);
    }
  }, []);
  return visible;
}
