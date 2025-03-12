'use html-signal';
import { LitElement, unsafeCSS, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef } from 'lit/directives/ref.js';
import { consume } from '@lit/context';
import { SignalWatcher } from '@lit-labs/signals';

import type { NfFlowElement as Nfe } from '../../../flow.el.jsx';
import { Flow } from '../../../flow.js';

import styles from './minimap.scss?inline';
import type { GenericFlow } from '../../../types.js';
import type { Node } from '../../../node.js';
import { reaction } from 'signal-utils/subtle/reaction';

@customElement('nf-wa-minimap')
export class NfWaMinimapElement extends SignalWatcher(LitElement) {
  static styles = unsafeCSS(styles);

  declare slot: (typeof Nfe)['SLOT']['foreground'];

  @consume({ context: Flow.CONTEXT, subscribe: true })
  @property({ attribute: false })
  accessor flow!: GenericFlow;

  #canvasRef = createRef<HTMLCanvasElement>();

  @property({ attribute: false }) accessor scale = 10;
  @property({ type: Number }) accessor width = 256;
  @property({ type: Number }) accessor height = 256;

  protected updated(_changedProperties: PropertyValues): void {
    this.updateCanvas();
  }

  public override firstUpdated(): void {
    reaction(
      () => [
        this.flow.viewportRect,
        this.flow.offsetX,
        this.flow.offsetY,
        this.flow.scale,
        this.flow.nodes.map((node) => [node.x, node.y, node.zIndex]),
      ],

      () => this.updateCanvas(),
    );
  }

  updateCanvas = (): void => {
    const canvas = this.#canvasRef.value!;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    const sortedNodes = [...this.flow.nodes].sort(
      (a: Node, b: Node /* FIXME */) =>
        (a.zIndex ?? 0) < (b.zIndex ?? 0) ? -1 : 1,
    );
    for (const node of sortedNodes) {
      // return;
      context.strokeStyle = 'grey';
      context.fillStyle = node.isSelected ? 'white' : 'lightgrey';

      context.beginPath();
      context.roundRect(
        ((node.x + this.flow.offsetX + this.flow.viewportRect.width / 2) *
          this.flow.scale) /
          this.scale,
        ((node.y + this.flow.offsetY + this.flow.viewportRect.height / 2) *
          this.flow.scale) /
          this.scale,
        (node.width * this.flow.scale) / this.scale,
        (node.height * this.flow.scale) / this.scale,
        2 * ((this.flow.scale * this.scale) / 10),
      );
      context.stroke();
      context.fill();
    }
  };

  render(): JSX.LitTemplate {
    return (
      <div
        class="wrapper"
        style:map={{ width: `${this.width}px`, height: `${this.height}px` }}
      >
        <div
          class="coords"
          class:list={[
            'coords',
            (this.flow.isContextMenuVisible ||
              this.flow.isZoomingCanvas ||
              this.flow.isDraggingCanvas ||
              this.flow.isDraggingNode ||
              this.flow.isCoordinatesVisible) &&
              'is-visible',
          ]}
        >
          <sl-tag size="small">X: {Math.round(this.flow.offsetX)}</sl-tag>
          <sl-tag size="small">Y: {Math.round(this.flow.offsetY)}</sl-tag>
          <sl-tag size="small">
            Z: {Math.round(this.flow.scale * 1000) / 1000}
          </sl-tag>
        </div>

        <canvas
          width={this.width}
          height={this.height}
          ref={this.#canvasRef}
          on:contextmenu={(event) => event.preventDefault()}
        />
      </div>
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nf-wa-minimap': NfWaMinimapElement;
  }
}
