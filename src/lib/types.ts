/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Flow } from './flow.js';
import { type NfHandleElement } from './handle.el.jsx';
import { type NfNodeElement } from './node.el.jsx';
import { Node } from './node.js';
import { type NfPortElement } from './port.el.jsx';
import type { Port } from './port.js';
// import type { Inlet, Outlet } from './port.js';

export type Link = {
  from: Port;
  to: Port;
};
export type ConnectingLink = {
  from: Port;
  to: Port | null;
};

// type NodeConstructor = { x; y; id?: string };

export type Coordinates = { x: number; y: number };

// export type SerializableResult<Ctor extends Ctor = Ctor> = Partial<
//   ReturnType<Ctor['prototype']['toJSON']>
// >;

export type FlowConstructorParameters<NodeTypes = any, InitialNodes = any> = {
  id?: string;
  nodeTypes?: NodeTypes;
  initialNodes?: InitialNodes;
  menu?: MenuItem[];
};

export type NodeConstructorParameters<_Node extends Node = Node> = {
  flow: Flow;
  data?: NodeSerializableOptions<_Node>;
};

export type PortSerializationOptions<PortMetadata = unknown> = Pick<
  Port,
  'direction'
> &
  Partial<Pick<Port, 'customDisplayName'>> &
  PortMetadata;

export type Validate = (value: unknown) => boolean;
export type AddPortOptions<
  Type = any,
  PortMetadata = any,
> = PortSerializationOptions & {
  validate?: Validate;
  value?: Type;
  metadata?: PortMetadata;
};

export type PortDirection = 'in' | 'out' | 'both';

// export type Port = Inlet | Outlet;

// export type PortConstructionData = Partial<ReturnType<Port['toJSON']>>;

export const PZ_EVENT = {
  panstart: 'panstart',
  pan: 'pan',
  panend: 'panend',
  zoom: 'zoom',
  zoomend: 'zoomend',
  transform: 'transform',
} as const;

export interface Offset {
  x: number;
  y: number;
}

export interface PointerData {
  id: number;
  startPos: Offset;
  currentPos: Offset;
}

export interface MenuItem {
  displayName?: string;
  icon?: string;
  label?: boolean;
  children?: MenuItem[];
  nodeCtor?: typeof Node<any>;
}

export function isNode(element: EventTarget): element is NfNodeElement {
  return NODE in element;
}
export function isHandle(element: EventTarget): element is NfHandleElement {
  return HANDLE in element;
}
export function isPort(element: EventTarget): element is NfPortElement {
  return PORT in element;
}

export type NodeSerializableOptions<
  NodeType extends Node = Node,
  Data extends Record<string, unknown> = Record<string, unknown>,
> = Pick<Node, 'x' | 'y' | 'id'> &
  Partial<Pick<Node, 'zIndex' | 'customDisplayName' | 'type'>> &
  Data & {
    ports?: Partial<{
      [key in keyof NodeType['ports']]: {
        value?: NodeType['ports'][key]['value'];
        connectedTo?: { node: string; port: string }[];
      };
    }>;
  };

export type GenericFlow = Flow<any, any>;

export type GenericNode = Omit<Node<any>, 'type'> & {
  type: string;
};
export type GenericPort = Port<any, any>;

export type NodeList<PortMetadata = any> = Record<
  string,
  typeof Node<PortMetadata>
>;
export type NodeType<
  PortMetadata = any,
  _B extends Record<string, typeof Node<PortMetadata>> = Record<
    string,
    typeof Node<PortMetadata>
  >,
  _Node extends _B[keyof _B] = _B[keyof _B],
> = Parameters<InstanceType<_Node>['fromJSON']>[0] /* & {
  ports: keyof InstanceType<_Node>['ports'];
  // ports: {
  //   [key in keyof InstanceType<_Node>['ports']]: string;
  // };
} */;

// NOTE: EXPERIMENTAL

// type Link<
//   B extends (typeof initialNodes)[number] = (typeof initialNodes)[number],
//   C extends keyof InstanceType<
//     (typeof nodeTypes)[keyof typeof nodeTypes]
//   >['ports'] = keyof InstanceType<
//     (typeof nodeTypes)[keyof typeof nodeTypes]
//   >['ports'],
// > = {
//   id: string;
//   from: {
//     node: B['id'];
//     port: C;
//   };
// };

// const initialLinks: Link[] = [
//   {
//     id: 'test',
//     from: { node: 'hey', port: 'number' },
//     to: { node: 'op', port: 'numberA' },
//   },
//   {
//     id: 'test2',
//     from: { node: 'op', port: 'number' },
//     to: { node: 'op', port: 'numberAb' },
//   },
// ];

export const FLOW_SLOT = {
  background: 'background',
  bgInteractive: 'background-interactive',
  foreground: 'foreground',
  fgInteractive: 'foreground-interactive',
} as const;
export type FlowSlot = (typeof FLOW_SLOT)[keyof typeof FLOW_SLOT];

export const HANDLE = Symbol('HANDLE');

export const NODE = Symbol('NODE');

export const PORT = Symbol('PORT');

export interface DefaultNodePorts {
  input: Port<any, any>;
  output: Port<any, any>;
}

export type AnyNodePorts<PortMetadata = unknown> = Record<
  string,
  Port<any, PortMetadata>
>;
