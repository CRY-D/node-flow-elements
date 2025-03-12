import type {
  FlowConstructorParameters,
  NodeList,
  NodeType,
} from '../../../../types.js';
import { NfWaOperationNode } from '../operation.el.js';
import type { PortsWithSchema } from '../schemas.js';
import { NfWaDisplayNumberNode } from '../display-number.el.js';
import { NfWaNumberNode } from '../number.el.js';
import { NfWaTextNode } from '../text.el.js';
import { NfWaNoteNode } from '../note.el.js';
import { NfWaCanvasFiltersNode } from '../canvas-filters.el.js';
import { NfWaCanvasTextNode } from '../canvas-text.el.js';
import { NfWaCanvasComparerNode } from '../canvas-comparer.el.js';
import { NfWaBroadcastChannelNode } from '../broadcast-channel.el.js';
import { NfWaCanvasMixerNode } from '../canvas-mixer.el.js';
import { NfWaCanvasColorNode } from '../canvas-color.el.jsx';

import { menu } from './menu.js';

export const nodeTypes = {
  NfWaNumberNode,
  NfWaOperationNode,
  NfWaDisplayNumberNode,
  NfWaTextNode,
  NfWaNoteNode,
  NfWaCanvasTextNode,
  NfWaCanvasComparerNode,
  NfWaCanvasFiltersNode,
  NfWaBroadcastChannelNode,
  NfWaCanvasMixerNode,
  NfWaCanvasColorNode,
} satisfies NodeList<PortsWithSchema>;

const offsetX = -200;
const offsetY = 200;

const initialNodes = [
  {
    id: 'num_1',
    type: 'NfWaNumberNode',
    x: 61 - offsetX,
    y: 33 - offsetY,
    customDisplayName: 'Factor - Brightness',
    test: 12,
    ports: {
      number: {
        value: 15,
        connectedTo: [{ node: 'op', port: 'numberA' }],
      },
    },
  },
  {
    type: 'NfWaOperationNode',
    id: 'op',
    x: 507 - offsetX,
    y: 94 - offsetY,
    foo2: 'sss',
    initialOperation: 'Multiply',
    ports: {
      result: {
        connectedTo: [
          { node: 'bd_in', port: 'messageInput' },
          { node: 'filters', port: 'brightnessIn' },
        ],
      },
    },
  },
  {
    type: 'NfWaNumberNode',
    id: 'num2',
    customDisplayName: 'Factor - Blur x Brightness',
    x: 0 - offsetX,
    y: 316 - offsetY,
    test: 1,
    ports: {
      number: {
        value: 11,
        connectedTo: [
          { node: 'op', port: 'numberA' },
          { node: 'op', port: 'numberB' },
          { node: 'filters', port: 'blurIn' },
        ],
      },
    },
  },

  {
    type: 'NfWaDisplayNumberNode',
    id: 'num_d',
    x: 1500 - offsetX,
    y: 57 - offsetY,
  },
  {
    type: 'NfWaCanvasTextNode',
    id: 'text_canvas',
    x: 333 - offsetX,
    y: 926 - offsetY,

    ports: {
      canvas: { connectedTo: [{ node: 'mixer_1', port: 'canvasBIn' }] },
    },
  },
  {
    type: 'NfWaCanvasFiltersNode',
    id: 'filters',
    x: 1304 - offsetX,
    y: 357 - offsetY,

    ports: {
      canvasOut: { connectedTo: [{ node: 'comparer_1', port: 'canvasAfter' }] },
    },
  },
  {
    type: 'NfWaTextNode',
    id: 'text_1',
    x: 39 - offsetX,
    y: 639 - offsetY,

    ports: {
      textOutput: {
        connectedTo: [{ node: 'text_canvas', port: 'text' }],
      },
    },
  },
  {
    type: 'NfWaCanvasComparerNode',

    id: 'comparer_1',
    x: 1801 - offsetX,
    y: 881 - offsetY,
  },
  {
    type: 'NfWaBroadcastChannelNode',
    id: 'bd_in',
    x: 930 - offsetX,
    y: 351 - offsetY,
    customDisplayName: 'Broadcast In  (op.)',
  },
  {
    type: 'NfWaBroadcastChannelNode',
    id: 'bd_out',
    x: 993 - offsetX,
    y: 33 - offsetY,
    customDisplayName: 'Broadcast Out (op.)',

    ports: {
      messageOutput: { connectedTo: [{ node: 'num_d', port: 'number' }] },
    },
  },
  {
    type: 'NfWaCanvasMixerNode',
    id: 'mixer_1',
    x: 867 - offsetX,
    y: 886 - offsetY,

    // ports: { canvasOut: { node: 'filters', port: 'canvasIn' } },
    ports: {
      canvasOut: {
        connectedTo: [
          { node: 'comparer_1', port: 'canvasBefore' },
          { node: 'filters', port: 'canvasIn' },
        ],
      },
    },
  },
  {
    type: 'NfWaCanvasColorNode',
    id: 'img_1',
    x: 451 - offsetX,
    y: 413 - offsetY,

    ports: {
      canvas: { connectedTo: [{ node: 'mixer_1', port: 'canvasAIn' }] },
    },
  },
  {
    id: 'note_1',
    type: 'NfWaNoteNode',
    x: 855 - offsetX,
    y: 684 - offsetY,
    ports: {
      text: {
        value:
          '💡 Right click on the canvas to create new nodes, clear all of them, etc.',
      },
    },
  },
  {
    id: 'note_2',
    type: 'NfWaNoteNode',
    x: 1751 - offsetX,
    y: 109 - offsetY,
    ports: {
      text: {
        value:
          '👈 Open a new tab / window to see how messages can be broadcasted!',
      },
    },
  },
] as const satisfies NodeType<typeof nodeTypes>[];

export const preset = {
  id: 'flow_1',
  nodeTypes,
  initialNodes,
  menu,
} as const satisfies FlowConstructorParameters;
