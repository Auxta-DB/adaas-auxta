import { Socket } from '@auxta/polyfill/net';
import { Buffer } from '@auxta/polyfill/buffer';
import { MessageCodec } from './MessageCodec';
import { AuxtaServerRequest, AuxtaServerResponse } from '@auxta/types/AuxtaClient.types';
import { AuxtaError } from '@auxta/errors/AuxtaError.class';
import { AUXTA_CLIENT_HEADER_SIZES } from '@auxta/constants/AuxtaClient.constants';

export class TCPClient {
    private socket: Socket;
    private buffer = Buffer.alloc(0);

    constructor(private host: string, private port: number) {
        this.socket = new Socket();
    }

    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.socket.connect(this.port, this.host, resolve);
            this.socket.on('error', (err: any) => {
                if (err.code === 'ECONNREFUSED') {
                    reject(AuxtaError.ECONNREFUSED(
                        `Connection refused`,
                        this.host,
                        this.port
                    ));
                }
                else {
                    reject(err);
                }
            });
        });
    }

    send(msg: AuxtaServerRequest): Promise<AuxtaServerResponse> {
        // AuxtaLogger.info(
        //     `Sending message to ${this.host}:${this.port} - Action: ${msg.headers.action}, Version: ${msg.headers.version}, Client: ${msg.headers.client}`,
        //     `\n - Commands\n: ${JSON.stringify(msg.commands, null, 2)}`
        // );

        return new Promise((resolve, reject) => {
            const encoded = MessageCodec.encode(msg);
            this.socket.write(encoded);

            const HEADER_SIZE =
                AUXTA_CLIENT_HEADER_SIZES.action +
                AUXTA_CLIENT_HEADER_SIZES.version +
                AUXTA_CLIENT_HEADER_SIZES.client;

            const onData = (data: Buffer) => {
                this.buffer = Buffer.concat([this.buffer, data]);

                while (this.buffer.length >= HEADER_SIZE + 4) {
                    const bodyLengthOffset = HEADER_SIZE;
                    const bodyLength = this.buffer.readUInt32BE(bodyLengthOffset);

                    const totalLength = HEADER_SIZE + 4 + bodyLength;

                    if (this.buffer.length >= totalLength) {
                        const fullMessage = this.buffer.slice(0, totalLength);
                        const decoded = MessageCodec.decode(fullMessage);

                        if (decoded) {
                            this.socket.off('data', onData);
                            // AuxtaLogger.info(`Received data from ${this.host}:${this.port} - Length: ${data.length}`);
                            // AuxtaLogger.info(`Received data: ${JSON.stringify(decoded, null, 2)}`);
                            resolve(decoded);
                        }

                        this.buffer = this.buffer.slice(totalLength);
                        return;
                    } else {
                        break;
                    }
                }
            };

            this.socket.on('data', onData);
            this.socket.once('error', reject);
        });
    }

    disconnect() {
        this.socket.end();
    }

    isConnected(): boolean {
        return !this.socket.destroyed;
    }
}
