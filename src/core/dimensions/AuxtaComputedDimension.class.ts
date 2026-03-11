import { AuxtaComputedDimensionDefinition, AuxtaDimensionDefinition, ComputedDimensionConstructorConfig, DimensionConstructorBaseConfig } from "@auxta/types/AuxtaDimension.types";
import { AuxtaDimension } from "../AuxtaDimension";
import { createHash } from '@auxta/polyfill/crypto';
import { AuxtaDimensionError } from "@auxta/errors/AuxtaDimension.error";



export class AuxtaComputedDimension<T extends any = any> extends AuxtaDimension<T> {


    formula!: string;

    /**
     * 
     * 
     * @param serialized 
     */
    constructor(
        /**
         * Config object from the definition
         */
        config: ComputedDimensionConstructorConfig<T>,
    )
    constructor(
        /**
         * Serialized value from storage
         */
        serialized: string,
    )
    constructor(
        param1: ComputedDimensionConstructorConfig<T> | string,
    ) {
        super(param1 as any);

        if (typeof param1 !== 'string') {
            this.formula = param1.formula;
        }
    }


    protected fromConfig(config: ComputedDimensionConstructorConfig<T>): void {
        if (!config || typeof config !== 'object')
            throw AuxtaDimensionError.invalidConfig(config, `Invalid configuration for computed dimension: ${this.name}. Expected an object.`);
        if (!config.formula)
            throw AuxtaDimensionError.invalidConfig(config, `Formula is required for computed dimension: ${this.name}.`);

        super.fromConfig(config);

        this.formula = config.formula;
    }


    /**
     * Returns the unique ID of the parameter, which is a hash of the name of the parameter.
     * This ID is used to identify the parameter and faster read it value
     */
    get id() {
        const input = `${String(this.formula)}`

        return createHash('sha256').update(input).digest('hex').slice(0, 16);
    }


    toDefinition(): AuxtaComputedDimensionDefinition {
        return {
            ...(super.toDefinition()),
            formula: this.formula,
            defaultValue: this.value,
        }
    }
}