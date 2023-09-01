---
title: FAQ
group:
  title: 快速上手
  order: 0
order: 1
nav: 快速上手
---

### 为什么设置了样式 `user-select: none` 后，鼠标从设置了此样式的元素内部开始框选之后拖到容器边缘无法滚动？

经过测试，这是 `chrome` 的行为，`safari` 则不会。如果想让文字无法被选择，推荐使用 `::selection` 选择器在容器内设置为 `background-color: transparent`。
