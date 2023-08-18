import { Radio, Space, Switch } from 'antd';
import React, { useState } from 'react';
import Selectable, { useSelectable } from 'react-selectable-box';

const list: string[] = [];
for (let i = 0; i < 200; i++) {
  list.push(String(i));
}

const Item = ({ value, rule }: { value: string; rule: 'collision' | 'inclusion' }) => {
  const { setNodeRef, isSelected, isAdding, isRemoving } = useSelectable({
    value,
    rule,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
        border: isAdding ? '1px solid #1677ff' : undefined,
        background: isRemoving ? 'red' : isSelected ? '#1677ff' : '#ccc',
      }}
    >
      {value}
    </div>
  );
};

export default () => {
  const [value, setValue] = useState<React.Key[]>([]);
  const [mode, setMode] = useState<'add' | 'remove' | 'reverse'>('add');
  const [selectFromInside, setSelectFromInside] = useState(true);
  const [enable, setEnable] = useState(true);
  const [rule, setRule] = useState<'collision' | 'inclusion'>('collision');

  return (
    <div>
      <Space style={{ marginBottom: 20 }} direction="vertical">
        <div>
          enable: <Switch checked={enable} onChange={setEnable} />
        </div>
        <div>
          selectFromInside: <Switch checked={selectFromInside} onChange={setSelectFromInside} />
        </div>
        <div>
          rule:
          <Radio.Group
            value={rule}
            onChange={(e) => setRule(e.target.value)}
            buttonStyle="solid"
            optionType="button"
            options={[
              { label: 'collision', value: 'collision' },
              { label: 'inclusion', value: 'inclusion' },
            ]}
          />
        </div>
        <div>
          mode:
          <Radio.Group
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            buttonStyle="solid"
            optionType="button"
            options={[
              { label: 'add', value: 'add' },
              { label: 'remove', value: 'remove' },
              { label: 'reverse', value: 'reverse' },
            ]}
          />
        </div>
      </Space>
      <Selectable
        disabled={!enable}
        mode={mode}
        value={value}
        selectFromInside={selectFromInside}
        onEnd={(selectingValue, { added, removed }) => {
          const result = value.concat(added).filter((i) => !removed.includes(i));
          setValue(result);
        }}
      >
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
            <Item key={i} value={i} rule={rule} />
          ))}
        </div>
      </Selectable>
    </div>
  );
};
