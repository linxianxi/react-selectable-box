import { defineConfig } from 'dumi';
import { homepage } from './package.json';

const isProd = process.env.NODE_ENV === 'production';

const name = 'react-selectable-box';

export default defineConfig({
  themeConfig: {
    name,
    github: homepage,
  },
  base: isProd ? `/${name}/` : '/',
  publicPath: isProd ? `/${name}/` : '/',
  html2sketch: {},
  mfsu: false,
  outputPath: '.doc',
  locales: [
    { id: 'en-US', name: 'EN' },
    { id: 'zh-CN', name: '中文' },
  ],
});
