import { AuxtaStaticDimensionDefinition, StaticDimensionConstructorConfig } from "@auxta/types/AuxtaDimension.types";
import { AuxtaDimension } from "../AuxtaDimension";
import { createHash } from '@auxta/polyfill/crypto';



export class AuxtaStaticDimension<T extends any = any> extends AuxtaDimension<T> {


    protected config !: StaticDimensionConstructorConfig<T>


    /**
     * 
     * 
     * @param serialized 
     */
    constructor(
        /**
         * Config object from the definition
         */
        config: StaticDimensionConstructorConfig<T>,
    )
    constructor(
        /**
         * Serialized value from storage
         */
        serialized: string,
    )
    constructor(
        param1: StaticDimensionConstructorConfig<T> | string,
    ) {
        super(param1 as any);
    }

    /**
     * Returns the unique ID of the parameter, which is a hash of the name of the parameter.
     * This ID is used to identify the parameter and faster read it value
     */
    get id() {
        const input = `${this.name}_${String(this.index)}_${String(this.vector)}`

        return createHash('sha256').update(input).digest('hex').slice(0, 16);
    }


    toDefinition(): AuxtaStaticDimensionDefinition {
        return {
            ...(super.toDefinition()),
            index: this.index!,
            vector: this.vector!,
        }
    }
}