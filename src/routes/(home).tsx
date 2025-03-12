'use html-signal';
import { defineRoute } from '@gracile/gracile/route';
import { document } from '../document.js';
import * as readme from '../../README.md';
import { SideMenu } from '../features/side-menu.jsx';

// prettier-ignore
const title = <><span>{'<'}</span>Node<span>-</span>Flow<span>-</span>Elements<span>{'>'}</span></>

export default defineRoute({
  document: () => document(),

  template: () => (
    <div class="root">
      <SideMenu
        toc={readme.meta.tableOfContents.at(0)?.children || []}
        title={title}
      />
      <main class="main">
        <article unsafe:html={readme.body.html} />
        <hr />
        This documentation was built with{' '}
        <a href="https://gracile.js.org">Gracile</a>.
      </main>
    </div>
  ),
});
