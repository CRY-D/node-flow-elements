'use html-signal';
import { LitElement, svg, unsafeCSS } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
// eslint-disable-next-line unicorn/no-keyword-prefix
import { classMap } from 'lit/directives/class-map.js';
import { animate } from '@lit-labs/motion';
import { ContextConsumer } from '@lit/context';
import { SignalWatcher } from '@lit-labs/signals';

import { Flow } from './flow.js';
import type { ConnectingLink, GenericFlow, Link } from './types.js';

import styles from './links.scss?inline';
import type { NfFlowElement as Nfe } from './flow.el.jsx';

// IDEA: Parametrize styles via CSS?
export class NfLinksElement extends SignalWatcher(LitElement) {
  static styles = unsafeCSS(styles);

  declare slot: (typeof Nfe)['SLOT']['fgInteractive'];

  declare flow?: GenericFlow;
  static properties = { flow: { attribute: false } };

  readonly #flowProvider = new ContextConsumer(this, {
    context: Flow.CONTEXT,
    subscribe: true,
  });
  get #flow(): GenericFlow {
    const flow = this.flow || this.#flowProvider.value;
    if (!flow) throw new ReferenceError('Missing flow.');
    return flow;
  }

  private readonly Cable = ({
    link,
    type,
  }: {
    link: Link | ConnectingLink;
    type?: 'overlay' | 'fatty' | 'outline';
  }): JSX.LitTemplate => {
    const dPath = this.#flow.makeLinkSvgPath(link);

    const cableStyles = styleMap({
      // NOTE: DISABLED (performance issues).
      // IDEA: Might use CSS, not inline styles.
      // animation: 'dash 120s linear infinite',
      // transition: 'stroke 25ms, stroke-width 25ms ',
    });

    // TODO: Parametrize CSS vars.
    const strokeWidth = (
      {
        fatty: '10px',
        outline: '6px',
        overlay: '3px',
        none: link.from.isPulsing ? '3px' : '1px',
      } as const
    )[type ?? 'none'];

    const stroke = (
      {
        fatty: 'transparent',
        outline: 'var(--_nf-links-grid-stroke-main-outline-color)',
        overlay: 'var(--_nf-links-grid-stroke-main-overlay-color)',
        main: link.from.isPulsing
          ? 'var(--_nf-links-grid-stroke-main-pulsing-color)'
          : 'var(--_nf-links-grid-stroke-main-color)',
      } as const
    )[type ?? 'main'];

    // TODO: Parametrize CSS vars.
    const dashArray = type === 'overlay' ? '20 100' : undefined;
    const dashOffset = type === 'overlay' ? 955 : undefined;

    return svg`
      <path
        fill="transparent"
        class=${type ?? ''}
        style=${cableStyles}
        d=${dPath}
        stroke-dasharray=${dashArray}
        stroke-dashoffset=${dashOffset}
        stroke-width=${strokeWidth}
        stroke=${stroke}
      />
    `;
  };

  public override render(): JSX.LitTemplate {
    return (
      <div
        on:dblclick={(event: MouseEvent) => event.stopPropagation()}
        class="links"
        style:map={{
          width: `${this.#flow.viewportRect.width}px`,
          height: `${this.#flow.viewportRect.height}px`,

          left: `${this.#flow.viewportRect.x}px`,
          top: `${this.#flow.viewportRect.y}px`,

          zIndex: this.#flow.isDraggingNode ? this.#flow.nodes.length + 1 : 0,
        }}
      >
        <svg>
          {this.#flow.connectingLink
            ? svg`
                ${this.Cable({ link: this.#flow.connectingLink })}
                ${this.Cable({
                  link: this.#flow.connectingLink,
                  type: 'overlay',
                })}
              `
            : null}

          {this.#flow.links.map((link) => {
            const animation = animate({
              in: [],
              out: [{ opacity: 0 }],
              stabilizeOut: true,
              properties: ['opacity'],
              keyframeOptions: { duration: 150 },
              id: `${link.from.id}_${link.to.id}`,
              inId: `in_${link.from.id}_${link.to.id}`,

              skipInitial: true,
            });
            const classes = classMap({
              paths: true,
              'is-connecting-port': this.#flow.connectingLink !== null,
            });

            return svg`
                <g
                  ${animation}
                  class=${classes}
                  @dblclick=${(): void => link.from.disconnect(link.to.id)}
                  @mousedown=${(event: MouseEvent): void =>
                    event.stopPropagation()}
                >
                  ${this.Cable({ link, type: 'outline' })}
                  ${this.Cable({ link })}
                  ${this.Cable({ link, type: 'overlay' })}
                  ${this.Cable({ link, type: 'fatty' })}
                </g>
              `;
          })}
        </svg>
      </div>
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nf-links': NfLinksElement;
  }
}
customElements.define('nf-links', NfLinksElement);
