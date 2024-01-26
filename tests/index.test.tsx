import { render } from '@testing-library/react';
import Selectable, { useSelectable } from '../src';

const list: string[] = [];
for (let i = 0; i < 10; i++) {
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

describe('Selectable', () => {
  it('render', async () => {
    const { container, unmount } = render(
      <Selectable>
        <div
          id="wrapper"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 20,
            padding: 20,
            border: '1px solid #ccc',
            width: 800,
          }}
        >
          {list.map((i) => (
            <Item key={i} value={i} />
          ))}
        </div>
      </Selectable>,
    );
    expect(container.querySelector('#wrapper')).toBeInTheDocument();
    unmount();
  });
});
