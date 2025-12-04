import { useRef, useState } from 'react';
import Selectable, { useSelectable } from 'react-selectable-box';
import './example.css';

const list: number[] = [];
for (let i = 0; i < 200; i++) {
  list.push(i);
}

const checkCircleCollision = (
  circle: { x: number; y: number; radius: number },
  rect: { x: number; y: number; width: number; height: number },
) => {
  // The point closest to the center of the rectangle
  // 矩形距离圆心最近的点
  let targetPoint = { x: 0, y: 0 };
  if (circle.x > rect.x + rect.width) {
    // If the circle is to the right of the rectangle
    // 如果圆形在矩形的右边
    targetPoint.x = rect.x + rect.width;
  } else if (circle.x < rect.x) {
    // If the circle is to the left of the rectangle
    // 如果圆形在矩形的左边
    targetPoint.x = rect.x;
  } else {
    // The x in the center of the circle is in the middle of the rectangle
    // 圆形中心的x在矩形中间
    targetPoint.x = circle.x;
  }
  if (circle.y > rect.y + rect.height) {
    // If the circle is below the rectangle
    // 如果圆形在矩形的下边
    targetPoint.y = rect.y + rect.height;
  } else if (circle.y < rect.y) {
    // If the circle is on top of the rectangle
    // 如果圆形在矩形的上边
    targetPoint.y = rect.y;
  } else {
    // The y of the center of the circle is in the middle of the rectangle
    // 圆形中心的y在矩形中间
    targetPoint.y = circle.y;
  }

  return (
    Math.sqrt(Math.pow(targetPoint.x - circle.x, 2) + Math.pow(targetPoint.y - circle.y, 2)) <
    circle.radius
  );
};

const itemSize = 50;

const Item = ({ value }: { value: number }) => {
  const itemRef = useRef<HTMLDivElement | null>(null);
  const { setNodeRef, isSelected, isAdding, isRemoving } = useSelectable({
    value,
    rule: (_, boxPosition) => {
      if (!itemRef.current) {
        return false;
      }
      const itemRect = itemRef.current.getBoundingClientRect();
      const radius = itemSize / 2;
      return checkCircleCollision(
        { x: itemRect.x + radius, y: itemRect.y + radius, radius },
        {
          x: boxPosition.left,
          y: boxPosition.top,
          width: boxPosition.width,
          height: boxPosition.height,
        },
      );
    },
  });

  return (
    <div
      ref={(ref) => {
        setNodeRef(ref);
        itemRef.current = ref;
      }}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        width: itemSize,
        height: itemSize,
        borderRadius: '50%',
        border: isAdding ? '1px solid #1677ff' : undefined,
        background: isRemoving ? 'red' : isSelected ? '#1677ff' : '#ccc',
      }}
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
