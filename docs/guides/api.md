---
title: API
group:
  title: Usage
  order: 0
order: 0
nav: Get Started
---

### Selectable

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| value | Current selected option | any[] | - |
| disabled | Whether to disable | boolean | false |
| mode | Selection mode | `add` \| `remove` \| `reverse` | `add` |
| virtualItems | The collection value of all items, only the virtual list needs to be passed [（FAQ）](#faq) | any[] | - |
| selectStartRange | Where to start with box selection | `all` \| `inside` \| `outside` | `all` |
| scrollSpeed | Scroll speed | number | 4 |
| scrollContainer | Specify the scrolling container | () => HTMLElement \| [ScrollContainerObjectType](#scrollcontainerobjecttype) |
| dragContainer | Specify the container that can start dragging. If `scrollContainer` is set, please do not set it because the two should be equal in a scrollable container. | () => HTMLElement | scrollContainer |
| boxStyle | Selection box style | React.CSSProperties | - |
| boxClassName | Selection box className | string | - |
| compareFn | Because value supports any type, you may need to define a custom function for comparison. The default is `===` | (item: any, value: any) => boolean |
| onStart | Called when selection starts | (event: MouseEvent \| TouchEvent) => void | - |
| onEnd | Called when selection ends | (selectingValue: any[], { added: any[], removed: any[] }) => void | - |

### ScrollContainerObjectType

If the scroll containers for the x-axis and y-axis are different, they need to be specified separately. inner is the inner scroll container, and outer is the outer scroll container.

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

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| value | The value of the current selectable element | any | - |
| disabled | Whether to disable | boolean | false |
| rule | Selection rule, collision, inclusion or customization. When customizing, the `boxPosition` is relative to the position of `scrollContainer` | `collision` \| `inclusion` \| ( boxElement: HTMLDivElement, boxPosition: { left: number; top: number; width: number; height: number }) => boolean | `collision` |
|  |

| Property    | 说明                                   | 类型                                   |
| ----------- | -------------------------------------- | -------------------------------------- |
| setNodeRef  | Set the selectable element             | (element: HTMLElement \| null) => void |
| isDragging  | Whether it is currently dragging       | boolean                                |
| isSelected  | Whether it has been selected           | boolean                                |
| isAdding    | Whether it is currently being added    | boolean                                |
| isRemoving  | Whether it is currently being removed  | boolean                                |
| isSelecting | Whether it is currently being selected | boolean                                |

### Methods

| Name   | Description      | Type       |
| ------ | ---------------- | ---------- |
| cancel | cancel selection | () => void |

### FAQ

#### 1.When used with a virtual list, passing in `virtualItems` ensures that `block` were unmounted during scrolling will still be selected after the selection ends. However, there can be issues when integrating with certain third-party virtual list libraries. A better integration can be achieved with [@tanstack/react-virtual](https://github.com/TanStack/virtual). If you don't mind not passing in virtualItems, it is recommended to use [react-virtuoso](https://github.com/petyosi/react-virtuoso), as it is simpler to use.

not passing `virtualItems`:

![before](https://github.com/user-attachments/assets/4ec33cb8-adf5-44da-8573-9e69486c8cb2)

passing `virtualItems`:

![after](https://github.com/user-attachments/assets/fd60faad-321d-46a4-8aec-c6bda2df2eb1)
