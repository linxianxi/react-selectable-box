export const getClientXY = (e: MouseEvent | TouchEvent) => {
  const obj = 'touches' in e ? e.touches[0] : e;
  return {
    clientX: obj.clientX,
    clientY: obj.clientY,
  };
};

export const isInRange = (
  rect: { left: number; top: number; width: number; height: number } | undefined,
  rule: 'collision' | 'inclusion',
  scrollContainer: HTMLElement | null,
  boxRect: { top: number; left: number; width: number; height: number },
) => {
  if (!rect || !scrollContainer) {
    return false;
  }

  const { left: rectLeft, top: rectTop, width: rectWidth, height: rectHeight } = rect;

  const { top: containerTop, left: containerLeft } = scrollContainer.getBoundingClientRect();
  const scrollLeft = scrollContainer.scrollLeft;
  const scrollTop = scrollContainer.scrollTop;

  const { top: boxTop, left: boxLeft, width: boxWidth, height: boxHeight } = boxRect;

  if (rule === 'collision') {
    return (
      rectLeft - containerLeft + scrollLeft < boxLeft + boxWidth &&
      rectLeft + rectWidth - containerLeft + scrollLeft > boxLeft &&
      rectTop - containerTop + scrollTop < boxTop + boxHeight &&
      rectTop + rectHeight - containerTop + scrollTop > boxTop
    );
  }

  return (
    rectLeft - containerLeft + scrollLeft >= boxLeft &&
    rectLeft + rectWidth - containerLeft + scrollLeft <= boxLeft + boxWidth &&
    rectTop - containerTop + scrollTop >= boxTop &&
    rectTop + rectHeight - containerTop + scrollTop <= boxTop + boxHeight
  );
};
