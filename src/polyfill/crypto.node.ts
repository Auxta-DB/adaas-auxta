/**
 * crypto.node.ts
 *
 * Node.js implementation of the crypto polyfill.
 * Uses the native `node:crypto` module.
 */
import nodeCrypto from 'node:crypto';

export function createHash(algorithm: string) {
    return nodeCrypto.createHash(algorithm);
}

export function randomUUID(): string {
    return nodeCrypto.randomUUID();
}
