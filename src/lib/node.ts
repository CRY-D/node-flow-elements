/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable prefer-rest-params */
import { computed, signal } from '@lit-labs/signals';

import type {
  AddPortOptions,
  AnyNodePorts,
  Coordinates,
  DefaultNodePorts,
  NodeConstructorParameters,
  NodeSerializableOptions,
} from './types.js';
import { Port } from './port.js';

export class Node<PortMetadata = any> {
  public readonly flow;
  public readonly superType = 'Node';

  public readonly type: string = 'Node';
  public id: string;

  public readonly defaultDisplayName: string = 'Node';
  public readonly defaultIcon: string = 'activity';
  public readonly helpText: string | null = null;

  public readonly Template: (() => unknown) | null = null;

  declare readonly ports: AnyNodePorts<PortMetadata> | DefaultNodePorts;

  constructor(options: NodeConstructorParameters<Node>) {
    this.flow = options.flow;

    this.id = options.data?.id || `node_${crypto.randomUUID()}`;

    if (options.data) this.fromJSON(options.data);

    setTimeout(() => {
      console.log({ ddd: Node.prototype.defaultDisplayName });
    }, 10);

    this.ports = {
      input: this.addPort({ direction: 'in' }),
      output: this.addPort({ direction: 'out' }),
    };
  }

  public get slotName(): string {
    return `node_${this.id}`;
  }

  public readonly $customDisplayName = signal<string | null>(null);
  public get customDisplayName(): string | null {
    return this.$customDisplayName.get();
  }
  public updateDisplayName(customName: string): void {
    this.$customDisplayName.set(customName);
    this.flow.dispatch(this.updateDisplayName.name, arguments, this);
  }
  public get displayName(): string {
    return this.customDisplayName ?? this.defaultDisplayName;
  }

  public readonly $isSelected = computed(() => this.flow.selectedNode === this);
  public get isSelected(): boolean {
    return this.$isSelected.get();
  }

  public readonly $zIndex = signal<number | null>(null);
  public get zIndex(): number | null {
    return this.$zIndex.get();
  }
  public updateZIndex(value: number): void {
    this.$zIndex.set(value);
    this.flow.dispatch(this.updateZIndex.name, arguments, this);
  }

  public readonly $isDragging = signal(false);
  public get isDragging(): boolean {
    return this.$isDragging.get();
  }
  public setIsDragging(state: boolean): void {
    this.$isDragging.set(state);
    this.flow.dispatch(this.setIsDragging.name, arguments, this);
  }

  public readonly $isHovering = signal(false);
  public get isHovering(): boolean {
    return this.$isHovering.get();
  }
  public setIsHovering(state: boolean): void {
    this.$isHovering.set(state);
    this.flow.dispatch(this.setIsHovering.name, arguments, this);
  }

  public readonly $x = signal(0);
  public get x(): number {
    return this.$x.get();
  }
  public readonly $y = signal(0);
  public get y(): number {
    return this.$y.get();
  }

  public readonly $width = signal(0);
  public get width(): number {
    return this.$width.get();
  }
  public readonly $height = signal(0);
  public get height(): number {
    return this.$height.get();
  }

  // realX = 0;
  // realY = 0;

  public updatePosition(options: Coordinates): void {
    // const gridSize = 16;

    // TODO:
    // const roundNearest = (coord, gridSize) => {
    //   return Math.round(coord / gridSize) * gridSize;
    // };
    // const roundNearest = (xx, nearest) => {
    //   return xx % gridSize ? xx - (xx % gridSize) + gridSize : xx;
    // };
    // if (this.realX % gridSize === 0) this.x = x;
    // if (this.realY % gridSize === 0) this.y = y;

    // this.realX = x;
    // this.realY = y;

    // this.x = roundNearest(x, gridSize);
    // this.y = roundNearest(y, gridSize);

    if (options.x) this.$x.set(options.x);
    if (options.y) this.$y.set(options.y);

    this.flow.dispatch(this.updatePosition.name, arguments, this);
  }

  public updateSizeFromDom({ width, height }: DOMRect): void {
    this.$width.set(width / this.flow.scale);
    this.$height.set(height / this.flow.scale);
  }

  public delete(): void {
    for (const port of Object.values(this.ports as AnyNodePorts))
      for (const extensionPort of port.connectedTo)
        for (const candidatePort of extensionPort.connectedTo)
          extensionPort.$connectedTo.set(
            extensionPort.connectedTo.filter((port) => port !== candidatePort),
          );

    // TODO: cleanup connections
    this.flow.$nodes.set(this.flow.nodes.filter((node) => node !== this));
    this.flow.dispatch(this.delete.name, arguments, this);
  }

  public addPort<Type = any>(
    options: AddPortOptions<Type, PortMetadata>,
  ): Port<Type, PortMetadata> {
    const createdPort = new Port<Type, PortMetadata>(options, this);

    return createdPort;
  }

  public fromJSON(options: NodeSerializableOptions<Node>): void {
    this.id = options.id;
    this.$x.set(options.x);
    this.$y.set(options.y);
    if (options.zIndex) this.$zIndex.set(options.zIndex);
    if (options.customDisplayName)
      this.$customDisplayName.set(options.customDisplayName);
  }

  public toJSON(): NodeSerializableOptions<Node> {
    const { type, id: id, x, y, displayName, zIndex, ports: _ports } = this;

    const ports = Object.fromEntries(
      Object.entries(_ports).map(([name, port]) => [name, port.toJSON()]),
    );

    return { type, id: id, x, y, displayName, zIndex, ports };
  }
}
