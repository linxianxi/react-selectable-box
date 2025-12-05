---
title: API
group:
  title: 快速上手
  order: 0
order: 0
nav: 快速上手
---

### Selectable

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 受控已选择的值 | any[] | - |
| disabled | 是否禁用 | boolean | false |
| mode | 模式 | `add` \| `remove` \| `reverse` | `add` |
| virtualItems | 全部 item 的集合值，只有虚拟列表时要传[（FAQ）](#faq) | any[] | - |
| selectStartRange | 从哪里可以开始进行框选 | `all` \| `inside` \| `outside` | `all` |
| scrollSpeed | 滚动速度 | number | 4 |
| scrollContainer | 指定滚动的容器 | () => HTMLElement \| [ScrollContainerObjectType](#scrollcontainerobjecttype) |
| dragContainer | 指定可以开始拖拽的容器， 如果设置了 `scrollContainer` 请不要设置，因为在可滚动容器中这两个应该相等 | () => HTMLElement | scrollContainer |
| boxStyle | 框选框的样式 | React.CSSProperties | - |
| boxClassName | 框选框的类名 | string | - |
| compareFn | 因为 value 支持任意类型，所以你可能需要自定义函数进行比较，默认使用 `===` | (item: any, value: any) => boolean | === |
| onStart | 框选开始时触发的事件 | (event: MouseEvent \| TouchEvent) => void | - |
| onEnd | 框选结束时触发的事件 | (selectingValue: any[], { added: any[], removed: any[] }) => void | - |

### ScrollContainerObjectType

如果 x 轴和 y 轴的滚动容器不同，需要分别指定。inner 为内部滚动容器，outer 为外部滚动容器。

```typescript
{
  inner: {
    axis: 'x' | 'y';
    getContainer: () => HTMLElement;
  }
  outer: {
    axis: 'y' | 'x';
    getContainer: () => HTMLElement;
  }
}
```

### useSelectable

```typescript
const { setNodeRef, isSelected, isAdding, isRemoving, isSelecting, isDragging } = useSelectable({
  value,
  disabled,
  rule,
});
```

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 当前可框选元素的值 | any | - |
| disabled | 是否禁用 | boolean | false |
| rule | 选中规则，碰撞、包含或自定义，自定义时的 `boxPosition` 是相对于 `scrollContainer` 的位置 | `collision` \| `inclusion` \| ( boxElement: HTMLDivElement, boxPosition: { left: number; top: number; width: number; height: number }) => boolean | `collision` |

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

### FAQ

#### 1.当配合虚拟列表使用时，传入 `virtualItems` 可以使在滚动过程中被卸载的方块在框选结束后也会被选中。但与某些虚拟列表第三方库结合会有问题，配合较好的是 [@tanstack/react-virtual](https://github.com/TanStack/virtual)。如果你不介意这个问题（不传入 `virtualItems`），建议使用 [react-virtuoso](https://github.com/petyosi/react-virtuoso)，该库使用起来比较简单。

不传入 `virtualItems`:

![before](https://github.com/user-attachments/assets/4ec33cb8-adf5-44da-8573-9e69486c8cb2)

传入 `virtualItems`:

![after](https://github.com/user-attachments/assets/fd60faad-321d-46a4-8aec-c6bda2df2eb1)
