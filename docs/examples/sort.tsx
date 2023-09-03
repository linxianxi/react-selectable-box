import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { useState } from 'react';
import Selectable, { useSelectable } from 'react-selectable-box';

const list: string[] = [];
for (let i = 0; i < 200; i++) {
  list.push(String(i));
}

const Item = ({
  value,
  disabled,
  onClick,
  selectedLength,
}: {
  value: React.Key;
  disabled: boolean;
  onClick: (isSelected: boolean) => void;
  selectedLength: number;
}) => {
  const {
    setNodeRef: setSelectNodeRef,
    isSelected,
    isAdding,
    isRemoving,
  } = useSelectable({
    value,
  });

  const {
    attributes,
    listeners,
    setNodeRef: setSortNodeRef,
    transform,
    transition,
    isDragging,
    isSorting,
  } = useSortable({
    id: value,
    disabled,
  });

  return (
    <div
      {...attributes}
      {...listeners}
      ref={(ref) => {
        setSelectNodeRef(ref);
        setSortNodeRef(ref);
      }}
      className="text"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        width: 50,
        height: 50,
        borderRadius: 4,
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 999 : undefined,
        cursor: isSelected ? 'move' : undefined,
        visibility: isSelected && !isDragging && isSorting ? 'hidden' : undefined,
        border: isAdding ? '1px solid #1677ff' : undefined,
        background: isRemoving ? 'red' : isSelected ? '#1677ff' : '#ccc',
      }}
      onClick={() => onClick(isSelected)}
    >
      {value}
      {isDragging && (
        <div style={{ position: 'absolute', right: 3, bottom: 0 }}>{selectedLength}</div>
      )}
    </div>
  );
};

export default () => {
  const [value, setValue] = useState<React.Key[]>([]);
  const [items, setItems] = useState<React.Key[]>(list);
  const [beforeSortItems, setBeforeSortItems] = useState<React.Key[]>([]);
  const [isSorting, setIsSorting] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // make item click event available
        distance: 1,
      },
    }),
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(event) => {
        setIsSorting(true);
        const index = event.active.data.current?.sortable.index as number;
        let unSelectItems: React.Key[] = [];
        let sortValue: React.Key[] = [];
        items.forEach((item) => {
          if (value.includes(item)) {
            sortValue.push(item);
          } else {
            unSelectItems.push(item);
          }
        });
        if (index <= unSelectItems.length) {
          unSelectItems.splice(index, 0, items[index]);
        } else {
          unSelectItems.push(...sortValue);
        }
        setBeforeSortItems(items);
        setItems(unSelectItems);
      }}
      onDragEnd={(event) => {
        setIsSorting(false);
        if (event.over) {
          const index = event.over?.data.current?.sortable.index;
          const newItems = items.filter((item) => !value.includes(item));
          const sortValue = beforeSortItems.filter((item) => value.includes(item));
          newItems.splice(index, 0, ...sortValue);
          setItems(newItems);
        } else {
          setItems(beforeSortItems);
        }
        setValue([]);
      }}
    >
      <SortableContext items={items} disabled={value.length === 0}>
        <Selectable
          value={value}
          disabled={isSorting}
          getContainer={() => document.querySelector('.container') as HTMLElement}
          onEnd={(selectingValue, { added, removed }) => {
            console.log('onEnd');
            const result = value.concat(added).filter((i) => !removed.includes(i));
            setValue(result);
          }}
        >
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 20,
              padding: 20,
              border: '1px solid #ccc',
            }}
            className="container"
          >
            {items.map((i) => (
              <Item
                selectedLength={value.length}
                key={i}
                value={i}
                disabled={!value.includes(i)}
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
      </SortableContext>
    </DndContext>
  );
};
