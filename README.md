<a name="readme-top"></a>

<div align="center">

<h1>react-selectable-box</h1>

A React component that allows you to select elements in the drag area using the mouse

[Changelog](./CHANGELOG.md) · [Report Bug][issues-url] · [Request Feature][issues-url]

<!-- SHIELD GROUP -->

[![NPM version][npm-image]][npm-url] [![NPM downloads][download-image]][download-url] [![install size][npm-size]][npm-size-url]

[![Test CI status][test-ci]][test-ci-url] [![Deploy CI][release-ci]][release-ci-url] [![Coverage][coverage]][codecov-url]

[![contributors][contributors-shield]][contributors-url] [![forks][forks-shield]][forks-url] [![stargazers][stargazers-shield]][stargazers-url] [![issues][issues-shield]][issues-url]

[![ docs by dumi][dumi-url]](https://d.umijs.org/) [![Build With father][father-url]](https://github.com/umijs/father/)

<!-- umi url -->

[dumi-url]: https://img.shields.io/badge/docs%20by-dumi-blue
[father-url]: https://img.shields.io/badge/build%20with-father-028fe4.svg

<!-- npm url -->

[npm-image]: http://img.shields.io/npm/v/react-selectable-box.svg?style=flat-square&color=deepgreen&label=latest
[npm-url]: http://npmjs.org/package/react-selectable-box
[npm-size]: https://img.shields.io/bundlephobia/minzip/react-selectable-box?color=deepgreen&label=gizpped%20size&style=flat-square
[npm-size-url]: https://packagephobia.com/result?p=react-selectable-box

<!-- coverage -->

[coverage]: https://codecov.io/gh/linxianxi/react-selectable-box/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/linxianxi/react-selectable-box/branch/master

<!-- Github CI -->

[test-ci]: https://github.com/linxianxi/react-selectable-box/workflows/Test%20CI/badge.svg
[release-ci]: https://github.com/linxianxi/react-selectable-box/workflows/Release%20CI/badge.svg
[test-ci-url]: https://github.com/linxianxi/react-selectable-box/actions?query=workflow%3ATest%20CI
[release-ci-url]: https://github.com/linxianxi/react-selectable-box/actions?query=workflow%3ARelease%20CI
[download-image]: https://img.shields.io/npm/dm/react-selectable-box.svg?style=flat-square
[download-url]: https://npmjs.org/package/react-selectable-box

</div>

## Introduction

A React component that allows you to select elements in the drag area using the mouse

<img width="600" src="https://github.com/linxianxi/react-selectable-box/assets/47104575/9d463acf-c56b-48d8-b7d5-2dc02b4257e0" />

## Usage

### Install

```bash
pnpm i react-selectable-box
```

### Docs

[docs](https://linxianxi.github.io/react-selectable-box/)

### Example

```typescript
import Selectable, { useSelectable } from 'react-selectable-box';

const list: number[] = [];
for (let i = 0; i < 200; i++) {
  list.push(i);
}

const App = () => {
  return (
    <Selectable>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 20,
          padding: 20,
          border: '1px solid #ccc',
        }}
      >
        {list.map((i) => (
          <Item key={i} value={i} />
        ))}
      </div>
    </Selectable>
  );
};

const Item = ({ value }: { value: number }) => {
  const { setNodeRef, isSelected, isAdding } = useSelectable({
    value,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        width: 50,
        height: 50,
        borderRadius: 4,
        border: isAdding ? '1px solid #1677ff' : undefined,
        background: isSelected ? '#1677ff' : '#ccc',
      }}
    />
  );
};
```

## Changelog

[CHANGELOG](https://linxianxi.github.io/react-selectable-box/changelog)

<div align="right">

[![][back-to-top]](#readme-top)

## </div>

#### 📝 License

Copyright © 2023 - present [linxianxi][profile-url]. <br />
This project is [MIT](./LICENSE) licensed.

<!-- LINK GROUP -->

[profile-url]: https://github.com/linxianxi

<!-- SHIELD LINK GROUP -->

[back-to-top]: https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square

<!-- contributors -->

[contributors-shield]: https://img.shields.io/github/contributors/linxianxi/react-selectable-box.svg?style=flat
[contributors-url]: https://github.com/linxianxi/react-selectable-box/graphs/contributors

<!-- forks -->

[forks-shield]: https://img.shields.io/github/forks/linxianxi/react-selectable-box.svg?style=flat
[forks-url]: https://github.com/linxianxi/react-selectable-box/network/members

<!-- stargazers -->

[stargazers-shield]: https://img.shields.io/github/stars/linxianxi/react-selectable-box.svg?style=flat
[stargazers-url]: https://github.com/linxianxi/react-selectable-box/stargazers

<!-- issues -->

[issues-shield]: https://img.shields.io/github/issues/linxianxi/react-selectable-box.svg?style=flat
[issues-url]: https://github.com/linxianxi/react-selectable-box/issues/new/choose
