import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Rule, useSelectableContext } from '../context';
import { isInRange } from '../utils';
import useUpdateEffect from './useUpdateEffect';

interface UseSelectableProps<T> {
  value: T;
  disabled?: boolean;
  rule?: Rule;
}

export default function useSelectable<T>({
  value,
  disabled,
  rule = 'collision',
}: UseSelectableProps<T>) {
  const {
    mode,
    scrollContainer,
    boxPosition,
    isDragging,
    value: contextValue = [],
    startInside,
    startTarget,
    selectingValue,
    unmountItemsInfo,
    scrollInfo,
    virtual,
    boxRef,
    compareFn,
  } = useSelectableContext();
  const node = useRef<HTMLElement | null>(null);

  const [inRange, setInRange] = useState(false);

  useEffect(() => {
    setInRange(
      isInRange(rule, node.current?.getBoundingClientRect(), scrollContainer, boxPosition, boxRef),
    );
  }, [rule, scrollContainer, boxPosition]);

  const isSelected = contextValue.some((i) => compareFn(i, value));

  const isSelecting = isDragging && !disabled && inRange;

  const isRemoving = isSelecting && isSelected && (mode === 'remove' || mode === 'reverse');

  const isAdding = isSelecting && !isSelected && (mode === 'add' || mode === 'reverse');

  const setNodeRef = useCallback((ref: HTMLElement | null) => {
    node.current = ref;
  }, []);

  useEffect(() => {
    if (startTarget && !startInside.current) {
      const contain = node.current?.contains(startTarget);
      if (contain) {
        startInside.current = true;
      }
    }
  }, [startTarget]);

  useEffect(() => {
    if (selectingValue) {
      if (isSelecting) {
        selectingValue.current.push(value);
      } else {
        selectingValue.current = selectingValue.current.filter((i) => !compareFn(i, value));
      }
    }
  }, [isSelecting]);

  // collect item unmount information when virtual
  useLayoutEffect(() => {
    if (virtual) {
      unmountItemsInfo.current.delete(value);

      return () => {
        if (node.current) {
          unmountItemsInfo.current.set(value, {
            rule,
            rect: node.current.getBoundingClientRect(),
            disabled,
            scrollLeft: scrollInfo.current.scrollLeft,
            scrollTop: scrollInfo.current.scrollTop,
          });
        }
      };
    }
  }, [virtual]);

  // update disabled when virtual and disabled changed
  useUpdateEffect(() => {
    if (virtual) {
      const info = unmountItemsInfo.current.get(value);
      if (info) {
        unmountItemsInfo.current.set(value, { ...info, disabled, rule });
      }
    }
  }, [virtual, disabled, rule]);

  return {
    setNodeRef,
    isSelecting,
    isRemoving,
    isSelected,
    isAdding,
    isDragging,
  };
}
