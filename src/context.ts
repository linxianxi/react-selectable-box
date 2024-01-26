import React, { useContext } from 'react';

type ValueType = string | number;

export type UnmountItemsInfoType<T> = Map<
  T,
  {
    rect: DOMRect;
    scrollTop: number;
    scrollLeft: number;
    rule: 'collision' | 'inclusion';
    disabled?: boolean;
  }
>;

interface ISelectableContext<T> {
  selectingValue: React.MutableRefObject<T[]>;
  boxRect: { top: number; left: number; width: number; height: number };
  isDragging: boolean;
  value: T[] | undefined;
  mode: 'add' | 'remove' | 'reverse';
  scrollContainer: HTMLElement | null;
  startTarget: HTMLElement | null;
  startInside: React.MutableRefObject<boolean>;
  unmountItemsInfo: React.MutableRefObject<UnmountItemsInfoType<T>>;
  scrollInfo: React.MutableRefObject<{
    scrollTop: number;
    scrollLeft: number;
  }>;
  virtual: boolean;
}

export const SelectableContext = React.createContext<ISelectableContext<ValueType>>(
  {} as ISelectableContext<ValueType>,
);

export const useSelectableContext = () => {
  const context = useContext(SelectableContext);
  if (!context) {
    throw new Error('Please put the selectable items in Selectable');
  }
  return context;
};
