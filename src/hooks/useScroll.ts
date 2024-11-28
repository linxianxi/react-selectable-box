import { useEffect, useRef } from 'react';
import { getClientXY } from '../utils';

const DEFAULT_SCROLL_SPEED = 4;

const EDGE_OFFSET = 1;

export default function useScroll(scrollSpeed = DEFAULT_SCROLL_SPEED) {
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

  const smoothScroll = (e: MouseEvent | TouchEvent, _container: HTMLElement) => {
    const container = _container === document.body ? document.documentElement : _container;
    const { clientX, clientY } = getClientXY(e);

    // top
    if (clientY - EDGE_OFFSET <= 0 || clientY <= container.getBoundingClientRect().top) {
      if (!topRaf.current) {
        const callback = () => {
          if (container.scrollTop > 0) {
            topRaf.current = requestAnimationFrame(() => {
              container.scrollTop -= scrollSpeed;
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
      clientY >= container.getBoundingClientRect().bottom
    ) {
      if (!bottomRaf.current) {
        const callback = () => {
          if (container.scrollTop < container.scrollHeight - container.clientHeight) {
            bottomRaf.current = requestAnimationFrame(() => {
              container.scrollTop += scrollSpeed;
              callback();
            });
          }
        };
        callback();
      }
    } else {
      cancelRaf(bottomRaf);
    }

    // left
    if (clientX - EDGE_OFFSET <= 0 || clientX <= container.getBoundingClientRect().left) {
      if (!leftRaf.current) {
        const callback = () => {
          if (container.scrollLeft > 0) {
            leftRaf.current = requestAnimationFrame(() => {
              container.scrollLeft -= scrollSpeed;
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
      clientX >= container.getBoundingClientRect().right
    ) {
      if (!rightRaf.current) {
        const callback = () => {
          if (container.scrollLeft < container.scrollWidth - container.clientWidth) {
            rightRaf.current = requestAnimationFrame(() => {
              container.scrollLeft += scrollSpeed;
              callback();
            });
          }
        };
        callback();
      }
    } else {
      cancelRaf(rightRaf);
    }
  };

  return {
    cancelScroll,
    smoothScroll,
  };
}
