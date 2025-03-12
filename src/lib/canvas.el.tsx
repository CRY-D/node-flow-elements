'use html-signal';
import { LitElement, unsafeCSS } from 'lit';
import { createRef } from 'lit/directives/ref.js';
import panzoom from 'panzoom';
import { SignalWatcher } from '@lit-labs/signals';

import { Flow } from './flow.js';
import styles from './canvas.scss?inline';
import { NfNodeElement } from './node.el.jsx';
import {
  isHandle,
  isNode,
  isPort,
  PZ_EVENT,
  type Offset,
  type PointerData,
} from './types.js';
import type { Port } from './port.js';

import './node.el.js';
import './handle.el.js';
import './port.el.js';

export class NfCanvasElement extends SignalWatcher(LitElement) {
  static styles = unsafeCSS(styles);

  static override properties = { flow: { attribute: false } };
  declare public flow: Flow;

  #pointerMap: Map<number, PointerData> = new Map();

  #panzoomInnerRef = createRef<HTMLDivElement>();
  #panzoomWrapperRef = createRef<HTMLDivElement>();

  protected override firstUpdated(): void {
    if (!this.flow) throw new ReferenceError('Missing flow.');
    this.#setupPanZoom();
    this.#observeResize();
  }

  #setupPanZoom(): void {
    this.flow.panzoom = panzoom(this.#panzoomInnerRef.value!, {
      // TODO: Parametrize some options, via CSS or JS props?
      disableKeyboardInteraction: true,
      minZoom: 0.05,
      maxZoom: 10,
      zoomSpeed: 0.25,
      // initialX: this.flow.initial.x,
      // initialY: this.flow.initial.y,
      // initialZoom: this.flow.initial.zoom,
      // bounds: true,
      // autocenter: true,
    });
    this.flow.panzoom.on(PZ_EVENT.panstart, () =>
      this.flow.setIsDraggingCanvas(true),
    );
    this.flow.panzoom.on(PZ_EVENT.panend, () =>
      this.flow.setIsDraggingCanvas(false),
    );
    // FIXME:
    // this.flow.panzoom.on(PZ_EVENT.zoom, () =>
    //   this.flow.setIsZoomingCanvas(true),
    // );
    // this.flow.panzoom.on(PZ_EVENT.zoomend, () =>
    //   this.flow.setIsZoomingCanvas(false),
    // );
    this.flow.panzoom.on(PZ_EVENT.transform, () => {
      if (!this.flow.panzoom) return;
      const transform = this.flow.panzoom.getTransform();

      this.flow.updateOffset(transform.x, transform.y);
      this.flow.updateScale(transform.scale);
    });
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.flow.panzoom) this.flow.panzoom.dispose();
  }

  #observeResize(): void {
    const observer = new ResizeObserver(() => this.#updateViewportRect());
    observer.observe(this.#panzoomWrapperRef.value!);

    this.#updateViewportRect();
  }

  #updateViewportRect(): void {
    const rect = this.#panzoomWrapperRef.value?.getBoundingClientRect();
    if (!rect) return;

    const scroll = { x: window.scrollX, y: window.scrollY };
    this.flow.updateViewportRect({ rect, scroll });
  }

  #handleDown(event: PointerEvent): void {
    if (event.button === 2 || !(event.target instanceof Element)) return;

    const paths = event.composedPath();

    const portElement = paths.find((element) => isPort(element));
    if (portElement?.port) {
      this.flow.setConnectingLink(portElement.port as Port);
      return;
    }

    const nodeElement = paths.find((element) => isNode(element));
    if (!nodeElement) return;

    this.flow.selectNode(nodeElement.node);

    const handleElement = paths.find((element) => isHandle(element));
    if (!handleElement) return;

    event.target.setPointerCapture(event.pointerId);

    this.#pointerMap.set(event.pointerId, {
      id: event.pointerId,
      startPos: { x: event.clientX, y: event.clientY },
      currentPos: { x: event.clientX, y: event.clientY },
    });

    nodeElement.node.setIsDragging(true);
  }

  #handleMove(event: PointerEvent): void {
    if (this.flow.connectingLink) {
      const rect = this.getBoundingClientRect();

      this.flow.updateMousePosition({
        x: (event.clientX - rect.x) / this.flow.scale,
        y: (event.clientY - rect.y) / this.flow.scale,
      });
    }

    const saved = this.#pointerMap.get(event.pointerId);
    if (!saved) return;

    const paths = event.composedPath();
    const nodeElement = paths.find((element) => isNode(element));

    if (!nodeElement) return;
    if (nodeElement.node.isDragging === false) return;

    const current = { ...saved.currentPos };
    saved.currentPos = { x: event.clientX, y: event.clientY };
    const delta = {
      y: (saved.currentPos.y - current.y) / this.flow.scale,
      x: (saved.currentPos.x - current.x) / this.flow.scale,
    };

    this.#moveElement(nodeElement, delta);
  }

  #handleUp(event: PointerEvent): void {
    const paths = event.composedPath();
    const nodeElement = paths.find((element) => isNode(element));
    const portElement = paths.find((element) => isPort(element));

    if (this.flow.connectingLink) {
      if (portElement?.port)
        this.flow.connectingLink.from.connectTo(portElement.port.id);

      this.flow.setConnectingLink(null);
    }

    if (!nodeElement) return;

    nodeElement.node.setIsDragging(false);

    this.#pointerMap.delete(event.pointerId);
  }

  #moveElement(child: NfNodeElement, delta: Offset): void {
    const position = {
      x: child.node.x + delta.x,
      y: child.node.y + delta.y,
    };
    const rect = child.getBoundingClientRect();

    child.node.updatePosition(position);
    child.node.updateSizeFromDom(rect);
  }

  #handleEnter(event: PointerEvent): void {
    this.#hoverNode(event, true);
  }

  #handleLeave(event: PointerEvent): void {
    this.#hoverNode(event, false);
  }

  #hoverNode(event: PointerEvent, hovering: boolean): void {
    const nodeElement = event.composedPath().find((element) => isNode(element));
    if (nodeElement) nodeElement.node.setIsHovering(hovering);
  }

  #handleDoubleClick(event: MouseEvent): void {
    const paths = event.composedPath();
    const nodeElement = paths.find((element) => isNode(element));
    const handleElement = paths.find((element) => isHandle(element));
    const portElement = paths.find((element) => isPort(element));

    if (portElement || nodeElement || handleElement) event.stopPropagation();
  }

  #handleContextMenu(event: MouseEvent): void {
    const element = event.composedPath().at(0);
    if (
      element !== this.#panzoomInnerRef.value &&
      element !== this.#panzoomWrapperRef.value
    )
      return;
    event.preventDefault();

    const x =
      event.clientX +
      window.scrollX +
      (event.clientX > 125 ? -105 : 25) -
      this.flow.viewportRect.x;
    const y =
      event.clientY +
      window.scrollY +
      (event.clientY < 125 ? 25 : -15) -
      this.flow.viewportRect.y;

    this.flow.setContextMenuPosition({ x, y });
    this.flow.setIsContextMenuVisible(true);
  }

  public static readonly SLOT_NAMES = {
    background: 'background',
    foreground: 'foreground',
  } as const;

  render(): JSX.LitTemplate {
    return (
      <div
        ref={this.#panzoomWrapperRef}
        class:list={[
          'wrapper',
          this.flow.isDraggingCanvas && 'is-dragging',
          this.flow.isDraggingNode && 'is-dragging-node',
          this.flow.connectingLink && 'is-connecting-port',
        ]}
        on:pointerdown={(event) => this.#handleDown(event)}
        on:pointermove={(event) => this.#handleMove(event)}
        on:pointerup={(event) => this.#handleUp(event)}
        on:pointerover={(event) => this.#handleEnter(event)}
        on:pointerout={(event) => this.#handleLeave(event)}
        on:dblclick={(event) => this.#handleDoubleClick(event)}
        on:contextmenu={(event) => this.#handleContextMenu(event)}
      >
        <div ref={this.#panzoomInnerRef}>
          <slot name={NfCanvasElement.SLOT_NAMES.background} />

          <slot
            // NOTE: Prevents PanZooms.
            on:dblclick={(event) => event.stopPropagation()}
            on:mousedown={(event) => event.stopPropagation()}
            on:mouseup={(event) => event.stopPropagation()}
            on:keydown={(event) => event.stopPropagation()}
          />

          <slot name={NfCanvasElement.SLOT_NAMES.foreground} />
        </div>
      </div>
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nf-interactive-canvas': NfCanvasElement;
  }
}
customElements.define('nf-interactive-canvas', NfCanvasElement);
