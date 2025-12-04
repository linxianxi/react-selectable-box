import { useState } from 'react';
import Selectable, { useSelectable } from 'react-selectable-box';
import './example.css';

const list: number[] = [];
for (let i = 0; i < 200; i++) {
  list.push(i);
}

const Item = ({ value, onClick }: { value: number; onClick: (isSelected: boolean) => void }) => {
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
      onClick={() => onClick(isSelected)}
    >
      {value}
    </div>
  );
};

export default () => {
  const [value, setValue] = useState<number[]>([]);

  return (
    <Selectable
      value={value}
      onStart={() => {
        console.log('start');
      }}
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
          <Item
            key={i}
            value={i}
            onClick={(isSelected) => {
              if (isSelected) {
                setValue(value.filter((val) => val !== i));
              } else {
                setValue(value.concat(i));
              }
            }}
          />
        ))}
      </div>
    </Selectable>
  );
};
