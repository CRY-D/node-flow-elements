import type { MenuItem } from '../../../../types.js';
import { NfWaBroadcastChannelNode } from '../broadcast-channel.el.jsx';
import { NfWaCanvasColorNode } from '../canvas-color.el.jsx';
import { NfWaCanvasComparerNode } from '../canvas-comparer.el.jsx';
import { NfWaCanvasFiltersNode } from '../canvas-filters.el.jsx';
import { NfWaCanvasMixerNode } from '../canvas-mixer.el.jsx';
import { NfWaCanvasTextNode } from '../canvas-text.el.jsx';
import { NfWaDisplayNumberNode } from '../display-number.el.jsx';
import { NfWaNoteNode } from '../note.el.jsx';
import { NfWaNumberNode } from '../number.el.jsx';
import { NfWaOperationNode } from '../operation.el.jsx';
import { NfWaTextNode } from '../text.el.jsx';

export const menu = [
  { displayName: 'Primitives', label: true },
  {
    displayName: 'Number',
    icon: '123',
    children: [
      //
      { nodeCtor: NfWaNumberNode },
      { nodeCtor: NfWaOperationNode },
      { nodeCtor: NfWaDisplayNumberNode },
    ],
  },
  {
    displayName: 'Text',
    icon: 'alphabet-uppercase',
    children: [
      //
      { nodeCtor: NfWaTextNode },
    ],
  },
  { displayName: 'Media', label: true },
  {
    displayName: 'Canvas',
    icon: 'collection-play',
    children: [
      //
      { nodeCtor: NfWaCanvasTextNode },
      { nodeCtor: NfWaCanvasFiltersNode },
      { nodeCtor: NfWaCanvasComparerNode },
      { nodeCtor: NfWaCanvasMixerNode },
      { nodeCtor: NfWaCanvasColorNode },
    ],
  },

  { displayName: 'Channels', label: true },

  { nodeCtor: NfWaBroadcastChannelNode },

  { displayName: 'Others', label: true },
  { nodeCtor: NfWaNoteNode },
] as const satisfies MenuItem[];
