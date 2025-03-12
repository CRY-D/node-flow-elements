'use html-signal';
import { css, LitElement } from 'lit';
import { SignalWatcher } from '@lit-labs/signals';

import { reaction } from 'signal-utils/subtle/reaction';
import { PORT, type GenericPort } from './types.js';

export class NfPortElement extends SignalWatcher(LitElement) {
  public readonly [PORT] = true;

  static override styles = css`
    :host {
      display: inline-block;
      user-select: none;
      cursor: var(--cursor-connecting, crosshair);
    }
  `;

  static override properties = {
    port: { attribute: false },
    // TODO: CSS API.
    cableOffset: { type: Number },
  };
  declare public port?: GenericPort;
  declare public cableOffset?: number;

  public override firstUpdated(): void {
    if (!this.port) throw new ReferenceError('No port.');

    // this.#updatePosition();
    reaction(
      () => [
        this.port?.node.x,
        this.port?.node.y,
        this.port?.node.width,
        this.port?.node.height,
        // this.port?.flow.viewportRect.x,
        // this.port?.flow.viewportRect.y,
      ],
      () => this.#updatePosition(),
    );
  }

  #updatePosition(): void {
    if (!this.port) return;

    this.port.updatePositionFromDom({
      rect: this.getBoundingClientRect(),
      scroll: { x: window.scrollX, y: window.scrollY },
      cableOffset: this.cableOffset,
    });
  }

  public override render(): JSX.LitTemplate {
    return <slot />;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nf-port': NfPortElement;
  }
}
customElements.define('nf-port', NfPortElement);
