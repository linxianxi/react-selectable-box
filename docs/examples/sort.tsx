// should use these versions https://github.com/clauderic/dnd-kit/issues/901#issuecomment-1340687113
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import Selectable, { useSelectable } from 'react-selectable-box';

const list: string[] = [];
for (let i = 0; i < 200; i++) {
  list.push(String(i));
}

const Item = ({
  value,
  disabled,
  onClick,
}: {
  value: string;
  disabled?: boolean;
  onClick: (isSelected: boolean) => void;
}) => {
  const {
    setNodeRef: setSelectNodeRef,
    isSelected,
    isAdding,
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
        cursor: isSelected ? 'move' : undefined,
        border: isAdding ? '1px solid #1677ff' : undefined,
        opacity: isDragging ? 0.5 : undefined,
        background: isSelected ? '#1677ff' : '#ccc',
      }}
      onClick={() => onClick(isSelected)}
    >
      {value}
    </div>
  );
};

export default () => {
  const [value, setValue] = useState<string[]>([]);
  const [items, setItems] = useState<string[]>(list);
  const [beforeSortItems, setBeforeSortItems] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

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
        const index = event.active.data.current?.sortable.index as number;
        setActiveId(items[index]);
        let unSelectItems: string[] = items.filter((item) => !value.includes(item));
        unSelectItems.splice(index, 0, items[index]);
        setBeforeSortItems(items);
        setItems(unSelectItems);
      }}
      onDragEnd={(event) => {
        setActiveId(null);
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
      <SortableContext items={items}>
        <Selectable
          value={value}
          disabled={!!activeId}
          onEnd={(selectingValue, { added, removed }) => {
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
          >
            {items.map((i) => (
              <Item
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

            <DragOverlay>
              {activeId ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 50,
                    height: 50,
                    borderRadius: 4,
                    background: '#1677ff',
                  }}
                >
                  {activeId}
                  <div
                    style={{
                      position: 'absolute',
                      right: -10,
                      bottom: -10,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 20,
                      height: 20,
                      background: 'red',
                      borderRadius: '50%',
                    }}
                  >
                    {value.length}
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </div>
        </Selectable>
      </SortableContext>
    </DndContext>
  );
};
