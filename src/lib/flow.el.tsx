/* eslint-disable jsdoc/check-tag-names */
'use html-signal';
import { css, LitElement } from 'lit';
import { For } from '@gracile-labs/jsx/components/for';
import { ContextProvider } from '@lit/context';
import { SignalWatcher } from '@lit-labs/signals';

import { Flow } from './flow.js';
import './node.el.js';
import './canvas.el.js';
import { FLOW_SLOT } from './types.js';

// import type { GenericFlow } from './types.js';

/**
 * @slot background
 * @slot background-interactive
 * @slot foreground
 * @slot foreground-interactive
 */
export class NfFlowElement extends SignalWatcher(LitElement) {
  static styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
    }
  `;

  static override properties = { flow: { attribute: false } };

  readonly #provider = new ContextProvider(this, { context: Flow.CONTEXT });
  #flow!: Flow;
  set flow(value) {
    this.#flow = value;
    this.#provider.setValue(value);
  }
  get flow(): Flow<any, any> {
    return this.#flow;
  }

  public override connectedCallback(): void {
    if (!this.flow) throw new ReferenceError('Missing flow store.');
    super.connectedCallback();
  }

  public static readonly SLOT = FLOW_SLOT;

  public override render(): JSX.LitTemplate {
    return (
      <>
        <slot name={NfFlowElement.SLOT.background} />

        <nf-interactive-canvas prop:flow={this.flow}>
          <slot name={NfFlowElement.SLOT.bgInteractive} />

          <this.Nodes />

          <slot name={NfFlowElement.SLOT.fgInteractive} />
        </nf-interactive-canvas>

        <slot name={NfFlowElement.SLOT.foreground} />
      </>
    );
  }

  private readonly Nodes = (): JSX.LitTemplate => (
    <For each={this.#flow.nodes} key={(node) => node.id}>
      {(node) => (
        <nf-node
          class="node"
          prop:node={node}
          style:map={{
            '--dx': node?.x ? `${node?.x}px` : '0',
            '--dy': node?.y ? `${node?.y}px` : '0',
            zIndex: node.zIndex?.toString() ?? 'initial',
          }}
        >
          <slot name={node.slotName}>
            {node.Template ? <node.Template /> : null}
          </slot>
        </nf-node>
      )}
    </For>
  );
}

declare global {
  interface HTMLElementTagNameMap {
    'nf-flow': NfFlowElement;
  }
}
customElements.define('nf-flow', NfFlowElement);
