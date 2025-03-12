// NOTE: Not working for now, keeping it to fix it somehow.

'use html-signal';
import { defineRoute } from '@gracile/gracile/route';
import { document } from '../document.jsx';
import * as elements from '../../custom-elements.md';
import { SideMenu } from '../features/side-menu.jsx';

const title = 'Custom Elements';
export default defineRoute({
  document: () => document({ title }),

  template: () => (
    <div class="root">
      {/* <SideMenu toc={elements.meta.tableOfContents} title={title} /> */}

      <main class="main">
        {/* <article unsafe:html={elements.body.html} /> */}
      </main>
      {/* <wc-dox tag="nf-flow"></wc-dox> */}
      {/* <wc-dox tag="nf-flow"></wc-dox> */}

      {/* <wc-dox component-name="NfBackgroundElement"></wc-dox> */}

      {/* <wc-css-parts tag="my-element"></wc-css-parts> */}
    </div>
  ),
});
