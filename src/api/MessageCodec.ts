import { AUXTA_CLIENT_HEADER_SIZES } from "@auxta/constants/AuxtaClient.constants";
import { AuxtaServerRequest, AuxtaServerResponse } from "@auxta/types/AuxtaClient.types";
import { Buffer } from '@auxta/polyfill/buffer';



export class MessageCodec {
    static encode(msg: AuxtaServerRequest): Buffer {
        const actionBuf = Buffer.alloc(AUXTA_CLIENT_HEADER_SIZES.action);
        actionBuf.write(msg.headers.action, 'utf-8');

        const versionBuf = Buffer.alloc(AUXTA_CLIENT_HEADER_SIZES.version);
        versionBuf.write(msg.headers.version, 'utf-8');

        const tokenBuf = Buffer.alloc(AUXTA_CLIENT_HEADER_SIZES.token);
        tokenBuf.write(msg.headers.token, 'utf-8');

        const clientBuf = Buffer.alloc(AUXTA_CLIENT_HEADER_SIZES.client);
        clientBuf.write(msg.headers.client, 'utf-8');

        const bodyStr = JSON.stringify(msg.commands);
        const bodyBuf = Buffer.from(bodyStr, 'utf-8');
        const bodyLen = bodyBuf.length;

        const totalLength = AUXTA_CLIENT_HEADER_SIZES.headerTotal + 4 + bodyLen;

        const buffer = Buffer.alloc(totalLength);
        let offset = 0;

        actionBuf.copy(buffer, offset); offset += AUXTA_CLIENT_HEADER_SIZES.action;
        versionBuf.copy(buffer, offset); offset += AUXTA_CLIENT_HEADER_SIZES.version;
        tokenBuf.copy(buffer, offset); offset += AUXTA_CLIENT_HEADER_SIZES.token;
        clientBuf.copy(buffer, offset); offset += AUXTA_CLIENT_HEADER_SIZES.client;

        buffer.writeUInt32BE(bodyLen, offset); offset += 4;
        bodyBuf.copy(buffer, offset);

        return buffer;
    }

    static decode(buffer: Buffer): AuxtaServerResponse | null {
        try {
            let offset = 0;

            const action = buffer.toString('utf-8', offset, offset + AUXTA_CLIENT_HEADER_SIZES.action).replace(/\0/g, '').trim(); offset += AUXTA_CLIENT_HEADER_SIZES.action;
            const version = buffer.toString('utf-8', offset, offset + AUXTA_CLIENT_HEADER_SIZES.version).replace(/\0/g, '').trim(); offset += AUXTA_CLIENT_HEADER_SIZES.version;

            const client = buffer.toString('utf-8', offset, offset + AUXTA_CLIENT_HEADER_SIZES.client).replace(/\0/g, '').trim(); offset += AUXTA_CLIENT_HEADER_SIZES.client;

            const bodyLen = buffer.readUInt32BE(offset); offset += 4;
            const bodyStr = buffer.toString('utf-8', offset, offset + bodyLen);
            const data = JSON.parse(bodyStr);

            return { version, client, data, action };
        } catch (e) {
            return null;
        }
    }
}

