import Portal from '@rc-component/portal';
import useEvent from 'rc-util/lib/hooks/useEvent';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { SelectableContext } from './context';

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

const Selectable = forwardRef<SelectableRef, SelectableProps>(
  (
    {
      defaultValue,
      value: propsValue,
      disabled,
      mode = 'add',
      children,
      selectFromInside = true,
      getContainer = defaultGetContainer,
      boxStyle,
      boxClassName,
      onStart,
      onEnd,
    },
    ref,
  ) => {
    const [isDragging, setIsDragging] = useState(false);
    const [value, setValue] = useMergedState(defaultValue || [], {
      value: propsValue,
      onChange: (newValue) => {
        if (onEnd) {
          const added: React.Key[] = [];
          const removed: React.Key[] = [];

          newValue.forEach((i) => {
            if (value.includes(i)) {
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
      },
    });
    const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
    const [moveCoords, setMoveCoords] = useState({ x: 0, y: 0 });
    const isStart = useRef(false);
    const selectingValue = useRef([]);
    const [startTarget, setStartTarget] = useState<HTMLElement | null>(null);
    const startInside = useRef(false);
    const moveClient = useRef({ x: 0, y: 0 });

    const isDraggingRef = useRef(isDragging);
    isDraggingRef.current = isDragging;

    const checkScroll = () => {
      if (isDraggingRef.current) {
        const scrollContainer = getContainer();
        const scrollContainerRect = scrollContainer.getBoundingClientRect();
        const x = moveClient.current.x - scrollContainerRect.left + scrollContainer.scrollLeft;
        const y = moveClient.current.y - scrollContainerRect.top + scrollContainer.scrollTop;
        setMoveCoords({
          x: Math.min(x, scrollContainer.scrollWidth),
          y: Math.min(y, scrollContainer.scrollHeight),
        });
      }
    };

    useImperativeHandle(ref, () => ({
      checkScroll,
    }));

    const handleStart = useEvent(() => {
      if (!isDragging) {
        onStart?.();
      }
    });

    useEffect(() => {
      const container = getContainer();

      if (disabled || !container) {
        return;
      }

      const onScroll = () => {
        checkScroll();
      };

      const onMouseMove = (e: MouseEvent) => {
        const shouldContinue = selectFromInside ? true : !startInside.current;
        if (isStart.current && shouldContinue) {
          handleStart();
          const { clientX, clientY } = e;
          moveClient.current = { x: clientX, y: clientY };
          setIsDragging(true);
          const { left, top } = container.getBoundingClientRect();
          const x = clientX - left + container.scrollLeft;
          const y = clientY - top + container.scrollTop;
          setMoveCoords({
            x: Math.min(x, container.scrollWidth),
            y: Math.min(y, container.scrollHeight),
          });
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
          selectingValue.current = [];
          setIsDragging(false);
        }
        setStartTarget(null);
        isStart.current = false;
        startInside.current = false;
      };

      const scrollListenerElement = container === document.body ? document : container;

      const onMouseDown = (e: MouseEvent) => {
        if (!selectFromInside) {
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
        window.removeEventListener('mousemove', onMouseDown);
        window.removeEventListener('mouseup', onMouseUp);
      };
    }, [disabled, selectFromInside]);

    const container = getContainer();
    const top = Math.min(startCoords.y, moveCoords.y);
    const left = Math.min(startCoords.x, moveCoords.x);
    const width = isDragging ? Math.abs(startCoords.x - moveCoords.x) : 0;
    const height = isDragging ? Math.abs(startCoords.y - moveCoords.y) : 0;
    const boxRect = { top, left, width, height };

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
        {isDragging && (
          <Portal open getContainer={getContainer}>
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
            />
          </Portal>
        )}
      </SelectableContext.Provider>
    );
  },
);

export default Selectable;
