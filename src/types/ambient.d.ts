/// <reference types="@gracile/gracile/ambient" />
/// <reference types="@gracile/markdown/ambient" />
/// <reference types="@gracile/svg/ambient" />

import type { CustomElements } from './jsx.js';
import type { CustomElements as CustomElementsVendor } from './jsx-vendor.js';

declare global {
  export namespace JSX {
    interface IntrinsicElements extends CustomElements, CustomElementsVendor {}
  }
}
