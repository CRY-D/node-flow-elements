import { Node } from '../../../node.js';

import {
  textPortSchema,
  type PortsWithSchema,
  type TextPort,
} from './schemas.js';

export class NfWaTextNode extends Node<PortsWithSchema> {
  public override readonly type = 'NfWaTextNode';

  public override readonly defaultDisplayName = 'Text Input';
  public override readonly defaultIcon = 'input-cursor';

  public override readonly ports = {
    textOutput: this.addPort<TextPort>({
      direction: 'out',
      customDisplayName: 'Text',
      metadata: { schema: textPortSchema },
    }),
  };

  public override readonly Template = (): JSX.LitTemplate => (
    <nf-wa-node slot={this.slotName} prop:node={this}>
      <div>
        {/* @ts-expect-error TODO: generate typings for JSFE. */}
        <jsf-shoelace
          prop:schema={{ properties: { textInput: textPortSchema } }}
          prop:dataChangeCallback={(data: { textInput: TextPort }) =>
            this.ports.textOutput.updateValue(data.textInput)
          }
          prop:submitButton={false}
        />
      </div>
    </nf-wa-node>
  );
}
