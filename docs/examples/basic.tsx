import { Descriptions, Radio, Switch } from 'antd';
import { useState } from 'react';
import Selectable, { useSelectable } from 'react-selectable-box';
import './example.css';

const list: number[] = [];
for (let i = 0; i < 200; i++) {
  list.push(i);
}

const Item = ({ value, rule }: { value: number; rule: 'collision' | 'inclusion' }) => {
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
        color: 'white',
        width: 50,
        height: 50,
        borderRadius: 4,
        border: isAdding ? '1px solid #1677ff' : undefined,
        background: isRemoving ? 'red' : isSelected ? '#1677ff' : '#ccc',
      }}
    >
      {value}
    </div>
  );
};

export default () => {
  const [value, setValue] = useState<number[]>([]);
  const [mode, setMode] = useState<'add' | 'remove' | 'reverse'>('add');
  const [selectStartRange, setSelectStartRange] = useState<'all' | 'inside' | 'outside'>('all');
  const [disabled, setDisabled] = useState(false);
  const [rule, setRule] = useState<'collision' | 'inclusion'>('collision');

  return (
    <div>
      <Descriptions
        column={1}
        items={[
          { label: 'disabled', children: <Switch checked={disabled} onChange={setDisabled} /> },
          {
            label: 'selectStartRange',
            children: (
              <Radio.Group
                value={selectStartRange}
                buttonStyle="solid"
                optionType="button"
                options={[
                  { label: 'all', value: 'all' },
                  { label: 'inside', value: 'inside' },
                  { label: 'outside', value: 'outside' },
                ]}
                onChange={(e) => setSelectStartRange(e.target.value)}
              />
            ),
          },
          {
            label: 'rule',
            children: (
              <Radio.Group
                value={rule}
                buttonStyle="solid"
                optionType="button"
                options={[
                  { label: 'collision', value: 'collision' },
                  { label: 'inclusion', value: 'inclusion' },
                ]}
                onChange={(e) => setRule(e.target.value)}
              />
            ),
          },
          {
            label: 'mode',
            children: (
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
            ),
          },
        ]}
      />

      <Selectable
        disabled={disabled}
        mode={mode}
        value={value}
        dragContainer={() => document.getElementById('drag-container')}
        selectStartRange={selectStartRange}
        onEnd={(selectingValue, { added, removed }) => {
          const result = value.concat(added).filter((i) => !removed.includes(i));
          setValue(result);
        }}
      >
        <div
          id="drag-container"
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
