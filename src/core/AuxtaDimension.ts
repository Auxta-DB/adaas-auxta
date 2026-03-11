import { AuxtaDimensionTypeSizeMap, AuxtaDimensionValueType } from '@auxta/constants/AuxtaDimension.constants';
import { AuxtaDimensionError } from '@auxta/errors/AuxtaDimension.error';
import { AUXTA_DIMENSION_INDEX_METADATA_KEY, AUXTA_DIMENSION_VECTOR_METADATA_KEY } from '@auxta/metadata/Dimensions.meta';
import { AuxtaDimensionDefinition, DimensionConstructorBaseConfig, IDimension } from '@auxta/types/AuxtaDimension.types';
import { createHash } from '@auxta/polyfill/crypto';
import { byteLength } from '@auxta/polyfill/buffer';



export class AuxtaDimension<T extends any = any> implements IDimension<T> {

    /**
     * The name of the dimension, typically the class name.
     */
    public name!: string;
    /**
     * Type of the parameter, we will check it later
     */
    public type!: AuxtaDimensionValueType; //  Default type is any, we will check it later
    /**
     * Value of the Dimension, this value can be anything, but we will check it later
     */
    public value: T | undefined;
    /**
     * Config object for the dimension, this object can be anything, but we will check it later
     */
    protected config!: DimensionConstructorBaseConfig;
    /**
     * Priority of the dimension, used for sorting and matching.
     */
    get priority(): number {
        return this.config.priority || 0;
    }


    /**
     * Dimension is the class that describes the parameter of the Vector, So during the matching process
     * each parameter should be provided by the Vector.
     * 
     * 
     * 
     * We have 3 main types of Dimension:
     *  - Computed - these are Dimension that are computed during the auction process, like Daily Budget, Quality, etc
     *  - Static - these are Dimension that are static and provided by the bidder, like Interests, Age Categories, etc
     *  - Dynamic - these are Dimension that are dynamic and can change during the auction process, like Clicks, CTR, etc
     */
    constructor(
        /**
         * Config object from the definition
         */
        config: DimensionConstructorBaseConfig<T>,
    )
    constructor(
        /**
         * Serialized value from storage
         */
        serialized: string,
    )
    constructor(
        param1: DimensionConstructorBaseConfig<T> | string,
        param2?: T
    ) {
        switch (true) {
            case typeof param1 === 'string' && param2 === undefined:
                this.fromSerialized(param1);
                break;

            case typeof param1 === 'object' && param2 === undefined:
                this.fromConfig(param1 as DimensionConstructorBaseConfig<T>);
                break;
            case typeof param1 === 'string' && typeof param2 !== 'undefined':
                //  If the first parameter is a string and the second is defined, we assume it is a name and value
                this.fromConfig({
                    name: param1 as string,
                    value: param2,
                });
                break;

            default:
                throw AuxtaDimensionError.invalidConstructor(
                    `Invalid constructor parameters: ${JSON.stringify(param1)} and ${JSON.stringify(param2)}`
                );
        }

    }

    get index(): string | undefined {
        return this[AUXTA_DIMENSION_INDEX_METADATA_KEY]?.name || this.config.index;
    }

    get vector(): string | undefined {
        return this[AUXTA_DIMENSION_VECTOR_METADATA_KEY]?.name || this.config.vector;
    }


    /**
     * This method is used to initialize the dimension from the configuration object.
     * 
     * @param config 
     */
    protected fromConfig(config: DimensionConstructorBaseConfig<T>): void {
        if (!config || typeof config !== 'object')
            throw AuxtaDimensionError.invalidConfig(config);

        if (!config.name)
            throw AuxtaDimensionError.invalidConfig(config, 'Dimension must have a name and type defined.');


        this.name = config.name;
        this.type = config.value !== undefined
            ? config.type || this.inferType(config.value)
            : config.type || 'string'; // Default type is string if not defined
        this.value = config.value !== undefined
            ? this.coerceToType(this.type, config.value)
            : undefined; // If value is not defined, we set it to undefined

        this.config = {
            ...config,
            type: this.type,
            value: this.value,
        }
    }

    /**
     * This method is used to initialize the dimension from the serialized value.
     * 
     * @param serialized 
     */
    protected fromSerialized(serialized: string): void {
        try {
            const parsed = JSON.parse(serialized);
            this.name = parsed.name;
            this.type = parsed.type;
            this.value = parsed.value;
            this.config = parsed.config;

        } catch (err) {
            throw AuxtaDimensionError.invalidSerializedValue(serialized, err);
        }
    }


    /**
     * Returns the unique ID of the parameter, which is a hash of the name of the parameter.
     * This ID is used to identify the parameter and faster read it value
     */
    get id() {
        const input = `${this.name}`;

        return createHash('sha256').update(input).digest('hex').slice(0, 16);
    }

    /**
     * Returns a size of Vec value in bytes
     */
    get size(): number {
        const sizeSource = JSON.stringify(this.toVec());
        if (sizeSource === null || sizeSource === undefined) return 0;
        const targetSize = AuxtaDimensionTypeSizeMap[this.type]!

        const realSize = byteLength(sizeSource, 'utf8')

        return realSize > targetSize ? targetSize : realSize;
    }


    get realSize(): number {
        const value = this.toVec();
        if (value === null || value === undefined) return 0;
        const sizeSource = JSON.stringify(value);
        return byteLength(sizeSource, 'utf8');
    }



    /**
     * @returns 
     */
    normalize(): string[] {
        const value = this.toVec();

        return [value];
    }


    async GET(): Promise<T | undefined> {
        return this.value as T;
    }


    /**
     * This method defines the way of interpretation of this parameter in vector.
     * This method is calling by Vector class to convert the parameter to the vector format.
     * For example Dynamic Dimensions does not have a static value and because of that they return their ID,
     * but for static parameters we return their value. 
     * 
     * @returns 
     */
    protected toVec(): string {
        return JSON.stringify(this.value);
    }


    coerceToType(type: AuxtaDimensionValueType, value: any): any {
        try {
            switch (type) {

                case 'varchar128':
                case 'varchar256':
                case 'varchar512':
                case 'string':
                    if (value === null || value === undefined) return '';
                    if (typeof value === 'object') return JSON.stringify(value);
                    return String(value);

                case 'float32':
                case 'float64':
                case 'int8':
                case 'int16':
                case 'int32':
                case 'number':
                    const num = Number(value);
                    if (isNaN(num)) throw AuxtaDimensionError.valueDoesNotMatchType('number', value);
                    return num;

                case 'bit':
                    return !!value ? 1 : 0;

                case 'boolean':
                    if (typeof value === 'boolean') return value;
                    if (typeof value === 'string') return value.toLowerCase() === 'true';
                    return Boolean(value);

                case 'object':
                    if (typeof value === 'object' && value !== null && !Array.isArray(value)) return value;
                    if (typeof value === 'string') return JSON.parse(value);
                    throw AuxtaDimensionError.valueDoesNotMatchType('object', value);

                case 'array':
                    if (Array.isArray(value)) return value;
                    if (typeof value === 'string') return JSON.parse(value);
                    throw AuxtaDimensionError.valueDoesNotMatchType('array', value);

                case 'date':
                    if (value instanceof Date) return value;
                    const date = new Date(value);
                    if (isNaN(date.getTime())) throw AuxtaDimensionError.valueDoesNotMatchType('date', value);
                    return date;

                case 'function':
                    if (typeof value === 'function') return value;
                    throw AuxtaDimensionError.valueDoesNotMatchType('function', value);

                default:
                    throw AuxtaDimensionError.unsupportedType(type);
            }
        } catch (err) {
            throw AuxtaDimensionError.errorDuringTypesConversion(value, typeof value, type, err);
        }
    }

    inferType(value: any): AuxtaDimensionValueType {
        if (value === null || value === undefined) {
            return 'string';
        }
        if (typeof value === 'string') {
            if (value.length <= 128) return 'varchar128';
            if (value.length <= 256) return 'varchar256';
            if (value.length <= 512) return 'varchar512';
            return 'string';
        }
        if (typeof value === 'number') {
            if (Number.isInteger(value)) {
                if (value >= -128 && value <= 127) return 'int8';
                if (value >= -32768 && value <= 32767) return 'int16';
                if (value >= -2147483648 && value <= 2147483647) return 'int32';
            }
            if (value >= -3.4028235e38 && value <= 3.4028235e38) return 'float32';
            if (value >= -1.7976931348623157e308 && value <= 1.7976931348623157e308) return 'float64';
            return 'number';
        }
        if (typeof value === 'boolean') return 'boolean';
        if (Array.isArray(value)) return 'array';
        if (typeof value === 'object') {
            if (value instanceof Date) return 'date';
            return 'object';
        }
        if (typeof value === 'function') return 'function';
        throw AuxtaDimensionError.unsupportedType(typeof value);
    }


    withValue<M extends any = any>(value: M): AuxtaDimension<M> {
        //  Here we can set the value of the parameter, but we need to check if the value is valid for the parameter
        //  For example, if the parameter is a vector, we need to check if the value is an array
        //  If the parameter is a number, we need to check if the value is a number
        //  If the parameter is a string, we need to check if the value is a string
        //  If the parameter is an object, we need to check if the value is an object
        return new AuxtaDimension<M>({
            ...this.config,
            value,
            type: this.type
        });
    }


    toString(): string {

        switch (this.type) {
            case 'string':
                return String(this.value);
            case 'number':
                return String(this.value);
            case 'boolean':
                return String(this.value);
            case 'object':
                return JSON.stringify(this.value);
            case 'array':
                return JSON.stringify(this.value);
            case 'date':
                return this.value instanceof Date ? this.value.toISOString() : String(this.value);
            case 'function':
                return this.value instanceof Function ? this.value.toString() : String(this.value);
            default:
                return String(this.value);
        }
    }


    toJSON(): any {
        return {
            [this.name]: this.toVec(),
        }
    }


    /**
     * Converts the dimension to its definition format. 
     * Definition format is used to prepare DB  to work with the dimension.
     * 
     * 
     * @returns 
     */
    toDefinition(): AuxtaDimensionDefinition {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            index: this.index,
            vector: this.vector,
            size: this.size,
            priority: this.config.priority || 0,
        }
    }
}