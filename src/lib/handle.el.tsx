'use html-signal';
import { css, LitElement } from 'lit';
import { SignalWatcher } from '@lit-labs/signals';
import { HANDLE } from './types.js';

export class NfHandleElement extends SignalWatcher(LitElement) {
  public readonly [HANDLE] = true;

  static styles = css`
    :host {
      display: contents;
      cursor: var(--cursor-move, move);
    }
  `;

  public override render(): JSX.LitTemplate {
    return <slot></slot>;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nf-handle': NfHandleElement;
  }
}
customElements.define('nf-handle', NfHandleElement);
