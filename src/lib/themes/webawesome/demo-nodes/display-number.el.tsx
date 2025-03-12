import { Node } from '../../../node.js';

import { numberPortSchema, type PortsWithSchema } from './schemas.js';

export class NfWaDisplayNumberNode extends Node<PortsWithSchema> {
  public override readonly type = 'NfWaDisplayNumberNode';

  public override readonly defaultDisplayName = 'Display';
  public override readonly defaultIcon = 'clipboard-pulse';

  public override readonly ports = {
    number: this.addPort<unknown>({
      direction: 'in',
      customDisplayName: 'Number',
      metadata: { schema: numberPortSchema },
    }),
  };

  public override readonly Template = (): JSX.LitTemplate => (
    <nf-wa-node slot={this.slotName} prop:node={this}>
      <sl-card style="width: 100%">
        {/* <div slot="header">Result</div> */}
        <div
          style={{
            'text-align': 'right',
            'font-size': '1.25em',
            'user-select': 'text',
          }}
        >
          {typeof this.ports.number?.value === 'number' ? (
            Math.round(Number(this.ports.number.value) * 100_000) / 100_000
          ) : (
            <em>Empty</em>
          )}
        </div>
      </sl-card>
    </nf-wa-node>
  );
}
