interface Example {
  title: string;
  code: string;
}

export const examples: Record<string, { setup?: string; tasks: Example[] }> = {
  'Deep Equality': {
    setup: `\
import lodash from "https://unpkg.com/lodash-es@4.18.1/lodash.js";
import { dequal } from "https://unpkg.com/dequal@2.0.3/dist/index.mjs";
import * as esToolkit from "https://unpkg.com/es-toolkit@1.47.0/dist/predicate/isEqual.mjs"

const source = { a: { b: 2 } };
const target = { a: { b: 3 } };
`,
    tasks: [
      {
        title: 'lodash',
        code: 'lodash.isEqual(source, target)',
      },
      {
        title: 'dequal',
        code: 'dequal(source, target)',
      },
      {
        title: 'es-toolkit',
        code: 'esToolkit.isEqual(source, target)',
      },
    ],
  },
  'String Concatenation': {
    tasks: [
      {
        title: '+= operator',
        code: `\
let result = '';
const parts = ['a', 'b', 'c', 'd', 'e'];
for (const part of parts) {
  result += part;
}`,
      },
      {
        title: 'Array.push + join',
        code: `\
const parts = ['a', 'b', 'c', 'd', 'e'];
const chunks = [];
for (const part of parts) {
  chunks.push(part);
}
const result = chunks.join('');`,
      },
      {
        title: 'Template literal',
        code: `\
const a = 'a', b = 'b', c = 'c', d = 'd', e = 'e';
const result = \`\${a}\${b}\${c}\${d}\${e}\`;`,
      },
      {
        title: 'String.concat',
        code: 'const result = \'\'.concat(\'a\', \'b\', \'c\', \'d\', \'e\');',
      },
    ],
  },
  'DOM Read/Write Batching': {
    setup: `\
const container = document.createElement('div');
container.style.cssText = 'position:absolute;left:-9999px;top:-9999px;';
document.body.appendChild(container);
const elements = [];
for (let i = 0; i < 100; i += 1) {
  const el = document.createElement('div');
  el.style.width = '100px';
  el.style.height = '100px';
  container.appendChild(el);
  elements.push(el);
}
`,
    tasks: [
      {
        title: 'Sequential read-write',
        code: `\
for (const el of elements) {
  const h = el.offsetHeight;
  el.style.width = h + 1 + 'px';
  const h2 = el.offsetHeight;
  el.style.height = h2 + 1 + 'px';
}`,
      },
      {
        title: 'Batched reads then writes',
        code: `\
const heights = [];
for (const el of elements) {
  heights.push(el.offsetHeight);
}
for (let i = 0; i < elements.length; i += 1) {
  elements[i].style.width = heights[i] + 1 + 'px';
  elements[i].style.height = heights[i] + 1 + 'px';
}`,
      },
    ],
  },
  'Deep Clone': {
    setup: `\
const obj = {
  a: 1,
  b: 'hello',
  c: { nested: { deep: true, arr: [1, 2, 3] } },
  d: null,
  e: [{ x: 1 }, { x: 2 }],
};
`,
    tasks: [
      {
        title: 'Spread (shallow)',
        code: 'const result = { ...obj }',
      },
      {
        title: 'structuredClone',
        code: 'structuredClone(obj)',
      },
      {
        title: 'JSON round-trip',
        code: 'JSON.parse(JSON.stringify(obj))',
      },
    ],
  },
  'JSON.parse vs Protobuf': {
    setup: `\
import protobuf from "https://esm.sh/protobufjs@7.4.0";

const proto = \`
syntax = "proto3";
enum Status { UNKNOWN = 0; ACTIVE = 1; INACTIVE = 2; }
message Meta { string ip = 1; string region = 2; }
message Sample {
  int32 id = 1;
  string name = 2;
  bool active = 3;
  double score = 4;
  bytes payload = 5;
  Status status = 6;
  repeated string tags = 7;
  Meta meta = 8;
  int64 timestamp = 9;
  sint32 priority = 10;
}
\`;

const Sample = protobuf.parse(proto).root.lookupType('Sample');

const obj = {
  id: 42,
  name: 'benchpress',
  active: true,
  score: 3.14159,
  payload: new Uint8Array([1, 2, 3, 4, 5]),
  status: 1,
  tags: ['a', 'b', 'c'],
  meta: { ip: '127.0.0.1', region: 'eu' },
  timestamp: 1700000000123,
  priority: -7,
};

const json = JSON.stringify(obj);
const bytes = Sample.encode(Sample.create(obj)).finish();`,
    tasks: [
      {
        title: 'JSON.parse',
        code: 'JSON.parse(json)',
      },
      {
        title: 'protobuf decode',
        code: 'Sample.decode(bytes)',
      },
      {
        title: 'protobuf decode + toObject',
        code: 'Sample.toObject(Sample.decode(bytes))',
      },
    ],
  },
};
