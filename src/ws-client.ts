// NOTE: This is a work in progress for Server/Client communication.

import { hc } from 'hono/client';

import type { app } from '../server/server.js';

const client = hc<typeof app>('http://localhost:8787');
export const ws = client.ws.$ws(0);

ws.addEventListener('open', () => {
  // setInterval(() => {
  //   ws.send(new Date().toString());
  // }, 1000);
});
