import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelectableContext } from '../context';
import { isInRange } from '../utils';
import useUpdateEffect from './useUpdateEffect';

export default function useSelectable({
  value,
  disabled,
  rule = 'collision',
}: {
  value: string | number;
  disabled?: boolean;
  rule?: 'collision' | 'inclusion';
}) {
  const {
    mode,
    scrollContainer,
    boxRect,
    isDragging,
    value: contextValue = [],
    startInside,
    startTarget,
    selectingValue,
    unmountItemsInfo,
    scrollInfo,
    virtual,
  } = useSelectableContext();
  const node = useRef<HTMLElement | null>(null);
  const rect = useRef<DOMRect>();

  const [inRange, setInRange] = useState(false);

  useEffect(() => {
    rect.current = node.current?.getBoundingClientRect();
    setInRange(isInRange(rect.current, rule, scrollContainer, boxRect));
  }, [rect.current, rule, scrollContainer, boxRect]);

  const isSelected = contextValue.includes(value);

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
        selectingValue.current = selectingValue.current.filter((i) => i !== value);
      }
    }
  }, [isSelecting]);

  // collect item unmount information when virtual
  useEffect(() => {
    if (virtual) {
      unmountItemsInfo.current.delete(value);

      return () => {
        if (rect.current) {
          unmountItemsInfo.current.set(value, {
            rule,
            rect: rect.current,
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
        unmountItemsInfo.current.set(value, { ...info, disabled });
      }
    }
  }, [virtual, disabled]);

  return {
    setNodeRef,
    isSelecting,
    isRemoving,
    isSelected,
    isAdding,
    isDragging,
  };
}
