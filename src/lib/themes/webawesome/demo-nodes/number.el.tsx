import { Node } from '../../../node.js';

import * as schemas from './schemas.js';

export class NfWaNumberNode extends Node<schemas.PortsWithSchema> {
  public override readonly type = 'NfWaNumberNode';
  public override readonly defaultDisplayName = 'Number Input';
  public override readonly defaultIcon = 'input-cursor';

  public override readonly ports = {
    number: this.addPort<number>({
      direction: 'out',
      customDisplayName: 'Number',
      validate: schemas.numberPortValidator,
      // FIXME:
      // value: 3,
      metadata: { schema: schemas.numberPortSchema },
    }),
  };

  public override readonly Template = (): JSX.LitTemplate => (
    <nf-wa-node slot={this.slotName} prop:node={this}>
      {/* @ts-expect-error TODO: generate typings for JSFE. */}
      <jsf-shoelace
        prop:schema={{
          properties: {
            number: {
              ...schemas.numberPortSchema,
              default: this.ports.number.value,
            },
          },
        }}
        prop:dataChangeCallback={(data: { number: schemas.NumberPort }) => {
          this.ports.number?.updateValue(data.number);
        }}
        prop:submitButton={false}
      />
    </nf-wa-node>
  );
}
