'use html-signal';
import { LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef } from 'lit/directives/ref.js';
import { SignalWatcher } from '@lit-labs/signals';
import { consume } from '@lit/context';
import type { SlDialog } from '@shoelace-style/shoelace';

import { Flow } from '../../../flow.js';
import type { NfFlowElement as Nfe } from '../../../flow.el.jsx';
import type { GenericFlow, MenuItem } from '../../../types.js';

import styles from './inventory.scss?inline';

@customElement('nf-wa-inventory')
export class NfWaInventoryElement extends SignalWatcher(LitElement) {
  static styles = unsafeCSS(styles);

  declare slot: (typeof Nfe)['SLOT']['foreground'];

  @consume({ context: Flow.CONTEXT, subscribe: true })
  @property({ attribute: false })
  accessor flow!: GenericFlow;

  #confirmClearAllDialogRef = createRef<SlDialog>();

  MenuPanel = (tree: MenuItem[]) =>
    tree.map((node) => {
      if (node.children)
        return (
          <sl-menu-item>
            {node.displayName}
            <sl-icon slot="prefix" name={node.icon}></sl-icon>

            <sl-menu slot="submenu"> {this.MenuPanel(node.children)} </sl-menu>
          </sl-menu-item>
        );
      else if (node.label) {
        return <sl-menu-label>{node.displayName}</sl-menu-label>;
      } else if (node.nodeCtor) {
        const dummyNode = new node.nodeCtor({ flow: this.flow });
        return (
          <>
            <sl-menu-item
              on:click={() => {
                this.flow.addNode({
                  id: `added_node_${crypto.randomUUID()}`,
                  type: dummyNode.type,
                  x:
                    (this.flow.contextMenuPosition.x - this.flow.offsetX) /
                    this.flow.scale,
                  y:
                    (this.flow.contextMenuPosition.y - this.flow.offsetY) /
                    this.flow.scale,
                });

                this.flow.setIsContextMenuVisible(false);
              }}
            >
              <sl-icon slot="prefix" name={dummyNode.defaultIcon}></sl-icon>
              {dummyNode.defaultDisplayName}
            </sl-menu-item>
          </>
        );
      }
    });

  private Dialog = () => (
    <sl-dialog ref={this.#confirmClearAllDialogRef}>
      <div slot="label">
        <sl-icon name="trash3-fill"></sl-icon>
        Clear canvas
      </div>

      <p>Are you sure you want to delete all nodes from canvas?</p>

      <p>
        <em>
          Press <kbd>ENTER</kbd> to confirm.
        </em>
      </p>

      <sl-button
        slot="footer"
        on:click={() => this.#confirmClearAllDialogRef.value?.hide()}
      >
        Cancel
      </sl-button>
      <sl-button
        // autofocus
        slot="footer"
        on:click={() => {
          this.flow.clearNodes();
          this.#confirmClearAllDialogRef.value?.hide();
        }}
        variant="primary"
      >
        Confirm
      </sl-button>
    </sl-dialog>
  );

  public override render(): JSX.LitTemplate {
    return (
      <>
        <div
          style:map={{
            '--xx': `${this.flow.contextMenuPosition.x}px`,
            '--yy': `${this.flow.contextMenuPosition.y}px`,
          }}
          class:list={[
            'context-menu-wrapper',
            this.flow.isContextMenuVisible && 'is-visible',
          ]}
          on:contextmenu={(event) => event.preventDefault()}
        >
          <sl-button
            size="large"
            class="clear-all"
            on:click={() => this.#confirmClearAllDialogRef.value?.show()}
          >
            <sl-icon slot="prefix" name="trash3-fill"></sl-icon> Clear all
          </sl-button>

          <sl-dropdown
            prop:open={this.flow.isContextMenuVisible}
            class="context-menu-dropdown"
            on:sl-after-hide={() => {
              this.flow.setIsContextMenuVisible(false);
            }}
          >
            <sl-button slot="trigger" size="small">
              <sl-icon slot="prefix" name="x-lg"></sl-icon>Nodes
            </sl-button>
            <sl-menu
              class:map={{
                'context-menu': true,
              }}
            >
              {this.MenuPanel(this.flow.menuItems)}
            </sl-menu>
          </sl-dropdown>
        </div>

        <this.Dialog />
      </>
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nf-wa-inventory': NfWaInventoryElement;
  }
}
