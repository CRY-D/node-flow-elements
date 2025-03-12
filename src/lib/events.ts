/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Flow } from './flow.js';
import type { Node } from './node.js';
import type { Port } from './port.js';

export type NodeFlowEventSuperType = 'Flow' | 'Node' | 'Port';

export type NodeFlowEventListenerType = 'changed';

type NodeEvent = ExtractMethods<Node>;
type PortEvent = ExtractMethods<Port>;
type FlowEvent = ExtractMethods<Flow>;

type PickMatching<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};
type ExtractMethods<T> = PickMatching<T, (...arguments_: any) => any>;

export type NfEventDetail<
  _N extends NodeEvent = NodeEvent,
  _P extends PortEvent = PortEvent,
  _F extends FlowEvent = FlowEvent,
> = {
  id: string;
} & (
  | {
      type: 'Node';
      instance: Node;
      method: keyof _N;
      args: unknown;
    }
  | {
      type: 'Port';
      instance: Port;
      method: keyof _P;
      args: unknown;
    }
  | {
      type: 'Flow';
      instance: Flow;
      method: keyof _F;
      args: unknown;
    }
);

export class NfEvent extends CustomEvent<NfEventDetail> {
  constructor(
    type: NodeFlowEventListenerType,
    options: { detail: NfEventDetail },
  ) {
    super(type, options);
  }
}

export class NodeFlowEventTarget extends EventTarget {
  listen(
    callback: {
      (event: NfEvent['detail']): void;
    },
    aborter = new AbortController(),
  ): AbortController {
    this.addEventListener(
      'changed' satisfies NodeFlowEventListenerType,
      (event) => callback((event as NfEvent).detail),
      { signal: aborter.signal },
    );
    return aborter;
  }

  public dispatching = true;

  public dispatch(
    method: string,
    arguments_: unknown,
    instance: Port<any, any> | Flow<any> | Node<any>,
  ): void {
    if (!this.dispatching) return;
    try {
      const detail: NfEventDetail = {
        id: instance.id,
        type: instance.superType,
        method,
        instance,
        args: [...((arguments_ as []) || [])],
      } as NfEventDetail;

      this.dispatchEvent(new NfEvent('changed', { detail }));
    } catch (error) {
      console.error(error);
    }
  }
}

export function serializeEvent(detail: NfEvent['detail']): {
  type: 'Node' | 'Port' | 'Flow' | 'unknown';
  id: string;
  method: unknown;
  args: unknown;
} {
  return {
    type: detail.type,
    id: detail.id,
    method: detail.method,
    args: detail.args,
  };
}

export function loadSerializedEvent(
  flow: Pick<Flow, 'dispatching' | 'ports' | 'nodes'>,
  data: NfEventDetail,
  options?: {
    pick: {
      Node?: (keyof Node)[];
      Flow?: (keyof Flow)[];
      Port?: (keyof Port)[];
    };
  },
): void {
  if (!options?.pick?.[data.type]?.includes(data.method as any)) return;

  switch (data.type) {
    case 'Node': {
      const node = flow.nodes.find((node) => node.id === data.id);
      if (!node) return;

      console.log({ data });
      flow.dispatching = false;
      // @ts-expect-error catch-all
      node[data.method](...(data.args || []));
      flow.dispatching = true;
      break;
    }
    case 'Port': {
      const port = flow.ports.find((port) => port.id === data.id);
      if (!port) return;

      flow.dispatching = false;
      // @ts-expect-error catch-all
      port[data.method](...(data.args || []));
      flow.dispatching = true;
      break;
    }
    case 'Flow': {
      flow.dispatching = false;
      // @ts-expect-error catch-all
      flow[data.method](...(data.args || []));
      flow.dispatching = true;
      break;
    }
  }
}

// export function dispatch(
//   value: (..._arguments: any) => any,
//   context: ClassMethodDecoratorContext,
// ) {
//   if (context.kind === 'method') {
//     return function (this: Node | Port | Flow, ..._arguments: any): any {
//       const returnValue = value.call(this, ..._arguments);

//       ('flow' in this ? this.flow : this).dispatch(
//         context.name.toString(),
//         _arguments || [],
//         this,
//       );

//       return returnValue;
//     };
//   }
// }
