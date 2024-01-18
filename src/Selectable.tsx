import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { SelectableContext } from './context';
import useContainer from './hooks/useContainer';
import useEvent from './hooks/useEvent';
import useLatest from './hooks/useLatest';
import useMergedState from './hooks/useMergedState';
import useScroll from './hooks/useScroll';
import { getClientXY } from './utils';

export interface SelectableProps<T> {
  defaultValue?: T[];
  value?: T[];
  disabled?: boolean;
  children?: React.ReactNode;
  mode?: 'add' | 'remove' | 'reverse';
  selectStartRange?: 'all' | 'inside' | 'outside';
  scrollContainer?: () => HTMLElement;
  dragContainer?: () => HTMLElement;
  boxStyle?: React.CSSProperties;
  boxClassName?: string;
  onStart?: () => void;
  onEnd?: (selectingValue: T[], changed: { added: T[]; removed: T[] }) => void;
  /**
   * @deprecated Use scrollContainer instead
   */
  getContainer?: () => HTMLElement;
}

function Selectable<T extends string | number>({
  defaultValue,
  value: propsValue,
  disabled,
  mode = 'add',
  children,
  selectStartRange = 'all',
  getContainer,
  scrollContainer: propsScrollContainer,
  dragContainer: propsDragContainer,
  boxStyle,
  boxClassName,
  onStart,
  onEnd,
}: SelectableProps<T>) {
  const [isDragging, setIsDragging] = useState(false);
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [moveCoords, setMoveCoords] = useState({ x: 0, y: 0 });
  const selectingValue = useRef<T[]>([]);
  const [startTarget, setStartTarget] = useState<HTMLElement | null>(null);
  const startInside = useRef(false);
  const moveClient = useRef({ x: 0, y: 0 });
  const [value, setValue] = useMergedState(defaultValue || [], {
    value: propsValue,
  });

  const scrollContainer = useContainer(propsScrollContainer || getContainer);
  const dragContainer = useContainer(propsDragContainer || propsScrollContainer || getContainer);

  const { smoothScroll, cancelScroll } = useScroll();
  const startCoordsRef = useLatest(startCoords);
  const isDraggingRef = useLatest(isDragging);
  const selectStartRangeRef = useLatest(selectStartRange);

  const top = Math.max(0, Math.min(startCoords.y, moveCoords.y));
  const left = Math.max(0, Math.min(startCoords.x, moveCoords.x));
  const width = isDragging ? Math.abs(startCoords.x - Math.max(0, moveCoords.x)) : 0;
  const height = isDragging ? Math.abs(startCoords.y - Math.max(0, moveCoords.y)) : 0;
  const boxRect = { top, left, width, height };

  if (process.env.NODE_ENV === 'development' && getContainer) {
    console.error(
      '[react-selectable-box]: getContainer will be deprecated in the future, use scrollContainer instead',
    );
  }

  const onScroll = () => {
    if (isDraggingRef.current && scrollContainer) {
      const containerRect = scrollContainer.getBoundingClientRect();
      const x = moveClient.current.x - containerRect.left + scrollContainer.scrollLeft;
      const y = moveClient.current.y - containerRect.top + scrollContainer.scrollTop;
      setMoveCoords({
        x: Math.min(x, scrollContainer.scrollWidth),
        y: Math.min(y, scrollContainer.scrollHeight),
      });
    }
  };

  const handleStart = useEvent(() => {
    onStart?.();
  });

  const handleEnd = useEvent((newValue: T[]) => {
    if (onEnd) {
      const added: T[] = [];
      const removed: T[] = [];

      newValue.forEach((i) => {
        if (value?.includes(i)) {
          if (mode === 'remove' || mode === 'reverse') {
            removed.push(i);
          }
        } else {
          if (mode === 'add' || mode === 'reverse') {
            added.push(i);
          }
        }
      });
      onEnd(newValue, { added, removed });
    }
  });

  useEffect(() => {
    let isMouseDowning = false;

    const reset = () => {
      setIsDragging(false);
      setStartTarget(null);
      isMouseDowning = false;
      startInside.current = false;
      selectingValue.current = [];
    };

    if (disabled || !scrollContainer || !dragContainer) {
      reset();
      return;
    }

    const onMouseMove = (e: MouseEvent | TouchEvent) => {
      // prevent default scroll behavior when mouse move
      e.preventDefault();
      if (isMouseDowning) {
        const { clientX, clientY } = getClientXY(e);
        moveClient.current = { x: clientX, y: clientY };
        const { left, top } = scrollContainer.getBoundingClientRect();
        const x = clientX - left + scrollContainer.scrollLeft;
        const y = clientY - top + scrollContainer.scrollTop;
        setMoveCoords({
          x: Math.min(x, scrollContainer.scrollWidth),
          y: Math.min(y, scrollContainer.scrollHeight),
        });
        smoothScroll(e, scrollContainer);

        if (!isDraggingRef.current) {
          let shouldDraggingStart = true;
          if (selectStartRangeRef.current === 'outside') {
            shouldDraggingStart = !startInside.current;
          } else if (selectStartRangeRef.current === 'inside') {
            shouldDraggingStart = startInside.current;
          }
          const boxWidth = Math.abs(startCoordsRef.current.x - x);
          const boxHeight = Math.abs(startCoordsRef.current.y - y);
          // prevent trigger when click too fast
          // https://github.com/linxianxi/react-selectable-box/issues/5
          if (shouldDraggingStart && (boxWidth > 1 || boxHeight > 1)) {
            setIsDragging(true);
            handleStart();
          }
        }
      }
    };

    const scrollListenerElement = scrollContainer === document.body ? document : scrollContainer;

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onMouseMove);
      window.removeEventListener('touchend', onMouseUp);
      scrollListenerElement.removeEventListener('scroll', onScroll);

      if (isDraggingRef.current) {
        cancelScroll();
        setValue(selectingValue.current);
        handleEnd(selectingValue.current);
      }
      reset();
    };

    const onMouseDown = (e: MouseEvent | TouchEvent) => {
      isMouseDowning = true;

      if (selectStartRangeRef.current !== 'all') {
        setStartTarget(e.target as HTMLElement);
      }

      const { clientX, clientY } = getClientXY(e);
      const { left, top } = scrollContainer.getBoundingClientRect();
      setStartCoords({
        x: clientX - left + scrollContainer.scrollLeft,
        y: clientY - top + scrollContainer.scrollTop,
      });

      window.addEventListener('mousemove', onMouseMove, { passive: false });
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onMouseMove, { passive: false });
      window.addEventListener('touchend', onMouseUp);
      scrollListenerElement.addEventListener('scroll', onScroll);
    };

    dragContainer.addEventListener('mousedown', onMouseDown);
    dragContainer.addEventListener('touchstart', onMouseDown);

    return () => {
      cancelScroll();
      dragContainer.removeEventListener('mousedown', onMouseDown);
      dragContainer.removeEventListener('touchstart', onMouseDown);
      scrollListenerElement.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onMouseMove);
      window.removeEventListener('touchend', onMouseUp);
    };
  }, [disabled, scrollContainer, dragContainer]);

  const contextValue = useMemo(
    () => ({
      value,
      selectingValue,
      isDragging,
      boxRect,
      mode,
      scrollContainer,
      startTarget,
      startInside,
    }),
    [value, isDragging, top, left, width, height, mode, scrollContainer, startTarget],
  );

  return (
    <SelectableContext.Provider value={contextValue}>
      {children}
      {isDragging &&
        scrollContainer &&
        createPortal(
          <div
            className={boxClassName}
            style={{
              position: 'absolute',
              zIndex: 9999,
              top: 0,
              left: 0,
              transform: `translate(${left}px, ${top}px)`,
              width,
              height,
              backgroundColor: 'rgba(22, 119, 255, 0.3)',
              ...boxStyle,
            }}
          />,
          scrollContainer,
        )}
    </SelectableContext.Provider>
  );
}

export default Selectable;
