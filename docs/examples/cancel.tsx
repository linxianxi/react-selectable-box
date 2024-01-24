import { useEffect, useRef, useState } from 'react';
import Selectable, { SelectableRef, useSelectable } from 'react-selectable-box';

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
  const [value, setValue] = useState<string[]>([]);
  const selectableRef = useRef<SelectableRef>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        selectableRef.current?.cancel();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <Selectable
      value={value}
      ref={selectableRef}
      dragContainer={() => document.getElementById('drag-container') as HTMLElement}
      onEnd={(selectingValue, { added, removed }) => {
        console.log('onEnd');
        const result = value.concat(added).filter((i) => !removed.includes(i));
        setValue(result);
      }}
    >
      <div
        id="drag-container"
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
