import { SlTextarea } from '@shoelace-style/shoelace';
import { css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef } from 'lit/directives/ref.js';
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js';
import { SignalWatcher } from '@lit-labs/signals';

import { Node } from '../../../node.js';

import type { PortsWithSchema } from './schemas.js';

export class NfWaNoteNode extends Node<PortsWithSchema> {
  public override readonly type = 'NfWaNoteNode';

  public override readonly defaultDisplayName = 'Sticky note';
  public override readonly defaultIcon = 'sticky';

  public override readonly ports = {
    text: this.addPort<string>({
      direction: 'in',
      metadata: { hidden: true },
    }),
  };

  // NOTE: beware those custom settings are not persisted
  // @signal accessor textContent = '';

  // public updateTextContent(text: string): void {
  //   this.textContent = text;
  // }

  public override readonly Template = (): JSX.LitTemplate => (
    <nf-wa-node slot={this.slotName} prop:node={this}>
      <nf-wa-note
        // prop:updateContent={this.updateTextContent}
        prop:textContent={this.ports.text.value ?? 'Empty…'}
      />
    </nf-wa-node>
  );
}

@customElement('nf-wa-note')
export class NfWaNoteElement extends SignalWatcher(LitElement) {
  static styles = [
    css`
      :host {
        display: contents;
      }

      .wrapper {
        padding: var(--sl-spacing-x-small);
      }
    `,
  ];

  #textAreaRef = createRef<SlTextarea>();

  // TODO: Sync (save)
  // TODO: extract to node body initial value with schema (everywhere)
  @property({ attribute: false }) accessor textContent: string = '';

  public override render(): JSX.LitTemplate {
    return (
      <div class="wrapper">
        <sl-textarea
          ref={this.#textAreaRef}
          // @ts-expect-error Incorrect SL typings.
          resize="both"
          value={this.textContent}
        />
      </div>
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nf-wa-note': NfWaNoteElement;
  }
}
