import { useRef } from 'react';

export default function useLatest<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;

  return ref;
}
