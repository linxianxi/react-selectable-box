export const isInRange = (
  element: HTMLElement | null,
  rule: 'collision' | 'inclusion',
  container?: HTMLElement | null,
  boxRect?: { top: number; left: number; width: number; height: number },
) => {
  const {
    left: nodeLeft = 0,
    top: nodeTop = 0,
    width: nodeWidth = 0,
    height: nodeHeight = 0,
  } = element?.getBoundingClientRect() || {};

  const { top: containerTop = 0, left: containerLeft = 0 } =
    container?.getBoundingClientRect() || {};
  const scrollLeft = container ? container.scrollLeft : 0;
  const scrollTop = container ? container.scrollTop : 0;

  const { top = 0, left = 0, width = 0, height = 0 } = boxRect || {};

  if (rule === 'collision') {
    return (
      nodeLeft - containerLeft + scrollLeft < left + width &&
      nodeLeft - containerLeft + scrollLeft + nodeWidth > left &&
      nodeTop - containerTop + scrollTop < top + height &&
      nodeTop - containerTop + scrollTop + nodeHeight > top
    );
  }

  return (
    nodeLeft - containerLeft + scrollLeft >= left &&
    nodeLeft - containerLeft + scrollLeft + nodeWidth <= left + width &&
    nodeTop - containerTop + scrollTop >= top &&
    nodeTop - containerTop + scrollTop + nodeHeight <= top + height
  );
};
