/**
 * crypto.browser.ts
 *
 * Browser implementation of the crypto polyfill.
 * Uses the Web Crypto API (`globalThis.crypto`) which is available in all
 * modern browsers and in Node 19+ globals — no import needed.
 */

export function createHash(algorithm: string) {
    // Web Crypto is async-only, so we implement a sync-compatible shim
    // using a streaming digest approach backed by SubtleCrypto.
    // For the call sites that need `.update(input).digest('hex')` we
    // return a synchronous-looking builder that resolves lazily.

    let _input = '';

    return {
        update(data: string) {
            _input += data;
            return this;
        },
        digest(encoding: 'hex' | 'base64'): string {
            // Synchronous fallback: use a pure-JS SHA-256 for browser bundles.
            // This avoids a mandatory async path while keeping zero dependencies.
            const hash = sha256(_input);
            if (encoding === 'hex') return hash;
            // base64 from hex bytes
            const bytes = new Uint8Array(hash.match(/.{2}/g)!.map(b => parseInt(b, 16)));
            return btoa(String.fromCharCode(...bytes));
        },
    };
}

export function randomUUID(): string {
    return globalThis.crypto.randomUUID();
}

// ---------------------------------------------------------------------------
// Pure-JS SHA-256 (RFC 6234) — ~60 lines, no dependencies
// ---------------------------------------------------------------------------
function sha256(message: string): string {
    const K = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
        0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
        0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
        0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
        0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
        0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
        0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
        0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
        0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
    ];

    const H = [
        0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
        0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
    ];

    // Encode message as UTF-8
    const bytes: number[] = [];
    for (let i = 0; i < message.length; i++) {
        const code = message.charCodeAt(i);
        if (code < 0x80) bytes.push(code);
        else if (code < 0x800) { bytes.push(0xc0 | (code >> 6)); bytes.push(0x80 | (code & 0x3f)); }
        else { bytes.push(0xe0 | (code >> 12)); bytes.push(0x80 | ((code >> 6) & 0x3f)); bytes.push(0x80 | (code & 0x3f)); }
    }

    const bitLen = bytes.length * 8;
    bytes.push(0x80);
    while (bytes.length % 64 !== 56) bytes.push(0);
    for (let i = 7; i >= 0; i--) bytes.push((bitLen / Math.pow(2, i * 8)) & 0xff);

    const r = (n: number, d: number) => (n >>> d) | (n << (32 - d));

    for (let i = 0; i < bytes.length; i += 64) {
        const w = new Array(64).fill(0);
        for (let j = 0; j < 16; j++)
            w[j] = (bytes[i + j * 4] << 24) | (bytes[i + j * 4 + 1] << 16) | (bytes[i + j * 4 + 2] << 8) | bytes[i + j * 4 + 3];
        for (let j = 16; j < 64; j++) {
            const s0 = r(w[j - 15], 7) ^ r(w[j - 15], 18) ^ (w[j - 15] >>> 3);
            const s1 = r(w[j - 2], 17) ^ r(w[j - 2], 19) ^ (w[j - 2] >>> 10);
            w[j] = (w[j - 16] + s0 + w[j - 7] + s1) >>> 0;
        }
        let [a, b, c, d, e, f, g, h] = H;
        for (let j = 0; j < 64; j++) {
            const S1 = r(e, 6) ^ r(e, 11) ^ r(e, 25);
            const ch = (e & f) ^ (~e & g);
            const t1 = (h + S1 + ch + K[j] + w[j]) >>> 0;
            const S0 = r(a, 2) ^ r(a, 13) ^ r(a, 22);
            const maj = (a & b) ^ (a & c) ^ (b & c);
            const t2 = (S0 + maj) >>> 0;
            h = g; g = f; f = e; e = (d + t1) >>> 0;
            d = c; c = b; b = a; a = (t1 + t2) >>> 0;
        }
        H[0] = (H[0] + a) >>> 0; H[1] = (H[1] + b) >>> 0;
        H[2] = (H[2] + c) >>> 0; H[3] = (H[3] + d) >>> 0;
        H[4] = (H[4] + e) >>> 0; H[5] = (H[5] + f) >>> 0;
        H[6] = (H[6] + g) >>> 0; H[7] = (H[7] + h) >>> 0;
    }

    return H.map(n => n.toString(16).padStart(8, '0')).join('');
}
