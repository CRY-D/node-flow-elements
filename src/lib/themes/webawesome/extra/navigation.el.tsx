'use html-signal';
import { LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { SignalWatcher } from '@lit-labs/signals';

import { Flow } from '../../../flow.js';

import styles from './navigation.scss?inline';
import type { NfFlowElement as Nfe } from '../../../flow.el.jsx';
import type { GenericFlow } from '../../../types.js';

@customElement('nf-wa-navigation')
export class NfWaNavigationElement extends SignalWatcher(LitElement) {
  static styles = unsafeCSS(styles);

  declare slot: (typeof Nfe)['SLOT']['foreground'];

  @consume({ context: Flow.CONTEXT, subscribe: true })
  @property({ attribute: false })
  accessor flow!: GenericFlow;

  public override render(): JSX.LitTemplate {
    return (
      <div
        class:list={[
          'navigation-overlay',
          this.flow.isCanvasCentered === false && 'is-visible',
        ]}
      >
        <sl-button
          class="toggle-coordinates"
          on:click={() =>
            this.flow.setIsCoordinatesVisible(!this.flow.isCoordinatesVisible)
          }
          size="small"
        >
          <sl-icon name="info-circle" />
        </sl-button>

        <sl-button
          class="zoom-in"
          on:click={() => this.flow.zoom('in')}
          size="small"
        >
          <sl-icon name="zoom-in" />
        </sl-button>

        <sl-button
          class="zoom-out"
          on:click={() => this.flow.zoom('out')}
          size="small"
        >
          <sl-icon name="zoom-out" />
        </sl-button>

        <sl-button
          class="center-viewport"
          on:click={() => this.flow.resetViewport()}
          size="small"
        >
          <sl-icon name="crosshair" />
        </sl-button>
      </div>
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nf-wa-navigation': NfWaNavigationElement;
  }
}
