import type { Component as VueComponent, DefineComponent } from 'vue';
import type {
  Component,
  LitRendererProps,
  NfeWaCenterElementProps,
  NfeWaInventoryElementProps,
  NfeWaLinksProps,
  NfeWaMinimapProps,
  NfeWaNavigationProps,
  NodeFlowBackgroundProps,
  NodeFlowFlowProps,
  NodeFlowHandleProps,
  NodeFlowPortProps,
} from './common';

/**
 * Usage, in an ambient `d.ts`:
 *
 * ```ts
 * import type { NodeFlowElements } from "@node-flow-elements/nfe/types/vue";
 *
 * declare module "vue" {
 *   interface GlobalComponents extends NodeFlowElements {}
 * }
 * ```
 */
export interface NodeFlowElements extends Record<Component, VueComponent> {
  'nf-flow': DefineComponent<NodeFlowFlowProps>;
  'nf-handle': DefineComponent<NodeFlowHandleProps>;
  'nf-port': DefineComponent<NodeFlowPortProps>;
  'nf-background': DefineComponent<NodeFlowBackgroundProps>;
  'nf-wa-center': DefineComponent<NfeWaCenterElementProps>;
  'nf-wa-inventory': DefineComponent<NfeWaInventoryElementProps>;
  'nf-wa-minimap': DefineComponent<NfeWaMinimapProps>;
  'nf-wa-navigation': DefineComponent<NfeWaNavigationProps>;
  'nf-links': DefineComponent<NfeWaLinksProps>;
  'lit-renderer': DefineComponent<LitRendererProps>;
}
