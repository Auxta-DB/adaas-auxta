import { AuxtaDynamicDimensionDefinition, DynamicDimensionConstructorConfig } from "@auxta/types/AuxtaDimension.types";
import { AuxtaDimension } from "../AuxtaDimension";
import { createHash } from '@auxta/polyfill/crypto';
import { AuxtaDimensionError } from "@auxta/errors/AuxtaDimension.error";





export class AuxtaDynamicDimension<T extends any = any> extends AuxtaDimension<T> {


    protected config !: DynamicDimensionConstructorConfig<T>

    /**
     * Represents a dynamic dimension that can change its value over time.
     * It is typically used for dimensions that are computed or updated based on some logic.
     * 
     * @param {Object} config - Configuration object for the dimension.
     */
    constructor(
        /**
         * Config object from the definition
         */
        config: DynamicDimensionConstructorConfig,
    )
    constructor(
        /**
         * Serialized value from storage
         */
        serialized: string,
    )
    constructor(
        param1: DynamicDimensionConstructorConfig | string,
    ) {
        super(param1 as any);
    }




    protected fromConfig(config: DynamicDimensionConstructorConfig<T>): void {
        if (!config || typeof config !== 'object')
            throw AuxtaDimensionError.invalidConfig(`Invalid configuration for dynamic dimension: ${this.name}. Expected an object.`);
        if (!config.behavior)
            throw AuxtaDimensionError.invalidConfig(`Behavior is required for dynamic dimension: ${this.name}.`);


        this.config = config;

        super.fromConfig(config);

        this.config.mode = this.config.mode || 'disk'; // Default mode
        this.config.scope = this.config.scope || 'global'; // Default scope



        if (this.config.behavior === 'aggregated' && [
            'number', 'int8', 'int16', 'int32',
            'uint8', 'uint16', 'uint32', 'float32',
            'float64', 'double', 'bigint', 'decimal'
        ].indexOf(this.config.type) === -1) {
            throw AuxtaDimensionError.invalidConfig(`Aggregated dynamic dimension must have type 'number', but got '${this.config.type}' for dimension: ${this.name}.`);
        }

    }


    /**
     * Returns the unique ID of the parameter, which is a hash of the name of the parameter.
     * This ID is used to identify the parameter and faster read it value
     */
    get id() {
        const input = `${this.name}_${String(this.config.scope)}_${String(this.index)}_${String(this.vector)}`

        return createHash('sha256').update(input).digest('hex').slice(0, 16);
    }


    toDefinition(): AuxtaDynamicDimensionDefinition {

        if (this.config.scope === 'vector' && (!this.index || !this.vector))
            throw AuxtaDimensionError.invalidConfig(`Vector scope requires 'vector' and 'index' properties to be defined for dynamic dimension: ${this.name}.`);

        if (this.config.scope === 'index' && !this.index)
            throw AuxtaDimensionError.invalidConfig(`Index scope requires 'index' property to be defined for dynamic dimension: ${this.name}.`);

        return {
            ...(super.toDefinition()),
            behavior: this.config.behavior,
            mode: this.config.mode,
            scope: this.config.scope,
            defaultValue: this.config.value,
        }

    }
}

