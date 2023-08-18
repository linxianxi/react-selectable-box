import React, { useState } from 'react';
import Selectable, { useSelectable } from 'react-selectable-box';

const list: string[] = [];
for (let i = 0; i < 200; i++) {
  list.push(String(i));
}

const Item = ({ value }: { value: string }) => {
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

export default () => {
  const [value, setValue] = useState<React.Key[]>([]);

  return (
    <Selectable
      value={value}
      onEnd={(selectingValue, { added, removed }) => {
        const result = value.concat(added).filter((i) => !removed.includes(i));
        setValue(result);
      }}
      getContainer={() => document.querySelector('.scroll-container') as HTMLElement}
    >
      <div
        className="scroll-container"
        style={{
          position: 'relative',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 20,
          padding: 20,
          height: 400,
          overflow: 'auto',
          border: '1px solid #ccc',
        }}
      >
        {list.map((i) => (
          <Item key={i} value={i} />
        ))}
      </div>
    </Selectable>
  );
};
