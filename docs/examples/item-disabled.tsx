import React, { useState } from 'react';
import Selectable, { useSelectable } from 'react-selectable-box';

const list: string[] = [];
for (let i = 0; i < 200; i++) {
  list.push(String(i));
}

const Item = ({ value }: { value: string }) => {
  const disabled = ['46', '47', '48'].includes(value);
  const { setNodeRef, isSelected, isAdding, isRemoving } = useSelectable({
    value,
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        width: 50,
        height: 50,
        borderRadius: 4,
        border: isAdding ? '1px solid #1677ff' : undefined,
        background: disabled ? '#999' : isRemoving ? 'red' : isSelected ? '#1677ff' : '#ccc',
      }}
    />
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
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 20,
          padding: 20,
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
