import { pathResolve, fileExists, readFile } from '@auxta/polyfill/fs';
import { env } from '@auxta/polyfill/process';
import { AuxtaLogger } from './Logger.service';

export class EnvUtil {
    static load(envPath: string = '.env') {
        const absolutePath = pathResolve(process.cwd(), envPath);

        if (!fileExists(absolutePath)) {
            AuxtaLogger.warn(`[env-loader] No .env file found at ${absolutePath}`);
            return;
        }

        const content = readFile(absolutePath);

        content.split('\n').forEach((line) => {
            const trimmed = line.trim();

            if (!trimmed || trimmed.startsWith('#')) return;

            const eqIndex = trimmed.indexOf('=');
            if (eqIndex === -1) return;

            const key = trimmed.slice(0, eqIndex).trim();
            const value = trimmed.slice(eqIndex + 1).trim().replace(/^['"]|['"]$/g, '');

            if (!Object.prototype.hasOwnProperty.call(env, key)) {
                env[key] = value;
            }
        });
    }
}
