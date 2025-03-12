import { signal } from '@lit-labs/signals';
import { reaction } from 'signal-utils/subtle/reaction';

import { Node } from '../../../node.js';
import type {
  NodeConstructorParameters,
  NodeSerializableOptions,
} from '../../../types.js';

import {
  type NumberPort,
  numberPortValidator,
  type PortsWithSchema,
} from './schemas.js';
import * as schemas from './schemas.js';

type Operation = (typeof NfWaOperationNode)['operations'][number];

export class NfWaOperationNode extends Node<PortsWithSchema> {
  public override readonly type = 'NfWaOperationNode';

  public override readonly defaultDisplayName = 'Operation';
  public override readonly defaultIcon = 'calculator';

  foo = 'foo';

  public override readonly ports = {
    numberA: this.addPort<NumberPort>({
      direction: 'in',
      customDisplayName: 'Operand A',
      validate: numberPortValidator,
      metadata: { schema: schemas.numberPortSchema },
    }),
    numberB: this.addPort<NumberPort>({
      direction: 'in',
      customDisplayName: 'Operand B',
      validate: numberPortValidator,
      metadata: { schema: schemas.numberPortSchema },
    }),

    result: this.addPort<NumberPort>({
      direction: 'out',
      customDisplayName: 'Result',
      value: 0,
    }),
  };

  public static readonly operations = [
    'Sum',
    'Divide',
    'Minus',
    'Multiply',
  ] as const;

  public accessor $currentOperation = signal<Operation>('Sum');
  public changeOperation(operation: Operation): void {
    this.$currentOperation.set(operation);
  }

  constructor(options: NodeConstructorParameters) {
    super(options);

    reaction(
      () => [
        this.ports.numberA.value,
        this.ports.numberB.value,
        this.$currentOperation.get(),
      ],
      () => this.updateResult(),
    );
  }

  public updateResult(): void {
    let result = Number.NaN;

    const b = this.ports.numberB.value || 0;
    const a = this.ports.numberA.value || 0;

    switch (this.$currentOperation.get()) {
      case 'Minus': {
        result = a - b;
        break;
      }
      case 'Divide': {
        result = a / b;
        break;
      }
      case 'Multiply': {
        result = a * b;
        break;
      }
      default: {
        result = a + b;
        break;
      }
    }
    this.ports.result.updateValue(result);
  }

  public override readonly Template = (): JSX.LitTemplate => (
    <nf-wa-node slot={this.slotName} prop:node={this}>
      <div style="display:flex; justify-content: center">
        {/* @ts-expect-error TODO: generate typings for JSFE. */}
        <jsf-shoelace
          prop:submitButton={false}
          prop:schema={{
            properties: {
              operation: {
                title: 'Calculation type',
                type: 'string',
                enum: NfWaOperationNode.operations,
              },
            },
          }}
          prop:data={{
            operation: this.$currentOperation.get(),
          }}
          prop:uiSchema={{ operation: { 'ui:widget': 'button' } }}
          prop:dataChangeCallback={(data: { operation: Operation }) => {
            this.changeOperation(data.operation);
          }}
        />
      </div>
    </nf-wa-node>
  );

  public override fromJSON(
    options: NodeSerializableOptions<this, { initialOperation: Operation }>,
  ): void {
    super.fromJSON(options);

    const operation = options.initialOperation;

    queueMicrotask(() => this.changeOperation(operation));
  }

  // TODO:
  // public override toJSON(): SerializableOptions<Pick<this, 'foo'>> {
  //   const { foo } = this;
  //   return { ...super.toJSON(), foo };
  // }
}
