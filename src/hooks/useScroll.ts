import { useEffect, useRef } from 'react';
import { SelectableProps } from '../type';
import { getClientXY } from '../utils';

const DEFAULT_SCROLL_SPEED = 4;

const EDGE_OFFSET = 1;

export default function useScroll(
  scrollSpeed = DEFAULT_SCROLL_SPEED,
  scrollContainer: SelectableProps['scrollContainer'],
) {
  const topRaf = useRef<number | null>(null);
  const bottomRaf = useRef<number | null>(null);
  const leftRaf = useRef<number | null>(null);
  const rightRaf = useRef<number | null>(null);

  const cancelRaf = (raf: React.MutableRefObject<number | null>) => {
    if (raf.current) {
      cancelAnimationFrame(raf.current);
      raf.current = null;
    }
  };

  const cancelScroll = () => {
    cancelRaf(topRaf);
    cancelRaf(bottomRaf);
    cancelRaf(leftRaf);
    cancelRaf(rightRaf);
  };

  useEffect(() => {
    return cancelScroll;
  }, []);

  const getScrollContainer = (axis: 'x' | 'y') => {
    function getContainer() {
      if (scrollContainer) {
        if (typeof scrollContainer === 'function') {
          return scrollContainer();
        }
        if (scrollContainer.inner?.axis === axis) {
          return scrollContainer.inner.getContainer();
        }
        if (scrollContainer.outer?.axis === axis) {
          return scrollContainer.outer.getContainer();
        }
      }
      return document.body;
    }

    const container = getContainer();

    return container === document.body ? document.documentElement : container;
  };

  const smoothScroll = (e: MouseEvent | TouchEvent) => {
    const { clientX, clientY } = getClientXY(e);
    const xScrollContainer = getScrollContainer('x');
    const yScrollContainer = getScrollContainer('y');

    if (yScrollContainer) {
      // top
      if (clientY - EDGE_OFFSET <= 0 || clientY <= yScrollContainer.getBoundingClientRect().top) {
        if (!topRaf.current) {
          const callback = () => {
            if (yScrollContainer.scrollTop > 0) {
              topRaf.current = requestAnimationFrame(() => {
                yScrollContainer.scrollTop -= scrollSpeed;
                callback();
              });
            }
          };
          callback();
        }
      } else {
        cancelRaf(topRaf);
      }

      // bottom
      if (
        clientY + EDGE_OFFSET >= window.innerHeight ||
        clientY >= yScrollContainer.getBoundingClientRect().bottom
      ) {
        if (!bottomRaf.current) {
          const callback = () => {
            if (
              yScrollContainer.scrollTop <
              yScrollContainer.scrollHeight - yScrollContainer.clientHeight
            ) {
              bottomRaf.current = requestAnimationFrame(() => {
                yScrollContainer.scrollTop += scrollSpeed;
                callback();
              });
            }
          };
          callback();
        }
      } else {
        cancelRaf(bottomRaf);
      }
    }

    if (xScrollContainer) {
      // left
      if (clientX - EDGE_OFFSET <= 0 || clientX <= xScrollContainer.getBoundingClientRect().left) {
        if (!leftRaf.current) {
          const callback = () => {
            if (xScrollContainer.scrollLeft > 0) {
              leftRaf.current = requestAnimationFrame(() => {
                xScrollContainer.scrollLeft -= scrollSpeed;
                callback();
              });
            }
          };
          callback();
        }
      } else {
        cancelRaf(leftRaf);
      }

      // right
      if (
        clientX + EDGE_OFFSET >= window.innerWidth ||
        clientX >= xScrollContainer.getBoundingClientRect().right
      ) {
        if (!rightRaf.current) {
          const callback = () => {
            if (
              xScrollContainer.scrollLeft <
              xScrollContainer.scrollWidth - xScrollContainer.clientWidth
            ) {
              rightRaf.current = requestAnimationFrame(() => {
                xScrollContainer.scrollLeft += scrollSpeed;
                callback();
              });
            }
          };
          callback();
        }
      } else {
        cancelRaf(rightRaf);
      }
    }
  };

  return {
    cancelScroll,
    smoothScroll,
  };
}
