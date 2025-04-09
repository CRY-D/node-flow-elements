'use html-signal';
import { Flow } from '../lib/index.js';

import { SignalWatcher } from '@lit-labs/signals';
import { LitElement, css, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

import * as presets from '../lib/themes/webawesome/demo-nodes/presets/index.js';

import '../lib/themes/webawesome/index.js';
import '../lib/themes/webawesome/demo-nodes/index.js';

import waTheme from '../lib/themes/webawesome/theme.scss?inline';

@customElement('demo-nf-wa')
export class DemoNfWa extends SignalWatcher(LitElement) {
  static styles = [
    unsafeCSS(waTheme),
    css`
      :host {
        display: contents;
      }
      .wrapper {
        height: 100%;
        width: 100%;
        /* HACK: */
        /* will-change: transform; */
        /* transform: translateZ(0);
        isolation: isolate; */
        overflow: hidden;
        border-radius: var(--sl-border-radius-x-large);
      }
    `,
  ];

  flow = new Flow(presets.kitchenSink);

  render() {
    return (
      <div class="wrapper">
        <nf-flow prop:flow={this.flow} class="nf-webawesome">
          <nf-background slot="background" />
          <nf-wa-center slot="background-interactive" />
          <nf-links slot="foreground-interactive" />
          <nf-wa-inventory slot="foreground" />
          <nf-wa-minimap slot="foreground" />
          <nf-wa-navigation slot="foreground" />
        </nf-flow>
      </div>
    );
  }
}
