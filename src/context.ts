import React, { useContext } from 'react';
import { ISelectableContext } from './type';

export const SelectableContext = React.createContext<ISelectableContext<any>>(
  {} as ISelectableContext<any>,
);

export const useSelectableContext = () => {
  const context = useContext(SelectableContext);
  if (!context) {
    throw new Error('Please put the selectable items in Selectable');
  }
  return context;
};
