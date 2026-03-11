/**
 * net.browser.ts
 *
 * Browser stub for the net polyfill.
 * TCP sockets are not available in browsers. This stub throws a clear error
 * at runtime if someone tries to use TCPClient in a browser context, while
 * still satisfying the TypeScript type surface so the browser bundle compiles.
 */

function notSupported(feature: string): never {
    throw new Error(
        `[Auxta] "${feature}" is not supported in browser environments. ` +
        `Use a server-side environment (Node.js) to connect to the Auxta DB directly.`
    );
}

export class Socket {
    constructor() { notSupported('net.Socket'); }
    connect(_port: number, _host: string, _cb?: () => void): this { return this; }
    write(_data: Uint8Array): void { notSupported('net.Socket.write'); }
    on(_event: string, _handler: (...args: any[]) => void): this { return this; }
    once(_event: string, _handler: (...args: any[]) => void): this { return this; }
    off(_event: string, _handler: (...args: any[]) => void): this { return this; }
    end(): void { notSupported('net.Socket.end'); }
    get destroyed(): boolean { return true; }
}

export type ISocket = Socket;
