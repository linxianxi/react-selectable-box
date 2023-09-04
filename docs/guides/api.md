---
title: API
group:
  title: Usage
  order: 0
order: 0
nav: Get Started
---

### Selectable

| 参数             | 说明                                                                                                                 | 类型                                                                                                           | 默认值              |
| ---------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------- |
| defaultValue     | Initial selected option                                                                                              | (string \| number)[]                                                                                           | -                   |
| value            | Current selected option                                                                                              | (string \| number)[]                                                                                           | -                   |
| disabled         | Whether to disable                                                                                                   | boolean                                                                                                        | false               |
| mode             | Selection mode                                                                                                       | `add` \| `remove` \| `reverse`                                                                                 | `add`               |
| selectStartRange | Where to start with box selection                                                                                    | `all` \| `inside` \| `outside`                                                                                 | `all`               |
| getContainer     | Specify the container. After setting, the container needs to set `position`, because the selection box is `absolute` | () => HTMLElement                                                                                              | () => document.body |
| boxStyle         | Selection box style                                                                                                  | React.CSSProperties                                                                                            | -                   |
| boxClassName     | Selection box className                                                                                              | string                                                                                                         | -                   |
| onStart          | Called when selection starts                                                                                         | () => void                                                                                                     | -                   |
| onEnd            | Called when selection ends                                                                                           | (selectingValue: (string \| number)[], { added: (string \| number)[], removed: (string \| number)[] }) => void | -                   |

### useSelectable

```typescript
const { setNodeRef, isSelected, isAdding, isRemoving, isSelecting, isDragging } = useSelectable({
  value,
  disabled,
  rule,
});
```

| 参数     | 说明                                        | 类型                       | 默认值      |
| -------- | ------------------------------------------- | -------------------------- | ----------- |
| value    | The value of the current selectable element | string \| number           | -           |
| disabled | Whether to disable                          | boolean                    | false       |
| rule     | Selection rule                              | `collision` \| `inclusion` | `collision` |

| 参数        | 说明                                   | 类型                                   |
| ----------- | -------------------------------------- | -------------------------------------- |
| setNodeRef  | Set the selectable element             | (element: HTMLElement \| null) => void |
| isDragging  | Whether it is currently dragging       | boolean                                |
| isSelected  | Whether it has been selected           | boolean                                |
| isAdding    | Whether it is currently being added    | boolean                                |
| isRemoving  | Whether it is currently being removed  | boolean                                |
| isSelecting | Whether it is currently being selected | boolean                                |
