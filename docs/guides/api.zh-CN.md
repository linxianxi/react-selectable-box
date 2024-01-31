---
title: API
group:
  title: 快速上手
  order: 0
order: 0
nav: 快速上手
---

### Selectable

| 参数             | 说明                                                                                               | 类型                                                              | 默认值          |
| ---------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | --------------- |
| defaultValue     | 默认已选择的值                                                                                     | any[]                                                             | -               |
| value            | 受控已选择的值                                                                                     | any[]                                                             | -               |
| disabled         | 是否禁用                                                                                           | boolean                                                           | false           |
| mode             | 模式                                                                                               | `add` \| `remove` \| `reverse`                                    | `add`           |
| items            | 全部 item 的集合值，只有虚拟列表时要传                                                             | any[]                                                             | -               |
| selectStartRange | 从哪里可以开始进行框选                                                                             | `all` \| `inside` \| `outside`                                    | `all`           |
| scrollContainer  | 指定滚动的容器，设置后，容器需要设置 `position`，因为选择框是 `absolute` 要相对于容器定位          | () => HTMLElement                                                 |
| dragContainer    | 指定可以开始拖拽的容器， 如果设置了 `scrollContainer` 请不要设置，因为在可滚动容器中这两个应该相等 | () => HTMLElement                                                 | scrollContainer |
| boxStyle         | 框选框的样式                                                                                       | React.CSSProperties                                               | -               |
| boxClassName     | 框选框的类名                                                                                       | string                                                            | -               |
| compareFn        | 因为 value 支持任意类型，所以你可能需要自定义函数进行比较，默认使用 `===`                          | (item: any, value: any) => boolean                                | ===             |
| onStart          | 框选开始时触发的事件                                                                               | () => void                                                        | -               |
| onEnd            | 框选结束时触发的事件                                                                               | (selectingValue: any[], { added: any[], removed: any[] }) => void | -               |

### useSelectable

```typescript
const { setNodeRef, isSelected, isAdding, isRemoving, isSelecting, isDragging } = useSelectable({
  value,
  disabled,
  rule,
});
```

| 参数     | 说明                                                                                     | 类型                                                                                                                                              | 默认值      |
| -------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| value    | 当前可框选元素的值                                                                       | any                                                                                                                                               | -           |
| disabled | 是否禁用                                                                                 | boolean                                                                                                                                           | false       |
| rule     | 选中规则，碰撞、包含或自定义，自定义时的 `boxPosition` 是相对于 `scrollContainer` 的位置 | `collision` \| `inclusion` \| ( boxElement: HTMLDivElement, boxPosition: { left: number; top: number; width: number; height: number }) => boolean | `collision` |

| 参数        | 说明               | 类型                                   |
| ----------- | ------------------ | -------------------------------------- |
| setNodeRef  | 设置当前可框选元素 | (element: HTMLElement \| null) => void |
| isDragging  | 是否正在框选       | boolean                                |
| isSelected  | 是否已经选中       | boolean                                |
| isAdding    | 当前是否正在添加   | boolean                                |
| isRemoving  | 当前是否正在删除   | boolean                                |
| isSelecting | 当前是否被框选     | boolean                                |

### 方法

| 名称   | 说明     | 类型       |
| ------ | -------- | ---------- |
| cancel | 取消选择 | () => void |
