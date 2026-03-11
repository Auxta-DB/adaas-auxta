/**
 * buffer.node.ts
 *
 * Node.js implementation of the buffer polyfill.
 * Re-exports the native Node.js `Buffer` class and its utilities unchanged.
 */
export { Buffer } from 'node:buffer';

export function byteLength(string: string, encoding: BufferEncoding = 'utf8'): number {
    return Buffer.byteLength(string, encoding);
}
