import React, { useContext } from 'react';

type ValueType = string | number;

export type Rule =
  | 'collision'
  | 'inclusion'
  | ((
      boxElement: HTMLDivElement,
      boxPosition: { left: number; top: number; width: number; height: number },
    ) => boolean);

export type UnmountItemsInfoType<T> = Map<
  T,
  {
    rect: DOMRect;
    scrollTop: number;
    scrollLeft: number;
    rule: Rule;
    disabled?: boolean;
  }
>;

interface ISelectableContext<T> {
  selectingValue: React.MutableRefObject<T[]>;
  boxPosition: { top: number; left: number; width: number; height: number };
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
  boxRef: React.MutableRefObject<HTMLDivElement | null>;
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
