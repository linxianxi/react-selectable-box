---
title: API
group:
  title: Usage
  order: 0
order: 0
nav: Get Started
---

### Selectable

| Property         | Description                                                                                                                                                                         | Type                                                              | Default         |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | --------------- |
| defaultValue     | Initial selected option                                                                                                                                                             | any[]                                                             | -               |
| value            | Current selected option                                                                                                                                                             | any[]                                                             | -               |
| disabled         | Whether to disable                                                                                                                                                                  | boolean                                                           | false           |
| mode             | Selection mode                                                                                                                                                                      | `add` \| `remove` \| `reverse`                                    | `add`           |
| items            | The collection value of all items, only the virtual list needs to be passed                                                                                                         | any[]                                                             | -               |
| selectStartRange | Where to start with box selection                                                                                                                                                   | `all` \| `inside` \| `outside`                                    | `all`           |
| scrollContainer  | Specify the scrolling container. After setting, the container needs to set `position` because the selection box is `absolute` and needs to be positioned relative to the container. | () => HTMLElement                                                 |
| dragContainer    | Specify the container that can start dragging. If `scrollContainer` is set, please do not set it because the two should be equal in a scrollable container.                         | () => HTMLElement                                                 | scrollContainer |
| boxStyle         | Selection box style                                                                                                                                                                 | React.CSSProperties                                               | -               |
| boxClassName     | Selection box className                                                                                                                                                             | string                                                            | -               |
| compareFn        | Because value supports any type, you may need to define a custom function for comparison. The default is `===`                                                                      | (item: any, value: any) => boolean                                |
| onStart          | Called when selection starts                                                                                                                                                        | () => void                                                        | -               |
| onEnd            | Called when selection ends                                                                                                                                                          | (selectingValue: any[], { added: any[], removed: any[] }) => void | -               |

### useSelectable

```typescript
const { setNodeRef, isSelected, isAdding, isRemoving, isSelecting, isDragging } = useSelectable({
  value,
  disabled,
  rule,
});
```

| Property | Description                                                                                                                                 | Type                                                                                                                                              | Default     |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| value    | The value of the current selectable element                                                                                                 | any                                                                                                                                               | -           |
| disabled | Whether to disable                                                                                                                          | boolean                                                                                                                                           | false       |
| rule     | Selection rule, collision, inclusion or customization. When customizing, the `boxPosition` is relative to the position of `scrollContainer` | `collision` \| `inclusion` \| ( boxElement: HTMLDivElement, boxPosition: { left: number; top: number; width: number; height: number }) => boolean | `collision` |
|          |

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
