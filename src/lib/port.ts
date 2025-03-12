/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { reaction } from 'signal-utils/subtle/reaction';
import { signal } from '@lit-labs/signals';

import { Node } from './node.js';
import { Flow } from './flow.js';
import type { AddPortOptions, PortDirection, Validate } from './types.js';

export class Port<Value = any, PortMetadata = any> {
  public readonly flow: Flow;

  public readonly node: Node<PortMetadata>;
  public readonly superType = 'Port';

  public get name(): string {
    for (const [name, port] of Object.entries(this.node.ports))
      if (port === this) return name;
    throw new ReferenceError('Incorrect port mapping.');
  }
  public get id(): string {
    for (const [name, port] of Object.entries(this.node.ports))
      if (port === this) return `port_${name}__${port.node.id}`;
    throw new ReferenceError('Incorrect port mapping.');
  }

  public readonly $direction = signal<PortDirection>('both');
  public get direction(): PortDirection {
    return this.$direction.get();
  }

  public readonly validate: Validate | null = null;

  public readonly $metadata = signal<PortMetadata>({} as PortMetadata);
  public get metadata(): PortMetadata {
    return this.$metadata.get();
  }

  constructor(
    options: AddPortOptions<Value, PortMetadata>,
    node: Node<PortMetadata>,
  ) {
    this.node = node;
    this.flow = node.flow;

    this.fromJSON(options);

    if (options.validate) this.validate = options.validate;
  }

  public readonly $connectedTo = signal<Port[]>([]);
  public get connectedTo(): Port[] {
    return this.$connectedTo.get();
  }

  declare public readonly customValueType?: string;

  public readonly $value = signal<Value | null>(null);
  public get value(): Value | null {
    return this.$value.get();
  }
  public updateValue(value: this['value']): void {
    this.$value.set(value);

    for (const port of this.connectedTo)
      if (port.direction === 'in') port.updateValue(value);

    this.bang();
    this.flow.dispatch(this.updateValue.name, null, this);
  }

  public setValidity(state: boolean): void {
    this.$validity.set(state);
    setTimeout(() => this.setValidity(state));
  }

  public connectTo(id: string): void {
    const foundPort = this.flow.ports.find((p) => p.id === id);

    if (!foundPort) return;

    if (
      foundPort.node !== this.node &&
      foundPort.direction !== this.direction
    ) {
      if (foundPort.validate) {
        const isValid = foundPort.validate(this.value);

        if (!isValid) {
          this.setValidity(false);
          return;
        }
      }

      foundPort.$connectedTo.set([...foundPort.connectedTo, this]);
      this.$connectedTo.set([...this.connectedTo, foundPort]);

      if (foundPort.direction === 'in') foundPort.updateValue(this.value);

      this.flow.updateMousePosition({ x: null, y: null });
    }
    this.flow.dispatch(this.connectTo.name, arguments, this);
  }

  public disconnect(id: string): void {
    const connectedPort = this.flow.ports.find((p) => p.id === id);
    if (!connectedPort) return;

    this.$connectedTo.set(
      this.connectedTo.filter((port) => port !== connectedPort),
    );
    connectedPort.$connectedTo.set(
      connectedPort.connectedTo.filter((port) => port !== this),
    );
    this.setIsDisconnecting(false);
    this.flow.dispatch(this.disconnect.name, arguments, this);
  }

  public disconnectAll(): void {
    for (const port of this.connectedTo)
      port.$connectedTo.set(port.connectedTo.filter((port) => port !== this));

    this.$connectedTo.set([]);
    this.flow.dispatch(this.disconnectAll.name, null, this);
  }

  public readonly $isDisconnecting = signal(false);
  public get isDisconnecting(): boolean {
    return this.$isDisconnecting.get();
  }
  public setIsDisconnecting(value: boolean): void {
    this.$isDisconnecting.set(value);
  }

  public readonly $customDisplayName = signal<string | null>(null);
  public get customDisplayName(): string | null {
    return this.$customDisplayName.get();
  }

  public get displayName(): string {
    return this.customDisplayName ?? this.name;
  }

  public updateDisplayName(customName: string): void {
    this.$customDisplayName.set(customName);
    this.flow.dispatch(this.updateDisplayName.name, arguments, this);
  }

  public readonly $validity = signal(true);
  public get validity(): boolean {
    return this.$validity.get();
  }

  public setIsPulsing(state: boolean): void {
    this.$isPulsing.set(state);
  }

  public readonly $lastChangeTime = signal(0);
  public get lastChangeTime(): number {
    return this.$lastChangeTime.get();
  }

  public bang(): void {
    this.setIsPulsing(true);
    setTimeout(() => this.setIsPulsing(false), 50);
    this.$lastChangeTime.set(Date.now());
    this.flow.dispatch(this.bang.name, null, this);
  }

  public readonly $isPulsing = signal(false);
  public get isPulsing(): boolean {
    return this.$isPulsing.get();
  }

  public readonly $x = signal(0);
  public get x(): number {
    return this.$x.get();
  }
  public readonly $y = signal(0);
  public get y(): number {
    return this.$y.get();
  }

  public updatePositionFromDom({
    rect,
    scroll,
    cableOffset = 4,
  }: {
    rect: DOMRect;
    scroll: { x: number; y: number };
    cableOffset?: number;
  }): void {
    const { scale, offsetX, offsetY, viewportRect } = this.flow;

    // NOTE: So the cable is sticking out
    const adjustment = cableOffset * (this.direction === 'in' ? -1 : 1);

    this.$x.set(
      (rect.x +
        scroll.x -
        offsetX -
        viewportRect.x +
        rect.width / 2 +
        adjustment) /
        scale,
    );
    this.$y.set(
      (rect.y +
        //
        scroll.y -
        offsetY -
        viewportRect.y +
        rect.height / 2) /
        scale,
    );
  }

  public fromJSON(options: AddPortOptions<Value, PortMetadata>): void {
    if (options.value) this.$value.set(options.value);
    if (options.direction) this.$direction.set(options.direction);
    if (options.metadata) this.$metadata.set(options.metadata);
    if (options.customDisplayName)
      this.$customDisplayName.set(options.customDisplayName);
  }

  // FIXME:
  public toJSON() /* : PortSerializationOptions<PortMetadata> */ {
    const { x, y, value, connectedTo: _connectedTo } = this;

    const connectedTo = _connectedTo.map((connectedPort) => {
      let portName;
      for (const [nodePortName, nodePort] of Object.entries(
        connectedPort.node.ports,
      ))
        if (connectedPort === nodePort) portName = nodePortName;

      if (!portName) throw new ReferenceError('Incorrect port.');

      return { node: connectedPort.node.id, port: portName };
    });

    return { x, y, value, connectedTo };
  }
}
