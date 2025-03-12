// import '@shoelace-style/shoelace/dist/components/details/details.js';

import { css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef } from 'lit/directives/ref.js';
import { SignalWatcher } from '@lit-labs/signals';
import { reaction } from 'signal-utils/subtle/reaction';

import type { Port } from '../../../port.js';
import { Node } from '../../../node.js';

import { type PortsWithSchema } from './schemas.js';

export class NfWaCanvasMixerNode extends Node<PortsWithSchema> {
  public override readonly type = 'NfWaCanvasMixerNode';

  public override readonly defaultDisplayName = 'Mixer';
  public override readonly defaultIcon = 'transparency';

  public override readonly ports = {
    canvasAIn: this.addPort<HTMLCanvasElement>({
      direction: 'in',
      customDisplayName: 'Canvas A',
    }),
    canvasBIn: this.addPort<HTMLCanvasElement>({
      direction: 'in',
      customDisplayName: 'Canvas B',
    }),

    canvasOut: this.addPort<HTMLCanvasElement>({
      direction: 'out',
      customDisplayName: 'Result',
    }),
  };

  public override readonly Template = (): JSX.LitTemplate => (
    <nf-wa-node slot={this.slotName} prop:node={this}>
      <wf-canvas-mixer
        prop:canvasAIn={this.ports.canvasAIn}
        prop:canvasBIn={this.ports.canvasBIn}
        prop:canvasOut={this.ports.canvasOut}
      />
    </nf-wa-node>
  );
}

@customElement('wf-canvas-mixer')
export class NfWaCanvasMixerElement extends SignalWatcher(LitElement) {
  static styles = [
    css`
      :host {
        display: contents;
      }

      .render {
        width: 100%;
        display: flex;
        justify-content: center;
      }
    `,
  ];

  #canvasRef = createRef<HTMLCanvasElement>();

  @property({ attribute: false })
  accessor canvasAIn: Port<HTMLCanvasElement> | null = null;

  @property({ attribute: false })
  accessor canvasBIn: Port<HTMLCanvasElement> | null = null;

  @property({ attribute: false })
  accessor canvasOut: Port<HTMLCanvasElement> | null = null;

  protected firstUpdated(): void {
    this.draw();

    reaction(
      () => [this.canvasAIn?.lastChangeTime, this.canvasBIn?.lastChangeTime],
      () => {
        this.draw();
      },
    );
  }

  draw() {
    const canvas = this.#canvasRef?.value;
    const context = canvas?.getContext('2d');

    const canvasA = this.canvasAIn;
    const canvasB = this.canvasBIn;

    if (
      context &&
      canvasA?.value instanceof HTMLCanvasElement &&
      canvasB?.value instanceof HTMLCanvasElement
    ) {
      context.drawImage(canvasA.value, 0, 0);

      context.drawImage(canvasB.value, 0, 0);

      if (canvas) this.canvasOut?.updateValue(canvas);
    }
  }

  public override render(): JSX.LitTemplate {
    return (
      <div class="render">
        <canvas ref={this.#canvasRef} width="250" height="250" />
      </div>
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wf-canvas-mixer': NfWaCanvasMixerElement;
  }
}
