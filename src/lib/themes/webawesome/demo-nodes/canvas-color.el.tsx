import { css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef } from 'lit/directives/ref.js';
import { SignalWatcher } from '@lit-labs/signals';
import { reaction } from 'signal-utils/subtle/reaction';
import type { SlColorPicker } from '@shoelace-style/shoelace';

import type { Port } from '../../../port.js';

import {
  textPortSchema,
  type PortsWithSchema,
  type TextPort,
} from './schemas.js';
import { Node } from '../../../node.js';

// TODO: add "image node source" before
export class NfWaCanvasColorNode extends Node<PortsWithSchema> {
  public override readonly type = 'NfWaCanvasColorNode';

  public override readonly defaultDisplayName = 'Solid color';
  public override readonly defaultIcon = 'alphabet-uppercase';

  public override readonly ports = {
    text: this.addPort<TextPort>({
      direction: 'in',
      customDisplayName: 'Text',
      metadata: { schema: textPortSchema },
    }),

    canvas: this.addPort<HTMLCanvasElement>({
      direction: 'out',
      customDisplayName: 'Canvas',
    }),
  };

  public override readonly Template = (): JSX.LitTemplate => (
    <nf-wa-node slot={this.slotName} prop:node={this}>
      <nf-canvas-color
        prop:canvasOut={this.ports.canvas}
        prop:textIn={this.ports.text}
      />
    </nf-wa-node>
  );
}

@customElement('nf-canvas-color')
export class NfWaCanvasColorElement extends SignalWatcher(LitElement) {
  static styles = [
    css`
      :host {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      header {
        display: flex;

        justify-content: center;
        align-items: center;
        gap: var(--sl-spacing-x-large);
        padding: var(--sl-spacing-small);
      }
    `,
  ];

  #canvasRef = createRef<HTMLCanvasElement>();

  protected firstUpdated(): void {
    this.draw();

    reaction(
      () => [this.textIn?.lastChangeTime],
      () => {
        this.draw();
      },
    );
  }

  draw() {
    const canvas = this.#canvasRef.value!;

    const context = canvas.getContext('2d')!;

    context.fillStyle = this.color;

    context.font = '36px system-ui';

    context.fillRect(0, 0, canvas.width, canvas.height);

    this.canvasOut?.updateValue(canvas);
  }

  @property({ attribute: false })
  accessor canvasOut: Port<HTMLCanvasElement> | null = null;

  @property({ attribute: false }) accessor textIn: Port<TextPort> | null = null;

  // TODO: extract to node body initial value with schema (everywhere)
  @property({ attribute: false }) accessor color: string = '#45001d';

  public override render(): JSX.LitTemplate {
    return (
      <>
        <header>
          Color
          <sl-color-picker
            value={this.color}
            label="Select a color"
            on:sl-input={(event: Event) => {
              this.color = (event.target as SlColorPicker).value;
              this.draw();
            }}
          />
          <sl-tag>
            <code>{this.color}</code>
          </sl-tag>
        </header>

        <canvas hidden width="250" height="250" ref={this.#canvasRef} />
      </>
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nf-canvas-color': NfWaCanvasColorElement;
  }
}
