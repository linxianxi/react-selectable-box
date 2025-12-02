export interface SelectableProps<T = any> {
  value?: T[];
  /** support virtual */
  virtualItems?: T[];
  disabled?: boolean;
  children?: React.ReactNode;
  mode?: 'add' | 'remove' | 'reverse';
  selectStartRange?: 'all' | 'inside' | 'outside';
  scrollSpeed?: number;
  scrollContainer?:
    | (() => HTMLElement)
    | {
        innerContainer?: {
          axis: 'x';
          getContainer: () => HTMLElement;
        };
        outerContainer: {
          axis: 'y';
          getContainer: () => HTMLElement;
        };
      }
    | {
        innerContainer?: {
          axis: 'y';
          getContainer: () => HTMLElement;
        };
        outerContainer: {
          axis: 'x';
          getContainer: () => HTMLElement;
        };
      };
  dragContainer?: () => HTMLElement;
  boxStyle?: React.CSSProperties;
  boxClassName?: string;
  compareFn?: (a: T, b: T) => boolean;
  onStart?: (event: MouseEvent | TouchEvent) => void;
  onEnd?: (selectingValue: T[], changed: { added: T[]; removed: T[] }) => void;
}

export interface SelectableRef {
  cancel: () => void;
}

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

export interface ISelectableContext<T> {
  selectingValue: React.MutableRefObject<T[]>;
  boxPosition: { top: number; left: number; width: number; height: number };
  isDragging: boolean;
  value: T[] | undefined;
  mode: 'add' | 'remove' | 'reverse';
  innerScrollContainer: HTMLElement | null;
  startTarget: HTMLElement | null;
  startInside: React.MutableRefObject<boolean>;
  unmountItemsInfo: React.MutableRefObject<UnmountItemsInfoType<T>>;
  virtual: boolean;
  boxRef: React.MutableRefObject<HTMLDivElement | null>;
  compareFn: (a: T, b: T) => boolean;
}
