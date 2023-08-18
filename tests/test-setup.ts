import '@testing-library/jest-dom';

/* eslint-disable global-require */
if (typeof window !== 'undefined') {
  /**
   * ref: https://github.com/vitest-dev/vitest/issues/821#issuecomment-1046954558
   * ref: https://github.com/ant-design/ant-design/issues/18774
   */
  if (!window.matchMedia) {
    Object.defineProperty(global.window, 'matchMedia', {
      value: vi.fn((query) => ({
        matches: query.includes('max-width'),
        addListener: () => {},
        addEventListener: () => {},
        removeListener: () => {},
        removeEventListener: () => {},
      })),
    });
  }
  // ref: https://github.com/NickColley/jest-axe/issues/147#issuecomment-758804533
  const { getComputedStyle } = window;
  window.getComputedStyle = (elt) => getComputedStyle(elt);
}
