import { useState } from 'react';
import useEvent from './useEvent';
import useLayoutUpdateEffect from './useLayoutUpdateEffect';

type Updater<T> = (updater: T | ((origin: T) => T)) => void;

export default function useMergedState<T>(
  defaultStateValue: T,
  option: {
    value: T;
  },
): [T, Updater<T>] {
  const { value } = option;

  const [innerValue, setInnerValue] = useState<T>(() => {
    if (value !== undefined) {
      return value;
    } else {
      return defaultStateValue;
    }
  });

  const mergedValue = value !== undefined ? value : innerValue;

  useLayoutUpdateEffect(() => {
    if (value === undefined) {
      setInnerValue(value);
    }
  }, [value]);

  const triggerChange: Updater<T> = useEvent((updater) => {
    setInnerValue(updater);
  });

  return [mergedValue, triggerChange];
}
