# `src/lib/background.el.tsx`:

## class: `NfBackgroundElement`, `nf-background`

### Fields

| Name   | Privacy | Type                                 | Default | Description | Inherited From |
| ------ | ------- | ------------------------------------ | ------- | ----------- | -------------- |
| `slot` |         | `(typeof Nfe)['SLOT']['background']` |         |             |                |
| `flow` | public  | `GenericFlow \| undefined`           |         |             |                |

### CSS Properties

| Name                                | Default   | Description |
| ----------------------------------- | --------- | ----------- |
| `--nf-background-grid-line-colors`  | `#191919` |             |
| `--nf-background-grid-line-width`   | `1`       |             |
| `--nf-background-grid-line-spacing` | `64`      |             |

<hr/>

# `src/lib/canvas.el.tsx`:

## class: `NfCanvasElement`, `nf-interactive-canvas`

### Static Fields

| Name         | Privacy | Type                                                                | Default                                                   | Description | Inherited From |
| ------------ | ------- | ------------------------------------------------------------------- | --------------------------------------------------------- | ----------- | -------------- |
| `SLOT_NAMES` | public  | `{
    background: 'background',
    foreground: 'foreground',
  }` | `{ background: 'background', foreground: 'foreground', }` |             |                |

### Fields

| Name   | Privacy | Type   | Default | Description | Inherited From |
| ------ | ------- | ------ | ------- | ----------- | -------------- |
| `flow` | public  | `Flow` |         |             |                |

<hr/>

# `src/lib/flow.el.tsx`:

## class: `NfFlowElement`, `nf-flow`

### Static Fields

| Name   | Privacy | Type | Default     | Description | Inherited From |
| ------ | ------- | ---- | ----------- | ----------- | -------------- |
| `SLOT` | public  |      | `FLOW_SLOT` |             |                |

### Fields

| Name   | Privacy | Type             | Default | Description | Inherited From |
| ------ | ------- | ---------------- | ------- | ----------- | -------------- |
| `flow` | public  | `Flow<any, any>` |         |             |                |

### Slots

| Name                     | Description |
| ------------------------ | ----------- |
| `background`             |             |
| `background-interactive` |             |
| `foreground`             |             |
| `foreground-interactive` |             |

<hr/>

# `src/lib/handle.el.tsx`:

## class: `NfHandleElement`, `nf-handle`

### Fields

| Name       | Privacy | Type      | Default | Description | Inherited From |
| ---------- | ------- | --------- | ------- | ----------- | -------------- |
| `[HANDLE]` | public  | `boolean` | `true`  |             |                |

<hr/>

# `src/lib/links.el.tsx`:

## class: `NfLinksElement`, `nf-links`

### Fields

| Name   | Privacy | Type                                    | Default | Description | Inherited From |
| ------ | ------- | --------------------------------------- | ------- | ----------- | -------------- |
| `slot` |         | `(typeof Nfe)['SLOT']['fgInteractive']` |         |             |                |
| `flow` | public  | `GenericFlow \| undefined`              |         |             |                |

<hr/>

# `src/lib/node.el.tsx`:

## class: `NfNodeElement`, `nf-node`

### Fields

| Name     | Privacy | Type      | Default | Description | Inherited From |
| -------- | ------- | --------- | ------- | ----------- | -------------- |
| `[NODE]` | public  | `boolean` | `true`  |             |                |
| `node`   | public  | `Node`    |         |             |                |

<hr/>

# `src/lib/port.el.tsx`:

## class: `NfPortElement`, `nf-port`

### Fields

| Name          | Privacy | Type                       | Default | Description | Inherited From |
| ------------- | ------- | -------------------------- | ------- | ----------- | -------------- |
| `[PORT]`      | public  | `boolean`                  | `true`  |             |                |
| `port`        | public  | `GenericPort \| undefined` |         |             |                |
| `cableOffset` | public  | `number \| undefined`      |         |             |                |

### Attributes

| Name          | Field       | Inherited From |
| ------------- | ----------- | -------------- |
| `cableOffset` | cableOffset |                |

<hr/>

# `src/lib/themes/lit-renderer.el.ts`:

## class: `LitRenderer`, `lit-renderer`

### Fields

| Name       | Privacy | Type                   | Default | Description | Inherited From |
| ---------- | ------- | ---------------------- | ------- | ----------- | -------------- |
| `template` | public  | `unknown \| undefined` |         |             |                |

<hr/>

# `src/lib/themes/webawesome/demo-nodes/broadcast-channel.el.tsx`:

## class: `NfWaBroadcastChannelNode`

### Fields

| Name                 | Privacy | Type     | Default                                                                                                                                                       | Description | Inherited From |
| -------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | -------------- |
| `type`               | public  | `string` | `'NfWaBroadcastChannelNode'`                                                                                                                                  |             |                |
| `defaultDisplayName` | public  | `string` | `'Broadcast'`                                                                                                                                                 |             |                |
| `defaultIcon`        | public  | `string` | `'broadcast-pin'`                                                                                                                                             |             |                |
| `ports`              | public  | `object` | `{ messageInput: this.addPort({ direction: 'in', customDisplayName: 'TX', }), messageOutput: this.addPort({ direction: 'out', customDisplayName: 'RX', }), }` |             |                |
| `defaultValue`       |         | `string` | `'main'`                                                                                                                                                      |             |                |
| `Template`           | public  |          |                                                                                                                                                               |             |                |

<hr/>

## class: `NfWaBroadcastChannelElement`, `wf-broadcast-channel`

### Fields

| Name            | Privacy | Type        | Default  | Description | Inherited From |
| --------------- | ------- | ----------- | -------- | ----------- | -------------- |
| `messageInput`  |         | `Port<any>` |          |             |                |
| `messageOutput` |         | `Port<any>` |          |             |                |
| `channel`       |         | `string`    | `'main'` |             |                |

<hr/>

# `src/lib/themes/webawesome/demo-nodes/canvas-color.el.tsx`:

## class: `NfWaCanvasColorNode`

### Fields

| Name                 | Privacy | Type     | Default                                                                                                                                                                                                                 | Description | Inherited From |
| -------------------- | ------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | -------------- |
| `type`               | public  | `string` | `'NfWaCanvasColorNode'`                                                                                                                                                                                                 |             |                |
| `defaultDisplayName` | public  | `string` | `'Solid color'`                                                                                                                                                                                                         |             |                |
| `defaultIcon`        | public  | `string` | `'alphabet-uppercase'`                                                                                                                                                                                                  |             |                |
| `ports`              | public  | `object` | `{ text: this.addPort<TextPort>({ direction: 'in', customDisplayName: 'Text', metadata: { schema: textPortSchema }, }), canvas: this.addPort<HTMLCanvasElement>({ direction: 'out', customDisplayName: 'Canvas', }), }` |             |                |
| `Template`           | public  |          |                                                                                                                                                                                                                         |             |                |

<hr/>

## class: `NfWaCanvasColorElement`, `nf-canvas-color`

### Fields

| Name        | Privacy | Type                              | Default     | Description | Inherited From |
| ----------- | ------- | --------------------------------- | ----------- | ----------- | -------------- |
| `canvasOut` |         | `Port<HTMLCanvasElement> \| null` | `null`      |             |                |
| `textIn`    |         | `Port<TextPort> \| null`          | `null`      |             |                |
| `color`     |         | `string`                          | `'#45001d'` |             |                |

### Methods

| Name   | Privacy | Description | Parameters | Return | Inherited From |
| ------ | ------- | ----------- | ---------- | ------ | -------------- |
| `draw` |         |             |            |        |                |

<hr/>

# `src/lib/themes/webawesome/demo-nodes/canvas-comparer.el.tsx`:

## class: `NfWaCanvasComparerNode`

### Fields

| Name                 | Privacy | Type     | Default                                                                                                                                                                                                 | Description | Inherited From |
| -------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | -------------- |
| `type`               | public  | `string` | `'NfWaCanvasComparerNode'`                                                                                                                                                                              |             |                |
| `defaultDisplayName` | public  | `string` | `'A/B Comparer'`                                                                                                                                                                                        |             |                |
| `defaultIcon`        | public  | `string` | `'layout-split'`                                                                                                                                                                                        |             |                |
| `ports`              | public  | `object` | `{ canvasBefore: this.addPort<HTMLCanvasElement>({ direction: 'in', customDisplayName: 'Before', }), canvasAfter: this.addPort<HTMLCanvasElement>({ direction: 'in', customDisplayName: 'After', }), }` |             |                |
| `Template`           | public  |          |                                                                                                                                                                                                         |             |                |

<hr/>

## class: `NfWaCanvasComparerElement`, `nf-wa-canvas-comparer`

### Fields

| Name             | Privacy | Type                      | Default | Description | Inherited From |
| ---------------- | ------- | ------------------------- | ------- | ----------- | -------------- |
| `canvasBeforeIn` |         | `Port<HTMLCanvasElement>` |         |             |                |
| `canvasAfterIn`  |         | `Port<HTMLCanvasElement>` |         |             |                |
| `blurFactor`     |         | `number`                  | `5`     |             |                |

### Methods

| Name   | Privacy | Description | Parameters | Return | Inherited From |
| ------ | ------- | ----------- | ---------- | ------ | -------------- |
| `draw` |         |             |            |        |                |

<hr/>

# `src/lib/themes/webawesome/demo-nodes/canvas-filters.el.tsx`:

## class: `NfWaCanvasFiltersNode`

### Fields

| Name                 | Privacy | Type     | Default                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Description | Inherited From |
| -------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | -------------- |
| `type`               | public  | `string` | `'NfWaCanvasFiltersNode'`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |             |                |
| `defaultDisplayName` | public  | `string` | `'Filters'`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |             |                |
| `defaultIcon`        | public  | `string` | `'shadows'`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |             |                |
| `helpText`           | public  | `string` | `'Cool canvas filters…'`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |             |                |
| `ports`              | public  | `object` | `{ blurIn: this.addPort<NumberPort>({ direction: 'in', customDisplayName: 'Blur (px)', metadata: { schema: { title: 'Blur', type: 'number', minimum: 0, maximum: 25, default: 15, }, }, }), brightnessIn: this.addPort<NumberPort>({ direction: 'in', customDisplayName: 'Brightness (%)', metadata: { schema: { title: 'Brightness', type: 'number', minimum: 0, maximum: 100, default: 75, }, }, }), canvasIn: this.addPort<HTMLCanvasElement>({ direction: 'in', customDisplayName: 'Canvas', // TODO: validate }), canvasOut: this.addPort<HTMLCanvasElement>({ direction: 'out', customDisplayName: 'Result', }), }` |             |                |
| `Template`           | public  |          |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |             |                |

<hr/>

## class: `NfWaCanvasFiltersElement`, `nf-wa-canvas-filters`

### Fields

| Name           | Privacy | Type                                        | Default | Description | Inherited From |
| -------------- | ------- | ------------------------------------------- | ------- | ----------- | -------------- |
| `canvasIn`     |         | `Port<HTMLCanvasElement, PortsWithSchema>`  |         |             |                |
| `canvasOut`    |         | `Port<HTMLCanvasElement, PortsWithSchema>`  |         |             |                |
| `blurIn`       |         | `Port<
    number,
    PortsWithSchema   >` |         |             |                |
| `brightnessIn` |         | `Port<number, PortsWithSchema>`             |         |             |                |

### Methods

| Name   | Privacy | Description | Parameters | Return | Inherited From |
| ------ | ------- | ----------- | ---------- | ------ | -------------- |
| `draw` |         |             |            |        |                |

<hr/>

# `src/lib/themes/webawesome/demo-nodes/canvas-mixer.el.tsx`:

## class: `NfWaCanvasMixerNode`

### Fields

| Name                 | Privacy | Type     | Default                                                                                                                                                                                                                                                                                                 | Description | Inherited From |
| -------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | -------------- |
| `type`               | public  | `string` | `'NfWaCanvasMixerNode'`                                                                                                                                                                                                                                                                                 |             |                |
| `defaultDisplayName` | public  | `string` | `'Mixer'`                                                                                                                                                                                                                                                                                               |             |                |
| `defaultIcon`        | public  | `string` | `'transparency'`                                                                                                                                                                                                                                                                                        |             |                |
| `ports`              | public  | `object` | `{ canvasAIn: this.addPort<HTMLCanvasElement>({ direction: 'in', customDisplayName: 'Canvas A', }), canvasBIn: this.addPort<HTMLCanvasElement>({ direction: 'in', customDisplayName: 'Canvas B', }), canvasOut: this.addPort<HTMLCanvasElement>({ direction: 'out', customDisplayName: 'Result', }), }` |             |                |
| `Template`           | public  |          |                                                                                                                                                                                                                                                                                                         |             |                |

<hr/>

## class: `NfWaCanvasMixerElement`, `wf-canvas-mixer`

### Fields

| Name        | Privacy | Type                              | Default | Description | Inherited From |
| ----------- | ------- | --------------------------------- | ------- | ----------- | -------------- |
| `canvasAIn` |         | `Port<HTMLCanvasElement> \| null` | `null`  |             |                |
| `canvasBIn` |         | `Port<HTMLCanvasElement> \| null` | `null`  |             |                |
| `canvasOut` |         | `Port<HTMLCanvasElement> \| null` | `null`  |             |                |

### Methods

| Name   | Privacy | Description | Parameters | Return | Inherited From |
| ------ | ------- | ----------- | ---------- | ------ | -------------- |
| `draw` |         |             |            |        |                |

<hr/>

# `src/lib/themes/webawesome/demo-nodes/canvas-text.el.tsx`:

## class: `NfWaCanvasTextNode`

### Fields

| Name                 | Privacy | Type     | Default                                                                                                                                                                                                                 | Description | Inherited From |
| -------------------- | ------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | -------------- |
| `type`               | public  | `string` | `'NfWaCanvasTextNode'`                                                                                                                                                                                                  |             |                |
| `defaultDisplayName` | public  | `string` | `'Text'`                                                                                                                                                                                                                |             |                |
| `defaultIcon`        | public  | `string` | `'alphabet-uppercase'`                                                                                                                                                                                                  |             |                |
| `ports`              | public  | `object` | `{ text: this.addPort<TextPort>({ direction: 'in', customDisplayName: 'Text', metadata: { schema: textPortSchema }, }), canvas: this.addPort<HTMLCanvasElement>({ direction: 'out', customDisplayName: 'Canvas', }), }` |             |                |
| `Template`           | public  |          |                                                                                                                                                                                                                         |             |                |

<hr/>

## class: `NfWaCanvasTextElement`, `nf-canvas-text`

### Fields

| Name        | Privacy | Type                              | Default | Description | Inherited From |
| ----------- | ------- | --------------------------------- | ------- | ----------- | -------------- |
| `canvasOut` |         | `Port<HTMLCanvasElement> \| null` | `null`  |             |                |
| `textIn`    |         | `Port<TextPort> \| null`          | `null`  |             |                |

### Methods

| Name   | Privacy | Description | Parameters | Return | Inherited From |
| ------ | ------- | ----------- | ---------- | ------ | -------------- |
| `draw` |         |             |            |        |                |

<hr/>

# `src/lib/themes/webawesome/demo-nodes/display-number.el.tsx`:

## class: `NfWaDisplayNumberNode`

### Fields

| Name                 | Privacy | Type     | Default                                                                                                                         | Description | Inherited From |
| -------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------- | -------------- |
| `type`               | public  | `string` | `'NfWaDisplayNumberNode'`                                                                                                       |             |                |
| `defaultDisplayName` | public  | `string` | `'Display'`                                                                                                                     |             |                |
| `defaultIcon`        | public  | `string` | `'clipboard-pulse'`                                                                                                             |             |                |
| `ports`              | public  | `object` | `{ number: this.addPort<unknown>({ direction: 'in', customDisplayName: 'Number', metadata: { schema: numberPortSchema }, }), }` |             |                |
| `Template`           | public  |          |                                                                                                                                 |             |                |

<hr/>

# `src/lib/themes/webawesome/demo-nodes/note.el.tsx`:

## class: `NfWaNoteNode`

### Fields

| Name                 | Privacy | Type     | Default                                                                             | Description | Inherited From |
| -------------------- | ------- | -------- | ----------------------------------------------------------------------------------- | ----------- | -------------- |
| `type`               | public  | `string` | `'NfWaNoteNode'`                                                                    |             |                |
| `defaultDisplayName` | public  | `string` | `'Sticky note'`                                                                     |             |                |
| `defaultIcon`        | public  | `string` | `'sticky'`                                                                          |             |                |
| `ports`              | public  | `object` | `{ text: this.addPort<string>({ direction: 'in', metadata: { hidden: true }, }), }` |             |                |
| `Template`           | public  |          |                                                                                     |             |                |

<hr/>

## class: `NfWaNoteElement`, `nf-wa-note`

### Fields

| Name          | Privacy | Type     | Default | Description | Inherited From |
| ------------- | ------- | -------- | ------- | ----------- | -------------- |
| `textContent` |         | `string` | `''`    |             |                |

<hr/>

# `src/lib/themes/webawesome/demo-nodes/number.el.tsx`:

## class: `NfWaNumberNode`

### Fields

| Name                 | Privacy | Type     | Default                                                                                                                                                                                               | Description | Inherited From |
| -------------------- | ------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | -------------- |
| `type`               | public  | `string` | `'NfWaNumberNode'`                                                                                                                                                                                    |             |                |
| `defaultDisplayName` | public  | `string` | `'Number Input'`                                                                                                                                                                                      |             |                |
| `defaultIcon`        | public  | `string` | `'input-cursor'`                                                                                                                                                                                      |             |                |
| `ports`              | public  | `object` | `{ number: this.addPort<number>({ direction: 'out', customDisplayName: 'Number', validate: schemas.numberPortValidator, // FIXME: // value: 3, metadata: { schema: schemas.numberPortSchema }, }), }` |             |                |
| `Template`           | public  |          |                                                                                                                                                                                                       |             |                |

<hr/>

# `src/lib/themes/webawesome/demo-nodes/operation.el.tsx`:

## class: `NfWaOperationNode`

### Static Fields

| Name         | Privacy | Type                                                          | Default                                     | Description | Inherited From |
| ------------ | ------- | ------------------------------------------------------------- | ------------------------------------------- | ----------- | -------------- |
| `operations` | public  | `[
    'Sum',
    'Divide',
    'Minus',
    'Multiply',
  ]` | `[ 'Sum', 'Divide', 'Minus', 'Multiply', ]` |             |                |

### Fields

| Name                 | Privacy | Type     | Default                                                                                                                                                                                                                                                                                                                                                                                                                                               | Description | Inherited From |
| -------------------- | ------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | -------------- |
| `type`               | public  | `string` | `'NfWaOperationNode'`                                                                                                                                                                                                                                                                                                                                                                                                                                 |             |                |
| `defaultDisplayName` | public  | `string` | `'Operation'`                                                                                                                                                                                                                                                                                                                                                                                                                                         |             |                |
| `defaultIcon`        | public  | `string` | `'calculator'`                                                                                                                                                                                                                                                                                                                                                                                                                                        |             |                |
| `foo`                |         | `string` | `'foo'`                                                                                                                                                                                                                                                                                                                                                                                                                                               |             |                |
| `ports`              | public  | `object` | `{ numberA: this.addPort<NumberPort>({ direction: 'in', customDisplayName: 'Operand A', validate: numberPortValidator, metadata: { schema: schemas.numberPortSchema }, }), numberB: this.addPort<NumberPort>({ direction: 'in', customDisplayName: 'Operand B', validate: numberPortValidator, metadata: { schema: schemas.numberPortSchema }, }), result: this.addPort<NumberPort>({ direction: 'out', customDisplayName: 'Result', value: 0, }), }` |             |                |
| `$currentOperation`  | public  |          |                                                                                                                                                                                                                                                                                                                                                                                                                                                       |             |                |
| `Template`           | public  |          |                                                                                                                                                                                                                                                                                                                                                                                                                                                       |             |                |

### Methods

| Name              | Privacy | Description | Parameters                                                                | Return | Inherited From |
| ----------------- | ------- | ----------- | ------------------------------------------------------------------------- | ------ | -------------- |
| `changeOperation` | public  |             | `operation: Operation`                                                    | `void` |                |
| `updateResult`    | public  |             |                                                                           | `void` |                |
| `fromJSON`        | public  |             | `options: NodeSerializableOptions<this, { initialOperation: Operation }>` | `void` |                |

<hr/>

# `src/lib/themes/webawesome/demo-nodes/text.el.tsx`:

## class: `NfWaTextNode`

### Fields

| Name                 | Privacy | Type     | Default                                                                                                                           | Description | Inherited From |
| -------------------- | ------- | -------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------- | -------------- |
| `type`               | public  | `string` | `'NfWaTextNode'`                                                                                                                  |             |                |
| `defaultDisplayName` | public  | `string` | `'Text Input'`                                                                                                                    |             |                |
| `defaultIcon`        | public  | `string` | `'input-cursor'`                                                                                                                  |             |                |
| `ports`              | public  | `object` | `{ textOutput: this.addPort<TextPort>({ direction: 'out', customDisplayName: 'Text', metadata: { schema: textPortSchema }, }), }` |             |                |
| `Template`           | public  |          |                                                                                                                                   |             |                |

<hr/>

# `src/lib/themes/webawesome/extra/center.el.tsx`:

## class: `NfWaCenterElement`, `nf-wa-center`

### Fields

| Name   | Privacy | Type                                    | Default | Description | Inherited From |
| ------ | ------- | --------------------------------------- | ------- | ----------- | -------------- |
| `slot` |         | `(typeof Nfe)['SLOT']['bgInteractive']` |         |             |                |
| `flow` |         | `GenericFlow`                           |         |             |                |

<hr/>

# `src/lib/themes/webawesome/extra/inventory.el.tsx`:

## class: `NfWaInventoryElement`, `nf-wa-inventory`

### Fields

| Name        | Privacy | Type                                 | Default | Description | Inherited From |
| ----------- | ------- | ------------------------------------ | ------- | ----------- | -------------- |
| `slot`      |         | `(typeof Nfe)['SLOT']['foreground']` |         |             |                |
| `flow`      |         | `GenericFlow`                        |         |             |                |
| `MenuPanel` |         |                                      |         |             |                |

<hr/>

# `src/lib/themes/webawesome/extra/minimap.el.tsx`:

## class: `NfWaMinimapElement`, `nf-wa-minimap`

### Fields

| Name           | Privacy | Type                                 | Default | Description | Inherited From |
| -------------- | ------- | ------------------------------------ | ------- | ----------- | -------------- |
| `slot`         |         | `(typeof Nfe)['SLOT']['foreground']` |         |             |                |
| `flow`         |         | `GenericFlow`                        |         |             |                |
| `scale`        |         | `number`                             | `10`    |             |                |
| `width`        |         | `number`                             | `256`   |             |                |
| `height`       |         | `number`                             | `256`   |             |                |
| `updateCanvas` |         |                                      |         |             |                |

### Attributes

| Name     | Field  | Inherited From |
| -------- | ------ | -------------- |
| `width`  | width  |                |
| `height` | height |                |

<hr/>

# `src/lib/themes/webawesome/extra/navigation.el.tsx`:

## class: `NfWaNavigationElement`, `nf-wa-navigation`

### Fields

| Name   | Privacy | Type                                 | Default | Description | Inherited From |
| ------ | ------- | ------------------------------------ | ------- | ----------- | -------------- |
| `slot` |         | `(typeof Nfe)['SLOT']['foreground']` |         |             |                |
| `flow` |         | `GenericFlow`                        |         |             |                |

<hr/>

# `src/lib/themes/webawesome/node.el.tsx`:

## class: `NfWaNodeElement`, `nf-wa-node`

### Fields

| Name                        | Privacy | Type          | Default | Description | Inherited From |
| --------------------------- | ------- | ------------- | ------- | ----------- | -------------- |
| `isNodeInfosEditModeActive` |         | `boolean`     | `false` |             |                |
| `isDeleting`                |         | `boolean`     | `false` |             |                |
| `node`                      |         | `GenericNode` |         |             |                |

<hr/>

# `src/lib/themes/webawesome/port.el.tsx`:

## class: `NfWaPortElement`, `nf-wa-port`

### Fields

| Name   | Privacy | Type   | Default | Description | Inherited From |
| ------ | ------- | ------ | ------- | ----------- | -------------- |
| `port` |         | `Port` |         |             |                |

<hr/>
