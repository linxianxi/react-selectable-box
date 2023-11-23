import { useRef } from 'react';
import { getClientXY } from '../utils';

const SCROLL_STEP = 4;

export default function useScroll() {
  const topRaf = useRef<number | null>(null);
  const bottomRaf = useRef<number | null>(null);
  const leftRaf = useRef<number | null>(null);
  const rightRaf = useRef<number | null>(null);

  const cancelTopRaf = () => {
    if (topRaf.current) {
      cancelAnimationFrame(topRaf.current);
      topRaf.current = null;
    }
  };

  const cancelBottomRaf = () => {
    if (bottomRaf.current) {
      cancelAnimationFrame(bottomRaf.current);
      bottomRaf.current = null;
    }
  };

  const cancelLeftRaf = () => {
    if (leftRaf.current) {
      cancelAnimationFrame(leftRaf.current);
      leftRaf.current = null;
    }
  };

  const cancelRightRaf = () => {
    if (rightRaf.current) {
      cancelAnimationFrame(rightRaf.current);
      rightRaf.current = null;
    }
  };

  const cancelScroll = () => {
    cancelTopRaf();
    cancelBottomRaf();
    cancelLeftRaf();
    cancelRightRaf();
  };

  const smoothScroll = (e: MouseEvent | TouchEvent, _container: HTMLElement) => {
    const container = _container === document.body ? document.documentElement : _container;
    const { clientX, clientY } = getClientXY(e);

    // top
    if (clientY < 0 || clientY < container.getBoundingClientRect().top) {
      if (!topRaf.current) {
        const callback = () => {
          if (container.scrollTop > 0) {
            topRaf.current = requestAnimationFrame(() => {
              container.scrollTop -= SCROLL_STEP;
              callback();
            });
          }
        };
        callback();
      }
    } else {
      cancelTopRaf();
    }

    // bottom
    if (clientY > window.innerHeight || clientY > container.getBoundingClientRect().bottom) {
      if (!bottomRaf.current) {
        const callback = () => {
          if (container.scrollTop < container.scrollHeight - container.clientHeight) {
            bottomRaf.current = requestAnimationFrame(() => {
              container.scrollTop += SCROLL_STEP;
              callback();
            });
          }
        };
        callback();
      }
    } else {
      cancelBottomRaf();
    }

    // left
    if (clientX < 0 || clientX < container.getBoundingClientRect().left) {
      if (!leftRaf.current) {
        const callback = () => {
          if (container.scrollLeft > 0) {
            leftRaf.current = requestAnimationFrame(() => {
              container.scrollLeft -= SCROLL_STEP;
              callback();
            });
          }
        };
        callback();
      }
    } else {
      cancelLeftRaf();
    }

    // right
    if (clientX > window.innerWidth || clientX > container.getBoundingClientRect().right) {
      if (!rightRaf.current) {
        const callback = () => {
          if (container.scrollLeft < container.scrollWidth - container.clientWidth) {
            rightRaf.current = requestAnimationFrame(() => {
              container.scrollLeft += SCROLL_STEP;
              callback();
            });
          }
        };
        callback();
      }
    } else {
      cancelRightRaf();
    }
  };

  return {
    cancelScroll,
    smoothScroll,
  };
}
