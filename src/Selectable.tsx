import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { SelectableContext } from './context';
import useContainer from './hooks/useContainer';
import useEvent from './hooks/useEvent';
import useLatest from './hooks/useLatest';
import useScroll from './hooks/useScroll';
import { SelectableProps, SelectableRef, UnmountItemsInfoType } from './type';
import { checkInRange, getClientXY } from './utils';

function defaultCompareFn<T>(a: T, b: T) {
  return a === b;
}

function Selectable<T>(
  {
    value,
    virtualItems,
    disabled,
    mode = 'add',
    children,
    selectStartRange = 'all',
    scrollSpeed,
    scrollContainer: propsScrollContainer,
    dragContainer: propsDragContainer,
    boxStyle,
    boxClassName,
    compareFn = defaultCompareFn<T>,
    onStart,
    onEnd,
  }: SelectableProps<T>,
  ref: React.ForwardedRef<SelectableRef>,
) {
  const [isDragging, setIsDragging] = useState(false);
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [moveCoords, setMoveCoords] = useState({ x: 0, y: 0 });
  const selectingValue = useRef<T[]>([]);
  const [startTarget, setStartTarget] = useState<HTMLElement | null>(null);
  const startInside = useRef(false);
  const moveClient = useRef({ x: 0, y: 0 });
  const boxRef = useRef<HTMLDivElement | null>(null);
  const unmountItemsInfo = useRef<UnmountItemsInfoType<T>>(new Map());
  const scrollInfo = useRef({ scrollTop: 0, scrollLeft: 0 });
  const [isCanceled, setIsCanceled] = useState(false);

  const getInnerScrollContainer =
    typeof propsScrollContainer === 'function'
      ? propsScrollContainer
      : propsScrollContainer?.inner?.getContainer;

  const innerScrollContainer = useContainer(getInnerScrollContainer);
  const outerScrollContainer = useContainer(
    typeof propsScrollContainer === 'object'
      ? propsScrollContainer?.outer?.getContainer
      : undefined,
    false,
  );
  const dragContainer = useContainer(propsDragContainer || getInnerScrollContainer);

  const { smoothScroll, cancelScroll } = useScroll(scrollSpeed, propsScrollContainer);
  const startCoordsRef = useLatest(startCoords);
  const isDraggingRef = useLatest(isDragging);
  const selectStartRangeRef = useLatest(selectStartRange);

  const top = Math.max(0, Math.min(startCoords.y, moveCoords.y));
  const left = Math.max(0, Math.min(startCoords.x, moveCoords.x));
  const width = isDragging ? Math.abs(startCoords.x - Math.max(0, moveCoords.x)) : 0;
  const height = isDragging ? Math.abs(startCoords.y - Math.max(0, moveCoords.y)) : 0;
  const boxPosition = useMemo(() => ({ top, left, width, height }), [top, left, width, height]);

  const virtual = !!virtualItems;

  React.useImperativeHandle(ref, () => ({
    cancel: () => {
      setIsCanceled(true);
      setIsDragging(false);
    },
  }));

  const handleStart = useEvent((event: MouseEvent | TouchEvent) => {
    onStart?.(event);
  });

  const handleEnd = useEvent(() => {
    if (onEnd) {
      if (virtual) {
        unmountItemsInfo.current.forEach((info, item) => {
          if (virtualItems.some((i) => compareFn(i, item))) {
            const isInRange = checkInRange(
              info.rule,
              {
                width: info.rect.width,
                height: info.rect.height,
                top: info.rect.top + info.scrollTop - scrollInfo.current.scrollTop,
                left: info.rect.left + info.scrollLeft - scrollInfo.current.scrollLeft,
              },
              innerScrollContainer,
              boxPosition,
              boxRef,
            );
            if (isInRange && !info.disabled) {
              selectingValue.current.push(item);
            } else {
              selectingValue.current = selectingValue.current.filter((i) => !compareFn(i, item));
            }
          }
        });
      }

      const added: T[] = [];
      const removed: T[] = [];

      selectingValue.current.forEach((i) => {
        if (value?.some((val) => compareFn(val, i))) {
          if (mode === 'remove' || mode === 'reverse') {
            removed.push(i);
          }
        } else {
          if (mode === 'add' || mode === 'reverse') {
            added.push(i);
          }
        }
      });

      onEnd(selectingValue.current, { added, removed });
    }
  });

  useEffect(() => {
    let isMouseDowning = false;
    let scrollContainerOriginPosition = '';

    const reset = () => {
      setIsDragging(false);
      setIsCanceled(false);
      setStartTarget(null);
      isMouseDowning = false;
      startInside.current = false;
      selectingValue.current = [];
    };

    if (disabled || !innerScrollContainer || !dragContainer || isCanceled) {
      reset();
      return;
    }

    const onMouseMove = (e: MouseEvent | TouchEvent) => {
      if (isMouseDowning) {
        // Prevent scroll on mobile
        if (window.TouchEvent && e instanceof TouchEvent) {
          e.preventDefault();
        }
        const { clientX, clientY } = getClientXY(e);
        moveClient.current = { x: clientX, y: clientY };
        const { left, top } = innerScrollContainer.getBoundingClientRect();
        const x = Math.min(
          clientX - left + innerScrollContainer.scrollLeft,
          innerScrollContainer.scrollWidth,
        );
        const y = Math.min(
          clientY - top + innerScrollContainer.scrollTop,
          innerScrollContainer.scrollHeight,
        );
        setMoveCoords({
          x,
          y,
        });
        smoothScroll(e);

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
            scrollContainerOriginPosition = getComputedStyle(innerScrollContainer).position;
            // default position in browser is `static`
            if (
              innerScrollContainer !== document.body &&
              scrollContainerOriginPosition === 'static'
            ) {
              innerScrollContainer.style.position = 'relative';
            }
            handleStart(e);
          }
        }
      }
    };

    const innerScrollListenerElement =
      innerScrollContainer === document.body ? document : innerScrollContainer;
    const outerScrollListenerElement =
      outerScrollContainer === document.body ? document : outerScrollContainer;

    const onScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      scrollInfo.current = { scrollTop: target.scrollTop, scrollLeft: target.scrollLeft };

      if (isDraggingRef.current) {
        const containerRect = innerScrollContainer.getBoundingClientRect();
        const x = Math.min(
          moveClient.current.x - containerRect.left + innerScrollContainer.scrollLeft,
          innerScrollContainer.scrollWidth,
        );
        const y = Math.min(
          moveClient.current.y - containerRect.top + innerScrollContainer.scrollTop,
          innerScrollContainer.scrollHeight,
        );
        setMoveCoords({
          x,
          y,
        });
      }
    };

    const onOuterScroll = () => {
      onScroll({ target: innerScrollContainer } as unknown as Event);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onMouseMove);
      window.removeEventListener('touchend', onMouseUp);

      if (isDraggingRef.current) {
        innerScrollContainer.style.position = scrollContainerOriginPosition;
        cancelScroll();
        handleEnd();
      }
      reset();
    };

    const onMouseDown = (e: MouseEvent | TouchEvent) => {
      const isMouseEvent = e instanceof MouseEvent;
      if (isMouseEvent && e.button !== 0) {
        return;
      }

      // Disable text selection, but it will prevent default scroll behavior when mouse move, so we used `useScroll`
      // And it will prevent click events on mobile devices, so don't trigger it
      if (isMouseEvent) {
        e.preventDefault();
      }

      isMouseDowning = true;

      if (selectStartRangeRef.current !== 'all') {
        setStartTarget(e.target as HTMLElement);
      }

      const { clientX, clientY } = getClientXY(e);
      const { left, top } = innerScrollContainer.getBoundingClientRect();
      setStartCoords({
        x: clientX - left + innerScrollContainer.scrollLeft,
        y: clientY - top + innerScrollContainer.scrollTop,
      });

      window.addEventListener('mousemove', onMouseMove, { passive: false });
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onMouseMove, { passive: false });
      window.addEventListener('touchend', onMouseUp);
    };

    dragContainer.addEventListener('mousedown', onMouseDown);
    dragContainer.addEventListener('touchstart', onMouseDown);
    innerScrollListenerElement.addEventListener('scroll', onScroll);
    outerScrollListenerElement?.addEventListener('scroll', onOuterScroll);

    return () => {
      if (scrollContainerOriginPosition) {
        innerScrollContainer.style.position = scrollContainerOriginPosition;
      }
      cancelScroll();
      dragContainer.removeEventListener('mousedown', onMouseDown);
      dragContainer.removeEventListener('touchstart', onMouseDown);
      innerScrollListenerElement.removeEventListener('scroll', onScroll);
      outerScrollListenerElement?.removeEventListener('scroll', onOuterScroll);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onMouseMove);
      window.removeEventListener('touchend', onMouseUp);
    };
  }, [disabled, innerScrollContainer, outerScrollContainer, dragContainer, isCanceled]);

  const contextValue = useMemo(
    () => ({
      value,
      selectingValue,
      isDragging,
      boxPosition,
      mode,
      innerScrollContainer,
      startTarget,
      startInside,
      unmountItemsInfo,
      virtual,
      boxRef,
      compareFn,
    }),
    [
      value,
      isDragging,
      boxPosition,
      mode,
      innerScrollContainer,
      startTarget,
      unmountItemsInfo,
      virtual,
      boxRef,
      compareFn,
    ],
  );

  return (
    <SelectableContext.Provider value={contextValue}>
      {children}
      {isDragging &&
        innerScrollContainer &&
        createPortal(
          <div
            ref={boxRef}
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
          innerScrollContainer,
        )}
    </SelectableContext.Provider>
  );
}

export default React.forwardRef(Selectable) as <T>(
  props: SelectableProps<T> & React.RefAttributes<SelectableRef>,
) => React.ReactElement;
