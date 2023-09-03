import React from 'react';

export const SelectableContext = React.createContext<{
  selectingValue: React.MutableRefObject<React.Key[]>;
  boxRect: { top: number; left: number; width: number; height: number };
  isDragging: boolean;
  value: React.Key[] | undefined;
  mode: 'add' | 'remove' | 'reverse';
  container: HTMLElement | null;
  startTarget: HTMLElement | null;
  startInside: React.MutableRefObject<boolean>;
} | null>(null);
