import { useEffect, useState } from 'react';

const defaultGetContainer = () => document.body;

export const getPortalContainer = (
  getContainer?: () => HTMLElement | null,
  useDefault: boolean = true,
) => {
  if (getContainer) {
    return getContainer();
  }
  if (useDefault) {
    return defaultGetContainer();
  }

  return null;
};

export default function useContainer(
  getContainer?: () => HTMLElement | null,
  useDefault?: boolean,
) {
  const [container, setContainer] = useState(() => getPortalContainer(getContainer, useDefault));

  useEffect(() => {
    setContainer(getPortalContainer(getContainer, useDefault));
  });

  return container;
}
