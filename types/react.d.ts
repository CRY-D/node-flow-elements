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
 * declare global {
 *   declare module "react" {
 *     namespace JSX {
 *       interface IntrinsicElements extends Nfe {}
 *     }
 *   }
 * }
 * type Nfe = import("@node-flow-elements/nfe/types/react").NodeFlowElements;
 * ```
 */
export interface NodeFlowElements extends Record<Component, any> {
  'nf-flow': Base & NodeFlowFlowProps;
  'nf-handle': Base & NodeFlowHandleProps;
  'nf-port': Base & NodeFlowPortProps;
  'nf-background': Base & NodeFlowBackgroundProps;
  'nf-wa-center': Base & NfeWaCenterElementProps;
  'nf-wa-inventory': Base & NfeWaInventoryElementProps;
  'nf-wa-minimap': Base & NfeWaMinimapProps;
  'nf-wa-navigation': Base & NfeWaNavigationProps;
  'nf-links': Base & NfeWaLinksProps;
  'lit-renderer': Base & LitRendererProps;
}

type Base = Pick<
  React.AllHTMLAttributes<HTMLElement>,
  | 'children'
  | 'dir'
  | 'hidden'
  | 'id'
  | 'lang'
  | 'slot'
  | 'style'
  | 'title'
  | 'translate'
  | 'onClick'
  | 'onFocus'
  | 'onBlur'
> & {
  /** A space-separated list of the classes of the element. Classes allows CSS and JavaScript to select and access specific elements via the class selectors or functions like the method `Document.getElementsByClassName()`. */
  className?: string;

  /** Contains a space-separated list of the part names of the element that should be exposed on the host element. */
  exportparts?: string;

  /** Used for labels to link them with their inputs (using input id). */
  htmlFor?: string;

  /** Used to help React identify which items have changed, are added, or are removed within a list. */
  key?: number | string;

  /** Contains a space-separated list of the part names of the element. Part names allows CSS to select and style specific elements in a shadow tree via the ::part pseudo-element. */
  part?: string;

  /** A mutable ref object whose `.current` property is initialized to the passed argument (`initialValue`). The returned object will persist for the full lifetime of the component. */
  ref?: any;

  /** Allows developers to make HTML elements focusable, allow or prevent them from being sequentially focusable (usually with the `Tab` key, hence the name) and determine their relative ordering for sequential focus navigation. */
  tabIndex?: number;
};
