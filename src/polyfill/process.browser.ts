/**
 * process.browser.ts
 *
 * Browser stub for `process.env`.
 * Provides an in-memory key/value store so all `process.env.AUXTA_*` reads
 * in Global.constants.ts return `undefined` and fall back to their defaults.
 *
 * Browser consumers can populate values before instantiating Auxta by
 * importing and writing to this store directly, or by passing config
 * explicitly to the Auxta constructor (recommended).
 */

const _env: Record<string, string | undefined> = {};

export const env: Record<string, string | undefined> = new Proxy(_env, {
    get(target, key: string) {
        return target[key];
    },
    set(target, key: string, value: string | undefined) {
        target[key] = value;
        return true;
    },
    has(target, key: string) {
        return key in target;
    },
});
