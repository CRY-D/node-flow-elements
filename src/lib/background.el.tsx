'use html-signal';
import { LitElement, css, type PropertyValues } from 'lit';
import { ContextConsumer } from '@lit/context';
import { SignalWatcher } from '@lit-labs/signals';
import { createRef } from 'lit/directives/ref.js';
import { reaction } from 'signal-utils/subtle/reaction';

import { Flow } from './flow.js';
import type { NfFlowElement as Nfe } from './flow.el.jsx';
import type { GenericFlow } from './types.js';

/**
 * @cssproperty [--nf-background-grid-line-colors=#191919]
 * @cssproperty [--nf-background-grid-line-width=1]
 * @cssproperty [--nf-background-grid-line-spacing=64]
 */
export class NfBackgroundElement extends SignalWatcher(LitElement) {
  static styles = css`
    :host {
      position: absolute;
      display: block;
      /* width: fit-content;
      height: fit-content; */

      /* HACK: (updateViewportRect) */
      overflow: hidden;

      /* TODO: light-dark(#333b3c, #efefec) */
      --_nf-background-grid-line-colors: var(
        --nf-background-grid-line-colors,
        #191919
      );
      --_nf-background-grid-line-width: var(--nf-background-grid-line-width, 1);
      --_nf-background-grid-line-spacing: var(
        --nf-background-grid-line-spacing,
        64
      );
    }

    canvas {
      background: #080808;
      width: 100%;
      height: 100%;
    }
  `;

  declare slot: (typeof Nfe)['SLOT']['background'];

  declare flow?: GenericFlow;
  static properties = { flow: { attribute: false } };

  readonly #flowProvider = new ContextConsumer(this, {
    context: Flow.CONTEXT,
    subscribe: true,
  });
  get #flow(): Flow {
    const flow = this.flow || this.#flowProvider.value;
    if (!flow) throw new ReferenceError('Missing flow.');
    return flow;
  }

  // @property({ type: Number }) accessor spacing = 20;
  // @property({ type: Number }) accessor lineWidth = 1;

  readonly #canvasRef = createRef<HTMLCanvasElement>();

  protected firstUpdated(): void {
    reaction(
      () => [
        this.#flow.viewportRect.width,
        this.#flow.viewportRect.height,
        this.#flow.offsetX,
        this.#flow.offsetY,
      ],
      () => this.#updateCanvas(),
    );
  }

  #updateCanvas() {
    console.log('UP1');
    const canvas = this.#canvasRef.value;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    console.log('UP2');

    if (canvas.width === 0 || canvas.height === 0 || this.#flow.scale === 0)
      return;

    console.log('UP3');
    const spacing = Number(
      getComputedStyle(this).getPropertyValue(
        '--_nf-background-grid-line-spacing',
      ),
    );
    const strokeStyle = getComputedStyle(this).getPropertyValue(
      '--_nf-background-grid-line-colors',
    );
    const lineWidth = Number(
      getComputedStyle(this).getPropertyValue(
        '--_nf-background-grid-line-width',
      ),
    );

    let step = spacing * this.#flow.scale;

    while (step < 16) step = step * 2;

    if (step === 0) return;

    const left =
      0.5 - Math.ceil(canvas.width / step) * step + this.#flow.offsetX;
    const top =
      0.5 - Math.ceil(canvas.height / step) * step + this.#flow.offsetY;

    const right = 2 * canvas.width;
    const bottom = 2 * canvas.height;

    context.clearRect(left, top, right - left, bottom - top);
    context.beginPath();

    for (let x = left; x < right; x += step) {
      context.moveTo(x, top);
      context.lineTo(x, bottom);
    }
    for (let y = top; y < bottom; y += step) {
      context.moveTo(left, y);
      context.lineTo(right, y);
    }

    context.strokeStyle = strokeStyle;
    context.lineWidth = lineWidth;

    context.stroke();
  }

  public override render(): JSX.LitTemplate {
    return (
      <canvas
        ref={this.#canvasRef}
        width={this.#flow.viewportRect.width}
        height={this.#flow.viewportRect.height}
      />
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nf-background': NfBackgroundElement;
  }
}
customElements.define('nf-background', NfBackgroundElement);
