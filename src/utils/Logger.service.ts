import { GLOBAL_CONSTANTS } from "@auxta/constants/Global.constants";

export class AuxtaLogger {


    private static getTimestamp(): string {
        return new Date().toISOString();
    }

    private static shouldLog(level: string): boolean {
        return level === 'info' && GLOBAL_CONSTANTS.LOGGING.LEVEL === 'info' ||
            level === 'warn' && (GLOBAL_CONSTANTS.LOGGING.LEVEL === 'info' || GLOBAL_CONSTANTS.LOGGING.LEVEL === 'warn') ||
            level === 'error' && (GLOBAL_CONSTANTS.LOGGING.LEVEL === 'info' || GLOBAL_CONSTANTS.LOGGING.LEVEL === 'warn' || GLOBAL_CONSTANTS.LOGGING.LEVEL === 'error');
    }

    private static formatOutput(level: string, color: string, ...args: any[]) {
        if (!AuxtaLogger.shouldLog(level)) return;

        const RESET = '\x1b[0m';
        const timestamp = AuxtaLogger.getTimestamp();
        const prefix = `${color}[${timestamp}] [${level.toUpperCase()}]${RESET}`;
        console.log(prefix, ...args);
    }

    static info(...args: any[]) {
        AuxtaLogger.formatOutput('info', '\x1b[36m', ...args); // Cyan
    }

    static warn(...args: any[]) {
        AuxtaLogger.formatOutput('warn', '\x1b[33m', ...args); // Yellow
    }

    static error(...args: any[]) {
        AuxtaLogger.formatOutput('error', '\x1b[31m', ...args); // Red
    }
}
