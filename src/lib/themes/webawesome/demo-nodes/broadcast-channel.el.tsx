import '@shoelace-style/shoelace/dist/components/copy-button/copy-button.js';
import { css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { SignalWatcher } from '@lit-labs/signals';
import { signal } from 'signal-utils';
import { reaction } from 'signal-utils/subtle/reaction';

import { Port } from '../../../port.js';
import { Node } from '../../../node.js';

import type { PortsWithSchema } from './schemas.js';

export class NfWaBroadcastChannelNode extends Node<PortsWithSchema> {
  public override readonly type = 'NfWaBroadcastChannelNode';

  public override readonly defaultDisplayName = 'Broadcast';
  public override readonly defaultIcon = 'broadcast-pin';

  public override readonly ports = {
    messageInput: this.addPort({
      direction: 'in',
      customDisplayName: 'TX',
    }),

    messageOutput: this.addPort({
      direction: 'out',
      customDisplayName: 'RX',
    }),
  };

  @signal accessor defaultValue: string = 'main';

  public override readonly Template = (): JSX.LitTemplate => (
    <nf-wa-node slot={this.slotName} prop:node={this}>
      <wf-broadcast-channel
        prop:defaultValue={this.defaultValue}
        prop:messageInput={this.ports.messageInput}
        prop:messageOutput={this.ports.messageOutput}
      />
    </nf-wa-node>
  );
}

@customElement('wf-broadcast-channel')
export class NfWaBroadcastChannelElement extends SignalWatcher(LitElement) {
  static styles = [
    css`
      :host {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .channel-wrapper {
        display: flex;
        align-items: center;
      }

      header {
        display: flex;
        align-items: center;
        justify-content: space-around;
      }

      sl-copy-button {
        margin-top: 2rem;
        margin-right: var(--sl-spacing-medium);

        &::part(button) {
          padding: 0;
        }
      }
    `,
  ];

  @property({ attribute: false }) accessor messageInput!: Port<any>;
  @property({ attribute: false }) accessor messageOutput!: Port<any>;

  // @property({ attribute: false }) accessor channel = 'main';
  @signal accessor channel = 'main';

  #broadcastChannel: BroadcastChannel = new BroadcastChannel('default');

  protected firstUpdated(): void {
    this.#reinitListener();
    reaction(
      () => [this.channel],
      () => {
        this.#reinitListener();
      },
    );

    reaction(
      () => [this.messageInput?.value],
      () => {
        this.#broadcastChannel.postMessage(this.messageInput.value);
      },
    );

    queueMicrotask(() =>
      this.#broadcastChannel.postMessage(this.messageInput.value),
    );
  }

  #listener = (event: MessageEvent<string>) => {
    this.messageOutput.updateValue(event.data);
  };
  #reinitListener(): void {
    this.#broadcastChannel.removeEventListener('message', this.#listener);
    this.#broadcastChannel.close();
    this.#broadcastChannel = new BroadcastChannel(this.channel);
    this.#broadcastChannel.addEventListener('message', this.#listener);
  }

  public override render(): JSX.LitTemplate {
    return (
      <div class="channel-wrapper">
        {/* @ts-expect-error TODO: generate typings for JSFE. */}
        <jsf-shoelace
          prop:schema={{
            properties: {
              text: {
                title: 'Channel unique name',
                // description: "Enter some text…",
                // default: this.defaultValue,
                default: 'main',
                type: 'string',
              },
            },
          }}
          prop:dataChangeCallback={(data: any) => {
            this.channel = data.text;
          }}
          prop:submitButton={false}
        />
        <sl-copy-button prop:value={this.channel}></sl-copy-button>
      </div>
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wf-broadcast-channel': NfWaBroadcastChannelElement;
  }
}
