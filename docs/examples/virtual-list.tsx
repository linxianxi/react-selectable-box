import React, { useState } from 'react';
import Selectable, { useSelectable } from 'react-selectable-box';
import { FixedSizeList } from 'react-window';

const list: string[] = [];
for (let i = 0; i < 2000; i++) {
  list.push(String(i));
}

const columnCount = 10;

const Cell = ({ value, style }: { value: string; style: React.CSSProperties }) => {
  const { setNodeRef, isSelected, isAdding, isRemoving, isDragging, isSelecting } = useSelectable({
    value,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
        border: isAdding ? '1px solid #1677ff' : undefined,
        background: isRemoving ? 'red' : isSelected ? '#1677ff' : '#ccc',
      }}
    >
      {value}
    </div>
  );
};

const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
  const rowList = list.slice(index * columnCount, (index + 1) * columnCount);
  return (
    <div style={{ ...style, display: 'flex' }}>
      {rowList.map((i, idx) => {
        const marginRight = idx < 9 ? 20 : 0;
        return <Cell key={i} value={i} style={{ marginRight }} />;
      })}
    </div>
  );
};

export default () => {
  const [value, setValue] = useState<React.Key[]>([]);

  return (
    <Selectable
      value={value}
      getContainer={() => document.querySelector('.container') as HTMLElement}
      onEnd={(selectingValue, { added, removed }) => {
        console.log(selectingValue, added, removed);
        const result = value.concat(added).filter((i) => !removed.includes(i));
        setValue(result);
      }}
    >
      <FixedSizeList
        className="container"
        height={500}
        itemSize={70}
        width={columnCount * 50 + (columnCount - 1) * 20}
        itemCount={Math.ceil(list.length / columnCount)}
      >
        {({ index, style }) => <Row index={index} style={style} />}
      </FixedSizeList>
    </Selectable>
  );
};
