import { LitElement, css } from 'lit';

export class LitRenderer extends LitElement {
  static styles = [
    css`
      :host {
        display: contents;
      }
    `,
  ];

  static override properties = { template: { attribute: false } };
  declare template?: unknown;

  public override render(): JSX.LitTemplate {
    return this.template || null;
  }
}
customElements.define('lit-renderer', LitRenderer);
