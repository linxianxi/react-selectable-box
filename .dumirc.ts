import { defineConfig } from 'dumi';
import { homepage } from './package.json';

export default defineConfig({
  themeConfig: {
    name: 'react-selectable-box',
    github: homepage,
  },
  html2sketch: {},
  mfsu: false,
  outputPath: '.doc',
});
