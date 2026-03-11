import { createHash, randomUUID } from '@auxta/polyfill/crypto';
import { AuxtaDimension } from './AuxtaDimension';
import { AuxtaSerializedVector, AuxtaVectorConstructorProps, AuxtaVectorDefinition } from '@auxta/types/AuxtaVector.types';
import { AuxtaComputedDimension } from './dimensions/AuxtaComputedDimension.class';
import { AUXTA_INDEX_METADATA_KEY } from '@auxta/decorators/Index.decorator';
import { AuxtaIndex } from './AuxtaIndex';
import { AuxtaVectorError } from '@auxta/errors/AuxtaVector.error';
import { AUXTA_VECTOR_METADATA_KEY } from '@auxta/metadata/Dimensions.meta';



/**
 * This class provides a custom structure for the Vectors that are used in auction process. 
 * Each vector Describes entity participating in the auction.
 * 
 *  
 * 
 */
export class AuxtaVector<T extends object> {

    id: string = `auxv:v1--${randomUUID()}`;

    constructor(vector: AuxtaVectorDefinition)
    constructor(vector: AuxtaVectorConstructorProps<T>)
    constructor(vector: AuxtaVectorConstructorProps<T> | AuxtaVectorDefinition) {

        if ('id' in vector && 'dimensions' in vector) {
            this.fromDefinition(vector as AuxtaVectorDefinition);
        }
        else {
            this.fromVectorConstructor(vector as AuxtaVectorConstructorProps<T>);
        }
    }


    get name(): string {
        return this.constructor.name;
    }

    get index(): AuxtaIndex {
        const index: AuxtaIndex = this.constructor[AUXTA_INDEX_METADATA_KEY];
        return index;
    }


    get size(): number {
        let size = 0;

        this.constructor[AUXTA_VECTOR_METADATA_KEY].forEach((dimension: Partial<AuxtaDimension>) => {
            if (dimension instanceof AuxtaDimension) {
                size += dimension.size;
            }
        });
        return size;
    }

    get dimensions(): Array<AuxtaDimension> {
        return this.constructor[AUXTA_VECTOR_METADATA_KEY] || []
    }

    static get dimensions(): Array<AuxtaDimension> {
        return this[AUXTA_VECTOR_METADATA_KEY] || []
    }

    static get index(): AuxtaIndex {
        const index: AuxtaIndex = this[AUXTA_INDEX_METADATA_KEY];
        return index;
    }


    private fromVectorConstructor(vector: AuxtaVectorConstructorProps<T>): void {
        if (!this.index)
            throw AuxtaVectorError.vectorIndexNotDefinedError(this.name);

        //  I need to remove internal readonly properties from input vector 
        const vectorToMerge = Object.keys(vector)
            .filter(key => !['name', 'index', 'size', 'dimensions'].includes(key))
            .reduce((obj, key) => {
                obj[key] = vector[key];
                return obj;
            }, {} as T);


        Object.assign(this, vectorToMerge);

    }


    private fromDefinition(vector: AuxtaVectorDefinition): void {
        this.id = vector.id // Use provided ID or generate a new one

        // compile object of all dimensions values
        const dimensionsValues: Record<string, any> = vector.dimensions.reduce((acc, dimension) => {
            acc[dimension.name] = dimension.value;
            return acc;
        }, {});

        //  I need to remove internal readonly properties from input vector 
        const vectorToMerge = Object.keys(vector)
            .filter(key => !['name', 'index', 'size', 'dimensions'].includes(key))
            .reduce((obj, key) => {
                obj[key] = vector[key];
                return obj;
            }, {} as T);


        Object.assign(this, vectorToMerge);
    }



    /**
     * Converts the vector to a normalized format.
     * 
     * return e.g. [["5", "6", "186"], ["param1", "param2"], ... ["true"], ["{a:'b'}"]]
     * 
     * @returns 
     */
    normalize(): Array<Array<string>> {
        if (!this.index) {
            throw AuxtaVectorError.vectorIndexNotDefinedError(this.name);
        }

        return this.index.dimensions.map(d => d.withValue(this[d.name]).normalize());
    }


    /**
     * 
     * Returns a string representation of the vector.
     * e.g. auxv:v1--1234-5678-9012-3456@AuxtaVector[["186"], ["1", "2"], ... ["true"], ["{a:'b'}"]]
     * 
     * @returns 
     */
    toString(): string {
        return `${this.id}@${this.name}[${this.normalize().map(dimension => `[${dimension.join(', ')}]`).join(', ')}]`;
    }


    toJSON(): AuxtaSerializedVector<T> {
        if (!this.index)
            throw AuxtaVectorError.vectorIndexNotDefinedError(this.name);

        return {
            id: this.id,
            name: this.name,
            index: this.index.name,
            size: this.size,

            ...(this.dimensions.reduce((acc, dimension) => {
                acc[dimension.name] = this[dimension.name];

                return acc
            }, {})) as T
        };
    }


    static toDefinition(): AuxtaVectorDefinition {

        if (!this.index)
            throw AuxtaVectorError.vectorIndexNotDefinedError(this.name);

        return {
            id: createHash('sha256').update(this.name).digest('hex').slice(0, 16),
            name: this.name,
            dimensions: this.dimensions.map((dimension) => dimension.toDefinition()),
        }
    }
}