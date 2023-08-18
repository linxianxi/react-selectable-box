import { useCallback, useContext, useEffect, useRef } from 'react';
import { SelectableContext } from '../context';
import { isInRange } from '../utils';

export const useSelectable = ({
  value,
  disabled,
  rule = 'collision',
}: {
  value: React.Key;
  disabled?: boolean;
  rule?: 'collision' | 'inclusion';
}) => {
  const context = useContext(SelectableContext);
  const node = useRef<HTMLElement | null>(null);

  const inRange = isInRange(node.current, rule, context?.container, context?.boxRect);

  const isDragging = !!context?.isDragging;

  const isSelected = !!context?.value.includes(value);

  const isSelecting = isDragging && !disabled && inRange;

  // 正在移除
  const isRemoving =
    isSelecting && isSelected && (context.mode === 'remove' || context.mode === 'reverse');

  // 正在选中
  const isAdding =
    isSelecting && !isSelected && (context.mode === 'add' || context.mode === 'reverse');

  useEffect(() => {
    if (context?.startTarget && !context.startInside.current) {
      const contain = node.current?.contains(context.startTarget);
      if (contain) {
        context.startInside.current = true;
      }
    }
  }, [context?.startTarget]);

  useEffect(() => {
    if (context?.selectingValue) {
      if (isSelecting) {
        context.selectingValue.current.push(value);
      } else {
        context.selectingValue.current = context.selectingValue.current.filter((i) => i !== value);
      }
    }
  }, [isSelecting]);

  const setNodeRef = useCallback((ref: HTMLElement | null) => {
    node.current = ref;
  }, []);

  return {
    isSelecting,
    isRemoving,
    isSelected,
    isAdding,
    setNodeRef,
    isDragging,
  };
};
