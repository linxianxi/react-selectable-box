import React, { useCallback, useEffect, useRef } from 'react';
import { useSelectableContext } from '../context';
import { isInRange } from '../utils';

export default function useSelectable({
  value,
  disabled,
  rule = 'collision',
}: {
  value: React.Key;
  disabled?: boolean;
  rule?: 'collision' | 'inclusion';
}) {
  const {
    mode,
    container,
    boxRect,
    isDragging,
    value: contextValue = [],
    startInside,
    startTarget,
    selectingValue,
  } = useSelectableContext();
  const node = useRef<HTMLElement | null>(null);

  const inRange = isInRange(node.current, rule, container, boxRect);

  const isSelected = contextValue.includes(value);

  const isSelecting = isDragging && !disabled && inRange;

  const isRemoving = isSelecting && isSelected && (mode === 'remove' || mode === 'reverse');

  const isAdding = isSelecting && !isSelected && (mode === 'add' || mode === 'reverse');

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

  const setNodeRef = useCallback((ref: HTMLElement | null) => {
    node.current = ref;
  }, []);

  return {
    setNodeRef,
    isSelecting,
    isRemoving,
    isSelected,
    isAdding,
    isDragging,
  };
}
