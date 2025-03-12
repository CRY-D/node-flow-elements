// import '@shoelace-style/shoelace/dist/components/details/details.js';

import { css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef } from 'lit/directives/ref.js';
import { SignalWatcher } from '@lit-labs/signals';
import { reaction } from 'signal-utils/subtle/reaction';

import { Node } from '../../../node.js';
import type { Port } from '../../../port.js';

import type { NumberPort, PortsWithSchema } from './schemas.js';

export class NfWaCanvasFiltersNode extends Node<PortsWithSchema> {
  public override readonly type = 'NfWaCanvasFiltersNode';

  public override readonly defaultDisplayName = 'Filters';
  public override readonly defaultIcon = 'shadows';

  // TODO:
  public override readonly helpText = 'Cool canvas filters…';

  public override readonly ports = {
    blurIn: this.addPort<NumberPort>({
      direction: 'in',
      customDisplayName: 'Blur (px)',

      metadata: {
        schema: {
          title: 'Blur',
          type: 'number',
          minimum: 0,
          maximum: 25,
          default: 15,
        },
      },
    }),

    brightnessIn: this.addPort<NumberPort>({
      direction: 'in',
      customDisplayName: 'Brightness (%)',
      metadata: {
        schema: {
          title: 'Brightness',
          type: 'number',
          minimum: 0,
          maximum: 100,
          default: 75,
        },
      },
    }),

    canvasIn: this.addPort<HTMLCanvasElement>({
      direction: 'in',
      customDisplayName: 'Canvas',
      // TODO: validate
    }),

    canvasOut: this.addPort<HTMLCanvasElement>({
      direction: 'out',
      customDisplayName: 'Result',
    }),
  };

  public override readonly Template = (): JSX.LitTemplate => (
    <nf-wa-node slot={this.slotName} prop:node={this}>
      <nf-wa-canvas-filters
        prop:blurIn={this.ports.blurIn}
        prop:brightnessIn={this.ports.brightnessIn}
        prop:canvasIn={this.ports.canvasIn}
        prop:canvasOut={this.ports.canvasOut}
      />
    </nf-wa-node>
  );
}

@customElement('nf-wa-canvas-filters')
export class NfWaCanvasFiltersElement extends SignalWatcher(LitElement) {
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
  accessor canvasIn!: Port<HTMLCanvasElement, PortsWithSchema>;

  @property({ attribute: false })
  accessor canvasOut!: Port<HTMLCanvasElement, PortsWithSchema>;

  @property({ attribute: false }) accessor blurIn!: Port<
    number,
    PortsWithSchema
  >;

  @property({ attribute: false })
  accessor brightnessIn!: Port<number, PortsWithSchema>;

  protected firstUpdated(): void {
    this.draw();

    reaction(
      () => [
        this.canvasIn?.lastChangeTime,
        this.blurIn?.lastChangeTime,
        this.brightnessIn?.lastChangeTime,
      ],
      () => {
        this.draw();
      },
    );
  }

  draw() {
    const canvas = this.#canvasRef?.value;
    const context = canvas?.getContext('2d');
    if (!context) return;

    const canvasInput = this.canvasIn;

    context.filter =
      `blur(${this.blurIn.value}px) ` +
      `brightness(${this.brightnessIn?.value}%)`;

    if (canvasInput?.value instanceof HTMLCanvasElement) {
      context.drawImage(canvasInput.value, 0, 0);

      if (canvas) this.canvasOut?.updateValue(canvas);
    }
  }

  public override render(): JSX.LitTemplate {
    return (
      <div class="render">
        <canvas width="250" height="250" ref={this.#canvasRef} />
      </div>
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nf-wa-canvas-filters': NfWaCanvasFiltersElement;
  }
}
