'use html-signal';
import { LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { SignalWatcher } from '@lit-labs/signals';

import type { Port } from '../../port.js';

import styles from './port.scss?inline';

@customElement('nf-wa-port')
export class NfWaPortElement extends SignalWatcher(LitElement) {
  static styles = unsafeCSS(styles);

  @property({ attribute: false }) accessor port!: Port;

  public override render(): JSX.LitTemplate {
    const portType =
      this.port.customValueType ??
      `${(typeof this.port.value)
        .charAt(0)
        .toUpperCase()}${(typeof this.port.value).slice(1)}`;

    const portIcon = this.port.customValueType ? 'box' : 'check-lg';

    return (
      <nf-port
        prop:port={this.port}
        class:list={[
          'wrapper',
          this.port.isPulsing && 'is-pulsing',
          this.port.connectedTo.length > 0 && 'is-connected',
        ]}
      >
        <sl-tooltip placement={this.port.direction === 'in' ? 'right' : 'left'}>
          <div slot="content" class="port-type-tooltip-content">
            {portType}
            <sl-icon name={portIcon} />
          </div>

          <div
            class:list={[
              'port',
              this.port.direction === 'in' ? 'inlet' : 'outlet',
            ]}
          >
            <sl-icon name="caret-right-fill" />
          </div>
        </sl-tooltip>
      </nf-port>
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nf-wa-port': NfWaPortElement;
  }
}
