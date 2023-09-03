import { useCallback, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-types
export default function useEvent<T extends Function>(callback: T): T {
  const fnRef = useRef<T>(callback);
  fnRef.current = callback;

  const memoFn = useCallback<T>(((...args: any) => fnRef.current?.(...args)) as any, []);

  return memoFn;
}
