/* eslint-disable unicorn/prevent-abbreviations */
import '@shoelace-style/shoelace/dist/components/image-comparer/image-comparer.js';

import { css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { createRef } from 'lit/directives/ref.js';
import { SignalWatcher } from '@lit-labs/signals';
import { reaction } from 'signal-utils/subtle/reaction';

import type { Port } from '../../../port.js';
import { Node } from '../../../node.js';

import { type PortsWithSchema } from './schemas.js';

export class NfWaCanvasComparerNode extends Node<PortsWithSchema> {
  public override readonly type = 'NfWaCanvasComparerNode';

  public override readonly defaultDisplayName = 'A/B Comparer';
  public override readonly defaultIcon = 'layout-split';

  public override readonly ports = {
    canvasBefore: this.addPort<HTMLCanvasElement>({
      direction: 'in',
      customDisplayName: 'Before',
    }),
    canvasAfter: this.addPort<HTMLCanvasElement>({
      direction: 'in',
      customDisplayName: 'After',
    }),
  };

  public override readonly Template = (): JSX.LitTemplate => (
    <nf-wa-node slot={this.slotName} prop:node={this}>
      <nf-wa-canvas-comparer
        prop:canvasBeforeIn={this.ports.canvasBefore}
        prop:canvasAfterIn={this.ports.canvasAfter}
      />
    </nf-wa-node>
  );
}

@customElement('nf-wa-canvas-comparer')
export class NfWaCanvasComparerElement extends SignalWatcher(LitElement) {
  static styles = [
    css`
      :host {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `,
  ];

  #canvasBeforeRef = createRef<HTMLCanvasElement>()!;
  #canvasAfterRef = createRef<HTMLCanvasElement>()!;

  @property({ attribute: false })
  accessor canvasBeforeIn!: Port<HTMLCanvasElement>;

  @property({ attribute: false })
  accessor canvasAfterIn!: Port<HTMLCanvasElement>;

  @state() accessor blurFactor = 5;

  protected firstUpdated(): void {
    this.draw();
    reaction(
      () => [
        this.canvasAfterIn.lastChangeTime,
        this.canvasBeforeIn.lastChangeTime,
      ],
      () => this.draw(),
    );
  }

  draw() {
    if (this.canvasBeforeIn?.value instanceof HTMLCanvasElement) {
      const canvasBeforeOut = this.#canvasBeforeRef.value;
      const ctxBeforeOut = canvasBeforeOut?.getContext('2d');

      if (ctxBeforeOut) {
        const canvasBeforeIn = this.canvasBeforeIn?.value;
        ctxBeforeOut.drawImage(canvasBeforeIn, 0, 0);
      }
    }
    if (this.canvasAfterIn?.value instanceof HTMLCanvasElement) {
      const canvasAfterOut = this.#canvasAfterRef.value;
      const ctxAfterOut = canvasAfterOut?.getContext('2d');

      if (ctxAfterOut) {
        const canvasAfterIn = this.canvasAfterIn?.value;

        ctxAfterOut.drawImage(canvasAfterIn, 0, 0);
      }
    }
  }

  public override render(): JSX.LitTemplate {
    return (
      <sl-image-comparer style="--handle-size: 2rem">
        <canvas
          ref={this.#canvasBeforeRef}
          slot="after"
          width="250"
          height="250"
        />
        <canvas
          ref={this.#canvasAfterRef}
          slot="before"
          width="250"
          height="250"
        />
      </sl-image-comparer>
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nf-wa-canvas-comparer': NfWaCanvasComparerElement;
  }
}
