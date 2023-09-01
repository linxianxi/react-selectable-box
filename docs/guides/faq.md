---
title: FAQ
group:
  title: Usage
  order: 0
order: 1
nav: Get Started
---

### Why after setting the style `user-select: none`, the mouse cannot scroll after starting the box selection from inside the element set with this style and dragging it to the edge of the container?

After testing, this is the behavior of `chrome`, and `safari` does not. If you want the text not to be selectable, it is recommended to use the `::selection` selector to set `background-color: transparent` inside the container.
