// NOTE: This is a bare page for testing a full-blown flow.

'use html-signal';
import { defineRoute } from '@gracile/gracile/route';
import { document } from '../document.jsx';

export default defineRoute({
  document,

  template: () => (
    <main>
      <div style="width:100%; height: 14rem">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Error qui ullam
        quam iusto quia quidem ipsam id suscipit, ipsa nostrum repellat quis?
        Iste, dignissimos quia facilis officia repellendus fugit rem?
      </div>

      <div style="width:100%; height: 54rem">
        <demo-nf-wa />
      </div>
    </main>
  ),
});
