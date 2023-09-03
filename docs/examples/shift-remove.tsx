import React, { useEffect, useState } from 'react';
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
        width: 50,
        height: 50,
        borderRadius: 4,
        border: isAdding ? '1px solid #1677ff' : undefined,
        background: isRemoving ? 'red' : isSelected ? '#1677ff' : '#ccc',
      }}
    />
  );
};

export default () => {
  const [value, setValue] = useState<React.Key[]>([]);
  const [mode, setMode] = useState<'add' | 'remove'>('add');

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setMode('remove');
      }
    };

    const onKeyUp = () => {
      setMode('add');
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  return (
    <Selectable
      value={value}
      mode={mode}
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
