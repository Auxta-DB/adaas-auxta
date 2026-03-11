/**
 * fs.browser.ts
 *
 * Browser stub for fs/path — file-system access is not available in browsers.
 * EnvUtil.load() becomes a no-op so the SDK still initialises cleanly;
 * configuration must be passed directly via the constructor instead.
 */

export function pathResolve(..._segments: string[]): string {
    return '';
}

export function fileExists(_absolutePath: string): boolean {
    return false;
}

export function readFile(_absolutePath: string): string {
    return '';
}
