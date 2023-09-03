import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { SelectableContext } from './context';
import useEvent from './hooks/useEvent';
import useLatest from './hooks/useLatest';
import useMergedState from './hooks/useMergedState';

interface SelectableProps {
  defaultValue?: React.Key[];
  value?: React.Key[];
  disabled?: boolean;
  children?: React.ReactNode;
  mode?: 'add' | 'remove' | 'reverse';
  selectFromInside?: boolean;
  getContainer?: () => HTMLElement;
  boxStyle?: React.CSSProperties;
  boxClassName?: string;
  onStart?: () => void;
  onEnd?: (
    selectingValue: React.Key[],
    changed: { added: React.Key[]; removed: React.Key[] },
  ) => void;
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

const Selectable = forwardRef<SelectableRef, SelectableProps>(
  (
    {
      defaultValue,
      value: propsValue,
      disabled,
      mode = 'add',
      children,
      selectFromInside = true,
      getContainer,
      boxStyle,
      boxClassName,
      onStart,
      onEnd,
    },
    ref,
  ) => {
    const [isDragging, setIsDragging] = useState(false);
    const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
    const [moveCoords, setMoveCoords] = useState({ x: 0, y: 0 });
    const isStart = useRef(false);
    const selectingValue = useRef([]);
    const [startTarget, setStartTarget] = useState<HTMLElement | null>(null);
    const startInside = useRef(false);
    const moveClient = useRef({ x: 0, y: 0 });
    const [container, setContainer] = useState(() => getPortalContainer(getContainer));
    const [value, setValue] = useMergedState(defaultValue || [], {
      value: propsValue,
    });

    const startCoordsRef = useLatest(startCoords);
    const isDraggingRef = useLatest(isDragging);
    const selectFromInsideRef = useLatest(selectFromInside);

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

    const handleEnd = useEvent((newValue: React.Key[]) => {
      if (onEnd) {
        const added: React.Key[] = [];
        const removed: React.Key[] = [];

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

    const handleReset = () => {
      setIsDragging(false);
      setStartTarget(null);
      isStart.current = false;
      startInside.current = false;
      selectingValue.current = [];
    };

    useEffect(() => {
      if (disabled || !container) {
        handleReset();
        return;
      }

      const onScroll = () => {
        checkScroll();
      };

      const onMouseMove = (e: MouseEvent) => {
        const shouldContinue = selectFromInsideRef.current ? true : !startInside.current;
        if (isStart.current && shouldContinue) {
          const { clientX, clientY } = e;
          moveClient.current = { x: clientX, y: clientY };
          const { left, top } = container.getBoundingClientRect();
          const x = clientX - left + container.scrollLeft;
          const y = clientY - top + container.scrollTop;
          setMoveCoords({
            x: Math.min(x, container.scrollWidth),
            y: Math.min(y, container.scrollHeight),
          });
          const width = Math.abs(startCoordsRef.current.x - x);
          const height = Math.abs(startCoordsRef.current.y - y);
          // prevent trigger when click too fast
          // https://github.com/linxianxi/react-selectable-box/issues/5
          if (!isDraggingRef.current && (width > 1 || height > 1)) {
            setIsDragging(true);
            handleStart();
          }
        } else {
          setStartTarget(null);
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
        handleReset();
      };

      const scrollListenerElement = container === document.body ? document : container;

      const onMouseDown = (e: MouseEvent) => {
        if (!selectFromInsideRef.current) {
          setStartTarget(e.target as HTMLElement);
        }

        const { clientX, clientY } = e;
        isStart.current = true;
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
  },
);

export default Selectable;
