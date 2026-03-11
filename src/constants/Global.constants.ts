

import { env } from '@auxta/polyfill/process';

export class GLOBAL_CONSTANTS {

    static get SERVER() {
        return {
            PORT: this.SERVER_PORT,
            HOST: this.SERVER_HOST,
            TOKEN: this.SERVER_TOKEN,
            CLIENT: this.SERVER_CLIENT, // Custom client name for better monitoring
        };
    }

    /**
     * The port on which the Auxta server will run.
     */
    private static get SERVER_PORT() {
        return env.AUXTA_SERVER_PORT ?
            parseInt(env.AUXTA_SERVER_PORT)
            : 5656;
    }
    /**
     * The host address for the Auxta server.
     * Default is 'localhost'.
     */
    private static get SERVER_HOST() {
        return env.AUXTA_SERVER_HOST || 'localhost';
    }
    /**
     * The token for authentication with the Auxta server.
     * 
     */
    private static get SERVER_TOKEN() {
        return env.AUXTA_SERVER_TOKEN || '';
    }

    /**
     * Allows to set the custom client for better connections monitoring.
     */
    private static get SERVER_CLIENT() {
        return env.AUXTA_SERVER_CLIENT || 'auxta-client'; // Default client name
    }


    static get DB() {
        return {
            SYNC: this.SYNC,
        }
    }

    static get SYNC() {
        return env.AUXTA_DB_SYNC ?
            env.AUXTA_DB_SYNC === 'true' || env.AUXTA_DB_SYNC === '1' || env.AUXTA_DB_SYNC === 'yes'
            : true; // Default to true if not set
    }


    static get CONNECTION_POOL() {
        return {
            SIZE: this.CONNECTION_POOL_SIZE,
            TIMEOUT: this.CONNECTION_POOL_TIMEOUT,
        }
    }
    /**
     * The size of the connection pool.
     * Default is 5.
     */
    private static get CONNECTION_POOL_SIZE() {
        return env.AUXTA_POOL_SIZE ?
            parseInt(env.AUXTA_POOL_SIZE)
            : 5; // Default pool size is 5
    }
    /**
     * The timeout for acquiring a connection from the pool in milliseconds.
     * Default is 5000 ms.
     */
    private static get CONNECTION_POOL_TIMEOUT() {
        return env.AUXTA_POOL_TIMEOUT ?
            parseInt(env.AUXTA_POOL_TIMEOUT)
            : 5000; // Default timeout is 5000 ms
    }

    static get LOGGING() {
        return {
            LEVEL: this.LOG_LEVEL,
        };
    }


    private static get LOG_LEVEL() {
        return (env.AUXTA_LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error' | 'silent') || 'info'; // Options: 'info', 'warn', 'error'
    }

}