import { useEffect, useState } from 'react';

const defaultGetContainer = () => document.body;

export const getPortalContainer = (getContainer: () => HTMLElement = defaultGetContainer) => {
  if (typeof window !== 'undefined') {
    return getContainer();
  }
  return null;
};

export default function useContainer(getContainer?: () => HTMLElement) {
  const [container, setContainer] = useState(() => getPortalContainer(getContainer));

  useEffect(() => {
    setContainer(getPortalContainer(getContainer));
  });

  return container;
}
