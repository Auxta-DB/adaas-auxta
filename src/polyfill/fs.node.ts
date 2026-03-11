/**
 * fs.node.ts
 *
 * Node.js implementation of the fs/path polyfill for EnvUtil.
 * Uses native node:fs and node:path.
 */
import * as fs from 'node:fs';
import * as nodePath from 'node:path';

export function pathResolve(...segments: string[]): string {
    return nodePath.resolve(...segments);
}

export function fileExists(absolutePath: string): boolean {
    return fs.existsSync(absolutePath);
}

export function readFile(absolutePath: string): string {
    return fs.readFileSync(absolutePath, 'utf-8');
}
