import React from 'react';

const useInternalLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

const useLayoutEffect = (
  callback: (mount: boolean) => void | VoidFunction,
  deps?: React.DependencyList,
) => {
  const firstMountRef = React.useRef(true);

  useInternalLayoutEffect(() => {
    return callback(firstMountRef.current);
  }, deps);

  // We tell react that first mount has passed
  useInternalLayoutEffect(() => {
    firstMountRef.current = false;
    return () => {
      firstMountRef.current = true;
    };
  }, []);
};

const useLayoutUpdateEffect: typeof React.useEffect = (callback, deps) => {
  useLayoutEffect((firstMount) => {
    if (!firstMount) {
      return callback();
    }
  }, deps);
};

export default useLayoutUpdateEffect;
