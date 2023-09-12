import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { SelectableContext } from './context';
import useEvent from './hooks/useEvent';
import useLatest from './hooks/useLatest';
import useMergedState from './hooks/useMergedState';

interface SelectableProps<T> {
  defaultValue?: T[];
  value?: T[];
  disabled?: boolean;
  children?: React.ReactNode;
  mode?: 'add' | 'remove' | 'reverse';
  selectStartRange?: 'all' | 'inside' | 'outside';
  getContainer?: () => HTMLElement;
  boxStyle?: React.CSSProperties;
  boxClassName?: string;
  onStart?: () => void;
  onEnd?: (selectingValue: T[], changed: { added: T[]; removed: T[] }) => void;
}

export interface SelectableRef {
  checkScroll: () => void;
}

const defaultGetContainer = () => document.body;

const getPortalContainer = (getContainer: () => HTMLElement = defaultGetContainer) => {
  if (typeof window !== 'undefined') {
    return getContainer();
  }
  return null;
};

function Selectable<T extends React.Key>(
  {
    defaultValue,
    value: propsValue,
    disabled,
    mode = 'add',
    children,
    selectStartRange = 'all',
    getContainer,
    boxStyle,
    boxClassName,
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
  const [container, setContainer] = useState(() => getPortalContainer(getContainer));
  const [value, setValue] = useMergedState(defaultValue || [], {
    value: propsValue,
  });

  const startCoordsRef = useLatest(startCoords);
  const isDraggingRef = useLatest(isDragging);
  const selectStartRangeRef = useLatest(selectStartRange);

  const top = Math.max(0, Math.min(startCoords.y, moveCoords.y));
  const left = Math.max(0, Math.min(startCoords.x, moveCoords.x));
  const width = isDragging ? Math.abs(startCoords.x - Math.max(0, moveCoords.x)) : 0;
  const height = isDragging ? Math.abs(startCoords.y - Math.max(0, moveCoords.y)) : 0;
  const boxRect = { top, left, width, height };

  useEffect(() => {
    setContainer(getPortalContainer(getContainer));
  });

  const checkScroll = () => {
    if (isDraggingRef.current && container) {
      const containerRect = container.getBoundingClientRect();
      const x = moveClient.current.x - containerRect.left + container.scrollLeft;
      const y = moveClient.current.y - containerRect.top + container.scrollTop;
      setMoveCoords({
        x: Math.min(x, container.scrollWidth),
        y: Math.min(y, container.scrollHeight),
      });
    }
  };

  useImperativeHandle(ref, () => ({
    checkScroll,
  }));

  const handleStart = useEvent(() => {
    if (!isDraggingRef.current) {
      onStart?.();
    }
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

    if (disabled || !container) {
      reset();
      return;
    }

    const onScroll = () => {
      checkScroll();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isMouseDowning) {
        const { clientX, clientY } = e;
        moveClient.current = { x: clientX, y: clientY };
        const { left, top } = container.getBoundingClientRect();
        const x = clientX - left + container.scrollLeft;
        const y = clientY - top + container.scrollTop;
        setMoveCoords({
          x: Math.min(x, container.scrollWidth),
          y: Math.min(y, container.scrollHeight),
        });

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

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('scroll', onScroll);

      if (isDraggingRef.current) {
        setValue(selectingValue.current);
        handleEnd(selectingValue.current);
      }
      reset();
    };

    const scrollListenerElement = container === document.body ? document : container;

    const onMouseDown = (e: MouseEvent) => {
      isMouseDowning = true;

      if (selectStartRangeRef.current !== 'all') {
        setStartTarget(e.target as HTMLElement);
      }

      const { clientX, clientY } = e;
      const { left, top } = container.getBoundingClientRect();
      setStartCoords({
        x: clientX - left + container.scrollLeft,
        y: clientY - top + container.scrollTop,
      });

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      scrollListenerElement.addEventListener('scroll', onScroll);
    };

    container.addEventListener('mousedown', onMouseDown);

    return () => {
      container.removeEventListener('mousedown', onMouseDown);
      scrollListenerElement.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [disabled, container]);

  const contextValue = useMemo(
    () => ({
      value,
      selectingValue,
      isDragging,
      boxRect,
      mode,
      container,
      startTarget,
      startInside,
    }),
    [value, isDragging, top, left, width, height, mode, container, startTarget],
  );

  return (
    <SelectableContext.Provider value={contextValue}>
      {children}
      {isDragging &&
        container &&
        createPortal(
          <div
            className={boxClassName}
            style={{
              position: 'absolute',
              zIndex: 999,
              top: 0,
              left: 0,
              transform: `translate(${left}px, ${top}px)`,
              width,
              height,
              backgroundColor: 'rgba(22, 119, 255, 0.3)',
              ...boxStyle,
            }}
          />,
          container,
        )}
    </SelectableContext.Provider>
  );
}

export default React.forwardRef(Selectable) as <T extends React.Key>(
  props: SelectableProps<T> & React.RefAttributes<SelectableRef>,
) => React.ReactElement;
