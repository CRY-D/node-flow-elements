'use html-signal';
import { LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { SignalWatcher } from '@lit-labs/signals';

import { Flow } from '../../../flow.js';
import type { NfFlowElement as Nfe } from '../../../flow.el.jsx';

import styles from './center.scss?inline';
import type { GenericFlow } from '../../../types.js';

@customElement('nf-wa-center')
export class NfWaCenterElement extends SignalWatcher(LitElement) {
  static styles = unsafeCSS(styles);

  declare slot: (typeof Nfe)['SLOT']['bgInteractive'];

  @consume({ context: Flow.CONTEXT, subscribe: true })
  @property({ attribute: false })
  accessor flow!: GenericFlow;

  public override render(): JSX.LitTemplate {
    return (
      <div
        class="center"
        style:map={{
          '--x': `${this.flow.viewportRect.width / 2}px`,
          '--y': `${this.flow.viewportRect.height / 2}px`,
        }}
      >
        <sl-icon name="crosshair"></sl-icon>
      </div>
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nf-wa-center': NfWaCenterElement;
  }
}
