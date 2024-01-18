import React, { useContext } from 'react';

interface ISelectableContext {
  selectingValue: React.MutableRefObject<(string | number)[]>;
  boxRect: { top: number; left: number; width: number; height: number };
  isDragging: boolean;
  value: (string | number)[] | undefined;
  mode: 'add' | 'remove' | 'reverse';
  scrollContainer: HTMLElement | null;
  startTarget: HTMLElement | null;
  startInside: React.MutableRefObject<boolean>;
}

export const SelectableContext = React.createContext<ISelectableContext>({} as ISelectableContext);

export const useSelectableContext = () => {
  const context = useContext(SelectableContext);
  if (!context) {
    throw new Error('Please put the selectable items in Selectable');
  }
  return context;
};
