/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from '@lit/context';
import type { PanZoom } from 'panzoom';
import { computed, signal } from '@lit-labs/signals';
// import { Ref } from 'lit/directives/ref.js';

import { Node } from './node.js';
import type {
  ConnectingLink,
  Coordinates,
  FlowConstructorParameters,
  GenericFlow,
  Link,
  MenuItem,
  NodeList,
  NodeType,
} from './types.js';
import type { Port } from './port.js';
import { NodeFlowEventTarget } from './events.js';

export class Flow<
  _NodeList extends NodeList = NodeList,
  TypedNode extends InstanceType<_NodeList[keyof _NodeList]> = InstanceType<
    _NodeList[keyof _NodeList]
  >,
> extends NodeFlowEventTarget {
  public nodeTypes: _NodeList;

  readonly superType = 'Flow';
  readonly id;

  public constructor(
    options?: FlowConstructorParameters<_NodeList, NodeType<_NodeList>[]>,
  ) {
    super();
    this.nodeTypes = options?.nodeTypes || ({} as _NodeList);

    if (options?.initialNodes)
      this.fromJSON({ nodeInfos: options.initialNodes });
    if (options?.menu) this.registerMenu(options.menu);

    this.id = options?.id ?? crypto.randomUUID();

    // this.ready2();
  }

  // private ready2(): void {
  //   this.dispatch(this.ready2.name, arguments, this);
  // }

  public fromJSON(options: { nodeInfos: NodeType<_NodeList>[] }): void {
    for (const nodeInfo of options.nodeInfos) this.addNode(nodeInfo);

    for (const nodeInfo of options.nodeInfos)
      for (const portKey in nodeInfo.ports) {
        const port = nodeInfo.ports[portKey as keyof typeof nodeInfo.ports];
        if (!port) continue;

        const nodeSource = this.nodes.find((n) => n.id === nodeInfo.id);
        const portSource =
          nodeSource?.ports[portKey as keyof typeof nodeSource.ports];

        if (portSource && nodeSource && 'value' in port)
          portSource.updateValue(port.value);

        if (!port.connectedTo) continue;
        for (const target of port.connectedTo) {
          const nodeTarget = this.nodes.find((n) => n.id === target.node);

          if (nodeTarget && nodeSource) {
            const portTarget =
              nodeTarget.ports[target.port as keyof typeof nodeTarget.ports];
            if (!portSource || !portTarget) continue;

            portSource.connectTo(portTarget.id);
          }
        }
      }
  }

  // MARK: Canvas

  public readonly $offsetX = signal(0);
  public get offsetX(): number {
    return this.$offsetX.get();
  }
  public readonly $offsetY = signal(0);
  public get offsetY(): number {
    return this.$offsetY.get();
  }

  public updateOffset(x: number, y: number): void {
    this.$offsetX.set(x);
    this.$offsetY.set(y);

    this.dispatch(this.updateOffset.name, arguments, this);
  }

  public readonly $scale = signal(1);
  public get scale(): number {
    return this.$scale.get();
  }

  // public readonly $1 = signal($2)
  // public $1 get() {
  //   return this.$1.get();
  // };

  public updateScale(factor: this['scale']): void {
    this.$scale.set(factor);
    this.dispatch(this.updateScale.name, arguments, this);
  }

  public readonly $isDraggingCanvas = signal(false);
  public get isDraggingCanvas(): boolean {
    return this.$isDraggingCanvas.get();
  }

  public setIsDraggingCanvas(state: this['isDraggingCanvas']): void {
    this.$isDraggingCanvas.set(state);
  }

  public readonly $isZoomingCanvas = signal(false);
  public get isZoomingCanvas(): boolean {
    return this.$isZoomingCanvas.get();
  }

  public setIsZoomingCanvas(state: this['isZoomingCanvas']): void {
    this.$isZoomingCanvas.set(state);
  }

  public get isDraggingNode(): boolean {
    return this.nodes.some((node) => node.isDragging);
  }

  public resetOffset(smooth?: boolean): void {
    const x = 0;
    const y = 0;

    this.updateOffset(x, y);

    if (smooth) this.panzoom?.smoothMoveTo(x, y);
    else this.panzoom?.moveTo(x, y);
  }

  public resetScale(smooth?: boolean): void {
    const x = this.viewportRect.x / 2;
    const y = this.viewportRect.y / 2;

    this.updateScale(1);

    if (smooth) this.panzoom?.smoothZoomAbs(x, y, 1);
    else this.panzoom?.zoomAbs(x, y, 1);
  }

  public resetViewport(smooth: boolean): void {
    this.resetOffset(smooth);
    this.resetScale(smooth);
    // HACK: Doing it twice…
    this.resetOffset(smooth);
    this.resetScale(smooth);
  }

  // IDEA:
  // public showRectangle(rect: DOMRect): void {
  //   this.panzoom?.showRectangle({ x: 100, y: 1100 });
  // }

  public readonly $viewportRect = signal({ width: 0, height: 0, x: 0, y: 0 });
  public get viewportRect() {
    return this.$viewportRect.get();
  }
  public updateViewportRect({
    rect,
    scroll,
  }: {
    rect: Flow['viewportRect'];
    scroll: Coordinates;
  }): void {
    this.$viewportRect.set({
      width: rect.width,
      height: rect.height,
      x: rect.x + scroll.x,
      y: rect.y + scroll.y,
    });

    this.dispatch(this.updateViewportRect.name, arguments, this);
  }

  public get isCanvasCentered(): boolean {
    return (
      this.scale === 1 &&
      this.offsetX === this.viewportRect.width / 2 &&
      this.offsetY === this.viewportRect.height / 2
    );
  }

  public readonly $mouseX = signal<this['mouseX']>(0);
  public get mouseX(): number | null {
    return this.$mouseX.get();
  }
  public readonly $mouseY = signal<this['mouseY']>(0);
  public get mouseY(): number | null {
    return this.$mouseY.get();
  }
  public updateMousePosition(coords: {
    x: Flow['mouseX'];
    y: Flow['mouseY'];
  }): void {
    this.$mouseX.set(coords.x);
    this.$mouseY.set(coords.y);
  }

  public get mouseXScaled(): number | null {
    if (!this.mouseX) return null;
    return this.mouseX - this.offsetX / this.scale;
  }
  public get mouseYScaled(): number | null {
    if (!this.mouseY) return null;
    return this.mouseY - this.offsetY / this.scale;
  }

  // MARK: Node

  public readonly $nodes = signal<TypedNode[]>([]);
  public get nodes() {
    return this.$nodes.get();
  }

  public addNode<
    AddedType extends keyof _NodeList = keyof _NodeList,
    AddedNode extends _NodeList[AddedType] = _NodeList[AddedType],
  >(
    node: { type?: AddedType | 'Node' } & NodeType<_NodeList>,
  ): InstanceType<AddedNode> {
    const CustomNode =
      node.type === 'Node' || node.type === undefined
        ? Node
        : this.nodeTypes[node.type];

    if (!CustomNode)
      throw new ReferenceError(`Missing custom node "${node.type}".`);

    const createdNode = new CustomNode({
      flow: this as Flow<any>,
      data: { ...node, zIndex: this.nodes.length },
    });

    this.selectNode(createdNode);

    this.$nodes.set([...this.nodes, createdNode] as TypedNode[]);

    this.dispatch(this.addNode.name, arguments, this);

    return createdNode as InstanceType<AddedNode>;
  }

  public readonly $selectedNode = signal<Node | null>(null);
  public get selectedNode(): Node | null {
    return this.$selectedNode.get();
  }

  public selectNode(node: Node): void {
    if (this.selectedNode === node) return;
    node.updateZIndex(
      this.selectedNode?.zIndex
        ? this.selectedNode.zIndex + 1
        : this.nodes.length,
    );

    this.$selectedNode.set(node);
  }

  public clearNodes(): void {
    this.$nodes.set([]);
    this.dispatch(this.clearNodes.name, arguments, this);
  }

  // MARK: Links

  public readonly $links = computed<Link[]>(() => {
    const links: Link[] = [];

    for (const node of this.$nodes.get())
      for (const outlet of Object.values(node.ports).filter(
        (port) => port.direction === 'out',
      ))
        for (const inlet of outlet.$connectedTo.get())
          links.push({ from: outlet, to: inlet });

    return links;
  });
  public get links(): Link[] {
    return this.$links.get();
  }

  public readonly $ports = computed<Port[]>(() => {
    const ports: Port[] = [];

    for (const node of this.nodes)
      for (const port of Object.values(node.ports)) ports.push(port);

    return ports;
  });
  public get ports(): Port[] {
    return this.$ports.get();
  }

  public panzoom?: PanZoom;
  // public panzoomWrapperRef?: Ref<HTMLDivElement>;

  public zoom(direction: 'in' | 'out'): void {
    if (!this.panzoom) return;

    this.panzoom?.smoothZoom(
      this.viewportRect.width / 2,
      this.viewportRect.height / 2,
      direction === 'in' ? 1.3 : 0.7,
    );
    this.dispatch(this.zoom.name, arguments, this);
  }

  public readonly $connectingLink = signal<ConnectingLink | null>(null);
  public get connectingLink(): ConnectingLink | null {
    return this.$connectingLink.get();
  }
  public setConnectingLink(
    from: Port | null = null,
    to: Port | null = null,
  ): void {
    console.log({ from: from });
    this.$connectingLink.set(from ? { from, to } : null);
  }

  public makeLinkSvgPath(link: ConnectingLink): string {
    const ws = this.viewportRect;
    const to = link.to || {
      x: this.mouseXScaled ?? link.from.x,
      y: this.mouseYScaled ?? link.from.y,
    };

    const controlPoint =
      Math.max(15, Math.min(Math.abs(to.x - link.from.x) / 1.5, 500)) *
      // FIXME:
      (link.from.direction === 'in' ? -1 : 1);

    const dPath =
      `M ${link.from.x - ws.x} ` +
      `${link.from.y - ws.y} ` +
      //
      `C ${link.from.x + controlPoint - ws.x} ` +
      `${link.from.y - ws.y}, ` +
      //
      `${to.x - controlPoint - ws.x} ` +
      `${to.y - ws.y} ${to.x - ws.x} ` +
      `${to.y - ws.y}`;

    return dPath;
  }

  // MARK: Context menu

  public $isContextMenuVisible = signal(false);
  public get isContextMenuVisible(): boolean {
    return this.$isContextMenuVisible.get();
  }
  public setIsContextMenuVisible(state: this['isContextMenuVisible']): void {
    this.$isContextMenuVisible.set(state);
    this.dispatch(this.setIsContextMenuVisible.name, arguments, this);
  }

  public $contextMenuPosition = signal({ x: 0, y: 0 });
  public get contextMenuPosition(): { x: number; y: number } {
    return this.$contextMenuPosition.get();
  }
  public setContextMenuPosition(state: this['contextMenuPosition']): void {
    this.$contextMenuPosition.set(state);
  }

  // MARK: Menu

  public readonly $menuItems = signal<MenuItem[]>([]);
  public get menuItems(): MenuItem[] {
    return this.$menuItems.get();
  }
  public registerMenu(items: this['menuItems']): void {
    this.$menuItems.set(items);
  }

  public static readonly CONTEXT = createContext<GenericFlow>(
    Symbol('NFE_FLOW'),
  );

  // MARK: Coordinates

  public readonly $isCoordinatesVisible = signal(false);
  public get isCoordinatesVisible(): boolean {
    return this.$isCoordinatesVisible.get();
  }
  public setIsCoordinatesVisible(state: this['isCoordinatesVisible']): void {
    this.$isCoordinatesVisible.set(state);
    this.dispatch(this.setIsCoordinatesVisible.name, arguments, this);
  }

  public toJSON() {
    const { nodes } = this;

    const result = { nodes: nodes.map((node) => node.toJSON()) };
    console.log(result);
    return result;
  }
}
