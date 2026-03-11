/**
 * buffer.browser.ts
 *
 * Browser implementation of the buffer polyfill.
 * Wraps Uint8Array so that the Buffer API surface used in this SDK works
 * identically in a browser bundle without pulling in the full `buffer` npm package.
 *
 * Supported API surface:
 *   Buffer.alloc(size)
 *   Buffer.from(string, encoding)
 *   Buffer.concat(list)
 *   buffer.write(string, encoding)
 *   buffer.copy(target, targetStart)
 *   buffer.slice(start, end)
 *   buffer.toString(encoding, start, end)
 *   buffer.readUInt32BE(offset)
 *   buffer.writeUInt32BE(value, offset)
 *   buffer.length
 */

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export class Buffer extends Uint8Array {
    // ── Static factories ──────────────────────────────────────────────────

    static alloc(size: number): Buffer {
        return new Buffer(size);
    }

    static from(source: string | ArrayBuffer | Uint8Array, encoding: string = 'utf-8'): Buffer {
        if (source instanceof ArrayBuffer || ArrayBuffer.isView(source)) {
            const arr = source instanceof ArrayBuffer ? new Uint8Array(source) : new Uint8Array((source as Uint8Array).buffer, (source as Uint8Array).byteOffset, (source as Uint8Array).byteLength);
            const buf = new Buffer(arr.length);
            buf.set(arr);
            return buf;
        }
        if (encoding === 'utf-8' || encoding === 'utf8') {
            const encoded = encoder.encode(source as string);
            const buf = new Buffer(encoded.length);
            buf.set(encoded);
            return buf;
        }
        // latin1 / binary
        const str = source as string;
        const buf = new Buffer(str.length);
        for (let i = 0; i < str.length; i++) buf[i] = str.charCodeAt(i) & 0xff;
        return buf;
    }

    static concat(list: Uint8Array[]): Buffer {
        const total = list.reduce((s, b) => s + b.length, 0);
        const out = new Buffer(total);
        let offset = 0;
        for (const b of list) { out.set(b, offset); offset += b.length; }
        return out;
    }

    // ── Instance methods ──────────────────────────────────────────────────

    write(str: string, encoding: string = 'utf-8'): void {
        const encoded = encoder.encode(str);
        this.set(encoded.subarray(0, this.length));
    }

    copy(target: Buffer, targetStart: number = 0): void {
        target.set(this, targetStart);
    }

    slice(start?: number, end?: number): Buffer {
        const sub = super.slice(start, end) as Uint8Array;
        const buf = new Buffer(sub.length);
        buf.set(sub);
        return buf;
    }

    toString(encoding: string = 'utf-8', start?: number, end?: number): string {
        const slice = start !== undefined || end !== undefined
            ? this.subarray(start, end)
            : this;
        if (encoding === 'utf-8' || encoding === 'utf8')
            return decoder.decode(slice);
        // latin1
        return Array.from(slice).map(b => String.fromCharCode(b)).join('');
    }

    readUInt32BE(offset: number): number {
        return ((this[offset] << 24) | (this[offset + 1] << 16) | (this[offset + 2] << 8) | this[offset + 3]) >>> 0;
    }

    writeUInt32BE(value: number, offset: number): void {
        this[offset]     = (value >>> 24) & 0xff;
        this[offset + 1] = (value >>> 16) & 0xff;
        this[offset + 2] = (value >>>  8) & 0xff;
        this[offset + 3] =  value         & 0xff;
    }
}

export function byteLength(string: string, _encoding: string = 'utf8'): number {
    return encoder.encode(string).length;
}
