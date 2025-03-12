/* eslint-disable unicorn/prevent-abbreviations */
import { css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef } from 'lit/directives/ref.js';
import { reaction } from 'signal-utils/subtle/reaction';
import { SignalWatcher } from '@lit-labs/signals';

import { Node } from '../../../node.js';
import type { Port } from '../../../port.js';

import {
  textPortSchema,
  type PortsWithSchema,
  type TextPort,
} from './schemas.js';

// TODO: add "image node source" before
export class NfWaCanvasTextNode extends Node<PortsWithSchema> {
  public override readonly type = 'NfWaCanvasTextNode';

  public override readonly defaultDisplayName = 'Text';
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
      <nf-canvas-text
        prop:canvasOut={this.ports.canvas}
        prop:textIn={this.ports.text}
      />
    </nf-wa-node>
  );
}

@customElement('nf-canvas-text')
export class NfWaCanvasTextElement extends SignalWatcher(LitElement) {
  static styles = [
    css`
      :host {
        display: flex;
        justify-content: center;
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

    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = '36px system-ui';

    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue(
      '--sl-color-primary-950',
    );
    ctx.fillText(this.textIn?.value || '<…Empty…>', 10, 100);

    this.canvasOut?.updateValue(canvas);
  }

  @property({ attribute: false })
  accessor canvasOut: Port<HTMLCanvasElement> | null = null;

  @property({ attribute: false }) accessor textIn: Port<TextPort> | null = null;

  public override render(): JSX.LitTemplate {
    return <canvas ref={this.#canvasRef} width="250" height="250" />;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nf-canvas-text': NfWaCanvasTextElement;
  }
}
