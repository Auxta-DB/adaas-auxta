/**
 * net.node.ts
 *
 * Node.js implementation of the net polyfill.
 * Re-exports the native `node:net` Socket so TCPClient works unchanged.
 */
export { Socket } from 'node:net';
export type { Socket as ISocket } from 'node:net';
