import { createNodeWebSocket } from '@hono/node-ws';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';

import { Flow } from '../src/lib/flow.js';

export const app = new Hono();

const flow = new Flow();

console.log({ flow });

const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

app.get(
  '/ws',
  upgradeWebSocket((c) => ({
    onMessage(event, ws) {
      // console.log(`Message from client: ${event.data}`);
      console.log(JSON.parse(event.data));
      ws.send('Hello from server!');
    },
    onClose: () => {
      console.log('Connection closed');
    },
  })),
);

const server = serve({ fetch: app.fetch, port: 8787 });
injectWebSocket(server);

console.log(server.address());

export type WebSocketApp = typeof app;
