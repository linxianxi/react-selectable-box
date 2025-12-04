import { useVirtualizer } from '@tanstack/react-virtual';
import React, { useState } from 'react';
import Selectable, { useSelectable } from 'react-selectable-box';
import './example.css';

const list: number[] = [];
for (let i = 0; i < 2000; i++) {
  list.push(i);
}

const columnCount = 10;

const Item = ({ value }: { value: number }) => {
  const { setNodeRef, isSelected, isAdding, isRemoving } = useSelectable({
    value,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        width: 50,
        height: 50,
        borderRadius: 4,
        border: isAdding ? '1px solid #1677ff' : undefined,
        background: isRemoving ? 'red' : isSelected ? '#1677ff' : '#ccc',
      }}
    >
      {value}
    </div>
  );
};

export default () => {
  const [value, setValue] = useState<number[]>([]);

  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: Math.ceil(list.length / columnCount),
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    gap: 20,
  });

  return (
    <Selectable
      value={value}
      virtualItems={list}
      scrollContainer={() => document.querySelector('.container')}
      onEnd={(selectingValue, { added, removed }) => {
        const result = value.concat(added).filter((i) => !removed.includes(i));
        setValue(result);
      }}
    >
      <div
        ref={parentRef}
        style={{
          height: `400px`,
          overflow: 'auto',
        }}
        className="container"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={virtualItem.key}
              style={{
                display: 'flex',
                gap: 20,
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              {list
                .slice(virtualItem.index * columnCount, (virtualItem.index + 1) * columnCount)
                .map((item) => (
                  <Item key={item} value={item} />
                ))}
            </div>
          ))}
        </div>
      </div>
    </Selectable>
  );
};
