# Node Flow Elements

Easily create node-based UIs with any front-end framework.  
Powered by standard **signals** and native **HTML elements**.

_NFE_ is similar to the "React/Svelte/Vue flow" alike open-source libraries, with some important differences:

1. The Flow is always in a dedicated reactive store, meaning the graph, ports and nodes metadata, but also their related actions, are **well separated from the view** layer.
2. Your views can be reactive via **standard events** (not recommended), framework specific **hooks** (based on events) or any standard **signal** proposal implementation you can find.
3. Any custom nodes can be injected in standard **slots**, being Lit/vanilla custom elements, or components made with **React**, **Vue**, **Solid**, etc.

## Demo

<demo-nf-wa style="display: block; height: 70dvh; width: 100%;">
<img src="">
</demo-nf-wa>

---

> [!CAUTION]  
> This proof-of-concept, after a while, _could_ be stabilized for production.  
> However, don't expect the high level of polish and features of well-known libraries that have been battle-tested for years in the React/Vue/Svelte… land.  
> _NFE_ is a specialized component set with a fair amount of opinions. Its API surface is meant to be kept small and manageable for me. It's already easily extendable, but more of the core features should be configurable.  
> Feel free to give some feedback in the GitHub discussions :).

## Why?

Now that Web Components capabilities are very well-supported in major browsers and frontend frameworks, like **React 19**, we can leverage them to act as an interoperable _flow charts_ toolkit. On key piece can make this ultimately interoperable: the TC39 standard proposal for a **Signal primitive** for JavaScript.

As any standard proposal process, building stuff is the best way to explore the edges, as well as raising awareness of newfound capabilities.

Keep in mind this project is an exploration to prove that we can aim toward a bit more standardized front-end world, at least for the _edges_ of each universe, without necessarily emptying their core (in this case, reactivity). **Re-using complex components** across front-end stacks definitely has some appeal that out-weight the trade-off.

<!-- Flow graphs, with their "Flow/Node/Port/Edges" concepts embrace natu -->

## How?

At core, a flow is a signal-backed reactive store, a class instance which is the brain for your application state and actions.

You can **interact with the flow** via a **declarative configuration** (often at initialization)
or via an **imperative API**, for maximum interoperability with your parent application.

What make NFE special is its ability to "_project_" any HTML snippets into dedicated standard slots. Those slots are dynamically generated, derived from the flow instance state:

```html
<nf-node class="node" style="--dx:261px;--dy:-167px;z-index:0;">
  <slot name="node_num_1">
    <!-- Any rendering method for a DOM tree can belong here!-->
  </slot>
</nf-node>
```

<small>Here, `node_num_1` is just the name you gave for a particular node, with its seed setting.
BTW, naming nodes are optional, they get an UUID as a fallback.</small>

Once the node list **is bound to your rendering method** (React, Lit, Vanilla…), _NFE_ takes care
of positioning, pan and zooming, connecting ports…
Both your custom template and the _NFE_ tree are actionable at will, for **local** or **global** state, **with** or **without** side effects with flow/nodes/ports states.

Of course, _NFE_ is not as solidly integrated with your vendor UI framework as a dedicated solution could be, but that could change over time, if the JS signal proposal get more widespread.

<div class="git-only">

**Table of Contents**

- [Demo](#demo)
- [Why?](#why)
- [How?](#how)
- [Installation](#installation)
  - [Cherry-picking](#cherry-picking)
- [Quick Start](#quick-start)
- [Base Components](#base-components)
  - [Flow](#flow)
  - [Node](#node)
  - [Port](#port)
  - [Handle](#handle)
  - [Links](#links)
  - [Background](#background)
- [Themes](#themes)
  - [Default](#default)
  - [Web awesome](#web-awesome)
    - [Installation](#installation-1)
    - [Base components](#base-components-1)
      - [Node](#node-1)
      - [Port](#port-1)
    - [Extra components](#extra-components)
      - [Minimap](#minimap)
      - [Navigation](#navigation)
      - [Center](#center)
    - [Demo nodes](#demo-nodes)
- [Custom nodes](#custom-nodes)
- [Events](#events)
- [Serialization](#serialization)
- [With UI Libraries](#with-ui-libraries)
  - [React](#react)
    - [Typings](#typings)
    - [Signals](#signals)
    - [Hooks](#hooks)
      - [`useFlow`](#useflow)
      - [`useNode`](#usenode)
      - [`usePort`](#useport)
  - [Lit](#lit)
    - [Typings](#typings-1)
  - [Vue](#vue)
    - [Typings](#typings-2)
- [Type-safety](#type-safety)
- [Server rendering](#server-rendering)

</div>

## Installation

```sh
npm i @node-flow-elements/nfe
```

Then, you just have to import the HTML Elements alongside the `Flow` store, like this:

```ts
import { Flow } from '@node-flow-elements/nfe';

const flow = new Flow({
  /* options */
});
```

Importing `@node-flow-elements/nfe` will automatically register the base HTML elements for _NFE_, namely:

- `<nf-flow>`: Parent level, Flow element.
- `<nf-node>`: Children node elements (you won't use these directly).
- `<nf-handle>`: Helper that wraps draggable sensitive zones for each node.
- `<nf-port>`: Same as the handle, but for ports, from which you can connect nodes.

These core elements are headless (meaning they have little to no styles), and ubiquitous when using _NFE_.

Moreover, elements below are imported, too.

- `<nf-links>`: Used to draw the SVG paths for connections.
- `<nf-background>`: The canvas element where the grid is drawn.

They are not _strictly_ required, but they are nearly always used together with the core elements above, that's why they are included in the index barrel file for convenience.  
You'll also get with other useful exports, like types, events…

However, it's possible to precisely import just what you need, e.g. if you want to replace `<nf-background>` or `<nf-links>` totally.

### Cherry-picking

If you want to import the elements or stores independently, it can be achieved like this:

```ts
// This will import nf-flow, nf-node, nf-handle and nf-port elements together:
import '@node-flow-elements/nfe/flow.el';

// If you need them, too:
import '@node-flow-elements/nfe/links.el';
import '@node-flow-elements/nfe/background.el';

// When an element has an associated store, it's typically in a sibling file:
import { Flow } from '@node-flow-elements/nfe/flow';
import { Node } from '@node-flow-elements/nfe/node';
// ...

// Import your other elements, or the NFE provided themes…
```

**What about CSS?**

You don't need to import any CSS files (via your bundler).  
The small amount of CSS in core components is already embedded and well-scoped,
thanks to Web Components built-in capabilities.

However, these few bare styles are still [easily customizable](#default) via **CSS properties** and **shadow parts**.

---

If you want to use the [Web Awesome (formerly Shoelace) theme](#web-awesome) with its custom node set, you'll need some optional peer dependencies too.

## Quick Start

> [!TIP] We are using different syntax and engine for this guide:
>
> - **React** 19
> - **Lit** (bare)
> - **Lit JSX** (via a Vite/Babel plugin)
>
> **Lit JSX** is an experimental JSX transformer for Lit.  
> While it's stable for internal use (_NFE_ lib and website are written with Lit JSX!), it's not released yet. I think it's interesting to see it in action in _NFE_ doc. It serves as a **conceptual bridge** between React JSX and HTML template literals (which are not a Lit only concept, BTW).

Let's build a flow from scratch:

<demo-1 import="/src/flow/1/app-lit-jsx.tsx">

**React**

<div slot="react">

```tsx
// @filename: /src/flow/1/app-react.tsx

import { Flow } from '@node-flow-elements/nfe';

const flow = new Flow({
  initialNodes: [
    {
      id: 'Node_1',
      x: 100,
      y: 100,
      ports: {
        output: { connectedTo: [{ node: 'Node_2', port: 'input' }] },
      },
    },
    {
      id: 'Node_2',
      x: 400,
      y: 300,
      ports: {
        output: { connectedTo: [{ node: 'Node_3', port: 'input' }] },
      },
    },
    {
      id: 'Node_3',
      x: 700,
      y: 600,
    },
  ],
});

export const App = () => (
  <nf-flow flow={flow}>
    <nf-background slot="background" />

    {flow.nodes.map((node) => (
      <div
        key={node.id}
        slot={node.slotName}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          borderRadius: '1rem',
          padding: '1rem',
          backgroundColor: 'hsl(0 0% 10%)',
        }}
      >
        <nf-handle>
          <header>"{node.id}" (Drag me!)</header>
        </nf-handle>

        <div>
          <nf-port port={node.ports.input}>
            <Socket />
          </nf-port>
          Input
        </div>

        <div style={{ textAlign: 'right' }}>
          Output
          <nf-port port={node.ports.output}>
            <Socket />
          </nf-port>
        </div>
      </div>
    ))}

    <nf-links slot="foreground-interactive" />
  </nf-flow>
);

const Socket = () => (
  <svg viewBox="0 0 100 100" style={{ height: '1rem', width: '1rem' }}>
    <circle cx="50" cy="50" r="50" />
  </svg>
);
```

</div>

**Lit JSX**

<div slot="lit-jsx">

```tsx
// @filename: /src/flow/1/app-lit-jsx.tsx

import { For } from '@gracile-labs/jsx/components/for';
import { Flow } from '@node-flow-elements/nfe';

const flow = new Flow({
  initialNodes: [
    {
      id: 'Node_1',
      x: 100,
      y: 100,
      ports: {
        output: { connectedTo: [{ node: 'Node_2', port: 'input' }] },
      },
    },
    {
      id: 'Node_2',
      x: 400,
      y: 300,
      ports: {
        output: { connectedTo: [{ node: 'Node_3', port: 'input' }] },
      },
    },
    {
      id: 'Node_3',
      x: 700,
      y: 600,
    },
  ],
});

export const App = () => (
  <nf-flow prop:flow={flow}>
    <nf-background slot="background" />

    <For each={flow.nodes} key={(node) => node.id}>
      {(node) => (
        <div
          slot={node.slotName}
          style:map={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            borderRadius: '1rem',
            padding: '1rem',
            backgroundColor: 'hsl(0 0% 10%)',
          }}
        >
          <nf-handle>
            <header>"{node.id}" (Drag me!)</header>
          </nf-handle>

          <div>
            <nf-port prop:port={node.ports.input}>
              <Socket />
            </nf-port>
            Input
          </div>

          <div style:map={{ textAlign: 'right' }}>
            Output
            <nf-port prop:port={node.ports.output}>
              <Socket />
            </nf-port>
          </div>
        </div>
      )}
    </For>

    <nf-links slot="foreground-interactive" />
  </nf-flow>
);

const Socket = () => (
  <svg viewBox="0 0 100 100" style:map={{ height: '1rem', width: '1rem' }}>
    <circle cx="50" cy="50" r="50" />
  </svg>
);
```

</div>

**Lit**

<div slot="lit">

```ts
// @filename: /src/flow/1/app-lit.tsx

import { html } from '@lit-labs/signals';
import { repeat } from 'lit/directives/repeat.js';
import { styleMap } from 'lit/directives/style-map.js';

import { Flow } from '@node-flow-elements/nfe';

const flow = new Flow({
  initialNodes: [
    {
      id: 'Node_1',
      x: 100,
      y: 100,
      ports: {
        output: { connectedTo: [{ node: 'Node_2', port: 'input' }] },
      },
    },
    {
      id: 'Node_2',
      x: 400,
      y: 300,
      ports: {
        output: { connectedTo: [{ node: 'Node_3', port: 'input' }] },
      },
    },
    {
      id: 'Node_3',
      x: 700,
      y: 600,
    },
  ],
});

export const App = () => html`
  <nf-flow .flow=${flow}>
    <nf-background slot="background" />

    ${repeat(
      flow.nodes,
      (node) => node.id,
      (node) => html`
        <div
          slot=${node.slotName}
          style=${styleMap({
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            borderRadius: '1rem',
            padding: '1rem',
            backgroundColor: 'hsl(0 0% 10%)',
          })}
        >
          <nf-handle>
            <header>"${node.id}" (Drag me!)</header>
          </nf-handle>

          <div>
            <nf-port .port=${node.ports.input}>${Socket()}</nf-port>
            Input
          </div>

          <div style=${styleMap({ textAlign: 'right' })}>
            Output
            <nf-port .port=${node.ports.output}>${Socket()}</nf-port>
          </div>
        </div>
      `,
    )}

    <nf-links slot="foreground-interactive" />
  </nf-flow>
`;

const Socket = () =>
  html`<svg
    viewBox="0 0 100 100"
    style=${styleMap({ height: '1rem', width: '1rem' })}
  >
    <circle cx="50" cy="50" r="50" />
  </svg>`;
```

</div>

</demo-1>

Here is a breakdown of this snippet:

1. Create a new `Flow` instance.
2. Set some `initialNodes` to play with in its constructor.
3. Put a parent `<nf-flow>` element in our base `<App />` template.
4. Put an (optional) `<nf-background>` element in it, to make navigation more sensible.
5. Iterate on the children `flow.nodes` in the `<nf-flow>`. They will be put on corresponding slots, thanks to the `slot={node.slotName}` indicator.
6. Put up a node header that will also act as a draggable zone for it, thanks to the `<nf-handle>` element.
7. Make things a tad prettier and easier to interact with, by setting up some styles, and an SVG circle for the port socket.
8. Set up the input and output ports thanks to the `<nf-port>` element. We pass it the `node.port.{input,output}` property.
9. Put the `<nf-links>` element in the flow, so the cables are rendered.

We are using the default `Node` class here, which provides the bare minimum, like 1 input and 1 output ports. You are able to [extend it at your will](#custom-nodes) though.

## Base Components

### Flow

```ts
const flow = new Flow(/* options… */);
```

JSX

```tsx
const Template = () => (
  <main>
    <nf-flow flow={flow}>
      {/* 
        ...
       */}
    </nf-flow>
  </main>
);
```

Lit-HTML

```ts
const Template = () => html`
  <main>
    <nf-flow .flow=${flow}>
      <!--
        ...
       -->
    </nf-flow>
  </main>
`;
```

Lit-JSX

```tsx
const Template = () => (
  <main>
    <nf-flow prop:flow={flow}>
      {/*
        ...
       */}
    </nf-flow>
  </main>
);
```

### Node

TBD…

### Port

TBD…

### Handle

TBD…

### Links

TBD…

### Background

TBD…

## Themes

### Default

This is the CSS properties that you can easily customize, here with an extract from the WebAwesome theme:

```scss
.nf-my-theme {
  --nf-background-grid-line-colors: var(--sl-color-neutral-50);
  --nf-background-grid-line-width: 0.5;
  --nf-background-grid-line-spacing: 48;

  --nf-links-grid-stroke-main-color: var(--sl-color-neutral-500);
  --nf-links-grid-stroke-main-pulsing-color: var(--sl-color-green-300);
  --nf-links-grid-stroke-main-overlay-color: var(--sl-color-neutral-500);

  // ...
}
```

Once you apply this class to a parent, properties will trickle down to all the consuming _NFE_ elements.

See the [full API reference](/api/) for every possible CSS properties.

### Web awesome

> [!NOTE]  
> Web Awesome is Shoelace 3.0.  
> But as Web Awesome is just around the corner, we're using the Shoelace package while using the new name already.  
> This is to avoid near future refactoring.

#### Installation

Installing Shoelace and form generation/validation tools is required for the theme to load:

```sh
npm i @shoelace-style/shoelace @jsfe/shoelace ajv ajv-formats
```

If needed, see the [JSON Schema Form Element](https://github.com/json-schema-form-element/jsfe) and [Shoelace/WebAwesome](https://shoelace.style) documentations.

Then, you can import the package in your project:

```sh

import '@node-flow-elements/nfe/themes/webawesome';

# Optional, if you want to try pre-made nodes:
import '@node-flow-elements/nfe/themes/webawesome/demo-nodes';
```

You'll also need to load the CSS properties.

```scss
@import '@shoelace-style/shoelace/dist/themes/light.css';
@import '@shoelace-style/shoelace/dist/themes/dark.css';

// @import '@node-flow-elements/nfe/themes/webawesome/theme.css';
```

Don't forget to add the `sl-theme-{light,dark}` class where you need them, usually the parent `<html>` element, but it can be any HTML container where _NFE_ lives.  
You'll need to add a `nf-webawesome` class to the `<nf-flow>` (or a parent) as well, for _NFE_ specific styles injection.

```tsx
const Template = () => (
  <div class="sl-theme-dark">
    <nf-flow class="nf-webawesome">{/* ... */}</nf-flow>
  </div>
);
```

All of this CSS will not interfere with the rest of your HTML document, as it's only properties and element shadow parts (with a few classes for WebAwesome), so it's safe to put this class in upper level, for example if you want to style multiple flows, or you are using WebAwesome in other places than _NFE_ flows.

#### Base components

##### Node

TBD…

##### Port

TBD…

#### Extra components

##### Minimap

TBD…

##### Navigation

TBD…

##### Center

TBD…

#### Demo nodes

TBD…

## Custom nodes

```tsx
export class NumberNode extends Node {
  type = 'NumberNode';

  defaultDisplayName = 'Number generator';

  ports = {
    numberOut: this.addPort<number>({
      direction: 'out',
      customDisplayName: 'Number',
    }),
  };

  Template = () => (
    <my-node slot={this.slotName} prop:node={this}>
      {/* ... */}
    </my-node>
  );
}
```

## Events

TBD…

## Serialization

TBD…

## With UI Libraries

### React

```tsx
import { useFlow } from '@node-flow-elements/nfe/adapters/react';

function MyFlow() {
  useFlow(flow);

  return (
    <div style={{ width: '50rem', height: '50rem' }}>
      <nf-flow flow={flow}>
        <nf-background slot="background" />
        <nf-wa-center slot="background-interactive" />

        <nf-links slot="foreground-interactive" />

        <nf-wa-inventory slot="foreground" />
        <nf-wa-minimap slot="foreground" />
        <nf-wa-navigation slot="foreground" />
      </nf-flow>
    </div>
  );
}
```

#### Typings

Usage, in an ambient `d.ts` (e.g. `/src/ambient.d.ts`):

```ts
declare global {
  declare module 'react' {
    namespace JSX {
      interface IntrinsicElements extends Nfe {}
    }
  }
}
type Nfe = import('@node-flow-elements/nfe/types/react').NodeFlowElements;
```

#### Signals

#### Hooks

##### `useFlow`

```tsx
import { useFlow } from '@node-flow-elements/nfe/adapters/react';

export const flow = new Flow();

function MyFlow() {
  useFlow(flow);

  return (
    <div>
      <button
        onClick={() => flow.setIsContextMenuVisible(!flow.isContextMenuVisible)}
      >
        Switch menu
      </button>

      {flow.isContextMenuVisible ? 'Visible' : 'Invisible'}

      <nf-flow flow={flow}>
        {/*
          ...
         */}
      </nf-flow>
    </div>
  );
}
```

##### `useNode`

TBD…

##### `usePort`

TBD…

### Lit

#### Typings

TBD…

<!-- ##### HTML template -->

<!-- ##### JSX -->

<!-- #### Signals -->

### Vue

#### Typings

Usage, in an ambient `d.ts`:

```ts
import type { NodeFlowElements } from '@node-flow-elements/nfe/types/vue';

declare module 'vue' {
  interface GlobalComponents extends NodeFlowElements {}
}
```

To avoid Vue warnings about unrecognized elements, see [Skipping Component Resolution](https://vuejs.org/guide/extras/web-components#skipping-component-resolution) in the Vue docs.

## Type-safety

_NFE_ is entirely written in TypeScript, and aim for the strictest API, while being aware of your customizations.

All of the `Flow`, `Node`, `Port` actions, custom node list, etc. are well-typed and respond to your configuration dynamically, like the node types or the port metadata.

But not only, besides the store, the custom HTML elements themselves are strictly typed, as soon as you set up a few lines of **ambient declarations** for **React**, **Vue**, etc.
And as usually, if you use Lit HTML templates, you'll have the Lit Analyzer tool-set at hand for properties and slots auto-completion, validation….

This will help to prevent mistakes when setting **properties** and **slots** in your views.

See the dedicated TypeScript section for your UI framework, if it's listed.  
Note that it's not much work to make Custom HTML elements typings to work with any UI framework, as soon as your its tooling can extend the HTML Elements tag map, usually via an ambient declaration.

## Server rendering

For now, it's not supported. But it is planned to pre-render as many things as possible via Lit SSR.  
Your nodes and others custom components in slots are still rendered with your UI framework, not by Lit, so the static marker is already there. If you have content in it (e.g. to cater for SEO), that will be present in the initial static markup. You will need to add a bit of styling, before the Custom HTML Element is connected to the document.

---

License ISC — Made by [Julian Cataldo](https://github.com/JulianCataldo).
