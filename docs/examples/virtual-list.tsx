import React, { HTMLAttributes, useState } from 'react';
import Selectable, { useSelectable } from 'react-selectable-box';
import { VirtuosoGrid } from 'react-virtuoso';

const list: number[] = [];
for (let i = 0; i < 2002; i++) {
  list.push(i);
}

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

const List: React.ForwardRefExoticComponent<
  HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
> = React.forwardRef(({ style, ...props }, ref) => {
  return (
    <div ref={ref} {...props} style={{ ...style, display: 'flex', flexWrap: 'wrap', gap: 20 }} />
  );
});

export default () => {
  const [value, setValue] = useState<number[]>([]);

  return (
    <Selectable
      value={value}
      items={list}
      scrollContainer={() => document.querySelector('.container') as HTMLElement}
      onEnd={(selectingValue, { added, removed }) => {
        const result = value.concat(added).filter((i) => !removed.includes(i));
        setValue(result);
      }}
    >
      <VirtuosoGrid
        totalCount={list.length}
        style={{ height: 500 }}
        components={{
          List,
        }}
        className="container"
        itemContent={(index) => <Item value={list[index]} />}
      />
    </Selectable>
  );
};
