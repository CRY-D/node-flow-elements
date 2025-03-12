import type { NodeFlowFlowElement } from '../dist/flow.el.js';
import type { NodeFlowBackground } from '../dist/background.el.js';
import type { NfeWaCenterElement } from '../dist/themes/webawesome/extra/center.el.js';
import type { NfeWaLinks } from '../dist/themes/webawesome/links.el.js';
import type { NfeWaMinimap } from '../dist/themes/webawesome/extra/minimap.el.js';
import type { NfeWaInventoryElement } from '../dist/themes/webawesome/extra/inventory.el.js';
import type { NfeWaNavigation } from '../dist/themes/webawesome/extra/navigation.el.js';
import type { LitRenderer } from '../src/lib/themes/lit-renderer.el.ts';
import type { NodeFlowHandleElement } from '../dist/handle.el.js';
import type { NodeFlowPortElement } from '../dist/port.el.js';

export type NodeFlowFlowProps = Pick<NodeFlowFlowElement, 'flow'>;

export type NodeFlowBackgroundProps = Partial<
  Pick<NodeFlowBackground, 'flow'>
> & {
  slot: 'background';
};

export type NodeFlowHandleProps = {};

export type NodeFlowPortProps = Partial<Pick<NodeFlowPortElement, 'port'>>;

export type NfeWaCenterElementProps = Partial<
  Pick<NfeWaCenterElement, 'flow'>
> & {
  slot: 'background-interactive';
};

export type NfeWaInventoryElementProps = Partial<
  Pick<NfeWaInventoryElement, 'flow'>
> & {
  slot: 'foreground';
};

export type NfeWaMinimapProps = Partial<Pick<NfeWaMinimap, 'flow'>> & {
  slot: 'foreground';
};

export type NfeWaNavigationProps = Partial<Pick<NfeWaNavigation, 'flow'>> & {
  slot: 'foreground';
};

export type NfeWaLinksProps = Partial<Pick<NfeWaLinks, 'flow'>> & {
  slot: 'foreground-interactive';
};

export type LitRendererProps = Partial<Pick<LitRenderer, 'template'>>;

export type Component =
  | 'nf-flow'
  | 'nf-handle'
  | 'nf-port'
  | 'nf-background'
  | 'nf-links'
  | 'lit-renderer'
  | 'nf-wa-center'
  | 'nf-wa-inventory'
  | 'nf-wa-minimap'
  | 'nf-wa-navigation';
