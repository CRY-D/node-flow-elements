'use html-signal';
import '../../port.el.jsx';
import '../../handle.el.jsx';

import { createRef } from 'lit/directives/ref.js';
import { LitElement, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { SlCard, SlInput } from '@shoelace-style/shoelace';
import { SignalWatcher } from '@lit-labs/signals';

import type { Port } from '../../port.js';

import styles from './node.scss?inline';
import type { PortsWithSchema } from './demo-nodes/schemas.js';
import type { GenericNode } from '../../types.js';
import { reaction } from 'signal-utils/subtle/reaction';

@customElement('nf-wa-node')
export class NfWaNodeElement extends SignalWatcher(LitElement) {
  static styles = unsafeCSS(styles);

  @state() accessor isNodeInfosEditModeActive = false;
  @state() accessor isDeleting = false;
  @property({ attribute: false }) accessor node!: GenericNode;

  #renameInputRef = createRef<SlInput>();
  #draggableRef = createRef<SlCard>();

  public override firstUpdated(): void {
    reaction(
      () => this.node.isSelected,
      () => {
        if (!this.node.isSelected && this.isNodeInfosEditModeActive)
          this.isNodeInfosEditModeActive = false;
      },
    );
  }

  public override render(): JSX.LitTemplate {
    if (!this.node) throw new ReferenceError('Missing node.');
    return (
      <sl-card
        ref={this.#draggableRef}
        class:map={{
          wrapper: true,
          'is-hovering': this.node.isHovering,
          'is-dragging': this.node.isDragging,
          'is-selected': this.node.isSelected,
          'is-deleting': this.isDeleting,
          'is-connecting-port': this.node.flow.connectingLink !== null,
        }}
      >
        <this.Header></this.Header>

        <slot />

        {Object.values(this.node.ports).length > 0 ? <this.Footer /> : null}
      </sl-card>
    );
  }

  private Coordinates = (): JSX.LitTemplate => (
    <div
      class:map={{
        coords: true,
        'is-visible': this.node.flow.isCoordinatesVisible,
      }}
    >
      <sl-tag size="small" class="tag-x">
        X: {Math.round(this.node.x)}
      </sl-tag>
      <sl-tag size="small" class="tag-y">
        Y: {Math.round(this.node.y)}
      </sl-tag>
    </div>
  );

  private Title = (): JSX.LitTemplate => (
    <div class="title">
      <sl-tooltip>
        <span slot="content">
          <strong>{this.node.defaultDisplayName}</strong>

          {this.node.helpText ? (
            <>
              <sl-divider style="margin: var(--sl-spacing-x-small) 0" />
              <div>{this.node.helpText}</div>
            </>
          ) : null}
        </span>

        <sl-icon name={this.node.defaultIcon} />
      </sl-tooltip>

      {this.node?.displayName}
    </div>
  );

  private Settings = (): JSX.LitTemplate => (
    <sl-dropdown
      prop:open={this.isNodeInfosEditModeActive}
      placement="top-end"
      on:sl-hide={() => {
        this.isNodeInfosEditModeActive = false;
      }}
      on:sl-show={() => {
        this.isNodeInfosEditModeActive = true;

        if (this.isNodeInfosEditModeActive)
          setTimeout(() => {
            this.#renameInputRef.value!.focus();
          }, 50);
      }}
    >
      <sl-icon-button
        prop:name={'pencil-square'}
        slot="trigger"
        label="Settings"
        style:map={{
          opacity: this.node.isSelected || this.node.isHovering ? 1 : 0.15,

          color: this.isNodeInfosEditModeActive
            ? 'var(--sl-color-primary-800)'
            : 'var(--sl-color-neutral-700)',
        }}
        on:click={(event) => {
          event.stopPropagation();
          this.node.flow.selectNode(this.node);
          this.isNodeInfosEditModeActive = !this.isNodeInfosEditModeActive;
        }}
      />

      <sl-menu class="node-settings">
        <sl-button
          on:click={() => {
            this.isNodeInfosEditModeActive = false;

            // FIXME: cables
            this.isDeleting = true;
            setTimeout(() => {
              this.isDeleting = false;
            }, 270);
            this.node.delete();
          }}
          size="small"
          variant="text"
          outline
          class="delete-node"
        >
          delete
        </sl-button>

        <sl-divider vertical />

        <sl-input
          ref={this.#renameInputRef}
          size="small"
          type="text"
          name="display_name"
          prop:value={this.node?.displayName ?? ''}
          on:keydown={(event) => {
            // HACK:
            if (event.key === 'Enter') {
              event.currentTarget
                .closest('form')
                ?.dispatchEvent(new Event('submit'));
            }
          }}
        />

        <sl-button variant="text" type="submit" size="small">
          ok
        </sl-button>
      </sl-menu>
    </sl-dropdown>
  );

  private Header = (): JSX.LitTemplate => (
    <div class="header">
      <this.Coordinates />
      <nf-handle slot="header">
        <this.Title />
      </nf-handle>

      <form
        on:submit={(event) => {
          event.preventDefault();
          this.#renameInputRef.value?.blur();

          const formData = new FormData(event.target as HTMLFormElement);

          const displayName = formData.get('display_name')?.toString();
          if (displayName === '')
            this.node?.updateDisplayName(this.node.defaultDisplayName);
          else if (displayName && displayName !== this.node.defaultDisplayName)
            this.node?.updateDisplayName(displayName);

          this.isNodeInfosEditModeActive = false;
        }}
        style:map={{ display: 'contents' }}
      >
        <this.Settings />
      </form>
    </div>
  );

  private Footer = (): JSX.LitTemplate => {
    const inputs = Object.values(this.node.ports).filter(
      (port) => port.direction === 'in' && !port.metadata.hidden,
    );
    const outputs = Object.values(this.node.ports).filter(
      (port) => port.direction === 'out' && !port.metadata.hidden,
    );
    return (
      <div slot="footer" hidden={inputs.length > 0 && outputs.length > 0}>
        {inputs.length > 0 ? <this.Ports ports={inputs} type="input" /> : null}
        {outputs.length > 0 ? (
          <this.Ports ports={outputs} type="output" />
        ) : null}
      </div>
    );
  };

  private readonly Label = ({
    port,
    type,
  }: {
    port: Port<unknown, PortsWithSchema>;
    type: 'output' | 'input';
  }): JSX.LitTemplate => (
    <sl-button-group class="action">
      {type === 'output' ? <this.Deleter port={port} /> : null}
      {type === 'input' ? <this.Banger port={port} /> : null}

      <sl-dropdown
        prop:placement={type === 'input' ? 'left-end' : 'right-end'}
        class="port-editor"
      >
        <sl-button
          size="small"
          variant="default"
          slot="trigger"
          prop:disabled={port.metadata.schema === null}
        >
          <div>{port.displayName}</div>
        </sl-button>

        <sl-menu>
          {/* TODO: Put in slot: */}
          {typeof port.metadata.schema === 'object' ? (
            // @ts-expect-error Need custom elements manifest.
            <jsf-shoelace
              prop:schema={{
                properties: {
                  portValue: {
                    title: `Port ${type} value`,
                    ...port.metadata.schema,
                  },
                },
              }}
              prop:data={{
                portValue: port.value ?? port.metadata.schema?.default,
              }}
              prop:dataChangeCallback={(value: { portValue: unknown }) => {
                port.updateValue(value.portValue);
              }}
              prop:submitButton={false}
            />
          ) : null}
        </sl-menu>
      </sl-dropdown>

      {type === 'output' ? <this.Banger port={port} /> : null}
      {type === 'input' ? <this.Deleter port={port} /> : null}
    </sl-button-group>
  );

  private readonly Banger = ({ port }: { port: Port }): JSX.LitTemplate => (
    <sl-button
      class="pulse"
      name="activity"
      size="small"
      variant="default"
      on:click={() => port.bang()}
    >
      <sl-icon name="activity" />
    </sl-button>
  );

  private readonly Deleter = ({ port }: { port: Port }): JSX.LitTemplate => (
    <sl-button
      class="disconnect-all"
      name="activity"
      size="small"
      variant="default"
      on:click={() => port.disconnectAll()}
    >
      <sl-icon name="x-lg" />
    </sl-button>
  );

  private readonly Ports = ({
    ports,
    type,
  }: {
    ports: Port<unknown, PortsWithSchema>[];
    type: 'input' | 'output';
  }): JSX.LitTemplate => (
    <div class:list={['port-wrapper', type]}>
      {ports.map((port) =>
        port.metadata.hidden ? null : (
          <div class="handle">
            {type === 'output' ? <this.Label port={port} type={type} /> : null}

            <div
              class:list={[
                'port',
                ports.at(0)?.direction === 'in' ? 'inlet' : 'outlet',
              ]}
            >
              <nf-wa-port prop:port={port} />
            </div>

            {type === 'input' ? <this.Label port={port} type={type} /> : null}
          </div>
        ),
      )}
    </div>
  );
}

declare global {
  interface HTMLElementTagNameMap {
    'nf-wa-node': NfWaNodeElement;
  }
}
